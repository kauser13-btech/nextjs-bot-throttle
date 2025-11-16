import { NextResponse } from 'next/server';
import { BOT_LIMITS, BOT_THROTTLE_ENABLED, RATE_LIMIT_WINDOW } from './lib/bot-config';

// In-memory rate limit store (for serverless, consider using Redis or KV store)
const rateLimitStore = new Map();

// Cleanup old entries every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, data] of rateLimitStore.entries()) {
      if (now - data.resetTime > RATE_LIMIT_WINDOW * 1000) {
        rateLimitStore.delete(key);
      }
    }
  }, 300000);
}

function detectBot(userAgent) {
  if (!userAgent) return null;

  for (const [botPattern, limit] of Object.entries(BOT_LIMITS)) {
    if (userAgent.includes(botPattern)) {
      return { name: botPattern, limit };
    }
  }

  return null;
}

function getRateLimitKey(botName, ip) {
  return `bot:${botName}:${ip}`;
}

function checkRateLimit(key, limit) {
  const now = Date.now();
  const windowMs = RATE_LIMIT_WINDOW * 1000;
  const data = rateLimitStore.get(key);

  if (!data || now > data.resetTime) {
    // First request or reset time passed
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + windowMs,
    });
    return {
      allowed: true,
      remaining: limit - 1,
      resetTime: now + windowMs,
    };
  }

  if (data.count >= limit) {
    // Rate limit exceeded
    return {
      allowed: false,
      remaining: 0,
      resetTime: data.resetTime,
      retryAfter: Math.ceil((data.resetTime - now) / 1000),
    };
  }

  // Increment count
  data.count += 1;
  rateLimitStore.set(key, data);

  return {
    allowed: true,
    remaining: limit - data.count,
    resetTime: data.resetTime,
  };
}

export function middleware(request) {
  
  // Check if bot throttling is enabled
  if (!BOT_THROTTLE_ENABLED) {
    return NextResponse.next();
  }

  const userAgent = request.headers.get('user-agent') || '';
  const ip = request.ip || request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';

  // Detect if request is from a verified bot
  const botInfo = detectBot(userAgent);

  if (botInfo) {
    const { name: botName, limit } = botInfo;
    const key = getRateLimitKey(botName, ip);
    const rateLimitResult = checkRateLimit(key, limit);

    if (!rateLimitResult.allowed) {
      // Rate limit exceeded - return 429
      return new NextResponse(
        JSON.stringify({
          error: 'Too Many Requests',
          message: `Rate limit exceeded for ${botName}`,
          bot: botName,
          limit: limit,
          retryAfter: rateLimitResult.retryAfter,
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': String(rateLimitResult.retryAfter),
            'X-RateLimit-Limit': String(limit),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(Math.floor(rateLimitResult.resetTime / 1000)),
            'X-Bot-Detected': botName,
          },
        }
      );
    }

    // Add rate limit headers to successful response
    const response = NextResponse.next();
    response.headers.set('X-Bot-Detected', botName);
    response.headers.set('X-RateLimit-Limit', String(limit));
    response.headers.set('X-RateLimit-Remaining', String(rateLimitResult.remaining));
    response.headers.set('X-RateLimit-Reset', String(Math.floor(rateLimitResult.resetTime / 1000)));

    return response;
  }

  // Not a bot, continue normally
  return NextResponse.next();
}

// Configure which routes the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public directory)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

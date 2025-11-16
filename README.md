# nextjs-bot-throttle

A Next.js middleware for intelligent bot detection and rate limiting. Protect your application from excessive bot traffic while maintaining good relationships with search engines, social media crawlers, and AI bots.

## Features

- **Automatic Bot Detection**: Identifies 30+ common bots including Google, Bing, social media crawlers, and AI bots
- **Configurable Rate Limits**: Set different limits for different bot types via environment variables
- **Zero Configuration**: Works out of the box with sensible defaults
- **Next.js 13+ Compatible**: Built for the App Router and Middleware
- **Lightweight**: In-memory rate limiting with automatic cleanup
- **SEO Friendly**: Proper 429 responses with `Retry-After` headers

## Installation

```bash
npm install nextjs-bot-throttle
```

Or with yarn:

```bash
yarn add nextjs-bot-throttle
```

Or with pnpm:

```bash
pnpm add nextjs-bot-throttle
```

## Quick Start

### Basic Usage

Create a `middleware.js` (or `middleware.ts`) file in the root of your Next.js project:

```javascript
// middleware.js
export { middleware, config } from 'nextjs-bot-throttle';
```

That's it! The middleware will now protect your application with default rate limits.

### Custom Configuration

You can customize bot limits using environment variables in your `.env.local` file:

```env
# Enable/Disable bot throttling
NEXT_PUBLIC_BOT_THROTTLE_ENABLED=true

# Rate limit window in seconds (default: 60)
NEXT_PUBLIC_BOT_RATE_LIMIT_WINDOW=60

# Custom limits for specific bots (requests per minute)
NEXT_PUBLIC_BOT_LIMIT_GOOGLEBOT=60
NEXT_PUBLIC_BOT_LIMIT_BINGBOT=60
NEXT_PUBLIC_BOT_LIMIT_CHATGPT=30
NEXT_PUBLIC_BOT_LIMIT_CLAUDEBOT=30
```

## Supported Bots

### Search Engines
- **Google**: Googlebot, Googlebot-Image, Googlebot-News, AdsBot-Google, and more
- **Bing**: bingbot, msnbot, adidxbot, BingPreview
- **Others**: Baidu, Yandex, DuckDuckGo, Yahoo

### Social Media
- Facebook (facebookexternalhit)
- Twitter (Twitterbot)
- LinkedIn (LinkedInBot)
- Pinterest

### AI Bots
- ChatGPT (GPTBot, ChatGPT-User, OAI-SearchBot)
- Claude (ClaudeBot, Claude-Web, anthropic-ai)
- Perplexity (PerplexityBot)
- Google Extended
- Cohere
- YouBot

### Others
- Applebot
- Amazonbot
- Archive.org bots

## Environment Variables

All rate limits are configurable via environment variables. The format is:

```
NEXT_PUBLIC_BOT_LIMIT_<BOTNAME>=<requests_per_minute>
```

### Available Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_BOT_THROTTLE_ENABLED` | `true` | Enable/disable bot throttling |
| `NEXT_PUBLIC_BOT_RATE_LIMIT_WINDOW` | `60` | Time window in seconds |
| `NEXT_PUBLIC_BOT_LIMIT_GOOGLEBOT` | `60` | Googlebot rate limit |
| `NEXT_PUBLIC_BOT_LIMIT_BINGBOT` | `60` | Bingbot rate limit |
| `NEXT_PUBLIC_BOT_LIMIT_CHATGPT` | `30` | ChatGPT bot rate limit |
| `NEXT_PUBLIC_BOT_LIMIT_CLAUDEBOT` | `30` | Claude bot rate limit |
| `NEXT_PUBLIC_BOT_LIMIT_GPTBOT` | `30` | GPTBot rate limit |
| `NEXT_PUBLIC_BOT_LIMIT_FACEBOOK` | `60` | Facebook crawler rate limit |
| `NEXT_PUBLIC_BOT_LIMIT_TWITTER` | `60` | Twitter bot rate limit |

See [lib/bot-config.js](./lib/bot-config.js) for the complete list of configurable bots.

## Response Headers

When a bot is detected, the middleware adds the following headers:

- `X-Bot-Detected`: Name of the detected bot
- `X-RateLimit-Limit`: Maximum requests allowed in the window
- `X-RateLimit-Remaining`: Remaining requests in the current window
- `X-RateLimit-Reset`: Unix timestamp when the rate limit resets

When rate limited (429 response):

- `Retry-After`: Seconds to wait before retrying

## Advanced Usage

### Using in Combination with Custom Middleware

If you need to combine this with your own middleware logic:

```javascript
// middleware.js
import { middleware as botThrottle, config as botConfig } from 'nextjs-bot-throttle';
import { NextResponse } from 'next/server';

export async function middleware(request) {
  // Run bot throttle first
  const botResponse = await botThrottle(request);

  // If bot was rate limited, return that response
  if (botResponse.status === 429) {
    return botResponse;
  }

  // Your custom middleware logic here
  // ...

  return NextResponse.next();
}

export const config = botConfig;
```

### Custom Route Matching

Modify which routes the middleware applies to:

```javascript
// middleware.js
export { middleware } from 'nextjs-bot-throttle';

export const config = {
  matcher: [
    '/api/:path*',  // Only protect API routes
    '/blog/:path*', // And blog pages
  ],
};
```

## Production Considerations

### In-Memory Storage Limitations

This package uses in-memory storage for rate limiting, which works well for:
- Single-instance deployments
- Development environments
- Low to medium traffic applications

For production environments with multiple instances or high traffic, consider:
- Using Redis or another distributed cache
- Implementing database-backed rate limiting
- Using edge middleware with KV stores (Vercel KV, Cloudflare KV, etc.)

### Serverless Environments

The in-memory store will reset on cold starts in serverless environments. This means:
- Rate limits are per-instance
- Bots might get more requests across multiple instances
- Consider using external storage for strict rate limiting

## How It Works

1. **Detection**: The middleware examines the `User-Agent` header to identify known bots
2. **Rate Limiting**: Tracks requests per bot per IP address
3. **Response**: Returns 429 when limits are exceeded, or adds informational headers when allowed
4. **Cleanup**: Automatically removes old entries from memory every 5 minutes

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

If you encounter any issues or have questions, please open an issue on GitHub.

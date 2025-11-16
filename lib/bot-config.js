// Bot Throttling Configuration
// All limits are requests per minute

export const BOT_LIMITS = {
  // Search Engine Bots (High Priority)
  'Googlebot': parseInt(process.env.NEXT_PUBLIC_BOT_LIMIT_GOOGLEBOT || '60'),
  'Googlebot-Image': parseInt(process.env.NEXT_PUBLIC_BOT_LIMIT_GOOGLEBOT_IMAGE || '30'),
  'Googlebot-News': parseInt(process.env.NEXT_PUBLIC_BOT_LIMIT_GOOGLEBOT_NEWS || '30'),
  'Googlebot-Video': parseInt(process.env.NEXT_PUBLIC_BOT_LIMIT_GOOGLEBOT_VIDEO || '30'),
  'Google-InspectionTool': parseInt(process.env.NEXT_PUBLIC_BOT_LIMIT_GOOGLE_INSPECTION || '10'),
  'AdsBot-Google': parseInt(process.env.NEXT_PUBLIC_BOT_LIMIT_ADSBOT_GOOGLE || '20'),
  'Mediapartners-Google': parseInt(process.env.NEXT_PUBLIC_BOT_LIMIT_MEDIAPARTNERS || '20'),
  'APIs-Google': parseInt(process.env.NEXT_PUBLIC_BOT_LIMIT_APIS_GOOGLE || '60'),

  'bingbot': parseInt(process.env.NEXT_PUBLIC_BOT_LIMIT_BINGBOT || '60'),
  'msnbot': parseInt(process.env.NEXT_PUBLIC_BOT_LIMIT_MSNBOT || '30'),
  'adidxbot': parseInt(process.env.NEXT_PUBLIC_BOT_LIMIT_ADIDXBOT || '20'),
  'BingPreview': parseInt(process.env.NEXT_PUBLIC_BOT_LIMIT_BING_PREVIEW || '10'),

  // Other Search Engines (Medium Priority)
  'Baiduspider': parseInt(process.env.NEXT_PUBLIC_BOT_LIMIT_BAIDU || '30'),
  'YandexBot': parseInt(process.env.NEXT_PUBLIC_BOT_LIMIT_YANDEX || '30'),
  'DuckDuckBot': parseInt(process.env.NEXT_PUBLIC_BOT_LIMIT_DUCKDUCKGO || '30'),
  'Slurp': parseInt(process.env.NEXT_PUBLIC_BOT_LIMIT_YAHOO || '30'),

  // Social Media Bots (High Priority for Previews)
  'facebookexternalhit': parseInt(process.env.NEXT_PUBLIC_BOT_LIMIT_FACEBOOK || '60'),
  'Twitterbot': parseInt(process.env.NEXT_PUBLIC_BOT_LIMIT_TWITTER || '60'),
  'LinkedInBot': parseInt(process.env.NEXT_PUBLIC_BOT_LIMIT_LINKEDIN || '30'),
  'Pinterest': parseInt(process.env.NEXT_PUBLIC_BOT_LIMIT_PINTEREST || '30'),

  // AI/ML Bots (Controlled Access)
  'ChatGPT-User': parseInt(process.env.NEXT_PUBLIC_BOT_LIMIT_CHATGPT || '30'),
  'GPTBot': parseInt(process.env.NEXT_PUBLIC_BOT_LIMIT_GPTBOT || '30'),
  'OAI-SearchBot': parseInt(process.env.NEXT_PUBLIC_BOT_LIMIT_OAI_SEARCH || '30'),
  'anthropic-ai': parseInt(process.env.NEXT_PUBLIC_BOT_LIMIT_ANTHROPIC || '30'),
  'Claude-Web': parseInt(process.env.NEXT_PUBLIC_BOT_LIMIT_CLAUDE_WEB || '30'),
  'ClaudeBot': parseInt(process.env.NEXT_PUBLIC_BOT_LIMIT_CLAUDEBOT || '30'),
  'Google-Extended': parseInt(process.env.NEXT_PUBLIC_BOT_LIMIT_GOOGLE_EXTENDED || '20'),
  'PerplexityBot': parseInt(process.env.NEXT_PUBLIC_BOT_LIMIT_PERPLEXITY || '30'),
  'YouBot': parseInt(process.env.NEXT_PUBLIC_BOT_LIMIT_YOUBOT || '30'),
  'cohere-ai': parseInt(process.env.NEXT_PUBLIC_BOT_LIMIT_COHERE || '20'),

  // Other Crawlers (Lower Priority)
  'Applebot': parseInt(process.env.NEXT_PUBLIC_BOT_LIMIT_APPLEBOT || '30'),
  'Amazonbot': parseInt(process.env.NEXT_PUBLIC_BOT_LIMIT_AMAZONBOT || '30'),
  'archive.org_bot': parseInt(process.env.NEXT_PUBLIC_BOT_LIMIT_ARCHIVE || '10'),
  'ia_archiver': parseInt(process.env.NEXT_PUBLIC_BOT_LIMIT_IA_ARCHIVER || '10'),
};

// Time window in seconds (default: 60 seconds = 1 minute)
export const RATE_LIMIT_WINDOW = parseInt(process.env.NEXT_PUBLIC_BOT_RATE_LIMIT_WINDOW || '60');

// Enable/Disable bot throttling
export const BOT_THROTTLE_ENABLED = process.env.NEXT_PUBLIC_BOT_THROTTLE_ENABLED !== 'false';

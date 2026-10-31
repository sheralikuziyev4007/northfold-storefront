import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Next 15 streams metadata into <body> for non-bot user agents. Keep it in <head> for everyone
  // so link previews, audits and less common crawlers read titles and descriptions reliably.
  htmlLimitedBots: /.*/,
  images: {
    formats: ['image/avif', 'image/webp'],
    // Store product photos come from Shopify's CDN. Site photography is local WebP in /public/images.
    remotePatterns: [{ protocol: 'https', hostname: 'cdn.shopify.com', pathname: '/**' }],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'DENY' },
        ],
      },
    ];
  },
};

export default nextConfig;

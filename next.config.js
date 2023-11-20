const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const isProduction = process.env.NODE_ENV === 'production';

// Custom logger function
const logger = {
  debug: (message) => console.log(`[DEBUG] ${message}`),
  info: (message) => console.log(`[INFO] ${message}`),
  warn: (message) => console.warn(`[WARN] ${message}`),
  error: (message) => console.error(`[ERROR] ${message}`),
};

module.exports = withBundleAnalyzer({
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    optimizePackageImports: ['@mantine/core', '@mantine/hooks'],
  },
  transpilePackages: ['@gametheorygoodsgame/gametheory-openapi'],
  webpack: (config) => {
    // Use the custom logger for webpack logging
    config.stats = {
      colors: true,
      logging: (type, message) => {
        switch (type) {
          case 'info':
            if (!isProduction) {
              logger.info(message);
            }
            break;
          case 'warn':
            if (!isProduction) {
              logger.warn(message);
            }
            break;
          case 'error':
            logger.error(message);
            break;
          case 'debug':
            if (!isProduction) {
              logger.debug(message);
            }
            break;
          default:
            if (!isProduction) {
              logger.debug(message);
            }
        }
      },
    };

    // Extend or modify the existing webpack configuration
    config.resolve.extensionAlias = {
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
      '.cjs': ['.cts', '.cjs'],
    };

    // Return the modified configuration
    return config;
  },
});

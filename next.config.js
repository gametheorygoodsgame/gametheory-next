const nextConfig = {
    webpack: (config) => {
        config.experiments = { ...config.experiments, topLevelAwait: true };
        return config;
    },
    output: 'standalone',
};

module.exports = nextConfig;
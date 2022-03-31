const removeImports = require("next-remove-imports")();

module.exports = removeImports({
  reactStrictMode: true,
  webpack5: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false };

    return config;
  },
  experimental: { esmExternals: true }
});



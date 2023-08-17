const nodeExternals = require('webpack-node-externals');

module.exports = {
  webpack: (config, { isServer }) => {
    // Only apply the externals configuration for server-side builds
    if (isServer) {
      config.externals = [
        nodeExternals({
          allowlist: [/^@babel/]
        })
      ];
    }

    return config;
  }
};

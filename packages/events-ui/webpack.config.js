const { composePlugins, withNx  } = require('@nrwl/webpack');
const { ProvidePlugin } = require('webpack');
const { withReact } = require('@nrwl/react');

// Nx plugins for webpack.
module.exports = composePlugins(withNx(), withReact(), (config) => {
  // Update the webpack config as needed here.
  // e.g. `config.plugins.push(new MyPlugin())`
  if (config.devServer) {
    config.devServer.host = '0.0.0.0';
    config.devServer.allowedHosts = 'all';
  }
  config.resolve.fallback = {
          assert: require.resolve('assert/'),
          crypto: require.resolve('crypto-browserify/'),
          http: require.resolve('stream-http/'),
          https: require.resolve('https-browserify/'),
          os: require.resolve('os-browserify/browser'),
          stream: require.resolve('stream-browserify/'),
          url: require.resolve('url/'),
          util: require.resolve('util/')
        }
      config.plugins.push(
        new ProvidePlugin({
            process: 'process/browser',
            Buffer: ['buffer', 'Buffer'],
        }),
    );
  return config;
});

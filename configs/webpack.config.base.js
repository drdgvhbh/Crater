/**
 * Base webpack config used across other specific configs
 */

import path from 'path';
import webpack from 'webpack';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import { dependencies } from '../package.json';

export default {
  externals: [...Object.keys(dependencies || {})],

  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
            },
          },
          'ts-loader',
        ],
      },
    ],
  },

  output: {
    path: path.join(__dirname, '..', 'app'),
    // https://github.com/webpack/webpack/issues/1114
    libraryTarget: 'commonjs2',
  },

  /**
   * Determine the array of extensions that should be used to resolve modules.
   */
  resolve: {
    alias: {
      'react-dom': '@hot-loader/react-dom',
      '@/*': path.join(__dirname, '..', 'app'),
    },
    extensions: ['.js', '.ts', '.tsx', '.json'],
  },

  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production',
    }),
    new ForkTsCheckerWebpackPlugin(),
  ],
};

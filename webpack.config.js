const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const { merge } = require('webpack-merge');
const path = require('path');

const dotenv = require('dotenv').config();

if (dotenv.error) {
  throw dotenv.error;
}

const parts = require('./webpack.parts');

const PATHS = {
  app: path.join(__dirname, 'packages/hws-lsa'),
};

const commonConfig = merge([
  {
    entry: PATHS.app,
    output: {
      path: path.resolve(process.cwd(), 'dist'),
    },
    node: false,
    plugins: [
      new CaseSensitivePathsPlugin(),
      new FriendlyErrorsWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: './template/index.html',
        title: 'Schweisthal – Schließanlagen Assistent',
      }),
    ],
    resolve: {
      mainFields: ['module', 'browser', 'main'],
    },
  },
  parts.loadSCSS(),
  parts.loadJavaScript({
    include: PATHS.app,
  }),
  {
    optimization: {
      noEmitOnErrors: true,
    },
  },
  parts.setFreeVariable('AUTH_API_URL', process.env.AUTH_API_URL),
  parts.setFreeVariable('CART_API_URL', process.env.CART_API_URL),
  parts.setFreeVariable('PRINT_API_URL', process.env.PRINT_API_URL),
  parts.setFreeVariable('PRODUCTS_API_URL', process.env.PRODUCTS_API_URL),
  parts.setFreeVariable('HWS_USERNAME', process.env.HWS_USERNAME),
  parts.setFreeVariable('HWS_PASSWORD', process.env.HWS_PASSWORD),
]);

const productionConfig = merge([
  {
    performance: {
      hints: 'warning',
      maxEntrypointSize: 250000,
      maxAssetSize: 450000,
    },
  },
  {
    recordsPath: path.join(__dirname, 'records.json'),
    output: {
      chunkFilename: '[name].[chunkhash:4].js',
      filename: '[name].[chunkhash:4].js',
    },
  },
  parts.clean(),
  parts.minifyJavaScript(),
  parts.generateSourceMaps({ type: 'source-map' }),
  {
    optimization: {
      splitChunks: {
        chunks: 'initial',
      },
      runtimeChunk: {
        name: 'manifest',
      },
    },
  },
  parts.attachRevision(),
]);

const developmentConfig = merge([
  parts.devServer({
    host: process.env.HOST,
    port: process.env.PORT,
  }),
]);

module.exports = (mode) => {
  const config = mode === 'production' ? productionConfig : developmentConfig;

  return merge([commonConfig, config, { mode }]);
};

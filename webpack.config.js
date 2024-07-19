const path = require('path');
const webpack = require('webpack');
require('dotenv').config();

module.exports = {
  entry: { app: ['./src/App.jsx'] },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'public'),
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      __UI_API_ENDPOINT__: `'${process.env.API_ENDPOINT}'`,
    }),
  ],
  optimization: {
    splitChunks: {
      name: 'vendor',
      chunks: 'all',
    },
  },
  mode: 'development',
};

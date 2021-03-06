const webpack = require('webpack');
const path = require('path');

const BUILD_DIR = path.resolve(__dirname, 'public', 'assets');
const VIEWS_DIR = path.resolve(__dirname, 'containers');
const COMPONENTS_DIR = path.resolve(__dirname, 'components');

module.exports = {
  entry: VIEWS_DIR + '/App.jsx',
  output: {
    path: BUILD_DIR,
    publicPath: 'assets',
    filename: 'bundle.js'
  },

  module: {
    loaders: [
      {
        test: /\.json/,
        include: [VIEWS_DIR, COMPONENTS_DIR],
        loader: 'json-loader'
      },
      {
        test: /\.jsx?$/,
        include: [VIEWS_DIR, COMPONENTS_DIR],
        loader: 'babel-loader'
      },
      {
        test: /\.styl$/,
        loader: 'style-loader!css-loader!stylus-loader'
      }
    ]
  },

  resolve: {
    extensions: ['.js', '.json', '.jsx', '.styl', '.css']
  }
};

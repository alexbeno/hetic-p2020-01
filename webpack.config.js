const webpack = require('webpack');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const MergeJsonWebpackPlugin = require('merge-jsons-webpack-plugin');

const isProd = (process.env.NODE_ENV === 'production');

module.exports = {
  entry: {
    app: './src/index.js',
  },
  devtool: isProd ? '' : 'eval-source-map',
  output: {
    filename: isProd ? '[name].bundle.min.js' : '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    hot: true,
    open: true,
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['es2015']
          }
        }
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'postcss-loader', 'sass-loader'],
        })
      },
      {
        test: /\.pug$/,
        use: 'pug-loader'
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf|json)$/,
        include: [
          path.resolve(__dirname, 'src/assets'),
        ],
        use: [
          'file-loader'
        ]
      },
      {
        test: /\.(gif|png|jpe?g|svg|mp4|webm|ico)$/i,
        use: [
          'file-loader',
          'image-webpack-loader'
        ],
      },
      {
        test: /\.(htaccess)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '.htaccess',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    require('autoprefixer'),
    new CleanWebpackPlugin(['dist']),
    new MergeJsonWebpackPlugin({
      'output': {
        'groupBy': [
          {
            'pattern': path.resolve(__dirname, 'src/locales/en/*.json'),
            'fileName': './locales/en.json',
          },
          {
            'pattern': path.resolve(__dirname, 'src/locales/fr/*.json'),
            'fileName': './locales/fr.json',
          },
          {
            'pattern': path.resolve(__dirname, 'src/locales/jp/*.json'),
            'fileName': './locales/jp.json',
          },
        ],
      },
    }),
    new HtmlWebpackPlugin({
      title: 'Main',
      template: './src/views/main.pug',
      filename: 'index.html',
    }),
    new HtmlWebpackPlugin({
      title: 'Home',
      template: './src/views/home.pug',
      filename: 'home.html',
      inject: false,
    }),
    new HtmlWebpackPlugin({
      title: 'About',
      template: './src/views/about.pug',
      filename: 'about.html',
      inject: false,
    }),
    new HtmlWebpackPlugin({
      title: 'Story',
      template: './src/views/story.pug',
      filename: 'story.html',
      inject: false,
    }),
    new HtmlWebpackPlugin({
      title: '404',
      template: './src/views/404.pug',
      filename: '404.html',
      inject: false,
    }),
    new HtmlWebpackPlugin({
      title: 'Specs',
      template: './src/views/specs.pug',
      filename: 'specs.html',
      inject: false,
    }),
    new HtmlWebpackPlugin({
      title: 'App',
      template: './src/views/app.pug',
      filename: 'app.html',
      inject: false,
    }),
    new ExtractTextPlugin({
      filename: '[name].[contenthash].css',
      disable: !isProd
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ],
};

if (isProd) {
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    })
  ])
} else {
  module.exports.plugins = (module.exports.plugins || []).concat([
    new StyleLintPlugin(),
  ])
}

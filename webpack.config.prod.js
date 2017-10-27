var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var ManifestPlugin = require('webpack-manifest-plugin');
var ChunkManifestPlugin = require('chunk-manifest-webpack-plugin');
var cssnext = require('postcss-cssnext');
var postcssFocus = require('postcss-focus');
var postcssReporter = require('postcss-reporter');
var cssnano = require('cssnano');
var path = require('path');

module.exports = {
  devtool: 'hidden-source-map',

  entry: {
    app: [
      './client/index.js',
    ],
    vendor: [
      'react',
      'react-dom',
      'react-redux',
      'react-router',
      'react-router-dom',
      'redux',
      'redux-thunk',
      'sanitize-html',
      'superagent',
    ]
  },

  output: {
    // path: __dirname + '/dist/client/',
    path: __dirname + '/dist/',
    filename: '[name].[chunkhash].js',
    publicPath: '/',
  },

  resolve: {
    extensions: ['.js', '.jsx', '.json', '.css'],
    modules: [
      'client',
      'node_modules',
    ],
  },

  module: {
    rules: [

      {
        test: /\.css$/,
        include: [
          path.resolve( __dirname, 'client' ),
        ],
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              // options: { importLoaders: 1 },
              // query: {
              query: {
                modules: true,
                sourceMap: false,  // true
                // importLoaders: 1,
                localIdentName: '[name]__[local]___[hash:base64:5]',
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: [
                  require('postcss-import')({
                    root: path.resolve( __dirname, 'client' ),
                  }),
                  require('postcss-cssnext')({
                    browsers: ['last 2 versions', '> 1%', 'ie > 10', 'safari > 5', 'ios > 6'],
                  }),
                  require('postcss-nested'),
                  require('postcss-modules-values'),
                ],
              },
            },
          ],
        }),
      },

      // {
      //   test: /\.css$/,
      //   exclude: /node_modules/,
      //   loader: 'style-loader!css-loader?localIdentName=[name]__[local]__[hash:base64:5]&modules&importLoaders=1&sourceMap!postcss-loader',
      // },
      {
        test: /\.css$/,
        include: /node_modules/,
        loaders: ['style-loader', 'css-loader'],
      }, {
        test: /\.jsx*$/,
        exclude: [/node_modules/, /.+\.config.js/],
        loader: 'babel-loader',
      }, {
        test: /\.(jpe?g|gif|png|svg)$/i,
        loader: 'url-loader?limit=10000',
      }, {
        test: /\.json$/,
        loader: 'json-loader',
      },
    ],
  },

  // module: {
  //   rules: [
  //     {
  //       test: /\.css$/,
  //       exclude: /node_modules/,
  //       loader: ExtractTextPlugin.extract('style-loader', 'css-loader?localIdentName=[hash:base64]&modules&importLoaders=1!postcss-loader'),
  //     }, {
  //       test: /\.css$/,
  //       include: /node_modules/,
  //       loaders: ['style-loader', 'css-loader'],
  //     }, {
  //       test: /\.jsx*$/,
  //       exclude: /node_modules/,
  //       loader: 'babel-loader',
  //     }, {
  //       test: /\.(jpe?g|gif|png|svg)$/i,
  //       loader: 'url-loader?limit=10000',
  //     }, {
  //       test: /\.json$/,
  //       loader: 'json-loader',
  //     },
  //   ],
  // },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production'),
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity,
      filename: 'vendor.js',
    }),
    new ExtractTextPlugin('app.[chunkhash].css', { allChunks: true }),
    new ManifestPlugin({
      basePath: '/',
    }),
    new ChunkManifestPlugin({
      filename: "chunk-manifest.json",
      manifestVariable: "webpackManifest",
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      comments: false,
      // minimize: true,
      mangle: false,
      compress: {
        warnings: false,
        // drop_console: true,    // eslint-disable-line camelcase
        drop_debugger: true,   // eslint-disable-line camelcase
        dead_code: true        // eslint-disable-line camelcase
      },
      output: {
        comments: false
      }
    }),
  ],

  // postcss: () => [
  //   postcssFocus(),
  //   cssnext({
  //     browsers: ['last 2 versions', 'IE > 10'],
  //   }),
  //   cssnano({
  //     autoprefixer: false
  //   }),
  //   postcssReporter({
  //     clearMessages: true,
  //   }),
  // ],
};

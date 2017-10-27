// var cssnext = require('postcss-cssnext');
// var postcssFocus = require('postcss-focus');
// var postcssReporter = require('postcss-reporter');

var ExtractTextPlugin = require('extract-text-webpack-plugin');

var cssModulesIdentName = '[name]__[local]__[hash:base64:5]';
if (process.env.NODE_ENV === 'production') {
  cssModulesIdentName = '[hash:base64]';
}

const srcPath = './client/';

module.exports = {
  output: {
    publicPath: '/',
    libraryTarget: 'commonjs2',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [
      'client',
      'node_modules',
    ],
  },
  module: {
    rules: [

      {
        test: /\.css$/,
        exclude: /node_modules/,
        loader: 'style-loader!css-loader?localIdentName=' + cssModulesIdentName + '&modules&importLoaders=1&sourceMap!postcss-loader',
      },

      // {
      //   test: /\.css$/,
      //   include: [
      //     srcPath,
      //   ],
      //   use: ExtractTextPlugin.extract({
      //     fallback: 'style-loader',
      //     use: [
      //       {
      //         loader: 'css-loader',
      //         query: {
      //           modules: true,
      //           sourceMap: false, // true
      //           localIdentName: cssModulesIdentName,
      //         },
      //       },
      //       {
      //         loader: 'postcss-loader',
      //         options: {
      //           plugins: [
      //             require('postcss-import')({
      //               root: srcPath,
      //             }),
      //             require('postcss-cssnext')({
      //               browsers: ['last 2 versions', '> 1%', 'ie > 10', 'safari > 5', 'ios > 5'],
      //             }),
      //             require('postcss-nested'),
      //             require('postcss-modules-values'),
      //             require('postcss-reporter')({
      //               clearMessages: true,
      //             })
      //           ],
      //         },
      //       },
      //     ],
      //   }),
      // },

      {
        test: /\.jpe?g$|\.gif$|\.png$|\.svg$/i,
        loader: 'url-loader?limit=10000',
      },
    ],
  },
};

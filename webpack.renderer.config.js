const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const spawn = require('child_process').spawn;

const baseConfig = require('./webpack.base.config');

module.exports = (env, options) => {
  const isDev = options.mode !== 'production';
  const tsxLoaders = ['ts-loader'];
  if (isDev) {
    tsxLoaders.unshift({
      loader: 'babel-loader',
      options: {
        babelrc: true,
        plugins: ['react-hot-loader/babel'],
      },
    });
  }

  const config = {
    target: 'electron-renderer',
    entry: {
      app: './src/renderer/main.tsx',
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          include: [path.resolve(__dirname, 'src', 'renderer')],
          exclude: [path.resolve(__dirname, 'src', 'main', '**')],
          loaders: tsxLoaders,
        },
        {
          test: /\.scss$/,
          loaders: ['style-loader', 'css-loader', 'sass-loader']
        },
        {
          test: /\.css$/,
          loaders: ['style-loader', 'css-loader']
        },
        {
          test: /\.(gif|png|jpe?g|svg)$/,
          use: [
            'file-loader',
            {
              loader: 'image-webpack-loader',
              options: {
                bypassOnDebug: true
              }
            }
          ]
        },
        // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
        {
          enforce: 'pre',
          test: /\.js$/,
          loader: 'source-map-loader'
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: 'Wharf',
        template: 'src/renderer/index.html',
      }),
      new webpack.NamedModulesPlugin(),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
      }),
    ]
  };

  if (isDev) {
    config.devServer = {
      port: 2003,
      compress: true,
      noInfo: true,
      stats: 'errors-only',
      inline: true,
      hot: true,
      headers: { 'Access-Control-Allow-Origin': '*' },
      historyApiFallback: {
        verbose: true,
        disableDotRule: false,
      },
      before() {
        if (process.env.START_HOT) {
          console.log('Starting main process');
          spawn('npm', ['run', 'start-main-dev'], {
            shell: true,
            env: process.env,
            stdio: 'inherit'
          })
          .on('close', code => process.exit(code))
          .on('error', spawnError => console.error(spawnError));
        }
      }
    }; 
  }

  return merge.smart(baseConfig, config);
};

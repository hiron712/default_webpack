const path = require("path");
const globule = require("globule");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const cssnano = require("cssnano");
const autoprefixer = require("autoprefixer");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

const CopyPlugin = require("copy-webpack-plugin");
const WriteFilePlugin = require("write-file-webpack-plugin");

const buildDefault = {
    mode: 'production', //開発バージョンで出力
    devtool: 'inline-source-map',
    entry: ['./src/js/index.js','./src/stylus/style.styl'],
    watchOptions: {
      ignored: /node_modules/
    },
    output: {
      path: __dirname + '/dist/js/',
      filename: 'app.js'
    },
    stats: {
      children: true,
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',   //loader名
            options: {                //Babelの設定
              presets: ['@babel/preset-env']
            }
          }
        },
        {
          test: /\.pug$/,
          use: [
            {
              loader: "pug-loader",
              options: {
                pretty: true
              }
            }
          ]
        },
        {
          test: /\.styl$/,
          use: [
            MiniCssExtractPlugin.loader,
            "css-loader",
            {
              loader: 'postcss-loader',
              options: {
                // publicPath: 'src/stylus/style.styl',
                postcssOptions: {
                  plugins: [
                    [
                      cssnano,
                      {
                        preset: [
                          "default",
                          { discardComments: { removeAll: true } },
                        ],
                      },
                    ],
                    [autoprefixer, { grid: true }],
                  ],
                },
              },
            },
            "stylus-loader",
          ],
        }
      ]
    },
    //プラグインの設定
    plugins: [
      //ファイル変更でブラウザリロード
      new BrowserSyncPlugin({
        host: 'localhost',
        port: 2000,
        server: { baseDir: 'dist' }
      }),
      new MiniCssExtractPlugin({
        filename: '../css/style.css'
      }),
      // new CopyPlugin({
      //   patterns: [
      //     {
      //       from: "./src/img",
      //       to: "./dist/img"
      //     },
      //   ],
      // }),
      new WriteFilePlugin()
    ],
  }

// buildDefault のプラグイン配列にpug変換を追加
const pugFiles = globule.find('src/pug/**/*.pug', {
  ignore: [ 'src/pug/**/_*.pug' ]
});

pugFiles.forEach((pug) => {
  const fileName = pug.replace('src/pug/', '').replace('.pug', '.html')
  buildDefault.plugins.push(
    new HtmlWebpackPlugin({
      template: pug,
      filename: `${__dirname}/dist/${fileName}`,
      inject: true,
      minify: true,
    })
  )
});

module.exports = buildDefault;
const path = require("path");
const globule = require("globule");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const cssnano = require("cssnano");
const autoprefixer = require("autoprefixer");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const buildDefault = [
  //javascript書き出し
  {
    mode: 'production', //開発バージョンで出力
    devtool: 'inline-source-map',
    entry: './src/js/index.js',
    watchOptions: {
      ignored: /node_modules/
    },
    output: {
      path: __dirname + '/dist/js/',
      filename: 'sample.js'
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
        }
      ]
    },
    //プラグインの設定
    plugins: [],
  },
  //CSS書き出し
  {
    mode: 'production',
    devtool: "source-map",
    entry: {
      style: './src/stylus/style.styl',
    },
    output: {
      path: `${__dirname}/dist/css`,
      // filename: '[name].css'
    },
    module: {
      rules: [
        {
          test: /\.styl$/,
          use: [
            MiniCssExtractPlugin.loader,
            "css-loader",
            {
              loader: 'postcss-loader',
              options: {
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
    plugins: [
      new MiniCssExtractPlugin({filename:'[name].css'}),
    ]
  }
];



const pugFiles = globule.find('src/pug/**/*.pug', {
  ignore: [ 'src/pug/**/_*.pug' ]
});

pugFiles.forEach((pug) => {
  const fileName = pug.replace('src/pug/', '').replace('.pug', '.html')
  buildDefault[0].plugins.push(
    new HtmlWebpackPlugin({
      filename: `${__dirname}/dist/${fileName}`,
      template: pug,
      inject: false,
      minify: true,
    })
  )
});

module.exports = buildDefault;
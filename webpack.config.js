const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const path = require("path");

const Dotenv = require('dotenv-webpack');

const mode = process.env.NODE_ENV || 'development';

const devMode = mode === 'development';

const target = devMode ? 'web' : 'browserslist';
const devtool = devMode ? 'source-map' : undefined;

const pages = ["index", "home-chat"];

module.exports = {
    mode,
    target,
    devtool,
    entry: ['@babel/polyfill', path.resolve(__dirname, 'src', 'home-chat.js')],
    output: {
        path: path.resolve(__dirname, 'dist'),
        clean: true,
        filename: '[name].[contenthash].js',
        assetModuleFilename: 'assets/[name][ext]',
    },
    plugins: [].concat(
        pages.map(
          (page) => 
            new HtmlWebpackPlugin({
              inject: true,
              template: path.resolve(__dirname, 'src', `${page}.html`),
              filename: `${page}.html`
          })
        ),
        new MiniCssExtractPlugin({
          filename: '[name].[contenthash].css',
        }),
        new Dotenv(),      
      ),
    module: {
        rules: [
            {
                test: /\.html$/i,
                loader: 'html-loader',
            },
            {
                test: /\.css$/i,
                use: [
                    devMode ? "style-loader" : MiniCssExtractPlugin.loader, 
                    "css-loader",
                    {
                        loader: "postcss-loader",
                        options: {
                          postcssOptions: {
                            plugins: [require('postcss-preset-env')],
                          },
                        },
                    },
                ],
            },
            {
                test: /\.woff2?$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'fonts/[name][ext]'
                }
            },
            {
                test: /\.(jpe?g|png|webp|gif|svg)$/i,
                use: {
                    loader: 'image-webpack-loader',
                    options: {
                        mozjpeg: {
                          progressive: true,
                        },
                        optipng: {
                          enabled: false,
                        },
                        pngquant: {
                          quality: [0.65, 0.90],
                          speed: 4
                        },
                        gifsicle: {
                          interlaced: false,
                        },
                        webp: {
                          quality: 75
                        }
                    }
                },
                type: 'asset/resource',
            },
            {
                test: /\.(?:js|mjs|cjs)$/i,
                exclude: /node_modules/,
                use: {
                  loader: 'babel-loader',
                  options: {
                    presets: [
                      ['@babel/preset-env', { targets: "defaults" }]
                    ]
                  }
                }
            }
        ]
    }
    
}
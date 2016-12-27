'use strict';

const isProd = process.env.NODE_ENV === 'production';
const { resolve } = require('path');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const LiveReloadPlugin = require('webpack-livereload-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: resolve(__dirname, 'www', 'js', 'main.js'),
    output: {
        path: resolve(__dirname, 'build'),
        filename: 'bundle.js',
    },
    module: {
        loaders: [
            {
                test: /.css$/,
                loader: ExtractTextPlugin.extract(['css']),
            },
            {
                test: /.(jpe?g|png|svg|ttf|eot|woff)(\?.+)?$/,
                loader: 'file?context=www/&name=[path][name].[ext]',
            }
        ]
    },
    plugins: [
        isProd ? null : new LiveReloadPlugin(),
        new ExtractTextPlugin('styles.css'),
        new CopyWebpackPlugin([
            {
                from: resolve(__dirname, 'www', 'img'),
                to: resolve(__dirname, 'build', 'img'),
            }
        ]),
        new ImageminPlugin({
            optipng: {
                optimizationLevel: 7,
            },
            jpegtran: {
                progressive: true,
            },

        }),
        new HtmlWebpackPlugin({
            template: resolve(__dirname, 'www', 'index.html'),
            favicon: resolve(__dirname, 'www', 'favicon.ico'),
            minify: {
                collapseWhitespace: true,
                removeAttributeQuotes: true,
                removeComments: true,
                minifyCSS: true,
                minifyJS: true,
            },
        }),
    ].filter(plugin => !!plugin),
};

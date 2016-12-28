'use strict';

const isProd = process.env.NODE_ENV === 'production';
const { resolve } = require('path');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const LiveReloadPlugin = require('webpack-livereload-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const SRC_DIR = resolve(__dirname, 'src');
const BUILD_DIR = resolve(__dirname, 'build');

module.exports = {
    entry: resolve(SRC_DIR, 'js', 'main.js'),
    output: {
        path: BUILD_DIR,
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
                from: resolve(SRC_DIR, 'img'),
                to: resolve(BUILD_DIR, 'img'),
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
            template: resolve(SRC_DIR, 'index.html'),
            favicon: resolve(SRC_DIR, 'favicon.ico'),
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

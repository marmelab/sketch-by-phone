var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: [
        './src/index.js',
    ],
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        loaders: [{
            test: /vendors/,
            use: ['script-loader'],
        }, {
            test: /\.html$/,
            loader: 'html-loader',
        }, {
            test: /\.dat$/,
            loader: 'file-loader',
        }, {
            test: /\.png$/,
            loader: 'file-loader',
        }, {
            test: /\.hiro$/,
            loader: 'file-loader',
        }],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/index.html',
        }),
    ],
};

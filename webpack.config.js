const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: './src/jsgantt.ts',
    devtool: 'source-map',
    mode: process.env.NODE_ENV ? process.env.NODE_ENV : 'development',
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new CopyPlugin({
            patterns: [
                { from: "src/jsgantt.css", to: "./" },
                { from: "CONTRIBUTING.md", to: "./" },
                { from: "Documentation.md", to: "./" },
                { from: "LICENSE", to: "./" },
                { from: "README.md", to: "./" },
                { from: "package.json", to: "./" },
            ],
        }),
    ],
    resolve: {
        extensions: ['.ts'],
    },
    output: {
        filename: 'jsgantt.js',
        library: 'JSGantt',
        path: path.resolve(__dirname, 'dist'),
    },
};

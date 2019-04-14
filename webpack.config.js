const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = (env) => {
    return {
        mode: env.mode,
        devtool: 'none',
        watch: env.mode === 'development',
        entry: {
            index: path.resolve('src/index.js')
        },
        output: {
            library: 'vwLib',
            filename: '[name]/[name].js',
            path: path.resolve(__dirname, "prod")
        },
        module: {
            rules: [
                { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
            ]
        },
        plugins: [
            new CleanWebpackPlugin()
        ]
    }
}

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = () => {
    return {
        entry: {
            main: path.resolve(__dirname, './src/App/index.tsx'),
        },
        module: {
            rules: [
                {
                    test: /\.ts(x?)$/,
                    use: 'ts-loader',
                    exclude: /[\\/]node_modules[\\/]/,
                },
            ],
        },
        devServer: {
            static: {
                directory: path.resolve(__dirname, './dist'),
            },
            port: 4200,
            open: true,
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, './src/App/index.html'),
            }),
        ],
        resolve: {
            extensions: ['.tsx', '.ts', '.jsx', '.js'],
        },
        output: {
            path: path.resolve(__dirname, './dist'),
            publicPath: '/',
        },
        performance: {
            hints: false,
        },
        stats: 'errors-warnings',
    };
};

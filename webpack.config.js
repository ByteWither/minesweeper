const path = require('path');

module.exports = () => {
    return {
        entry: {
            main: path.resolve(__dirname, './src/index.ts'),
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
        resolve: {
            extensions: ['.tsx', '.ts', '.js'],
        },
        output: {
            path: path.resolve(__dirname, './dist'),
        },
    };
};

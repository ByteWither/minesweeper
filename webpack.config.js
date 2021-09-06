const path = require('path');

module.exports = () => {
    return {
        entry: {
            main: path.resolve(__dirname, './src/index.js'),
        },
        output: {
            path: path.resolve(__dirname, './dist'),
        },
    };
};

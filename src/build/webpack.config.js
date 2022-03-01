const path = require('path');

module.exports = {
    context: path.resolve(__dirname, '../'),
    entry: './scripts/app.js',
    output: {
        path: path.resolve(__dirname, '../../assets'),
        filename: 'scripts/main.js'
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                include: /scripts/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    }
};

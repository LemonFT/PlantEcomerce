module.exports = {
    // other webpack configuration...
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/i,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react'],
                    },
                },
            },
            {
                test: /\.(png|jpe?g|gif|webp)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.(scss|css)$/i,
                use: ['style-loader', 'css-loader', 'sass-loader'],
            },
            // other rules...
        ],
    },
    resolve: {
        fallback: {
            "crypto": false
        }
    }
    
};

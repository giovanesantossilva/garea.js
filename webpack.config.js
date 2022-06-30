const path = require('path');

module.exports = {
    mode: "development",
    entry:  path.resolve(__dirname, "public", "index.js"),
    output: {
        path: path.resolve(__dirname, "public"),
        publicPath: '/',
        filename: "bundle.js",
    },
    devServer: {
        port: 3000,
        hot: true,
        open: true,
        allowedHosts: 'all',
        static: {
            directory: path.join(__dirname, 'public'),
        },
    },
    resolve: {
        extensions: [ ".js" ]
    },
    module: {
        rules: [
            {
                test: /.js$/i,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /.(png|svg|jpg|jpeg)$/i,
                type: 'asset/resource'
            }
        ]
    }
}

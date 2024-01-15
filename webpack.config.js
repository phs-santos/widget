const path = require("path");

module.exports = {
    entry: {
        card: "./component/card/card.js",
    },
    mode: "development",
    output: {
        filename: "[name]/[name].js",
        path: path.resolve(__dirname, "build"),
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /(node_modules)/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env", "@babel/preset-react"],
                    },
                },
            },
        ],
    },
    devServer: {
        static: {
          directory: './dist'
        },
        port: 8080,
        open: false
    },
    watch: true,
    watchOptions: {
      ignored: /node_modules/,
      poll: 1000,
    },
    
};
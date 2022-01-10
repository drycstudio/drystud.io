module.exports = {
    plugins: [
        require("postcss-import"),
        require("tailwindcss"),
        require("postcss-nested"), // or require('postcss-nesting')
        require("autoprefixer"),
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "style-loader",
                    },
                    {
                        loader: "css-loader",
                        options: {
                            importLoaders: 1,
                        },
                    },
                    {
                        loader: "postcss-loader",
                    },
                ],
            },
        ],
    },
};

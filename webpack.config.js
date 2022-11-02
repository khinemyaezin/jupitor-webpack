const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
module.exports = {
  mode: "development",
  entry: {
    index: "./src/home/index.js",
    signup: "./src/auth/signup.js",
    login: "./src/auth/login.js",
    quote: "./src/quote/quote.js",
  },
  
  devtool: "inline-source-map",
  devServer: {
    static: "./dist",
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [["@babel/preset-env", { targets: "defaults" }]],
          },
        },
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: () => [require("autoprefixer")],
              },
            },
          },
        ],
      },
      {
        test: /\.(jpe?g|png)$/i,
        type: "asset/resource",
      },
      {
        test: /\.svg$/,
        type: "asset",
        use: "svgo-loader",
      }
    ],
  },
  resolve: {
    alias: {
      assets: path.resolve(__dirname, "src/assets"),
    },
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
    }),
    new HtmlWebpackPlugin({
      title: "Home",
      filename: "index.html",
      template: "src/home/index.html",
      scriptLoading: "module",
      chunks: ["index"],
    }),
    new HtmlWebpackPlugin({
      title: "Signup",
      filename: "signup.html",
      template: "src/auth/signup.html",
      scriptLoading: "module",
      chunks: ["signup"],
    }),
    new HtmlWebpackPlugin({
      title: "Login",
      filename: "login.html",
      template: "src/auth/login.html",
      scriptLoading: "module",
      chunks: ["login"],
    }),
    new HtmlWebpackPlugin({
      title: "Quote",
      filename: "quote.html",
      template: "src/quote/quote.html",
      scriptLoading: "module",
      chunks: ["quote"],
    }),
  ],
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
    assetModuleFilename: "assets/[name][ext]",
    clean: true,
  },
};

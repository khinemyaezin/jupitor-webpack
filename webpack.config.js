const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const devMode = process.env.NODE_ENV !== "production";

module.exports = {
  mode: "development",
  entry: {
    index: "./src/home/index.js",
    signup: "./src/auth/signup.js",
    login: "./src/auth/login.js",
    quote: "./src/quote/quote.js",
  },

  //devtool: "inline-source-map",
  devServer: {
    static: "./dist",
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
      favicon: "src/assets/favicon.ico",
      scriptLoading: "module",
      chunks: ["index"],
    }),
    new HtmlWebpackPlugin({
      title: "Signup",
      filename: "signup.html",
      template: "src/auth/signup.html",
      favicon: "src/assets/favicon.ico",

      scriptLoading: "module",
      chunks: ["signup"],
    }),
    new HtmlWebpackPlugin({
      title: "Login",
      filename: "login.html",
      template: "src/auth/login.html",
      favicon: "src/assets/favicon.ico",

      scriptLoading: "module",
      chunks: ["login"],
    }),
    new HtmlWebpackPlugin({
      title: "Quote",
      filename: "quote.html",
      template: "src/quote/quote.html",
      favicon: "src/assets/favicon.ico",

      scriptLoading: "module",
      chunks: ["quote"],
    }),
  ].concat(devMode ? [] : [new MiniCssExtractPlugin()]),
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          devMode ? "style-loader" : MiniCssExtractPlugin.loader,
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
      },
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
    ],
  },
  resolve: {
    alias: {
      assets: path.resolve(__dirname, "src/assets"),
    },
  },

  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
    assetModuleFilename: "assets/[name][ext]",
    clean: true,
  },
};

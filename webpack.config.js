const path = require("path");

const nodeExternals = require("webpack-node-externals");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  // Specify the entry point of your application
  entry: "./src/index.js",

  // Specify that we're targeting Node.js
  target: "node",

  // This will create source maps for easier debugging
  devtool: "source-map",

  // Specify the output file
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
  },

  // Exclude node_modules from the bundle
  externals: [nodeExternals()],

  // Set the mode to development or production
  mode: "development",

  // Module rules for handling different file types
  module: {
    rules: [
      {
        // Use babel-loader for JavaScript files
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },

  // Plugins can be added here if needed
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: "src/views", to: "views" },
        { from: "src/assets", to: "assets" },

        // { from: "public", to: "public" },
      ],
    }),
  ],
};

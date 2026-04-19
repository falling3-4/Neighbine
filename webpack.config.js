const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");

function daysSince(startDate) {
  const start = new Date(startDate);
  const now = new Date();

  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.floor((now - start) / msPerDay);
}

const version = daysSince("2025-12-19");

module.exports = {
  entry: "./src/index.ts",
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "src/index.html", to: "index.html" },
        { from: "resources/js/neutralino.js", to: "neutralino.js" },
        { from: "resources/sounds", to: "sounds" },
      ],
    }),
    new webpack.DefinePlugin({
      __VERSION__: JSON.stringify(version),
    }),
  ],
};

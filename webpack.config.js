const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");

// date format, DDDD-HH (days and hours since the start date)
function formatDate(startDate) {
  const start = new Date(startDate);
  const now = new Date();

  const totalHours = Math.floor((now - start) / (1000 * 60 * 60));

  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;

  return `${days}-${hours}`;
}

const version = formatDate("2025-12-19T17:19:00");

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
        { from: "resources/textures", to: "textures" },
      ],
    }),
    new webpack.DefinePlugin({
      __VERSION__: JSON.stringify(version),
    }),
  ],
};

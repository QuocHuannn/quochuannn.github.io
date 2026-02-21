const { merge } = require("webpack-merge");
const commonConfiguration = require("./webpack.common.js");

module.exports = merge(commonConfiguration, {
  mode: "development",
  devServer: {
    host: "0.0.0.0",
    port: 8080,
    open: true,
    hot: true,
    allowedHosts: "all",
  },
});

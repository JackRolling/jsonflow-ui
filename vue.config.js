const url = 'http://jsonflow-gateway:9999'
const path = require("path");

module.exports = {
  lintOnSave: false,
  outputDir: "dist",
  // 开发环境显示报错位置
  productionSourceMap: true,
  runtimeCompiler: true,

  devServer: {
    disableHostCheck: true,
    port: 8080,
    proxy: {
      '/': {
        target: url,
        ws: false,
        pathRewrite: {
          '^/': '/'
        }
      }
    }
  },
  pluginOptions: {
    "style-resources-loader": {
      preProcessor: "less",
      patterns: [
        // 全局变量路径，不能使用路径别名
        path.resolve(__dirname, "./src/assets/*"),
      ]
    }
  }
}

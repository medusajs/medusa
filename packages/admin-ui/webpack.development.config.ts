import path from "path"
import { Configuration } from "webpack-dev-server"
import { getWebpackConfig } from "./src/node/webpack/webpack.config"

const getDevServerConfig = () => {
  const devConfig = getWebpackConfig({
    cacheDir: __dirname,
    dest: path.resolve(__dirname, "build"),
    entry: path.resolve(__dirname, "ui", "src", "main.tsx"),
    env: "development",
    options: {
      backend: "http://localhost:9000",
      publicPath: "/",
    },
  })

  return {
    ...devConfig,
    ...{
      devServer: {
        port: 7001,
        historyApiFallback: true,
      } as Configuration,
    },
  }
}

module.exports = getDevServerConfig()

import path from "path"
import { Configuration } from "webpack-dev-server"
import { getDevConfig } from "./src/webpack/webpack.dev.config"

const getDevServerConfig = () => {
  const devConfig = getDevConfig({
    publicPath: "/",
    outDir: path.resolve(process.cwd(), "build"),
  })

  return {
    ...devConfig,
    context: path.resolve(__dirname, "ui"),
    ...{
      devServer: {
        port: 7001,
        historyApiFallback: true,
      } as Configuration,
    },
  }
}

module.exports = getDevServerConfig()

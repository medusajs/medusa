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
    ...{
      devServer: {
        port: 7001,
        historyApiFallback: true,
      } as Configuration,
    },
  }
}

// Dev config for running the admin ui in development mode from within the monorepo
module.exports = getDevServerConfig()

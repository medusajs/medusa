import webpack from "webpack"
import webpackDevMiddleware from "webpack-dev-middleware"
import webpackHotMiddleware from "webpack-hot-middleware"
import { BuildOptions } from "./types"
import { getDevConfig } from "./webpack/webpack.dev.config"

export function getDevMiddleware(options: BuildOptions) {
  const webpackDevConfig = getDevConfig(options)
  const compiler = webpack(webpackDevConfig)

  return {
    adminDevMiddleware: webpackDevMiddleware(compiler, {
      publicPath: "/app",
    }),
    adminHotMiddleware: webpackHotMiddleware(compiler as any),
  }
}

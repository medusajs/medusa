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
      stats: {
        colors: true,
        hash: false,
        version: false,
        timings: false,
        assets: false,
        chunks: false,
        modules: false,
        reasons: false,
        children: false,
        source: false,
        errors: false,
        errorDetails: false,
        warnings: false,
        publicPath: false,
      },
    }),
    adminHotMiddleware: webpackHotMiddleware(compiler as any),
  }
}

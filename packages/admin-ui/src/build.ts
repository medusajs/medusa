import webpack from "webpack"
import { BuildOptions } from "./types"
import { injectExtensions } from "./utils"
import { getProdConfig } from "./webpack/webpack.prod.config"

export async function build(options: BuildOptions) {
  await injectExtensions()

  const config = getProdConfig(options)
  const compiler = webpack(config)

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      let messages: webpack.StatsCompilation

      if (err) {
        if (!err.message) {
          return reject(err)
        }
        messages = {
          errors: [err],
          warnings: [],
        }
      } else {
        messages = stats.toJson({ all: false, warnings: true, errors: true })
      }

      if (messages.errors.length) {
        if (messages.errors.length > 1) {
          messages.errors.length = 1
        }

        return reject(
          new Error(
            messages.errors.reduce((acc, error) => {
              return acc + error.message
            }, "")
          )
        )
      }

      return resolve({
        stats,
        warnings: messages.warnings,
      })
    })
  })
}

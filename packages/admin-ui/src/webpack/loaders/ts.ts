import type { RuleSetRule } from "webpack"

const tsRegex = /\.tsx?$/

export const tsLoader: RuleSetRule = {
  test: tsRegex,
  use: {
    loader: "swc-loader",
    options: {
      sync: true,
      jsc: {
        transform: {
          react: {
            runtime: "automatic",
          },
        },
      },
    },
  },
}

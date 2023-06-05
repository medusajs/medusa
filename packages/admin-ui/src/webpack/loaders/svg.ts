import { RuleSetRule } from "webpack"
import { IS_DEV } from "../constants"

const svgRegex = /\.svg$/

export const svgLoader: RuleSetRule = {
  test: svgRegex,
  oneOf: [
    {
      type: "asset/resource",
      resourceQuery: /url/,
    },
    {
      type: "asset/inline",
      resourceQuery: /base64/,
    },
    {
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    },
  ],
  generator: {
    filename: `images/${IS_DEV ? "[name][ext]" : "[name]-[hash][ext]"}`,
  },
}

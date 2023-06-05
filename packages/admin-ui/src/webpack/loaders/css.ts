import MiniCssExtractPlugin from "mini-css-extract-plugin"
import type { RuleSetRule } from "webpack"

const cssTest = /\.css$/

export const cssLoader: RuleSetRule = {
  test: /\.css$/,
  use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
}

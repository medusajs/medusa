import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin"
import { Configuration, HotModuleReplacementPlugin } from "webpack"
import { BuildOptions } from "../types"
import { getBaseConfig } from "./webpack.base.config"

export function getDevConfig(options: BuildOptions): Configuration {
  const base = getBaseConfig(options)

  if (Array.isArray(base.entry)) {
    base.entry.push("webpack-hot-middleware/client")
  } else if (typeof base.entry === "string") {
    base.entry = [base.entry, "webpack-hot-middleware/client"]
  }

  base.plugins.push(
    new HotModuleReplacementPlugin(),
    new ReactRefreshWebpackPlugin()
  )

  return {
    ...base,
    mode: "development",
  }
}

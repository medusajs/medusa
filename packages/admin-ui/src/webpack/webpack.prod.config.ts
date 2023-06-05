import { Configuration } from "webpack"
import { BuildOptions } from "../types"
import { getBaseConfig } from "./webpack.base.config"

export function getProdConfig(options: BuildOptions): Configuration {
  const base = getBaseConfig(options)

  return {
    ...base,
    mode: "production",
  }
}

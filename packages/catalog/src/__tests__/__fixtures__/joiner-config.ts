import * as joinerConfigs from "./joiner-configs"

export const joinerConfig = Object.values(joinerConfigs).map(
  (config) => config.default
)

import { ModuleJoinerConfig } from "@medusajs/types"
import * as joinerConfigs from "./joiner-configs"

export const joinerConfig = Object.values(joinerConfigs) as ModuleJoinerConfig[]

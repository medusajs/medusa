import { defineJoinerConfig, Modules } from "@medusajs/utils"
import { default as schema } from "./schema"

export const joinerConfig = defineJoinerConfig(Modules.SALES_CHANNEL, {
  schema,
})

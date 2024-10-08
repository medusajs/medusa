import { defineJoinerConfig, Modules } from "@medusajs/framework/utils"

export const joinerConfig = defineJoinerConfig(Modules.FILE, {
  models: [{ name: "File" }],
})

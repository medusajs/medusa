import { defineJoinerConfig, Modules } from "@medusajs/utils"

export const joinerConfig = defineJoinerConfig(Modules.FILE, {
  models: [{ name: "File" }],
})

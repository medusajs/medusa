import { defineJoinerConfig, Modules } from "@medusajs/utils"

export const joinerConfig = defineJoinerConfig(Modules.NOTIFICATION, {
  dmlObjects: [{ name: "Notification" }],
})

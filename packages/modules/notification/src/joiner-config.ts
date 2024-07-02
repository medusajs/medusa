import { defineJoinerConfig, Modules } from "@medusajs/utils"

export const joinerConfig = defineJoinerConfig(Modules.NOTIFICATION, {
  models: [{ name: "Notification" }],
})

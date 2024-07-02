import { AuthIdentity } from "@models"
import { defineJoinerConfig, Modules } from "@medusajs/utils"

export const joinerConfig = defineJoinerConfig(Modules.AUTH, {
  dmlObjects: [AuthIdentity],
})

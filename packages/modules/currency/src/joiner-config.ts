import { defineJoinerConfig, Modules } from "@medusajs/utils"

export const joinerConfig = defineJoinerConfig(Modules.CURRENCY, {
  primaryKeys: ["code"],
  linkableKeys: {
    currency_code: "currency",
  },
})

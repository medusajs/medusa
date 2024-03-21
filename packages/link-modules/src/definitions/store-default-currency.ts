import { Modules } from "@medusajs/modules-sdk"
import { ModuleJoinerConfig } from "@medusajs/types"

export const StoreDefaultCurrency: ModuleJoinerConfig = {
  isLink: true,
  isReadOnlyLink: true,
  extends: [
    {
      serviceName: Modules.STORE,
      relationship: {
        serviceName: Modules.CURRENCY,
        primaryKey: "code",
        foreignKey: "default_currency_code",
        alias: "default_currency",
      },
    },
  ],
}

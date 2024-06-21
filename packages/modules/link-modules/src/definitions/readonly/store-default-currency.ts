import { ModuleJoinerConfig } from "@medusajs/types"
import { Modules } from "@medusajs/utils"

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
        args: {
          methodSuffix: "Currencies",
        },
      },
    },
  ],
}

import { Modules } from "@medusajs/modules-sdk"
import { ModuleJoinerConfig } from "@medusajs/types"
import { MapToConfig } from "@medusajs/utils"
import { Currency, MoneyAmount } from "@models"

export enum LinkableKeys {
  MONEY_AMOUNT_ID = "money_amount_id",
  CURRENCY_CODE = "currency_code",
}

export const entityNameToLinkableKeysMap: MapToConfig = {
  [Currency.name]: [{ mapTo: LinkableKeys.CURRENCY_CODE, valueFrom: "code" }],
  [MoneyAmount.name]: [
    { mapTo: LinkableKeys.MONEY_AMOUNT_ID, valueFrom: "id" },
  ],
}

export const joinerConfig: ModuleJoinerConfig = {
  serviceName: Modules.PRICING,
  primaryKeys: ["id", "currency_code"],
  linkableKeys: Object.values(LinkableKeys),
  alias: [
    {
      name: "money_amount",
    },
    {
      name: "money_amounts",
    },
    {
      name: "currency",
      args: {
        methodSuffix: "Currencies",
      },
    },
    {
      name: "currencies",
      args: {
        methodSuffix: "Currencies",
      },
    },
  ],
}

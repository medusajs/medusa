import { Modules } from "@medusajs/modules-sdk"
import { JoinerServiceConfig } from "@medusajs/types"
import { MapToConfig } from "@medusajs/utils"
import { Currency } from "@models"

export enum LinkableKeys {
  MONEY_AMOUNT_ID = "money_amount_id",
  CURRENCY_CODE = "code",
}

export const entityNameToLinkableKeysMap: MapToConfig = {
  [Currency.name]: [{ mapTo: LinkableKeys.CURRENCY_CODE, valueFrom: "code" }],
}

export const joinerConfig: JoinerServiceConfig = {
  serviceName: Modules.PRICING,
  primaryKeys: ["id"],
  alias: [
    // {
    //   name: "money_amount",
    // },
    // {
    //   name: "money_amounts",
    // },
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

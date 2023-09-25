import { Modules } from "@medusajs/modules-sdk"
import { ModuleJoinerConfig } from "@medusajs/types"
import { MapToConfig } from "@medusajs/utils"
import * as Models from "@models"

export enum LinkableKeys {
  MONEY_AMOUNT_ID = "money_amount_id",
  CURRENCY_CODE = "currency_code",
  PRICE_SET_ID = "price_set_id",
}

export const entityNameToLinkableKeysMap: MapToConfig = {
  [Models.PriceSet.name]: [
    { mapTo: LinkableKeys.PRICE_SET_ID, valueFrom: "id" },
  ],
  [Models.Currency.name]: [
    { mapTo: LinkableKeys.CURRENCY_CODE, valueFrom: "code" },
  ],
  [Models.MoneyAmount.name]: [
    { mapTo: LinkableKeys.MONEY_AMOUNT_ID, valueFrom: "id" },
  ],
}

export const joinerConfig: ModuleJoinerConfig = {
  serviceName: Modules.PRICING,
  primaryKeys: ["id", "currency_code"],
  linkableKeys: Object.values(LinkableKeys),
  alias: [
    {
      name: "price_set",
    },
    {
      name: "price_sets",
    },
    {
      name: "money_amount",
      args: {
        methodSuffix: "MoneyAmounts",
      },
    },
    {
      name: "money_amounts",
      args: {
        methodSuffix: "MoneyAmounts",
      },
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

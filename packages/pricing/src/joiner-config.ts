import { Modules } from "@medusajs/modules-sdk"
import { ModuleJoinerConfig } from "@medusajs/types"
import { MapToConfig } from "@medusajs/utils"
import * as Models from "@models"
import { Currency, MoneyAmount, PriceSet } from "@models"

export const LinkableKeys = {
  money_amount_id: MoneyAmount.name,
  currency_code: Currency.name,
  price_set_id: PriceSet.name,
}

export const entityNameToLinkableKeysMap: MapToConfig = {
  [Models.PriceSet.name]: [
    { mapTo: LinkableKeys.price_set_id, valueFrom: "id" },
  ],
  [Models.Currency.name]: [
    { mapTo: LinkableKeys.currency_code, valueFrom: "code" },
  ],
  [Models.MoneyAmount.name]: [
    { mapTo: LinkableKeys.money_amount_id, valueFrom: "id" },
  ],
}

export const joinerConfig: ModuleJoinerConfig = {
  serviceName: Modules.PRICING,
  primaryKeys: ["id", "currency_code"],
  linkableKeys: LinkableKeys,
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

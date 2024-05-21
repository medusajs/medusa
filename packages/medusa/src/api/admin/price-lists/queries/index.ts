import {
  buildPriceListRules,
  buildPriceSetPricesForCore,
} from "@medusajs/utils"
import { cleanResponseData } from "../../../../utils/clean-response-data"
import { AdminPriceListRemoteQueryDTO } from "../types"

export * from "./get-price-list"
export * from "./list-price-lists"
export * from "./list-prices"

export function buildPriceListResponse(
  priceLists,
  apiFields
): AdminPriceListRemoteQueryDTO[] {
  for (const priceList of priceLists) {
    priceList.rules = buildPriceListRules(priceList.price_list_rules)
    priceList.prices = buildPriceSetPricesForCore(priceList.prices)
  }

  return priceLists.map((priceList) => cleanResponseData(priceList, apiFields))
}

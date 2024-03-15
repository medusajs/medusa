import { MedusaContainer } from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  buildPriceListRules,
  buildPriceSetPricesForCore,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import { cleanResponseData } from "../../../../utils/clean-response-data"
import { AdminPriceListRemoteQueryDTO } from "../types"

export async function listPriceLists({
  container,
  remoteQueryFields,
  apiFields,
  variables,
}: {
  container: MedusaContainer
  remoteQueryFields: string[]
  apiFields: string[]
  variables: Record<string, any>
}): Promise<[AdminPriceListRemoteQueryDTO[], number]> {
  const remoteQuery = container.resolve(ContainerRegistrationKeys.REMOTE_QUERY)
  const queryObject = remoteQueryObjectFromString({
    entryPoint: "price_list",
    fields: remoteQueryFields,
    variables,
  })

  const { rows: priceLists, metadata } = await remoteQuery(queryObject)

  if (!metadata.count) {
    return [[], 0]
  }

  for (const priceList of priceLists) {
    priceList.rules = buildPriceListRules(priceList.price_list_rules || [])
    priceList.prices = buildPriceSetPricesForCore(
      priceList.price_set_money_amounts || []
    )
  }

  const sanitizedPriceLists: AdminPriceListRemoteQueryDTO[] = priceLists.map(
    (priceList) => cleanResponseData(priceList, apiFields)
  )

  return [sanitizedPriceLists, metadata.count]
}

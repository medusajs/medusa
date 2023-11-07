import {
  PriceListPriceDTO,
  UpdatePriceListDTO,
  WorkflowTypes,
} from "@medusajs/types"
import { WorkflowArguments } from "../../helper"

type Result = {
  priceLists: UpdatePriceListDTO[]
  priceListPricesMap: Map<string, PriceListPriceDTO[]>
}

export async function prepareUpdatePriceLists({
  container,
  data,
}: WorkflowArguments<{
  price_lists: WorkflowTypes.PriceListWorkflow.UpdatePriceListWorkflowDTO[]
}>): Promise<Result> {
  const { price_lists: priceListsData } = data
  const remoteQuery = container.resolve("remoteQuery")

  const variantPriceSetMap = new Map<string, string>()
  const priceListPricesMap = new Map<string, PriceListPriceDTO[]>()

  const variantIds = priceListsData
    .map((pld) => pld.prices?.map((p) => p.variant_id))
    .flat()

  const variables = {
    variant_id: variantIds,
  }

  const query = {
    product_variant_price_set: {
      __args: variables,
      fields: ["variant_id", "price_set_id"],
    },
  }

  const variantPriceSets = await remoteQuery(query)

  for (const { variant_id, price_set_id } of variantPriceSets) {
    variantPriceSetMap.set(variant_id, price_set_id)
  }

  const priceLists = priceListsData.map((pld) => {
    const priceListPrices: PriceListPriceDTO[] = []

    pld.prices?.forEach((price) => {
      const { variant_id, ...priceData } = price
      if (!variant_id) {
        return
      }

      priceListPrices.push({
        id: priceData.id,
        price_set_id: variantPriceSetMap.get(variant_id) as string,
        currency_code: priceData.currency_code as string,
        amount: priceData.amount,
        min_quantity: priceData.min_quantity,
        max_quantity: priceData.max_quantity,
      })

      return
    })

    priceListPricesMap.set(pld.id, priceListPrices)

    delete pld?.prices

    const priceListDataClone: UpdatePriceListDTO = {
      ...pld,
    }

    if (pld.name) {
      priceListDataClone.title = pld.name
    }

    return priceListDataClone
  })

  return { priceLists, priceListPricesMap }
}

prepareUpdatePriceLists.aliases = {
  payload: "prepare",
}

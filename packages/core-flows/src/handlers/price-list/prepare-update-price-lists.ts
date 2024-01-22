import {
  PriceListPriceDTO,
  UpdatePriceListDTO,
  WorkflowTypes,
} from "@medusajs/types"
import { WorkflowArguments } from "@medusajs/workflows-sdk"

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
  const regionService = container.resolve("regionService")

  const variantPriceSetMap = new Map<string, string>()
  const priceListPricesMap = new Map<string, PriceListPriceDTO[]>()

  const variantIds = priceListsData
    .map((priceListData) => priceListData.prices?.map((p) => p.variant_id))
    .flat()

  const variables = {
    variant_id: variantIds,
    take: null,
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

  const regionIds = priceListsData
    .map(({ prices }) => prices?.map((price) => price.region_id) ?? [])
    .flat(2)
  const regions = await regionService.list({ id: regionIds })
  const regionsMap: Map<string, string> = new Map(
    regions.map((region: { id: string; currency_code: string }) => [
      region.id,
      region.currency_code,
    ])
  )

  const priceLists = priceListsData.map((priceListData) => {
    const priceListPrices: PriceListPriceDTO[] = []

    priceListData.prices?.forEach((price) => {
      const { variant_id, ...priceData } = price
      if (!variant_id) {
        return
      }

      const rules: Record<string, string> = {}
      if (price.region_id) {
        rules.region_id = price.region_id
      }

      priceListPrices.push({
        id: priceData.id,
        price_set_id: variantPriceSetMap.get(variant_id) as string,
        currency_code:
          regionsMap.get(priceData.region_id as string) ??
          (priceData.currency_code as string),
        amount: priceData.amount,
        min_quantity: priceData.min_quantity,
        max_quantity: priceData.max_quantity,
        rules,
      })

      return
    })

    priceListPricesMap.set(priceListData.id, priceListPrices)

    delete priceListData?.prices

    const priceListDataClone: UpdatePriceListDTO = {
      ...priceListData,
    }

    if (priceListData.name) {
      priceListDataClone.title = priceListData.name
    }

    return priceListDataClone
  })

  return { priceLists, priceListPricesMap }
}

prepareUpdatePriceLists.aliases = {
  payload: "prepare",
}

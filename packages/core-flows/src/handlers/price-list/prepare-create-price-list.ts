import { CreatePriceListDTO, PriceListWorkflow } from "@medusajs/types"
import { MedusaError } from "@medusajs/utils"
import { WorkflowArguments } from "@medusajs/workflows-sdk"

type Result = {
  tag?: string
  priceList: CreatePriceListDTO
}[]

export async function prepareCreatePriceLists({
  container,
  data,
}: WorkflowArguments<{
  price_lists: (PriceListWorkflow.CreatePriceListWorkflowDTO & {
    _associationTag?: string
  })[]
}>): Promise<Result | void> {
  const remoteQuery = container.resolve("remoteQuery")
  const regionService = container.resolve("regionService")

  const { price_lists } = data

  const variantIds = price_lists
    .map((priceList) => priceList.prices.map((price) => price.variant_id))
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

  const variantIdPriceSetIdMap: Map<string, string> = new Map(
    variantPriceSets.map((variantPriceSet) => [
      variantPriceSet.variant_id,
      variantPriceSet.price_set_id,
    ])
  )

  const variantsWithoutPriceSets: string[] = []

  for (const variantId of variantIds) {
    if (!variantIdPriceSetIdMap.has(variantId)) {
      variantsWithoutPriceSets.push(variantId)
    }
  }

  if (variantsWithoutPriceSets.length) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `No priceSet exist for variants: ${variantsWithoutPriceSets.join(", ")}`
    )
  }

  const regionIds = price_lists
    .map(({ prices }) => prices?.map((price) => price.region_id) ?? [])
    .flat(2)
  const regions = await regionService.list({ id: regionIds }, {})
  const regionIdCurrencyCodeMap: Map<string, string> = new Map(
    regions.map((region: { id: string; currency_code: string }) => [
      region.id,
      region.currency_code,
    ])
  )

  return price_lists.map((priceListDTO) => {
    priceListDTO.title ??= priceListDTO.name
    const { _associationTag, name, prices, ...rest } = priceListDTO

    const priceList = rest as CreatePriceListDTO

    priceList.rules ??= {}
    priceList.prices =
      prices?.map((price) => {
        const price_set_id = variantIdPriceSetIdMap.get(price.variant_id)!

        const rules: Record<string, string> = {}
        if (price.region_id) {
          rules.region_id = price.region_id
        }

        return {
          currency_code:
            regionIdCurrencyCodeMap.get(price.region_id as string) ??
            (price.currency_code as string),
          amount: price.amount,
          min_quantity: price.min_quantity,
          max_quantity: price.max_quantity,
          price_set_id,
          rules,
        }
      }) ?? []

    return { priceList, tag: _associationTag }
  })
}

prepareCreatePriceLists.aliases = {
  payload: "payload",
}

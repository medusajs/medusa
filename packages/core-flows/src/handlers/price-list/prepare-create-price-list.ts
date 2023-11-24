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

  return price_lists.map((priceListDTO) => {
    priceListDTO.title ??= priceListDTO.name
    const { _associationTag, name, prices, ...rest } = priceListDTO

    const priceList = rest as CreatePriceListDTO

    priceList.rules ??= {}
    priceList.prices =
      prices?.map((price) => {
        const price_set_id = variantIdPriceSetIdMap.get(price.variant_id)!

        return {
          currency_code: price.currency_code,
          amount: price.amount,
          min_quantity: price.min_quantity,
          max_quantity: price.max_quantity,
          price_set_id,
        }
      }) ?? []

    return { priceList, tag: _associationTag }
  })
}

prepareCreatePriceLists.aliases = {
  payload: "payload",
}

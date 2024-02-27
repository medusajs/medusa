import { WorkflowArguments } from "@medusajs/workflows-sdk"
import { prepareCreatePriceLists } from "./prepare-create-price-list"

type Result = {
  priceSetIds: string[]
  priceListId: string
}

export async function prepareRemoveVariantPrices({
  container,
  data,
}: WorkflowArguments<{
  variant_ids: string[]
  price_list_id: string
}>): Promise<Result | void> {
  const remoteQuery = container.resolve("remoteQuery")

  const { price_list_id, variant_ids } = data

  const variables = {
    variant_id: variant_ids,
    take: null,
  }

  const query = {
    product_variant_price_set: {
      __args: variables,
      fields: ["variant_id", "price_set_id"],
    },
  }

  const productsWithVariantPriceSets: QueryResult[] = await remoteQuery(query)

  const priceSetIds = productsWithVariantPriceSets.map(
    (variantPriceSet) => variantPriceSet.price_set_id
  )

  return { priceSetIds, priceListId: price_list_id }
}

prepareCreatePriceLists.aliases = {
  payload: "payload",
}

type QueryResult = {
  price_set_id: string
  variant_id: string
}

const defaultAdminProductRemoteQueryObject = {
  fields: ["id"],
  variants: {
    price: {
      fields: ["variant_id", "price_set_id"],
    },
  },
}

import { WorkflowArguments } from "../../helper"
import { prepareCreatePriceLists } from "./prepare-create-price-list"

type Result = {
  priceSets: string[]
  priceListId: string
}

export async function prepareRemoveVariantPrices({
  container,
  data,
}: WorkflowArguments<{
  variantIds: string[]
  priceListId: string
}>): Promise<Result | void> {
  const remoteQuery = container.resolve("remoteQuery")

  const { priceListId, variantIds } = data

  const variables = {
    variant_id: variantIds,
  }

  const query = {
    product_variant_price_set: {
      __args: variables,
      fields: ["variant_id", "price_set_id"],
    },
  }

  const productsWithVariantPriceSets: QueryResult[] = await remoteQuery(query)

  const priceSets = productsWithVariantPriceSets.map(
    (variantPriceSet) => variantPriceSet.price_set_id
  )

  return { priceSets, priceListId }
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

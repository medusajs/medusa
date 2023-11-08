import { WorkflowArguments } from "../../helper"
import { prepareCreatePriceLists } from "./prepare-create-price-list"

type Result = {
  priceSets: string[]
}

export async function prepareRemoveProductPrices({
  container,
  data,
}: WorkflowArguments<{
  productIds: string[]
}>): Promise<Result | void> {
  const remoteQuery = container.resolve("remoteQuery")

  const { productIds } = data

  const variables = {
    id: productIds,
  }

  const query = {
    product: {
      __args: variables,
      ...defaultAdminProductRemoteQueryObject,
    },
  }

  const variantPriceSets = await remoteQuery(query)

  const variantIdPriceSetIdMap: Map<string, string> = new Map(
    variantPriceSets.map((variantPriceSet) => [
      variantPriceSet.variant_id,
      variantPriceSet.price_set_id,
    ])
  )

  return { priceSets: [] }
}

prepareCreatePriceLists.aliases = {
  payload: "payload",
}

const defaultAdminProductRemoteQueryObject = {
  fields: ["id"],
  variants: {
    product_variant_price_set: {
      fields: ["variant_id", "price_set_id"],
    },
  },
}

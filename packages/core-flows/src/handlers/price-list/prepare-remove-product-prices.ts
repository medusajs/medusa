import { WorkflowArguments } from "@medusajs/workflows-sdk"
import { prepareCreatePriceLists } from "./prepare-create-price-list"

type Result = {
  priceSetIds: string[]
  priceListId: string
}

export async function prepareRemoveProductPrices({
  container,
  data,
}: WorkflowArguments<{
  product_ids: string[]
  price_list_id: string
}>): Promise<Result | void> {
  const remoteQuery = container.resolve("remoteQuery")

  const { price_list_id, product_ids } = data

  const variables = {
    id: product_ids,
    take: null,
  }

  const query = {
    product: {
      __args: variables,
      ...defaultAdminProductRemoteQueryObject,
    },
  }

  const productsWithVariantPriceSets: QueryResult[] = await remoteQuery(query)

  const priceSetIds = productsWithVariantPriceSets
    .map(({ variants }) => variants.map(({ price }) => price.price_set_id))
    .flat()

  return { priceSetIds, priceListId: price_list_id }
}

prepareCreatePriceLists.aliases = {
  payload: "payload",
}

type QueryResult = {
  id: string
  variants: {
    id: string
    price: {
      price_set_id: string
      variant_id: string
    }
  }[]
}

const defaultAdminProductRemoteQueryObject = {
  fields: ["id"],
  variants: {
    price: {
      fields: ["variant_id", "price_set_id"],
    },
  },
}

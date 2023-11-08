import { WorkflowArguments } from "../../helper"
import { prepareCreatePriceLists } from "./prepare-create-price-list"

type Result = {
  priceSets: string[]
  priceListId: string
}

export async function prepareRemoveProductPrices({
  container,
  data,
}: WorkflowArguments<{
  productIds: string[]
  priceListId: string
}>): Promise<Result | void> {
  const remoteQuery = container.resolve("remoteQuery")

  const { priceListId, productIds } = data

  const variables = {
    id: productIds,
  }

  const query = {
    product: {
      __args: variables,
      ...defaultAdminProductRemoteQueryObject,
    },
  }

  const productsWithVariantPriceSets: QueryResult[] = await remoteQuery(query)

  const priceSets = productsWithVariantPriceSets
    .map(({ variants }) => variants.map(({ price }) => price.price_set_id))
    .flat()

  return { priceSets, priceListId }
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

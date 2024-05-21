import { MedusaContainer } from "@medusajs/types"
import {
  buildPriceListRules,
  buildPriceSetPricesForCore,
  ContainerRegistrationKeys,
  isPresent,
  MedusaError,
  remoteQueryObjectFromString,
} from "@medusajs/utils"

export const fetchPriceList = async (
  id: string,
  scope: MedusaContainer,
  fields: string[]
) => {
  const remoteQuery = scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "price_lists",
    variables: {
      filters: { id },
    },
    fields,
  })

  const [priceList] = await remoteQuery(queryObject)

  if (!isPresent(priceList)) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Price list with id: ${id} was not found`
    )
  }

  return transformPriceList(priceList)
}

export const transformPriceList = (priceList) => {
  priceList.rules = buildPriceListRules(priceList.price_list_rules)
  priceList.prices = buildPriceSetPricesForCore(priceList.prices)

  delete priceList.price_list_rules

  return priceList
}

export const fetchPriceListPriceIdsForProduct = async (
  priceListId: string,
  productIds: string[],
  scope: MedusaContainer
): Promise<string[]> => {
  const remoteQuery = scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)
  const priceSetIds: string[] = []
  const variants = await remoteQuery(
    remoteQueryObjectFromString({
      entryPoint: "variants",
      variables: { filters: { product_id: productIds } },
      fields: ["price_set.id"],
    })
  )

  for (const variant of variants) {
    if (variant.price_set?.id) {
      priceSetIds.push(variant.price_set.id)
    }
  }

  const productPrices = await remoteQuery(
    remoteQueryObjectFromString({
      entryPoint: "prices",
      variables: {
        filters: { price_set_id: priceSetIds, price_list_id: priceListId },
      },
      fields: ["id"],
    })
  )

  return productPrices.map((price) => price.id)
}

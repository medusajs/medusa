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

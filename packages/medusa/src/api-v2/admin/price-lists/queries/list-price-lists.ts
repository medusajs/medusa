import { MedusaContainer } from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import { AdminPriceListRemoteQueryDTO } from "../types"
import { buildPriceListResponse } from "./"

export async function listPriceLists({
  container,
  remoteQueryFields,
  apiFields,
  variables,
}: {
  container: MedusaContainer
  remoteQueryFields: string[]
  apiFields: string[]
  variables: Record<string, any>
}): Promise<[AdminPriceListRemoteQueryDTO[], number]> {
  const remoteQuery = container.resolve(ContainerRegistrationKeys.REMOTE_QUERY)
  const queryObject = remoteQueryObjectFromString({
    entryPoint: "price_list",
    fields: remoteQueryFields,
    variables,
  })

  const { rows: priceLists, metadata } = await remoteQuery(queryObject)

  if (!metadata.count) {
    return [[], 0]
  }

  const sanitizedPriceLists = buildPriceListResponse(priceLists, apiFields)

  return [sanitizedPriceLists, metadata.count]
}

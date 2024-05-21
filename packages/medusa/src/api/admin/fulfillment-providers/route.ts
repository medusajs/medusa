import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../types/routing"
import { AdminFulfillmentProvidersParamsType } from "./validators"

export const GET = async (
  req: AuthenticatedMedusaRequest<AdminFulfillmentProvidersParamsType>,
  res: MedusaResponse
) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)
  const queryObject = remoteQueryObjectFromString({
    entryPoint: "fulfillment_provider",
    variables: {
      filters: req.filterableFields,
      ...req.remoteQueryConfig.pagination,
    },
    fields: req.remoteQueryConfig.fields,
  })

  const { rows: fulfillment_providers, metadata } = await remoteQuery(
    queryObject
  )

  res.json({
    fulfillment_providers,
    count: metadata.count,
    offset: metadata.skip,
    limit: metadata.take,
  })
}

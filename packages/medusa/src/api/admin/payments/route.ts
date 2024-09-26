import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/framework/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../types/routing"
import { HttpTypes } from "@medusajs/types"

export const GET = async (
  req: AuthenticatedMedusaRequest<HttpTypes.AdminPaymentFilters>,
  res: MedusaResponse<HttpTypes.AdminPaymentsResponse>
) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)
  const queryObject = remoteQueryObjectFromString({
    entryPoint: "payment",
    variables: {
      filters: req.filterableFields,
      ...req.remoteQueryConfig.pagination,
    },
    fields: req.remoteQueryConfig.fields,
  })

  const { rows: payments, metadata } = await remoteQuery(queryObject)

  res.json({
    payments,
    count: metadata.count,
    offset: metadata.skip,
    limit: metadata.take,
  })
}

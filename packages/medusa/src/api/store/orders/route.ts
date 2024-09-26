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
  req: AuthenticatedMedusaRequest<HttpTypes.StoreOrderFilters>,
  res: MedusaResponse<HttpTypes.StoreOrderListResponse>
) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "order",
    variables: {
      filters: {
        ...req.filterableFields,
        customer_id: req.auth_context.actor_id,
      },
      ...req.remoteQueryConfig.pagination,
    },
    fields: req.remoteQueryConfig.fields,
  })

  const { rows: orders, metadata } = await remoteQuery(queryObject)

  res.json({
    orders,
    count: metadata.count,
    offset: metadata.skip,
    limit: metadata.take,
  })
}

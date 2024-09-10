import { ContainerRegistrationKeys } from "@medusajs/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../types/routing"
import { HttpTypes } from "@medusajs/types"

export const GET = async (
  req: AuthenticatedMedusaRequest<HttpTypes.AdminStoreListParams>,
  res: MedusaResponse<HttpTypes.AdminStoreListResponse>
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const {
    data: [stores],
    metadata,
  } = await query.graph({
    entryPoint: "store",
    variables: {
      filters: req.filterableFields,
      ...req.remoteQueryConfig.pagination,
    },
    fields: req.remoteQueryConfig.fields,
  })

  res.json({
    stores,
    count: metadata?.count,
    offset: metadata?.skip,
    limit: metadata?.take,
  })
}

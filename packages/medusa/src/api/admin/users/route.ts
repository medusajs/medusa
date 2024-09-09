import { HttpTypes } from "@medusajs/types"
import { ContainerRegistrationKeys } from "@medusajs/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../types/routing"

export const GET = async (
  req: AuthenticatedMedusaRequest<HttpTypes.AdminUserListParams>,
  res: MedusaResponse<HttpTypes.AdminUserListResponse>
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data: users, metadata } = await query.graph({
    entryPoint: "user",
    variables: {
      filters: req.filterableFields,
      ...req.remoteQueryConfig.pagination,
    },
    fields: req.remoteQueryConfig.fields,
  })

  res.status(200).json({
    users,
    count: metadata?.count,
    offset: metadata?.skip,
    limit: metadata?.take,
  })
}

export const AUTHENTICATE = false

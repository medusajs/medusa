import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { HttpTypes } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export const GET = async (
  req: AuthenticatedMedusaRequest<HttpTypes.AdminGetLayoutConfigurationsParams>,
  res: MedusaResponse<HttpTypes.AdminLayoutConfigurationListResponse>
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const filters = {
    ...req.filterableFields,
    $or: [{ user_id: req.auth_context.actor_id }, { is_system_default: true }],
  }

  const { data: layout_configurations, metadata } = await query.graph({
    entity: "layout_configuration",
    fields: req.queryConfig.fields,
    filters,
    pagination: req.queryConfig.pagination,
  })

  res.json({
    layout_configurations,
    count: metadata?.count ?? 0,
    offset: metadata?.skip ?? 0,
    limit: metadata?.take ?? 20,
  })
}

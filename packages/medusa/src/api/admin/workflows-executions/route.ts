import { HttpTypes } from "@medusajs/types"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../types/routing"
import { ContainerRegistrationKeys } from "@medusajs/utils"

export const GET = async (
  req: AuthenticatedMedusaRequest<HttpTypes.AdminGetWorkflowExecutionsParams>,
  res: MedusaResponse<HttpTypes.AdminWorkflowExecutionListResponse>
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data: workflowExecutions, metadata } = await query.graph({
    entryPoint: "workflow_execution",
    variables: {
      filters: req.filterableFields,
      ...req.remoteQueryConfig.pagination,
    },
    fields: req.remoteQueryConfig.fields,
  })

  res.json({
    workflow_executions: workflowExecutions,
    count: metadata?.count,
    offset: metadata?.skip,
    limit: metadata?.take,
  })
}

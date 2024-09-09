import { HttpTypes } from "@medusajs/types"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../types/routing"

import { AdminGetWorkflowExecutionDetailsParamsType } from "../validators"
import { ContainerRegistrationKeys } from "@medusajs/utils"

export const GET = async (
  req: AuthenticatedMedusaRequest<AdminGetWorkflowExecutionDetailsParamsType>,
  res: MedusaResponse<HttpTypes.AdminWorkflowExecutionResponse>
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const variables = { id: req.params.id }

  const {
    data: [workflowExecution],
  } = await query.graph({
    entryPoint: "workflow_execution",
    variables,
    fields: req.remoteQueryConfig.fields,
  })

  res.status(200).json({ workflow_execution: workflowExecution })
}

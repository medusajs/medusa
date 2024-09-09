import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../types/routing"

import { ContainerRegistrationKeys } from "@medusajs/utils"
import { AdminGetWorkflowExecutionDetailsParamsType } from "../../validators"
import { HttpTypes } from "@medusajs/types"

export const GET = async (
  req: AuthenticatedMedusaRequest<AdminGetWorkflowExecutionDetailsParamsType>,
  res: MedusaResponse<HttpTypes.AdminWorkflowExecutionResponse>
) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { workflow_id, transaction_id } = req.params
  const variables = { workflow_id, transaction_id }

  const {
    data: [workflowExecution],
  } = await remoteQuery.graph({
    entryPoint: "workflow_execution",
    variables,
    fields: req.remoteQueryConfig.fields,
  })

  res.status(200).json({ workflow_execution: workflowExecution })
}

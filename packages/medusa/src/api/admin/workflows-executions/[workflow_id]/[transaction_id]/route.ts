import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../types/routing"

import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import { AdminGetWorkflowExecutionDetailsParamsType } from "../../validators"

export const GET = async (
  req: AuthenticatedMedusaRequest<AdminGetWorkflowExecutionDetailsParamsType>,
  res: MedusaResponse
) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const { workflow_id, transaction_id } = req.params
  const variables = { workflow_id, transaction_id }

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "workflow_execution",
    variables,
    fields: req.remoteQueryConfig.fields,
  })

  const [workflowExecution] = await remoteQuery(queryObject)

  res.status(200).json({ workflow_execution: workflowExecution })
}

import { HttpTypes } from "@zjedene-medusa/framework/types"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@zjedene-medusa/framework/http"

import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@zjedene-medusa/framework/utils"

export const GET = async (
  req: AuthenticatedMedusaRequest<HttpTypes.AdminGetWorkflowExecutionDetailsParams>,
  res: MedusaResponse<HttpTypes.AdminWorkflowExecutionResponse>
) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)
  const variables = { id: req.params.id }

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "workflow_execution",
    variables,
    fields: req.queryConfig.fields,
  })

  const [workflowExecution] = await remoteQuery(queryObject)
  res.status(200).json({ workflow_execution: workflowExecution })
}

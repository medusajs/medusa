import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../types/routing"

import { AdminGetWorkflowExecutionsParamsType } from "./validators"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/utils"

export const GET = async (
  req: AuthenticatedMedusaRequest<AdminGetWorkflowExecutionsParamsType>,
  res: MedusaResponse
) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "workflow_execution",
    variables: {
      filters: req.filterableFields,
      ...req.remoteQueryConfig.pagination,
    },
    fields: req.remoteQueryConfig.fields,
  })

  const { rows: workflowExecutions, metadata } = await remoteQuery(queryObject)

  res.json({
    workflow_executions: workflowExecutions,
    count: metadata.count,
    offset: metadata.skip,
    limit: metadata.take,
  })
}

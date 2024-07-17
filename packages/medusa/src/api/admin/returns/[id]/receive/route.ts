import {
  beginReceiveReturnWorkflow,
  cancelReturnReceiveWorkflow,
} from "@medusajs/core-flows"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../types/routing"
import { AdminPostReceiveReturnsReqSchemaType } from "../../validators"

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminPostReceiveReturnsReqSchemaType>,
  res: MedusaResponse
) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const { id } = req.params

  const workflow = beginReceiveReturnWorkflow(req.scope)
  const { result } = await workflow.run({
    input: {
      ...req.validatedBody,
      return_id: id,
    },
  })

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "return",
    variables: {
      id: result.return_id,
      filters: {
        ...req.filterableFields,
      },
    },
    fields: req.remoteQueryConfig.fields,
  })

  const [orderReturn] = await remoteQuery(queryObject)

  res.json({
    order_change: result,
    return: orderReturn,
  })
}

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const { id } = req.params

  await cancelReturnReceiveWorkflow(req.scope).run({
    input: {
      return_id: id,
    },
  })

  res.status(200).json({
    id,
    object: "return",
    deleted: true,
  })
}

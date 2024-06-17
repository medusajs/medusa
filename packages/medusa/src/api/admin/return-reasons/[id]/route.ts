import {
  deleteReturnReasonsWorkflow,
  updateReturnReasonsWorkflow,
} from "@medusajs/core-flows"
import { UpdateOrderReturnReasonDTO } from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../types/routing"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const variables = { id: req.params.id }

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "return_reason",
    variables,
    fields: req.remoteQueryConfig.fields,
  })

  const [return_reason] = await remoteQuery(queryObject)

  res.json({ return_reason })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<UpdateOrderReturnReasonDTO>,
  res: MedusaResponse
) => {
  const workflow = updateReturnReasonsWorkflow(req.scope)

  const { id } = req.params
  const input = {
    selector: { id },
    update: req.validatedBody,
  }

  const { result } = await workflow.run({ input })

  const variables = { id: result[0].id }

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "return_reason",
    variables,
    fields: req.remoteQueryConfig.fields,
  })

  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)
  const [return_reason] = await remoteQuery(queryObject)

  res.json({ return_reason })
}

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const { id } = req.params

  const workflow = deleteReturnReasonsWorkflow(req.scope)

  const input = {
    ids: [id],
  }
  await workflow.run({ input })

  res.json({
    id,
    object: "return_reason",
    deleted: true,
  })
}

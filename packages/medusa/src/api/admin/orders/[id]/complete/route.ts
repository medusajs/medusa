import { completeOrderWorkflow } from "@medusajs/core-flows"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../types/routing"
import { AdminCompleteOrderType } from "../../validators"

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminCompleteOrderType>,
  res: MedusaResponse
) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)
  const { id } = req.params

  const { errors } = await completeOrderWorkflow(req.scope).run({
    input: { orderIds: [req.validatedBody.order_id] },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "order",
    variables: { id },
    fields: req.remoteQueryConfig.fields,
  })

  const [order] = await remoteQuery(queryObject)

  res.status(200).json({ order })
}

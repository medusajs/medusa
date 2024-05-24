import { completeOrderWorkflow } from "@medusajs/core-flows"
import { remoteQueryObjectFromString } from "@medusajs/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../types/routing"
import { AdminCompleteOrderType } from "../../validators"

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminCompleteOrderType>,
  res: MedusaResponse
) => {
  const remoteQuery = req.scope.resolve("remoteQuery")
  const { id } = req.params

  await completeOrderWorkflow(req.scope).run({
    input: { orderIds: [req.validatedBody.order_id] },
  })

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "order",
    variables: { id },
    fields: req.remoteQueryConfig.fields,
  })

  const [order] = await remoteQuery(queryObject)

  res.status(200).json({ order })
}

import { cancelOrderFulfillmentWorkflow } from "@medusajs/core-flows"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../../../types/routing"
import { AdminOrderCancelFulfillmentType } from "../../../../validators"
import { AdditionalData } from "@medusajs/types"

export const POST = async (
  req: AuthenticatedMedusaRequest<
    AdminOrderCancelFulfillmentType & AdditionalData
  >,
  res: MedusaResponse
) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const variables = { id: req.params.id }

  const input = {
    ...req.validatedBody,
    order_id: req.params.id,
    fulfillment_id: req.params.fulfillment_id,
  }

  await cancelOrderFulfillmentWorkflow(req.scope).run({
    input,
  })

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "order",
    variables,
    fields: req.remoteQueryConfig.fields,
  })

  const [order] = await remoteQuery(queryObject)
  res.status(200).json({ order })
}

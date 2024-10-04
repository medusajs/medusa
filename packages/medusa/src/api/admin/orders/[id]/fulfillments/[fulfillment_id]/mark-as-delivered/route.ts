import { markOrderFulfillmentAsDeliveredWorkflow } from "@medusajs/core-flows"
import { HttpTypes } from "@medusajs/framework/types"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
  refetchEntity,
} from "@medusajs/framework/http"

export const POST = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse<HttpTypes.AdminOrderResponse>
) => {
  const { id: orderId, fulfillment_id: fulfillmentId } = req.params

  await markOrderFulfillmentAsDeliveredWorkflow(req.scope).run({
    input: { orderId, fulfillmentId },
  })

  const order = await refetchEntity(
    "order",
    orderId,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.status(200).json({ order })
}

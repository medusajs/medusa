import type {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework"
import { HttpTypes } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

import { refundOrderToStoreCreditWorkflow } from "../../../../../workflows/orders/workflows/refund-order-to-store-credit"
import { AdminRefundOrderToStoreCreditParamsType } from "./validators"

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminRefundOrderToStoreCreditParamsType>,
  res: MedusaResponse<HttpTypes.AdminOrderResponse>
) => {
  const { id } = req.params

  await refundOrderToStoreCreditWorkflow.run({
    input: {
      order_id: id,
      amount: req.validatedBody.amount,
      note: req.validatedBody.note,
    },
    container: req.scope,
  })

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const {
    data: [order],
  } = await query.graph(
    {
      entity: "order",
      fields: ["*"],
      filters: { id },
    },
    { throwIfKeyNotFound: true }
  )

  res.json({ order })
}

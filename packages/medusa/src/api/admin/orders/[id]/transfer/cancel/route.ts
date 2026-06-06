import { cancelOrderTransferRequestWorkflow } from "@zjedene-medusa/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@zjedene-medusa/framework/http"
import { AdminOrder, HttpTypes } from "@zjedene-medusa/framework/types"
import { ContainerRegistrationKeys } from "@zjedene-medusa/framework/utils"

export const POST = async (
  req: AuthenticatedMedusaRequest<{}, HttpTypes.AdminGetOrderParams>,
  res: MedusaResponse<HttpTypes.AdminOrderResponse>
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const orderId = req.params.id
  const userId = req.auth_context.actor_id

  await cancelOrderTransferRequestWorkflow(req.scope).run({
    input: {
      order_id: orderId,
      logged_in_user_id: userId,
      actor_type: req.auth_context.actor_type as "user",
    },
  })

  const result = await query.graph({
    entity: "order",
    filters: { id: orderId },
    fields: req.queryConfig.fields,
  })

  res.status(200).json({ order: result.data[0] as AdminOrder })
}

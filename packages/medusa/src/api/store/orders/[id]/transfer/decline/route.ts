import { AuthenticatedMedusaRequest, MedusaResponse } from "@zjedene-medusa/framework"
import { HttpTypes } from "@zjedene-medusa/framework/types"
import {
  declineOrderTransferRequestWorkflow,
  getOrderDetailWorkflow,
} from "@zjedene-medusa/core-flows"

export const POST = async (
  req: AuthenticatedMedusaRequest<
    HttpTypes.StoreDeclineOrderTransfer,
    HttpTypes.SelectParams
  >,
  res: MedusaResponse<HttpTypes.StoreOrderResponse>
) => {
  await declineOrderTransferRequestWorkflow(req.scope).run({
    input: {
      order_id: req.params.id,
      token: req.validatedBody.token,
    },
  })

  const { result } = await getOrderDetailWorkflow(req.scope).run({
    input: {
      fields: req.queryConfig.fields,
      order_id: req.params.id,
    },
  })

  res.status(200).json({ order: result as HttpTypes.StoreOrder })
}

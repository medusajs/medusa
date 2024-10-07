import { getOrderDetailWorkflow } from "@medusajs/core-flows"
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { HttpTypes } from "@medusajs/framework/types"

// TODO: Do we want to apply some sort of authentication here? My suggestion is that we do
export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse<HttpTypes.StoreOrderResponse>
) => {
  const workflow = getOrderDetailWorkflow(req.scope)
  const { result } = await workflow.run({
    input: {
      fields: req.remoteQueryConfig.fields,
      order_id: req.params.id,
    },
  })

  res.status(200).json({ order: result as HttpTypes.StoreOrder })
}

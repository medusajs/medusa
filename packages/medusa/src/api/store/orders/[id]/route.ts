import { getOrderDetailWorkflow } from "@zjedene-medusa/core-flows"
import { MedusaRequest, MedusaResponse } from "@zjedene-medusa/framework/http"
import { HttpTypes } from "@zjedene-medusa/framework/types"

// TODO: Do we want to apply some sort of authentication here? My suggestion is that we do
export const GET = async (
  req: MedusaRequest<HttpTypes.StoreGetOrderParams>,
  res: MedusaResponse<HttpTypes.StoreOrderResponse>
) => {
  const workflow = getOrderDetailWorkflow(req.scope)
  const { result } = await workflow.run({
    input: {
      fields: req.queryConfig.fields,
      order_id: req.params.id,
      filters: {
        is_draft_order: false,
      },
    },
  })

  res.status(200).json({ order: result as HttpTypes.StoreOrder })
}

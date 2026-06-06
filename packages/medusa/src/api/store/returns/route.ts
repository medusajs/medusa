import { createAndCompleteReturnOrderWorkflow } from "@zjedene-medusa/core-flows"
import { MedusaRequest, MedusaResponse } from "@zjedene-medusa/framework/http"
import { HttpTypes } from "@zjedene-medusa/framework/types"

/**
 * @since 2.8.0
 */
export const POST = async (
  req: MedusaRequest<HttpTypes.StoreCreateReturn>,
  res: MedusaResponse<HttpTypes.StoreReturnResponse>
) => {
  const input = req.validatedBody as HttpTypes.StoreCreateReturn

  const workflow = createAndCompleteReturnOrderWorkflow(req.scope)
  const { result } = await workflow.run({
    input,
  })

  res.status(200).json({ return: result as HttpTypes.StoreReturn })
}

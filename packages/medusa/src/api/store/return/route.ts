import { createAndCompleteReturnOrderWorkflow } from "@medusajs/core-flows"
import { MedusaRequest, MedusaResponse } from "../../../types/routing"
import { StorePostReturnsReqSchemaType } from "./validators"
import { HttpTypes } from "@medusajs/types"

export const POST = async (
  req: MedusaRequest<StorePostReturnsReqSchemaType>,
  res: MedusaResponse<HttpTypes.StoreReturnResponse>
) => {
  const input = req.validatedBody as StorePostReturnsReqSchemaType

  const workflow = createAndCompleteReturnOrderWorkflow(req.scope)
  const { result } = await workflow.run({
    input,
  })

  res.status(200).json({ return: result as HttpTypes.StoreReturn })
}

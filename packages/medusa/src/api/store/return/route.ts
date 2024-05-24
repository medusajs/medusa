import { createReturnOrderWorkflow } from "@medusajs/core-flows"
import { MedusaRequest, MedusaResponse } from "../../../types/routing"
import { StorePostReturnsReqSchemaType } from "./validators"

export const POST = async (
  req: MedusaRequest<StorePostReturnsReqSchemaType>,
  res: MedusaResponse
) => {
  const input = req.validatedBody as StorePostReturnsReqSchemaType

  const workflow = createReturnOrderWorkflow(req.scope)
  const { result } = await workflow.run({
    input,
  })

  res.status(200).json({ return: result })
}

import { createReturnOrderWorkflow } from "@medusajs/core-flows"
import { MedusaRequest, MedusaResponse } from "../../../types/routing"
import { StorePostReturnsReqSchemaType } from "./validators"

export const POST = async (
  req: MedusaRequest<StorePostReturnsReqSchemaType>,
  res: MedusaResponse
) => {
  const input = req.validatedBody as StorePostReturnsReqSchemaType

  const workflow = createReturnOrderWorkflow(req.scope)
  const { result, errors } = await workflow.run({
    input,
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  res.status(200).json({ return: result })
}

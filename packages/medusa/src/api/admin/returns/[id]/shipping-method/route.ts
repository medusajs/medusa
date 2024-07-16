import { createReturnShippingMethodWorkflow } from "@medusajs/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../types/routing"
import { AdminPostReturnsShippingReqSchemaType } from "../../validators"

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminPostReturnsShippingReqSchemaType>,
  res: MedusaResponse
) => {
  const { id } = req.params

  const { result: orderPreview } = await createReturnShippingMethodWorkflow(
    req.scope
  ).run({
    input: { ...req.validatedBody, return_id: id },
  })

  res.json({
    order: orderPreview,
  })
}

import { removeReturnShippingMethodWorkflow } from "@medusajs/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../../types/routing"

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const { id, action_id } = req.params

  const { result: orderPreview } = await removeReturnShippingMethodWorkflow(
    req.scope
  ).run({
    input: {
      return_id: id,
      action_id,
    },
  })

  res.json({
    order: orderPreview,
  })
}

import { cancelOrderOrderEditWorkflow } from "@medusajs/core-flows"
import { HttpTypes } from "@medusajs/types"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../types/routing"
import { AdminPostCancelOrderEditReqSchemaType } from "../../validators"

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminPostCancelOrderEditReqSchemaType>,
  res: MedusaResponse<HttpTypes.AdminOrderEditResponse>
) => {
  const { id } = req.params

  const workflow = cancelOrderOrderEditWorkflow(req.scope)
  const { result } = await workflow.run({
    input: {
      ...req.validatedBody,
      exchange_id: id,
    },
  })

  res.status(200).json({ exchange: result as HttpTypes.AdminOrderEdit })
}

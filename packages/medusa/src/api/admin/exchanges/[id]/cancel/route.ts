import { cancelOrderExchangeWorkflow } from "@medusajs/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../types/routing"
import { AdminPostCancelExchangeReqSchemaType } from "../../validators"

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminPostCancelExchangeReqSchemaType>,
  res: MedusaResponse
) => {
  const { id } = req.params

  const workflow = cancelOrderExchangeWorkflow(req.scope)
  const { result } = await workflow.run({
    input: {
      ...req.validatedBody,
      exchange_id: id,
    },
  })

  res.status(200).json({ exchange: result })
}

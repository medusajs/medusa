import { cancelOrderExchangeWorkflow } from "@medusajs/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../types/routing"
import { AdminPostCancelExchangeReqSchemaType } from "../../validators"
import { HttpTypes } from "@medusajs/types"

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminPostCancelExchangeReqSchemaType>,
  res: MedusaResponse<HttpTypes.AdminExchangeResponse>
) => {
  const { id } = req.params

  const workflow = cancelOrderExchangeWorkflow(req.scope)
  const { result } = await workflow.run({
    input: {
      ...req.validatedBody,
      exchange_id: id,
    },
  })

  res.status(200).json({ exchange: result as HttpTypes.AdminExchange })
}

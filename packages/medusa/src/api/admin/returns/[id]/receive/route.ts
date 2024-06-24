import { receiveReturnOrderWorkflow } from "@medusajs/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../types/routing"
import { AdminPostReceiveReturnsReqSchemaType } from "../../validators"

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminPostReceiveReturnsReqSchemaType>,
  res: MedusaResponse
) => {
  const input = req.validatedBody as AdminPostReceiveReturnsReqSchemaType

  const workflow = receiveReturnOrderWorkflow(req.scope)
  const { result } = await workflow.run({
    input,
  })

  res.status(200).json({ return: result })
}

import { cancelReturnWorkflow } from "@medusajs/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../types/routing"
import { AdminPostCancelReturnReqSchemaType } from "../../validators"

export const POST = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const { id } = req.params
  const input = req.validatedBody as AdminPostCancelReturnReqSchemaType

  const workflow = cancelReturnWorkflow(req.scope)
  const { result } = await workflow.run({
    input: {
      ...input,
      return_id: id,
    },
  })

  res.status(200).json({ return: result })
}

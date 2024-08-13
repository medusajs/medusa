import { cancelOrderClaimWorkflow } from "@medusajs/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../types/routing"
import { AdminPostCancelClaimReqSchemaType } from "../../validators"
import { HttpTypes } from "@medusajs/types"

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminPostCancelClaimReqSchemaType>,
  res: MedusaResponse<HttpTypes.AdminClaimResponse>
) => {
  const { id } = req.params

  const workflow = cancelOrderClaimWorkflow(req.scope)
  const { result } = await workflow.run({
    input: {
      ...req.validatedBody,
      claim_id: id,
    },
  })

  res.status(200).json({ claim: result as HttpTypes.AdminClaim })
}

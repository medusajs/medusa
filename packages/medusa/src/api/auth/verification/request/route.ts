import { requestVerificationWorkflow } from "@medusajs/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { VerificationRequestType } from "../../validators"

export const POST = async (
  req: AuthenticatedMedusaRequest<VerificationRequestType>,
  res: MedusaResponse
) => {
  const { entity_id, entity_type, code_provider, metadata } = req.validatedBody

  const { result } = await requestVerificationWorkflow(req.scope).run({
    input: {
      auth_identity_id: req.auth_context.auth_identity_id,
      entity_id,
      entity_type,
      code_provider,
      metadata,
    },
  })

  res.status(201).json({ verification: result })
}

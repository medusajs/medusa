import { requestVerificationWorkflow } from "@zjedene-medusa/core-flows"
import { MedusaRequest, MedusaResponse } from "@zjedene-medusa/framework/http"
import { VerificationRequestType } from "../../../../validators"

export const POST = async (
  req: MedusaRequest<VerificationRequestType>,
  res: MedusaResponse
) => {
  const { actor_type, auth_provider } = req.params
  const { entity_id, metadata } = req.validatedBody

  const { result } = await requestVerificationWorkflow(req.scope).run({
    input: {
      actor_type,
      provider: auth_provider,
      entity_id,
      metadata,
    },
  })

  res.status(201).json({ verification: result })
}

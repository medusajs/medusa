import { revokeApiKeysWorkflow } from "@medusajs/core-flows"
import { RevokeApiKeyDTO } from "@medusajs/types"
import { MedusaRequest, MedusaResponse } from "../../../../../types/routing"

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const id = req.params.id

  const { result, errors } = await revokeApiKeysWorkflow(req.scope).run({
    input: {
      selector: { id: req.params.id },
      revoke: {
        revoked_by: req.auth_user?.id,
      } as RevokeApiKeyDTO,
    },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  res.status(200).json({ apiKey: result[0] })
}

import { reindexSearchIndexesWorkflow } from "@medusajs/core-flows"
import { HttpTypes } from "@medusajs/framework/types"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { MedusaError, Modules } from "@medusajs/framework/utils"

/**
 * Rebuild a search index from its seed.
 */
export const POST = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse<HttpTypes.AdminSearchIndexReindexResponse>
) => {
  const searchModule = req.scope.resolve(Modules.SEARCH, {
    allowUnregistered: true,
  })

  if (!searchModule) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      "The Search Module is not enabled"
    )
  }

  const { result } = await reindexSearchIndexesWorkflow(req.scope).run({
    input: {
      index: req.params.id,
    },
  })

  res.json(result)
}

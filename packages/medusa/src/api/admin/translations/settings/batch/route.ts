import { batchTranslationSettingsWorkflow } from "@medusajs/core-flows"
import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework"
import { HttpTypes } from "@medusajs/types"

/**
 * @since 2.13.0
 * @featureFlag translation
 */
export const POST = async (
  req: AuthenticatedMedusaRequest<HttpTypes.AdminBatchTranslationSettings>,
  res: MedusaResponse<HttpTypes.AdminBatchTranslationSettingsResponse>
) => {
  const { create = [], update = [], delete: deleteIds = [] } = req.validatedBody

  const { result } = await batchTranslationSettingsWorkflow(req.scope).run({
    input: {
      create,
      update,
      delete: deleteIds,
    },
  })

  return res.status(200).json({
    created: result.created,
    updated: result.updated,
    deleted: {
      ids: deleteIds,
      object: "translation_settings",
      deleted: true,
    },
  })
}

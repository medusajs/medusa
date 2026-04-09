import { batchTranslationSettingsWorkflow } from "@medusajs/core-flows"
import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework"
import { defineFileConfig, FeatureFlag } from "@medusajs/framework/utils"
import { HttpTypes } from "@medusajs/types"
import TranslationFeatureFlag from "../../../../../feature-flags/translation"

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

defineFileConfig({
  isDisabled: () => !FeatureFlag.isFeatureEnabled(TranslationFeatureFlag.key),
})

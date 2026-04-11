import { batchTranslationsWorkflow } from "@medusajs/core-flows"
import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework"
import {
  ContainerRegistrationKeys,
  defineFileConfig,
  FeatureFlag,
} from "@medusajs/framework/utils"
import { BatchMethodRequest, HttpTypes } from "@medusajs/types"
import TranslationFeatureFlag from "../../../../feature-flags/translation"
import { defaultAdminTranslationFields } from "../query-config"
import {
  AdminCreateTranslationType,
  AdminUpdateTranslationType,
} from "../validators"

/**
 * @since 2.12.3
 * @featureFlag translation
 */
export const POST = async (
  req: AuthenticatedMedusaRequest<
    BatchMethodRequest<AdminCreateTranslationType, AdminUpdateTranslationType>
  >,
  res: MedusaResponse<HttpTypes.AdminTranslationsBatchResponse>
) => {
  const { create = [], update = [], delete: deleteIds = [] } = req.validatedBody

  const { result } = await batchTranslationsWorkflow(req.scope).run({
    input: {
      create,
      update,
      delete: deleteIds,
    },
  })

  const ids = Array.from(
    new Set([
      ...result.created.map((t) => t.id),
      ...result.updated.map((t) => t.id),
    ])
  )

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const { data: translations } = await query.graph({
    entity: "translation",
    fields: defaultAdminTranslationFields,
    filters: {
      id: ids,
    },
  })

  const created = translations.filter((t) =>
    result.created.some((r) => r.id === t.id)
  )
  const updated = translations.filter((t) =>
    result.updated.some((r) => r.id === t.id)
  )

  return res.status(200).json({
    created,
    updated,
    deleted: {
      ids: deleteIds,
      object: "translation",
      deleted: true,
    },
  })
}

defineFileConfig({
  isDisabled: () => !FeatureFlag.isFeatureEnabled(TranslationFeatureFlag.key),
})

import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { HttpTypes } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  defineFileConfig,
  FeatureFlag,
} from "@medusajs/framework/utils"
import TranslationFeatureFlag from "../../../feature-flags/translation"

/**
 * @since 2.12.3
 * @featureFlag translation
 */
export const GET = async (
  req: MedusaRequest<HttpTypes.AdminTranslationsListParams>,
  res: MedusaResponse<HttpTypes.AdminTranslationsListResponse>
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data: translations, metadata } = await query.graph(
    {
      entity: "translation",
      fields: req.queryConfig.fields,
      filters: req.filterableFields,
      pagination: req.queryConfig.pagination,
    },
    {
      cache: { enable: true },
    }
  )

  return res.status(200).json({
    translations,
    count: metadata?.count ?? 0,
    offset: metadata?.skip ?? 0,
    limit: metadata?.take ?? 0,
  })
}

defineFileConfig({
  isDisabled: () => !FeatureFlag.isFeatureEnabled(TranslationFeatureFlag.key),
})

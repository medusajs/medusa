import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import {
  ContainerRegistrationKeys,
  defineFileConfig,
  FeatureFlag,
} from "@medusajs/framework/utils"
import { HttpTypes } from "@medusajs/framework/types"
import TranslationFeatureFlag from "../../../feature-flags/translation"

/**
 * @since 2.12.3
 * @featureFlag translation
 */
export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse<HttpTypes.StoreLocaleListResponse>
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const {
    data: [store],
  } = await query.graph({
    entity: "store",
    fields: ["supported_locales.*", "supported_locales.locale.*"],
    pagination: {
      take: 1,
    },
  })

  const locales = store?.supported_locales.reduce((acc, locale) => {
    acc.push({
      code: locale.locale_code,
      name: locale.locale.name,
    })
    return acc
  }, [])

  res.json({
    locales,
  })
}

defineFileConfig({
  isDisabled: () => !FeatureFlag.isFeatureEnabled(TranslationFeatureFlag.key),
})

import {
  ContainerRegistrationKeys,
  defineFileConfig,
  FeatureFlag,
  MedusaError,
} from "@zjedene-medusa/framework/utils"
import { MedusaRequest, MedusaResponse } from "@zjedene-medusa/framework/http"
import { HttpTypes } from "@zjedene-medusa/framework/types"
import TranslationFeatureFlag from "../../../../feature-flags/translation"

/**
 * @since 2.12.3
 * @featureFlag translation
 */
export const GET = async (
  req: MedusaRequest<HttpTypes.AdminLocaleParams>,
  res: MedusaResponse<HttpTypes.AdminLocaleResponse>
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const {
    data: [locale],
  } = await query.graph(
    {
      entity: "locale",
      filters: {
        code: req.params.code,
      },
      fields: req.queryConfig.fields,
    },
    {
      cache: { enable: true },
    }
  )

  if (!locale) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Locale with code: ${req.params.code} was not found`
    )
  }

  res.status(200).json({ locale })
}

defineFileConfig({
  isDisabled: () => !FeatureFlag.isFeatureEnabled(TranslationFeatureFlag.key),
})

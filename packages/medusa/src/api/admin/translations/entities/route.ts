import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { HttpTypes } from "@medusajs/types"

/**
 * @since 2.12.4
 * @featureFlag translation
 */
export const GET = async (
  req: AuthenticatedMedusaRequest<{}, HttpTypes.AdminTranslationEntitiesParams>,
  res: MedusaResponse<HttpTypes.AdminTranslationEntitiesResponse>
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const { type, id } = req.validatedQuery

  const {
    data: [translationSettings],
  } = await query.graph(
    {
      entity: "translation_settings",
      fields: ["*"],
      filters: {
        entity_type: type,
      },
    },
    {
      cache: { enable: true },
    }
  )

  const translatableFields = translationSettings?.fields ?? []

  const filters: Record<string, unknown> = {}
  if (id) {
    filters.id = id
  }

  const { data: entities = [], metadata } = await query
    .graph(
      {
        entity: type,
        fields: ["id", ...translatableFields],
        filters,
        pagination: req.queryConfig.pagination,
      },
      {
        cache: { enable: true },
      }
    )
    .catch((e) => {
      const normalizedMessage = e.message.toLowerCase()
      if (
        normalizedMessage.includes("service with alias") &&
        normalizedMessage.includes("was not found")
      ) {
        return { data: [], metadata: { count: 0, skip: 0, take: 0 } }
      }
      throw e
    })

  let aggregatedData =
    entities as HttpTypes.AdminTranslationEntitiesResponse["data"]

  if (aggregatedData.length) {
    const { data: translations } = await query.graph({
      entity: "translations",
      fields: ["*"],
      filters: {
        reference_id: aggregatedData.map((entity) => entity.id),
      },
    })

    // aggregate data - include all translations for all locales
    aggregatedData = aggregatedData.map((entity) => {
      entity.translations = translations.filter(
        (translation) => translation.reference_id === entity.id
      )
      return entity
    })
  }

  return res.json({
    data: aggregatedData,
    count: metadata?.count ?? 0,
    offset: metadata?.skip ?? 0,
    limit: metadata?.take ?? 0,
  })
}

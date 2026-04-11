import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { HttpTypes, ITranslationModuleService } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  defineFileConfig,
  FeatureFlag,
  Modules,
  promiseAll,
} from "@medusajs/framework/utils"
import TranslationFeatureFlag from "../../../../feature-flags/translation"

/**
 * @since 2.12.3
 * @featureFlag translation
 */
export const GET = async (
  req: AuthenticatedMedusaRequest<
    {},
    HttpTypes.AdminTranslationStatisticsParams
  >,
  res: MedusaResponse<HttpTypes.AdminTranslationStatisticsResponse>
) => {
  const translationService = req.scope.resolve<ITranslationModuleService>(
    Modules.TRANSLATION
  )
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { locales, entity_types } = req.validatedQuery

  // Fetch counts for each entity type in parallel
  const entityCounts = await promiseAll(
    entity_types.map(async (entityType) => {
      const { metadata } = await query
        .graph(
          {
            entity: entityType,
            fields: ["id"],
            pagination: { take: 1, skip: 0 },
          },
          {
            throwIfKeyNotFound: false,
            cache: { enable: true },
          }
        )
        .catch((e) => {
          const normalizedMessage = e.message.toLowerCase()
          if (
            normalizedMessage.includes("service with alias") &&
            normalizedMessage.includes("was not found")
          ) {
            return { metadata: { count: 0 } }
          }
          throw e
        })
      return { entityType, count: metadata?.count ?? 0 }
    })
  )

  const entities: Record<string, { count: number }> = {}
  for (const { entityType, count } of entityCounts) {
    entities[entityType] = { count }
  }

  const statistics = await translationService.getStatistics({
    locales,
    entities,
  })

  return res.json({
    statistics,
  })
}

defineFileConfig({
  isDisabled: () => !FeatureFlag.isFeatureEnabled(TranslationFeatureFlag.key),
})

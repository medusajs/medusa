import {
  applyAndAndOrOperators,
  booleanString,
} from "../../utils/common-validators"
import {
  createBatchBody,
  createFindParams,
  createSelectParams,
} from "../../utils/validators"
import { z } from "@medusajs/framework/zod"

export const AdminGetTranslationParams = createSelectParams()

export const AdminGetTranslationParamsFields = z.object({
  q: z.string().optional(),
  reference_id: z.union([z.string(), z.array(z.string())]).optional(),
  reference: z.string().optional(),
  locale_code: z.string().optional(),
})

export type AdminGetTranslationsParamsType = z.infer<
  typeof AdminGetTranslationsParams
>

export const AdminGetTranslationsParams = createFindParams({
  limit: 20,
  offset: 0,
})
  .merge(AdminGetTranslationParamsFields)
  .merge(applyAndAndOrOperators(AdminGetTranslationParamsFields))

export type AdminCreateTranslationType = z.infer<typeof AdminCreateTranslation>
export const AdminCreateTranslation = z.object({
  reference_id: z.string(),
  reference: z.string(),
  locale_code: z.string(),
  translations: z.record(z.string()),
})

export type AdminUpdateTranslationType = z.infer<typeof AdminUpdateTranslation>
export const AdminUpdateTranslation = z.object({
  id: z.string(),
  reference_id: z.string().optional(),
  reference: z.string().optional(),
  locale_code: z.string().optional(),
  translations: z.record(z.string()).optional(),
})

export type AdminBatchTranslationsType = z.infer<typeof AdminBatchTranslations>
export const AdminBatchTranslations = createBatchBody(
  AdminCreateTranslation,
  AdminUpdateTranslation
)

export type AdminTranslationStatisticsType = z.infer<
  typeof AdminTranslationStatistics
>
export const AdminTranslationStatistics = z
  .object({
    locales: z.union([z.string(), z.array(z.string())]),
    entity_types: z.union([z.string(), z.array(z.string())]),
  })
  .transform((data) => ({
    // Normalize to arrays for consistent handling
    locales: Array.isArray(data.locales) ? data.locales : [data.locales],
    entity_types: Array.isArray(data.entity_types)
      ? data.entity_types
      : [data.entity_types],
  }))

export type AdminTranslationSettingsParamsType = z.infer<
  typeof AdminTranslationSettingsParams
>
export const AdminTranslationSettingsParams = z.object({
  entity_type: z.string().optional(),
  is_active: booleanString().optional(),
})

const AdminUpdateTranslationSettings = z.object({
  id: z.string(),
  entity_type: z.string().optional(),
  fields: z.array(z.string()).optional(),
  is_active: z.boolean().optional(),
})

const AdminCreateTranslationSettings = z.object({
  entity_type: z.string(),
  fields: z.array(z.string()),
  is_active: z.boolean().optional(),
})

export type AdminBatchTranslationSettingsType = z.infer<
  typeof AdminBatchTranslationSettings
>
export const AdminBatchTranslationSettings = createBatchBody(
  AdminCreateTranslationSettings,
  AdminUpdateTranslationSettings
)

export type AdminTranslationEntitiesParamsType = z.infer<
  typeof AdminTranslationEntitiesParams
>
export const AdminTranslationEntitiesParams = createFindParams({
  limit: 20,
  offset: 0,
}).merge(
  z.object({
    type: z.string(),
    id: z.union([z.string(), z.array(z.string())]).optional(),
  })
)

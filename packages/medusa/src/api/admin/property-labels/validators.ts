import { z } from "zod"
import { createSelectParams } from "../../utils/validators"

/**
 * Query parameters for listing property labels.
 */
export const AdminPropertyLabelParams = createSelectParams()

/**
 * Query parameters for filtering property labels.
 */
export const AdminPropertyLabelListParams = createSelectParams().extend({
  entity: z.string().optional(),
  property: z.string().optional(),
  q: z.string().optional(),
  limit: z.coerce.number().optional(),
  offset: z.coerce.number().optional(),
  order: z.string().optional(),
})

/**
 * Payload for creating a property label.
 */
export const AdminCreatePropertyLabel = z.object({
  entity: z.string().min(1),
  property: z.string().min(1),
  label: z.string().min(1),
  description: z.string().nullish(),
})

/**
 * Payload for updating a property label.
 */
export const AdminUpdatePropertyLabel = z.object({
  label: z.string().min(1).optional(),
  description: z.string().nullish(),
})

/**
 * Payload for batch property label operations.
 */
export const AdminBatchPropertyLabels = z.object({
  create: z
    .array(
      z.object({
        entity: z.string().min(1),
        property: z.string().min(1),
        label: z.string().min(1),
        description: z.string().nullish(),
      })
    )
    .optional(),
  update: z
    .array(
      z.object({
        id: z.string().min(1),
        label: z.string().min(1).optional(),
        description: z.string().nullish(),
      })
    )
    .optional(),
  delete: z.array(z.string()).optional(),
})

export type AdminCreatePropertyLabelType = z.infer<
  typeof AdminCreatePropertyLabel
>
export type AdminUpdatePropertyLabelType = z.infer<
  typeof AdminUpdatePropertyLabel
>
export type AdminBatchPropertyLabelsType = z.infer<
  typeof AdminBatchPropertyLabels
>
export type AdminPropertyLabelListParamsType = z.infer<
  typeof AdminPropertyLabelListParams
>

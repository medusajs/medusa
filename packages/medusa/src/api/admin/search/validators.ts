import { z } from "@medusajs/framework/zod"

export type AdminGetSearchParamsType = z.infer<typeof AdminGetSearchParams>

/**
 * No `fields`: each entity returns a fixed field set (index retrievable fields
 * when the Search Module is on, or the admin fallback registry otherwise). No
 * shared `filters` either — entities share nothing to filter on across the
 * board. Both are additive later.
 */
export const AdminGetSearchParams = z
  .object({
    q: z.string().optional(),
    entity: z
      .union([z.string(), z.array(z.string())])
      // `?entity=product,customer` arrives as one string, `?entity[]=` as an array.
      .transform((value) =>
        (Array.isArray(value) ? value : value.split(","))
          .map((entity) => entity.trim())
          .filter(Boolean)
      )
      .optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
    offset: z.coerce.number().int().nonnegative().optional(),
  })
  .strict()

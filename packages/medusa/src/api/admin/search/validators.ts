import { z } from "@medusajs/framework/zod"

export type AdminGetSearchParamsType = z.infer<typeof AdminGetSearchParams>

/**
 * No `fields`: a flat list cannot mean the same thing for two entities, so every
 * group returns what its index holds. No `filters` either — the module's filter
 * tree does not survive a query string legibly, and entities share nothing to
 * filter on. Both are additive later.
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

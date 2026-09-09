import { z } from "@medusajs/framework/zod"
import { createFindParams } from "../../../utils/validators"

/**
 * The filters a storefront can narrow a product search by, on top of the
 * sales channel and status the endpoint always applies.
 *
 * The set is intentionally small: every key here has to exist on the product
 * index as a filterable field, and a search engine rejects a filter on a field
 * it doesn't hold. Richer filtering belongs on `/store/products`, which queries
 * the database.
 */
export const StoreGetProductsSearchParamsFields = z
  .object({
    /**
     * The free-text query matched against the index' searchable fields.
     */
    q: z.string().optional(),
    id: z.union([z.string(), z.array(z.string())]).optional(),
    handle: z.union([z.string(), z.array(z.string())]).optional(),
    collection_id: z.union([z.string(), z.array(z.string())]).optional(),
    type_id: z.union([z.string(), z.array(z.string())]).optional(),
    tag_id: z.union([z.string(), z.array(z.string())]).optional(),
    category_id: z.union([z.string(), z.array(z.string())]).optional(),
    sales_channel_id: z.union([z.string(), z.array(z.string())]).optional(),
    region_id: z.string().optional(),
    country_code: z.string().optional(),
    province: z.string().optional(),
    cart_id: z.string().optional(),
  })
  .strict()

export type StoreGetProductsSearchParamsType = z.infer<
  typeof StoreGetProductsSearchParams
>

export const StoreGetProductsSearchParams = createFindParams({
  offset: 0,
  limit: 20,
})
  .merge(StoreGetProductsSearchParamsFields)
  .strict()

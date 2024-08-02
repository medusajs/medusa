import { ProductStatus } from "@medusajs/utils"
import { z } from "zod"
import { createOperatorMap } from "../../validators"
import { OptionalBooleanValidator } from "../common"
import { FilterableProductProps } from "@medusajs/types"

export const ProductStatusEnum = z.nativeEnum(ProductStatus)

export const GetProductsParams = z.object({
  q: z.string().optional(),
  id: z.union([z.string(), z.array(z.string())]).optional(),
  title: z.string().optional(),
  handle: z.string().optional(),
  is_giftcard: OptionalBooleanValidator,
  category_id: z.union([z.string(), z.array(z.string())]).optional(),
  sales_channel_id: z.union([z.string(), z.array(z.string())]).optional(),
  collection_id: z.union([z.string(), z.array(z.string())]).optional(),
  tag_id: z.union([z.string(), z.array(z.string())]).optional(),
  type_id: z.union([z.string(), z.array(z.string())]).optional(),
  created_at: createOperatorMap().optional(),
  updated_at: createOperatorMap().optional(),
  deleted_at: createOperatorMap().optional(),
})

type HttpProductFilters = FilterableProductProps & {
  tag_id?: string | string[]
  category_id?: string | string[]
}

export const transformProductParams = (
  data: HttpProductFilters
): FilterableProductProps => {
  const res = {
    ...data,
    tags: normalizeArray(data, "tag_id"),
    categories: normalizeArray(data, "category_id"),
  }

  delete res.tag_id
  delete res.category_id

  return res as FilterableProductProps
}

const normalizeArray = (filters: HttpProductFilters, key: string) => {
  if (filters[key]) {
    if (Array.isArray(filters[key])) {
      return {
        id: { $in: filters[key] },
      }
    } else {
      return {
        id: filters[key] as string,
      }
    }
  }

  return undefined
}

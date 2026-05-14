import { FilterableProductProps, OperatorMap } from "@medusajs/framework/types"
import { isPresent, ProductStatus } from "@medusajs/framework/utils"
import { z } from "@medusajs/framework/zod"
import { createOperatorMap } from "../../validators"
import { booleanString } from "../common"

export const ProductStatusEnum = z.nativeEnum(ProductStatus)

export const StoreGetProductParamsDirectFields = z.object({
  q: z.string().optional(),
  id: z.union([z.string(), z.array(z.string())]).optional(),
  title: z.union([z.string(), z.array(z.string())]).optional(),
  handle: z.union([z.string(), z.array(z.string())]).optional(),
  is_giftcard: booleanString().optional(),
  category_id: z.union([z.string(), z.array(z.string())]).optional(),
  external_id: z.union([z.string(), z.array(z.string())]).optional(),
  collection_id: z.union([z.string(), z.array(z.string())]).optional(),
  tag_id: z.union([z.string(), z.array(z.string())]).optional(),
  type_id: z.union([z.string(), z.array(z.string())]).optional(),
  created_at: createOperatorMap().optional(),
  updated_at: createOperatorMap().optional(),
  deleted_at: createOperatorMap().optional(),
})

export const GetProductsParams = z
  .object({
    sales_channel_id: z.union([z.string(), z.array(z.string())]).optional(),
  })
  .merge(StoreGetProductParamsDirectFields)

type HttpProductFilters = FilterableProductProps & {
  tag_id?: string | string[]
  category_id?: string | string[]
}

export const transformProductParams = (
  data: HttpProductFilters
): FilterableProductProps => {
  const res: HttpProductFilters = {
    ...data,
  }

  if (isPresent(data.tag_id)) {
    res.tags = { id: data.tag_id as string[] }
    delete res.tag_id
  }

  if (isPresent(data.category_id)) {
    res.categories = { id: data.category_id as OperatorMap<string> }
    delete res.category_id
  }

  return res as FilterableProductProps
}

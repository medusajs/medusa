import { ProductStatus } from "@medusajs/utils"
import { z } from "zod"
import { createOperatorMap } from "../../validators"
import { OptionalBooleanValidator } from "../common"

export const ProductStatusEnum = z.nativeEnum(ProductStatus)

export const GetProductsParams = z.object({
  q: z.string().optional(),
  id: z.union([z.string(), z.array(z.string())]).optional(),
  title: z.string().nullish(),
  handle: z.string().nullish(),
  is_giftcard: OptionalBooleanValidator,
  category_id: z.string().array().nullish(),
  sales_channel_id: z.string().array().nullish(),
  collection_id: z.string().array().nullish(),
  tags: z.string().array().optional(),
  type_id: z.string().array().optional(),
  created_at: createOperatorMap().optional(),
  updated_at: createOperatorMap().optional(),
  deleted_at: createOperatorMap().optional(),
})

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
  category_id: z.union([z.string(), z.array(z.string())]).nullish(),
  sales_channel_id: z.union([z.string(), z.array(z.string())]).nullish(),
  collection_id: z.union([z.string(), z.array(z.string())]).nullish(),
  tags: z.union([z.string(), z.array(z.string())]).optional(),
  type_id: z.union([z.string(), z.array(z.string())]).optional(),
  created_at: createOperatorMap().optional(),
  updated_at: createOperatorMap().optional(),
  deleted_at: createOperatorMap().optional(),
})

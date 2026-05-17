import { z } from "zod"
import {
  createFindParams,
  createOperatorMap,
  createSelectParams,
} from "../../utils/validators"

const PriceType = z.enum(["retail", "wholesale", "supply"])

export const AdminCreateChannelPrice = z.object({
  sales_material_id: z.string(),
  shop_id: z.string().optional(),
  customer_class_id: z.string().optional(),
  price_type: PriceType,
  currency_code: z.string().optional(),
  amount: z.number(),
  start_at: z.string().datetime().optional(),
  end_at: z.string().datetime().optional(),
  min_quantity: z.number().optional(),
  max_quantity: z.number().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
})

export type AdminCreateChannelPriceType = z.infer<typeof AdminCreateChannelPrice>

export const AdminUpdateChannelPrice = z.object({
  sales_material_id: z.string().optional(),
  shop_id: z.string().optional(),
  customer_class_id: z.string().optional(),
  price_type: PriceType.optional(),
  currency_code: z.string().optional(),
  amount: z.number().optional(),
  start_at: z.string().datetime().optional(),
  end_at: z.string().datetime().optional(),
  min_quantity: z.number().optional(),
  max_quantity: z.number().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
})

export type AdminUpdateChannelPriceType = z.infer<typeof AdminUpdateChannelPrice>

export const AdminGetChannelPriceParams = createSelectParams()

export const AdminGetChannelPricesParams = createFindParams({
  limit: 50,
  offset: 0,
}).merge(
  z.object({
    q: z.string().optional(),
    id: z.union([z.string(), z.array(z.string()), createOperatorMap()]).optional(),
    sales_material_id: z.union([z.string(), z.array(z.string()), createOperatorMap()]).optional(),
    shop_id: z.union([z.string(), z.array(z.string()), createOperatorMap()]).optional(),
    customer_class_id: z.union([z.string(), z.array(z.string()), createOperatorMap()]).optional(),
    price_type: z.union([z.string(), z.array(z.string()), createOperatorMap()]).optional(),
    currency_code: z.union([z.string(), z.array(z.string()), createOperatorMap()]).optional(),
    amount: z.union([z.string(), z.array(z.string()), createOperatorMap()]).optional(),
    start_at: createOperatorMap().optional(),
    end_at: createOperatorMap().optional(),
    min_quantity: createOperatorMap().optional(),
    max_quantity: createOperatorMap().optional(),
    created_at: createOperatorMap().optional(),
    updated_at: createOperatorMap().optional(),
    deleted_at: createOperatorMap().optional(),
  })
)

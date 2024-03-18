import { z } from "zod"

export const AddressPayload = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  address_1: z.string().min(1),
  address_2: z.string().optional(),
  city: z.string().min(1),
  province: z.string().optional(),
  postal_code: z.string().min(1),
  country_code: z.string().min(1),
  phone: z.string().optional(),
  company: z.string().optional(),
})

export const ExistingItemSchema = z.object({
  product_title: z.string().optional(),
  thumbnail: z.string().optional(),
  variant_title: z.string().optional(),
  variant_id: z.string().min(1),
  sku: z.string().optional(),
  quantity: z.number().min(1),
  unit_price: z.number().min(0),
  custom_unit_price: z.union([z.number(), z.string()]).optional(),
})

export const CustomItemSchema = z.object({
  title: z.string().min(1),
  quantity: z.number().min(1),
  unit_price: z.number().min(0),
})

export const ShippingMethodSchema = z.object({
  option_id: z.string().min(1),
  option_title: z.string(),
  amount: z.union([z.number(), z.string()]).optional(),
  custom_amount: z.union([z.number(), z.string()]).optional(),
})

export const CreateDraftOrderSchema = z.object({
  email: z.string().email(),
  region_id: z.string().min(1),
  customer_id: z.string().optional(),
  shipping_address: AddressPayload,
  billing_address: AddressPayload.nullable(),
  existing_items: z.array(ExistingItemSchema).optional(),
  custom_items: z.array(CustomItemSchema).optional(),
  shipping_method: ShippingMethodSchema,
  notification_order: z.boolean().optional(),
})

export enum View {
  EXISTING_ITEMS = "existing_items",
  CUSTOM_ITEMS = "custom_items",
}

import * as zod from "zod"

export const AddressPayload = zod.object({
  first_name: zod.string().min(1),
  last_name: zod.string().min(1),
  address_1: zod.string().min(1),
  address_2: zod.string().optional(),
  city: zod.string().min(1),
  province: zod.string().optional(),
  postal_code: zod.string().min(1),
  country_code: zod.string().min(1),
  phone: zod.string().optional(),
  company: zod.string().optional(),
})

export const CreateReturnSchema = zod.object({
  quantity: zod.record(zod.string(), zod.number()),
  reason: zod.record(zod.string(), zod.string()),
  note: zod.record(zod.string(), zod.string().optional()),

  shipping_address: AddressPayload,

  location: zod.string(),
  return_shipping: zod.string(),
  replacement_shipping: zod.string(),
  send_notification: zod.boolean().optional(),

  enable_custom_refund: zod.boolean().optional(),
  custom_refund: zod.number().optional(),
})

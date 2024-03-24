import * as zod from "zod"

export const CreateReturnSchema = zod.object({
  quantity: zod.record(zod.string(), zod.number()),
  reason: zod.record(zod.string(), zod.string().optional()),
  note: zod.record(zod.string(), zod.string().optional()),

  location: zod.string(),
  return_shipping: zod.string(),
  send_notification: zod.boolean().optional(),

  enable_custom_refund: zod.boolean().optional(),
  enable_custom_shipping_price: zod.boolean().optional(),

  custom_refund: zod.number().optional(),
  custom_shipping_price: zod.number().optional(),
})

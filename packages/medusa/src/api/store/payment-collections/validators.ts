import { z } from "zod"
import { createSelectParams } from "../../utils/validators"

export type StoreGetPaymentCollectionParamsType = z.infer<
  typeof StoreGetPaymentCollectionParams
>
export const StoreGetPaymentCollectionParams = createSelectParams()

export type StoreCreatePaymentSessionType = z.infer<
  typeof StoreCreatePaymentSession
>
export const StoreCreatePaymentSession = z
  .object({
    provider_id: z.string(),
    context: z.record(z.unknown()).nullish(),
    data: z.record(z.unknown()).nullish(),
  })
  .strict()

export type StoreCreatePaymentCollectionType = z.infer<
  typeof StoreCreatePaymentCollection
>
export const StoreCreatePaymentCollection = z
  .object({
    cart_id: z.string(),
    region_id: z.string(),
    currency_code: z.string(),
    amount: z.number(),
  })
  .strict()

import { z } from "@medusajs/framework/zod"

export type AdminRefundOrderToStoreCreditParamsType = z.infer<
  typeof AdminRefundOrderToStoreCreditParams
>
export const AdminRefundOrderToStoreCreditParams = z.object({
  amount: z.number().positive(),
  note: z.string().optional(),
})

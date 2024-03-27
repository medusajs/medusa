import { z } from "zod"

export enum RefundReason {
  Discount = "discount",
  Other = "other",
}

export const CreateRefundSchema = z.object({
  amount: z.union([z.number(), z.string()]),
  reason: z.nativeEnum(RefundReason),
  note: z.string().optional(),
  notification_enabled: z.boolean().optional(),
})

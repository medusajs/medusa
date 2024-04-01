import { z } from "zod"
import i18n from "i18next"

export enum RefundReason {
  Discount = "discount",
  Other = "other",
}

export const CreateRefundSchema = z.object({
  amount: z.union([z.number(), z.string()]),
  reason: z.nativeEnum(RefundReason, {
    errorMap: () => ({
      message: i18n.t("orders.refund.error.reasonRequired"),
    }),
  }),
  note: z.string().optional(),
  notification_enabled: z.boolean().optional(),
})

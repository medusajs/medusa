import i18n from "i18next"
import { z } from "zod"

export const AddressSchema = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  company: z.string().optional(),
  address_1: z.string().min(1),
  address_2: z.string().optional(),
  city: z.string().min(1),
  postal_code: z.string().min(1),
  province: z.string().optional(),
  country_code: z.string().min(1),
  phone: z.string().optional(),
})

export const EmailSchema = z.object({
  email: z.string().email(),
})

export const TransferOwnershipSchema = z
  .object({
    current_owner_id: z.string().min(1),
    new_owner_id: z
      .string()
      .min(1, i18n.t("transferOwnership.validation.required")),
  })
  .superRefine((data, ctx) => {
    if (data.current_owner_id === data.new_owner_id) {
      return ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["new_owner_id"],
        message: i18n.t("transferOwnership.validation.mustBeDifferent"),
      })
    }
  })

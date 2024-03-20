import i18n from "i18next"
import { z } from "zod"
import { castNumber } from "../../../../../lib/cast-number"

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

export const ExistingItemSchema = z
  .object({
    product_title: z.string().optional(),
    thumbnail: z.string().optional(),
    variant_title: z.string().optional(),
    variant_id: z.string().min(1),
    sku: z.string().optional(),
    quantity: z.number().min(1),
    unit_price: z.number().min(0),
    custom_unit_price: z.union([z.number(), z.string()]).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.custom_unit_price && isNaN(castNumber(data.custom_unit_price))) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid custom unit price",
        path: ["custom_unit_price"],
      })
    }
  })

export const CustomItemSchema = z
  .object({
    title: z.string().min(1),
    quantity: z.number().min(1),
    unit_price: z.union([z.number(), z.string()]),
  })
  .superRefine((data, ctx) => {
    if (
      typeof data.unit_price === "string" &&
      isNaN(castNumber(data.unit_price))
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid unit price",
        path: ["unit_price"],
      })
    }
  })

export const ShippingMethodSchema = z
  .object({
    option_id: z.string().min(1),
    option_title: z.string(),
    amount: z.union([z.number(), z.string()]).optional(),
    custom_amount: z.union([z.number(), z.string()]).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.custom_amount && isNaN(castNumber(data.custom_amount))) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid custom amount",
        path: ["custom_amount"],
      })
    }
  })

export const CreateDraftOrderSchema = z
  .object({
    email: z.string().optional(),
    region_id: z.string().min(1),
    customer_id: z.string().optional(),
    shipping_address: AddressPayload,
    billing_address: AddressPayload.nullable(),
    existing_items: z.array(ExistingItemSchema).optional(),
    custom_items: z.array(CustomItemSchema).optional(),
    shipping_method: ShippingMethodSchema,
    notification_order: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.existing_items?.length && !data.custom_items?.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: i18n.t("draftOrders.validation.requiredItems"),
        path: ["custom_items"],
      })

      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: i18n.t("draftOrders.validation.requiredItems"),
        path: ["existing_items"],
      })
    }

    if (!data.email && !data.customer_id) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: i18n.t("draftOrders.validation.requiredEmailOrCustomer"),
        path: ["customer_id"],
      })

      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: i18n.t("draftOrders.validation.requiredEmailOrCustomer"),
        path: ["email"],
      })
    } else if (!data.customer_id && data.email) {
      const parsedEmail = z.string().email().safeParse(data.email)

      if (!parsedEmail.success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: i18n.t("draftOrders.validation.invalidEmail"),
          path: ["email"],
        })
      }
    }
  })

export enum View {
  EXISTING_ITEMS = "existing_items",
  CUSTOM_ITEMS = "custom_items",
}

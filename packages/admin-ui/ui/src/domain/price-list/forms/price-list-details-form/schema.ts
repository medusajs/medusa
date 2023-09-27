import * as z from "zod"

export const priceListDetailsSchema = z.object({
  type: z.object({
    value: z.enum(["sale", "override"], {
      required_error: "Type is required",
    }),
  }),
  general: z.object({
    name: z.string().nonempty({ message: "Name is required" }),
    description: z.string().nonempty({ message: "Description is required" }),
    tax_inclusive: z.boolean(),
  }),
  dates: z
    .object({
      starts_at: z.date().nullable().optional(),
      ends_at: z.date().nullable().optional(),
    })
    .superRefine((data, ctx) => {
      if (data.starts_at && data.ends_at && data.starts_at > data.ends_at) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Start date cannot be after end date",
          path: ["starts_at"],
        })

        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "End date cannot be before start date",
          path: ["ends_at"],
        })
      }
    }),
  customer_groups: z.object({
    ids: z.array(z.string()),
  }),
})

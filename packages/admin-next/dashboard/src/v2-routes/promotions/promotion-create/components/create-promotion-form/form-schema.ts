import { z } from "zod"

const RuleSchema = z.array(
  z.object({
    id: z.string().optional(),
    attribute: z.string().min(1, { message: "Required field" }),
    operator: z.string().min(1, { message: "Required field" }),
    values: z.union([
      z.number().min(1, { message: "Required field" }),
      z.string().min(1, { message: "Required field" }),
      z.array(z.string()).min(1, { message: "Required field" }),
    ]),
    required: z.boolean().optional(),
    disguised: z.boolean().optional(),
    field_type: z.string().optional(),
  })
)

export const CreatePromotionSchema = z.object({
  template_id: z.string().optional(),
  campaign_id: z.string().optional(),
  campaign_choice: z.enum(["none", "existing", "new"]).optional(),
  is_automatic: z.string().toLowerCase(),
  code: z.string().min(1),
  type: z.enum(["buyget", "standard"]),
  rules: RuleSchema,
  application_method: z.object({
    allocation: z.enum(["each", "across"]),
    value: z.number().min(0),
    max_quantity: z.number().optional(),
    target_rules: RuleSchema,
    buy_rules: RuleSchema.min(2).optional(),
    type: z.enum(["fixed", "percentage"]),
    target_type: z.enum(["order", "shipping_methods", "items"]),
  }),
})

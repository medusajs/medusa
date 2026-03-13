import { z } from "zod"
import { CreateCampaignSchema } from "../../../../campaigns/campaign-create/components/create-campaign-form"
import { TFunction } from "i18next"

const RuleSchema = (t: TFunction) => z.array(
  z.object({
    id: z.string().optional(),
    attribute: z.string().min(1, { message: t("promotions.errors.requiredField") }),
    operator: z.string().min(1, { message: t("promotions.errors.requiredField") }),
    values: z.union([
      z.number().min(1, { message: t("promotions.errors.requiredField") }),
      z.string().min(1, { message: t("promotions.errors.requiredField") }),
      z.array(z.string()).min(1, { message: t("promotions.errors.requiredField") }),
    ]),
    required: z.boolean().optional(),
    disguised: z.boolean().optional(),
    field_type: z.string().optional(),
  })
)

export const CreatePromotionSchema = (t: TFunction) => z
  .object({
    template_id: z.string().optional(),
    campaign_id: z.string().optional(),
    campaign_choice: z.enum(["none", "existing", "new"]).optional(),
    is_automatic: z.string().toLowerCase(),
    code: z.string().min(1),
    type: z.enum(["buyget", "standard"]),
    status: z.enum(["draft", "active", "inactive"]),
    rules: RuleSchema(t),
    is_tax_inclusive: z.boolean().optional(),
    limit: z.number().int().min(1).nullable().optional(),
    application_method: z.object({
      allocation: z.enum(["each", "across", "once"]),
      value: z.number().min(0).or(z.string().min(1)),
      currency_code: z.string().optional(),
      max_quantity: z.number().optional().nullable(),
      target_rules: RuleSchema(t),
      buy_rules: RuleSchema(t),
      type: z.enum(["fixed", "percentage"]),
      target_type: z.enum(["order", "shipping_methods", "items"]),
    }),
    campaign: CreateCampaignSchema.optional(),
  })
  .refine(
    (data) => {
      if (data.application_method.allocation === "across") {
        return true
      }

      return (
        (data.application_method.allocation === "each" ||
          data.application_method.allocation === "once") &&
        typeof data.application_method.max_quantity === "number"
      )
    },
    {
      path: ["application_method.max_quantity"],
      message: `required field`,
    }
  )

export type CreatePromotionSchemaType = z.infer<
  ReturnType<typeof CreatePromotionSchema>
>

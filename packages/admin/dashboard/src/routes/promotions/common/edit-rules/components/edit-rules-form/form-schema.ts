import i18n from "i18next"
import { z } from "zod"

export const EditRules = z.object({
  type: z.string().optional(),
  rules: z.array(
    z.object({
      id: z.string().optional(),
      attribute: z
        .string()
        .min(1, { message: i18n.t("promotions.form.required") }),
      operator: z
        .string()
        .min(1, { message: i18n.t("promotions.form.required") }),
      values: z.union([
        z.number().min(1, { message: i18n.t("promotions.form.required") }),
        z.string().min(1, { message: i18n.t("promotions.form.required") }),
        z
          .array(z.string())
          .min(1, { message: i18n.t("promotions.form.required") }),
      ]),
      required: z.boolean().optional(),
      disguised: z.boolean().optional(),
      field_type: z.string().optional(),
    })
  ),
})

export type EditRulesType = z.infer<typeof EditRules>

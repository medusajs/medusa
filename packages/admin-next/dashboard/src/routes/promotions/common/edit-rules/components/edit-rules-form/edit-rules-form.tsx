import { zodResolver } from "@hookform/resolvers/zod"
import { PromotionDTO, PromotionRuleDTO } from "@medusajs/types"
import { Button } from "@medusajs/ui"
import i18n from "i18next"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as zod from "zod"
import { RouteDrawer } from "../../../../../../components/route-modal"
import { RuleTypeValues } from "../../edit-rules"
import { RulesFormField } from "../rules-form-field"

type EditPromotionFormProps = {
  promotion: PromotionDTO
  rules: PromotionRuleDTO[]
  ruleType: RuleTypeValues
  handleSubmit: any
  isSubmitting: boolean
}

const EditRules = zod.object({
  type: zod.string().optional(),
  rules: zod.array(
    zod.object({
      id: zod.string().optional(),
      attribute: zod
        .string()
        .min(1, { message: i18n.t("promotions.form.required") }),
      operator: zod
        .string()
        .min(1, { message: i18n.t("promotions.form.required") }),
      values: zod.union([
        zod.number().min(1, { message: i18n.t("promotions.form.required") }),
        zod.string().min(1, { message: i18n.t("promotions.form.required") }),
        zod
          .array(zod.string())
          .min(1, { message: i18n.t("promotions.form.required") }),
      ]),
      required: zod.boolean().optional(),
      disguised: zod.boolean().optional(),
      field_type: zod.string().optional(),
    })
  ),
})

export const EditRulesForm = ({
  promotion,
  ruleType,
  handleSubmit,
  isSubmitting,
}: EditPromotionFormProps) => {
  const { t } = useTranslation()
  const [rulesToRemove, setRulesToRemove] = useState([])

  const form = useForm<zod.infer<typeof EditRules>>({
    defaultValues: { rules: [], type: promotion.type },
    resolver: zodResolver(EditRules),
  })

  const handleFormSubmit = form.handleSubmit(handleSubmit(rulesToRemove))

  return (
    <RouteDrawer.Form form={form}>
      <form onSubmit={handleFormSubmit} className="flex h-full flex-col">
        <RouteDrawer.Body>
          <RulesFormField
            form={form}
            ruleType={ruleType}
            setRulesToRemove={setRulesToRemove}
            rulesToRemove={rulesToRemove}
            promotion={promotion}
          />
        </RouteDrawer.Body>

        <RouteDrawer.Footer>
          <div className="flex items-center justify-end gap-x-2">
            <RouteDrawer.Close asChild>
              <Button size="small" variant="secondary" disabled={isSubmitting}>
                {t("actions.cancel")}
              </Button>
            </RouteDrawer.Close>

            <Button size="small" type="submit" isLoading={isSubmitting}>
              {t("actions.save")}
            </Button>
          </div>
        </RouteDrawer.Footer>
      </form>
    </RouteDrawer.Form>
  )
}

import { zodResolver } from "@hookform/resolvers/zod"
import { PromotionDTO, PromotionRuleDTO } from "@medusajs/types"
import { Button } from "@medusajs/ui"
import i18n from "i18next"
import { useState } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as zod from "zod"
import { RouteDrawer } from "../../../../../../components/route-modal"
import { RuleTypeValues } from "../../edit-rules"
import { RulesFormField } from "../rules-form-field"
import { getDisguisedRules } from "./utils"

type EditPromotionFormProps = {
  promotion: PromotionDTO
  rules: PromotionRuleDTO[]
  ruleType: RuleTypeValues
  attributes: any[]
  operators: any[]
  handleSubmit: any
  isSubmitting: boolean
}

const EditRules = zod.object({
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
      field_type: zod.string().optional(),
    })
  ),
})

export const EditRulesForm = ({
  promotion,
  rules,
  ruleType,
  attributes,
  operators,
  handleSubmit,
  isSubmitting,
}: EditPromotionFormProps) => {
  const { t } = useTranslation()
  const requiredAttributes = attributes?.filter((ra) => ra.required) || []
  const requiredAttributeValues = requiredAttributes?.map((ra) => ra.value)
  const disguisedRules =
    getDisguisedRules(promotion, requiredAttributes, ruleType) || []
  const [rulesToRemove, setRulesToRemove] = useState([])

  const form = useForm<zod.infer<typeof EditRules>>({
    defaultValues: {
      rules: [...disguisedRules, ...rules].map((rule) => ({
        id: rule.id,
        required: requiredAttributeValues.includes(rule.attribute),
        field_type: rule.field_type,
        attribute: rule.attribute!,
        operator: rule.operator!,
        values: Array.isArray(rule?.values)
          ? rule?.values?.map((v: any) => v.value!)
          : rule.values,
      })),
    },
    resolver: zodResolver(EditRules),
  })

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "rules",
    keyName: "rules_id",
  })

  const handleFormSubmit = form.handleSubmit(handleSubmit(rulesToRemove))

  return (
    <RouteDrawer.Form form={form}>
      <form onSubmit={handleFormSubmit} className="flex h-full flex-col">
        <RouteDrawer.Body>
          <RulesFormField
            form={form}
            ruleType={ruleType}
            attributes={attributes}
            operators={operators}
            fields={fields}
            setRulesToRemove={setRulesToRemove}
            rulesToRemove={rulesToRemove}
            appendRule={append}
            removeRule={remove}
            updateRule={update}
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

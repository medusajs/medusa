import { zodResolver } from "@hookform/resolvers/zod"
import { PromotionDTO, PromotionRuleDTO } from "@medusajs/types"
import { Button } from "@medusajs/ui"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { RouteDrawer } from "../../../../../../components/route-modal"
import { RuleTypeValues } from "../../edit-rules"
import { RulesFormField } from "../rules-form-field"
import { EditRules, EditRulesType } from "./form-schema"

type EditPromotionFormProps = {
  promotion: PromotionDTO
  rules: PromotionRuleDTO[]
  ruleType: RuleTypeValues
  handleSubmit: any
  isSubmitting: boolean
}

export const EditRulesForm = ({
  promotion,
  ruleType,
  handleSubmit,
  isSubmitting,
}: EditPromotionFormProps) => {
  const { t } = useTranslation()
  const [rulesToRemove, setRulesToRemove] = useState([])

  const form = useForm<EditRulesType>({
    defaultValues: { rules: [], type: promotion.type },
    resolver: zodResolver(EditRules),
  })

  const handleFormSubmit = form.handleSubmit(handleSubmit(rulesToRemove))

  return (
    <RouteDrawer.Form form={form}>
      <form onSubmit={handleFormSubmit} className="flex h-full flex-col">
        <RouteDrawer.Body>
          <RulesFormField
            form={form as any}
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

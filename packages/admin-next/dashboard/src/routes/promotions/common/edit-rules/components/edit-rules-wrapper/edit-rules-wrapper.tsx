import {
  CreatePromotionRuleDTO,
  PromotionDTO,
  PromotionRuleDTO,
  PromotionRuleOperatorValues,
  PromotionRuleResponse,
} from "@medusajs/types"
import { useRouteModal } from "../../../../../../components/route-modal"
import {
  usePromotionAddRules,
  usePromotionRemoveRules,
  usePromotionUpdateRules,
  useUpdatePromotion,
} from "../../../../../../hooks/api/promotions"
import { RuleTypeValues } from "../../edit-rules"
import { EditRulesForm } from "../edit-rules-form"
import { getRuleValue } from "./utils"

type EditPromotionFormProps = {
  promotion: PromotionDTO
  rules: PromotionRuleDTO[]
  ruleType: RuleTypeValues
}

export const EditRulesWrapper = ({
  promotion,
  rules,
  ruleType,
}: EditPromotionFormProps) => {
  const { handleSuccess } = useRouteModal()
  const { mutateAsync: updatePromotion } = useUpdatePromotion(promotion.id)
  const { mutateAsync: addPromotionRules } = usePromotionAddRules(
    promotion.id,
    ruleType
  )

  const { mutateAsync: removePromotionRules } = usePromotionRemoveRules(
    promotion.id,
    ruleType
  )

  const { mutateAsync: updatePromotionRules, isPending } =
    usePromotionUpdateRules(promotion.id, ruleType)

  const handleSubmit = (
    rulesToRemove?: { id: string; disguised: boolean; attribute: string }[]
  ) => {
    return async function (data: { rules: PromotionRuleResponse[] }) {
      const applicationMethodData: Record<any, any> = {}
      const { rules: allRules = [] } = data
      const disguisedRules = allRules.filter((rule) => rule.disguised)
      const disguisedRulesToRemove =
        rulesToRemove?.filter((r) => r.disguised) || []

      // For all the rules that were disguised, convert them to actual values in the
      // database, they are currently all under application_method. If more of these are coming
      // up, abstract this away.
      for (const rule of disguisedRules) {
        applicationMethodData[rule.attribute] = getRuleValue(rule)
      }

      for (const rule of disguisedRulesToRemove) {
        applicationMethodData[rule.attribute] = null
      }

      // This variable will contain the rules that are actual rule objects, without the disguised
      // objects
      const rulesData = allRules.filter((rule) => !rule.disguised)
      const rulesToCreate: CreatePromotionRuleDTO[] = rulesData.filter(
        (rule) => !("id" in rule)
      )
      const rulesToUpdate = rulesData.filter(
        (rule: { id: string }) => typeof rule.id === "string"
      )

      if (Object.keys(applicationMethodData).length) {
        await updatePromotion({
          application_method: applicationMethodData,
        } as any)
      }

      rulesToCreate.length &&
        (await addPromotionRules({
          rules: rulesToCreate.map((rule) => {
            return {
              attribute: rule.attribute,
              operator: rule.operator,
              values: rule.values,
            } as any
          }),
        }))

      rulesToRemove?.length &&
        (await removePromotionRules({
          rule_ids: rulesToRemove.map((r) => r.id).filter(Boolean),
        }))

      rulesToUpdate.length &&
        (await updatePromotionRules({
          rules: rulesToUpdate.map((rule: PromotionRuleResponse) => {
            return {
              id: rule.id!,
              attribute: rule.attribute,
              operator: rule.operator as PromotionRuleOperatorValues,
              values: rule.values as unknown as string | string[],
            }
          }),
        }))

      handleSuccess()
    }
  }

  return (
    <EditRulesForm
      promotion={promotion}
      rules={rules}
      ruleType={ruleType}
      handleSubmit={handleSubmit}
      isSubmitting={isPending}
    />
  )
}

import {
  CreatePromotionRuleDTO,
  PromotionDTO,
  PromotionRuleDTO,
} from "@medusajs/types"
import { useRouteModal } from "../../../../../../components/route-modal"
import {
  usePromotionAddRules,
  usePromotionRemoveRules,
  usePromotionRuleAttributes,
  usePromotionRuleOperators,
  usePromotionUpdateRules,
  useUpdatePromotion,
} from "../../../../../../hooks/api/promotions"
import { RuleTypeValues } from "../../edit-rules"
import { EditRulesForm } from "../edit-rules-form"
import { getDisguisedRules } from "../edit-rules-form/utils"

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
  const {
    attributes,
    isError: isAttributesError,
    error: attributesError,
  } = usePromotionRuleAttributes(ruleType!)

  const {
    operators,
    isError: isOperatorsError,
    error: operatorsError,
  } = usePromotionRuleOperators()

  if (isAttributesError || isOperatorsError) {
    throw attributesError || operatorsError
  }

  const requiredAttributes = attributes?.filter((ra) => ra.required) || []
  const disguisedRules =
    getDisguisedRules(promotion, requiredAttributes, ruleType) || []

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

  const handleSubmit = (rulesToRemove?: { id: string }[]) => {
    return async function (data: { rules: PromotionRuleDTO[] }) {
      const applicationMethodData: Record<any, any> = {}
      const { rules: allRules = [] } = data
      const disguisedRulesData = allRules.filter((rule) =>
        disguisedRules.map((rule) => rule.id).includes(rule.id!)
      )

      // For all the rules that were disguised, convert them to actual values in the
      // database, they are currently all under application_method. If more of these are coming
      // up, abstract this away.
      for (const rule of disguisedRulesData) {
        const currentAttribute = attributes?.find(
          (attr) => attr.value === rule.attribute
        )

        applicationMethodData[rule.id!] =
          currentAttribute?.field_type === "number"
            ? parseInt(rule.values as unknown as string)
            : rule.values
      }

      // This variable will contain the rules that are actual rule objects, without the disguised
      // objects
      const rulesData = allRules.filter(
        (rule) => !disguisedRules.map((rule) => rule.id).includes(rule.id!)
      )

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
              values: rule.operator === "eq" ? rule.values[0] : rule.values,
            } as any
          }),
        }))

      rulesToRemove?.length &&
        (await removePromotionRules({
          rule_ids: rulesToRemove.map((r) => r.id!),
        }))

      rulesToUpdate.length &&
        (await updatePromotionRules({
          rules: rulesToUpdate.map((rule: PromotionRuleDTO) => {
            return {
              id: rule.id!,
              attribute: rule.attribute,
              operator: rule.operator,
              values: rule.values as unknown as string | string[],
            }
          }),
        }))

      handleSuccess()
    }
  }

  if (attributes && operators) {
    return (
      <EditRulesForm
        promotion={promotion}
        rules={rules}
        ruleType={ruleType}
        attributes={attributes}
        operators={operators}
        handleSubmit={handleSubmit}
        isSubmitting={isPending}
      />
    )
  }
}

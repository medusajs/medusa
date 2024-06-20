import { AdminGetPromotionRulesRes } from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
  RuleOperator,
  RuleType,
} from "@medusajs/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../types/routing"
import {
  getRuleAttributesMap,
  operatorsMap,
  ruleQueryConfigurations,
  validateRuleType,
} from "../../utils"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const { id, rule_type: ruleType } = req.params
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  validateRuleType(ruleType)

  const dasherizedRuleType = ruleType.split("-").join("_")
  const queryObject = remoteQueryObjectFromString({
    entryPoint: "promotion",
    variables: { id },
    fields: req.remoteQueryConfig.fields,
  })

  const [promotion] = await remoteQuery(queryObject)
  const ruleAttributes = getRuleAttributesMap({
    promotionType: promotion?.type || req.query.promotion_type,
    applicationMethodType:
      promotion?.application_method?.type || req.query.application_method_type,
  })[ruleType]
  const promotionRules: any[] = []

  if (dasherizedRuleType === RuleType.RULES) {
    promotionRules.push(...(promotion?.rules || []))
  } else if (dasherizedRuleType === RuleType.TARGET_RULES) {
    promotionRules.push(...(promotion?.application_method?.target_rules || []))
  } else if (dasherizedRuleType === RuleType.BUY_RULES) {
    promotionRules.push(...(promotion?.application_method?.buy_rules || []))
  }

  const transformedRules: AdminGetPromotionRulesRes = []
  const disguisedRules = ruleAttributes.filter((attr) => !!attr.disguised)

  for (const disguisedRule of disguisedRules) {
    const getValues = () => {
      const value = promotion?.application_method?.[disguisedRule.id]

      if (disguisedRule.field_type === "number") {
        return value
      }

      if (value) {
        return [{ label: value, value }]
      }

      return []
    }

    const required = disguisedRule.required ?? true
    const applicationMethod = promotion?.application_method
    const recordValue = applicationMethod?.[disguisedRule.id]

    if (required || recordValue) {
      transformedRules.push({
        ...disguisedRule,
        id: undefined,
        attribute: disguisedRule.id,
        attribute_label: disguisedRule.label,
        operator: RuleOperator.EQ,
        operator_label: operatorsMap[RuleOperator.EQ].label,
        value: undefined,
        values: getValues(),
      })
    }

    continue
  }

  for (const promotionRule of [...promotionRules, ...transformedRules]) {
    const currentRuleAttribute = ruleAttributes.find(
      (attr) =>
        attr.value === promotionRule.attribute ||
        attr.value === promotionRule.attribute
    )

    if (!currentRuleAttribute) {
      continue
    }

    const queryConfig = ruleQueryConfigurations[currentRuleAttribute.id]

    if (!queryConfig) {
      continue
    }

    const rows = await remoteQuery(
      remoteQueryObjectFromString({
        entryPoint: queryConfig.entryPoint,
        variables: {
          filters: {
            [queryConfig.valueAttr]: promotionRule.values?.map((v) => v.value),
          },
        },
        fields: [queryConfig.labelAttr, queryConfig.valueAttr],
      })
    )

    const valueLabelMap = new Map<string, string>(
      rows.map((row) => [
        row[queryConfig.valueAttr],
        row[queryConfig.labelAttr],
      ])
    )

    promotionRule.values =
      promotionRule.values?.map((value) => ({
        value: value.value,
        label: valueLabelMap.get(value.value) || value.value,
      })) || promotionRule.values

    if (!currentRuleAttribute.hydrate) {
      transformedRules.push({
        ...currentRuleAttribute,
        ...promotionRule,
        attribute_label: currentRuleAttribute.label,
        operator_label:
          operatorsMap[promotionRule.operator]?.label || promotionRule.operator,
      })
    }
  }

  res.json({
    rules: transformedRules,
  })
}

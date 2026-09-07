import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { HttpTypes } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import {
  ruleQueryConfigurations,
  validateRuleAttribute,
  validateRuleType,
} from "../../../utils"
import {
  ApplicationMethodTargetTypeValues,
  RuleTypeValues,
} from "@medusajs/types"

/*
  This endpoint returns all the potential values for rules (promotion rules, target rules and buy rules)
  given an attribute of a rule. The response for different rule_attributes are returned uniformly
  as an array of labels and values.
  Eg. If the rule_attribute requested is "currency_code" for "rules" rule type, we return currencies
  from the currency module.
*/
export const GET = async (
  req: AuthenticatedMedusaRequest<HttpTypes.AdminGetPromotionsRuleValueParams>,
  res: MedusaResponse<HttpTypes.AdminRuleValueOptionsListResponse>
) => {
  const { rule_type: ruleType, rule_attribute_id: ruleAttributeId } = req.params
  const queryConfig = ruleQueryConfigurations[ruleAttributeId]
  const filterableFields = req.filterableFields

  validateRuleType(ruleType)
  validateRuleAttribute({
    ruleType: ruleType as RuleTypeValues,
    ruleAttributeId,
    promotionType: undefined,
    applicationMethodType: undefined,
    applicationMethodTargetType:
      filterableFields.application_method_target_type as
        | ApplicationMethodTargetTypeValues
        | undefined,
  })

  if (filterableFields.value) {
    filterableFields[queryConfig.valueAttr] = filterableFields.value

    delete filterableFields.value
  }

  if (filterableFields.application_method_target_type) {
    delete filterableFields.application_method_target_type
  }

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const fields = [queryConfig.labelAttr, queryConfig.valueAttr]

  const { data, metadata } = await query.graph({
    entity: queryConfig.entryPoint,
    fields,
    filters: filterableFields,
    pagination: req.queryConfig.pagination,
  })

  const values = data.map((r) => ({
    label: r[queryConfig.labelAttr],
    value: r[queryConfig.valueAttr],
  }))

  res.json({
    values,
    count: metadata!.count,
    offset: metadata!.skip,
    limit: metadata!.take,
  })
}

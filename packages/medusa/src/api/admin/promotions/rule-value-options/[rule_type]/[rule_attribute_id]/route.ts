import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../../types/routing"
import {
  ruleQueryConfigurations,
  validateRuleAttribute,
  validateRuleType,
} from "../../../utils"
import { AdminGetPromotionRuleParamsType } from "../../../validators"

/*
  This endpoint returns all the potential values for rules (promotion rules, target rules and buy rules)
  given an attribute of a rule. The response for different rule_attributes are returned uniformly
  as an array of labels and values.
  Eg. If the rule_attribute requested is "currency_code" for "rules" rule type, we return currencies
  from the currency module.
*/
export const GET = async (
  req: AuthenticatedMedusaRequest<AdminGetPromotionRuleParamsType>,
  res: MedusaResponse
) => {
  const {
    rule_type: ruleType,
    rule_attribute_id: ruleAttributeId,
    promotion_type: promotionType,
    application_method_type: applicationMethodType,
  } = req.params
  const queryConfig = ruleQueryConfigurations[ruleAttributeId]
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)
  const filterableFields = req.filterableFields

  if (filterableFields.value) {
    filterableFields[queryConfig.valueAttr] = filterableFields.value

    delete filterableFields.value
  }

  validateRuleType(ruleType)
  validateRuleAttribute({
    promotionType,
    ruleType,
    ruleAttributeId,
    applicationMethodType,
  })

  const { rows } = await remoteQuery(
    remoteQueryObjectFromString({
      entryPoint: queryConfig.entryPoint,
      variables: {
        filters: filterableFields,
        ...req.remoteQueryConfig.pagination,
      },
      fields: [queryConfig.labelAttr, queryConfig.valueAttr],
    })
  )

  const values = rows.map((r) => ({
    label: r[queryConfig.labelAttr],
    value: r[queryConfig.valueAttr],
  }))

  res.json({
    values,
  })
}

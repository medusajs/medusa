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

export const GET = async (
  req: AuthenticatedMedusaRequest<AdminGetPromotionRuleParamsType>,
  res: MedusaResponse
) => {
  const {
    rule_type: ruleType,
    rule_attribute_id: ruleAttributeId,
    promotion_type: promotionType,
  } = req.params
  const queryConfig = ruleQueryConfigurations[ruleAttributeId]
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)
  const filterableFields = req.filterableFields

  if (filterableFields.value) {
    filterableFields[queryConfig.valueAttr] = filterableFields.value

    delete filterableFields.value
  }

  validateRuleType(ruleType)
  validateRuleAttribute(promotionType, ruleType, ruleAttributeId)

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

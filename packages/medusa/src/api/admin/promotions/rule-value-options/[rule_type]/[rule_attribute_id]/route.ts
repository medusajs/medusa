import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { HttpTypes } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  FeatureFlag,
} from "@medusajs/framework/utils"
import {
  ruleQueryConfigurations,
  validateRuleAttribute,
  validateRuleType,
} from "../../../utils"
import {
  ApplicationMethodTargetTypeValues,
  RuleTypeValues,
} from "@medusajs/types"
import IndexEngineFeatureFlag from "../../../../../../feature-flags/index-engine"

/*
  Entry points that exist as top-level types in the Index module's default schema
  (packages/modules/index/src/utils/default-schema.ts). Only `product` qualifies
  today; the other entry points this endpoint may receive (product_category,
  product_collection, product_type, product_tag, region, currency, customer_group,
  country, sales_channel, shipping_option_type) are not top-level types in the
  index, so they keep using query.graph.
*/
const ENTITIES_SUPPORTED_BY_INDEX_ENGINE = ["product"]

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

  if (filterableFields.value) {
    filterableFields[queryConfig.valueAttr] = filterableFields.value

    delete filterableFields.value
  }

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

  if (filterableFields.application_method_target_type) {
    delete filterableFields.application_method_target_type
  }

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const fields = [queryConfig.labelAttr, queryConfig.valueAttr]

  const useIndexEngine =
    FeatureFlag.isFeatureEnabled(IndexEngineFeatureFlag.key) &&
    ENTITIES_SUPPORTED_BY_INDEX_ENGINE.includes(queryConfig.entryPoint)

  if (useIndexEngine) {
    // TODO: Remove once we implement search by relations in a similar way to query.graph
    const filters = { ...filterableFields }
    if (!!filters.q) {
      filters.variants = filters.variants ?? {}
    }

    const { data, metadata } = await query.index({
      entity: queryConfig.entryPoint,
      fields,
      filters,
      pagination: req.queryConfig.pagination,
    })

    const values = data.map((r) => ({
      label: r[queryConfig.labelAttr],
      value: r[queryConfig.valueAttr],
    }))

    res.json({
      values,
      count: metadata!.estimate_count,
      estimate_count: metadata!.estimate_count,
      offset: metadata!.skip,
      limit: metadata!.take,
    })
    return
  }

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

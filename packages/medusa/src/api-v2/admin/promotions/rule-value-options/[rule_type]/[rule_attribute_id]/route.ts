import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../../types/routing"
import { validateRuleAttribute, validateRuleType } from "../../../utils"

const queryConfigurations = {
  region: {
    entryPoint: "region",
    labelAttr: "name",
    valueAttr: "id",
  },
  currency: {
    entryPoint: "currency",
    labelAttr: "name",
    valueAttr: "code",
  },
  customer_group: {
    entryPoint: "customer_group",
    labelAttr: "name",
    valueAttr: "id",
  },
  sales_channel: {
    entryPoint: "sales_channel",
    labelAttr: "name",
    valueAttr: "id",
  },
  country: {
    entryPoint: "country",
    labelAttr: "display_name",
    valueAttr: "iso_2",
  },
  product: {
    entryPoint: "product",
    labelAttr: "title",
    valueAttr: "id",
  },
  product_category: {
    entryPoint: "product_category",
    labelAttr: "name",
    valueAttr: "id",
  },
  product_collection: {
    entryPoint: "product_collection",
    labelAttr: "title",
    valueAttr: "id",
  },
  product_type: {
    entryPoint: "product_type",
    labelAttr: "value",
    valueAttr: "id",
  },
  product_tag: {
    entryPoint: "product_tag",
    labelAttr: "value",
    valueAttr: "id",
  },
}

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const { rule_type: ruleType, rule_attribute_id: ruleAttributeId } = req.params
  const queryConfig = queryConfigurations[ruleAttributeId]
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  validateRuleType(ruleType)
  validateRuleAttribute(ruleType, ruleAttributeId)

  const { rows } = await remoteQuery(
    remoteQueryObjectFromString({
      entryPoint: queryConfig.entryPoint,
      variables: {
        filters: req.filterableFields,
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

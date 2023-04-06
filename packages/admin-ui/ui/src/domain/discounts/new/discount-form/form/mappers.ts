import { AdminPostDiscountsReq, AdminUpsertCondition } from "@medusajs/medusa"
import { FieldValues } from "react-hook-form"
import {
  getSubmittableMetadata,
  MetadataFormType,
} from "../../../../../components/forms/general/metadata-form"
import { Option } from "../../../../../types/shared"
import { AllocationType, ConditionMap, DiscountRuleType } from "../../../types"

export interface DiscountFormValues extends FieldValues {
  code: string
  rule: {
    value: number
    description: string
    type: DiscountRuleType
    allocation: AllocationType
  }
  starts_at?: Date
  ends_at?: Date | null
  usage_limit: number | null
  is_dynamic: boolean
  valid_duration: string | null
  regions?: Option[]
  metadata: MetadataFormType
}

export enum DiscountConditionType {
  PRODUCTS = "products",
  PRODUCT_TYPES = "product_types",
  PRODUCT_COLLECTIONS = "product_collections",
  PRODUCT_TAGS = "product_tags",
  CUSTOMER_GROUPS = "customer_groups",
}

const mapConditionsToCreate = (map: ConditionMap) => {
  const conditions: AdminUpsertCondition[] = []

  for (const [key, value] of Object.entries(map)) {
    if (value && value.items.length) {
      conditions.push({
        operator: value.operator,
        [key]: value.items.map((i) => i.id),
      })
    }
  }

  if (!conditions.length) {
    return undefined
  }

  return conditions
}

export const formValuesToCreateDiscountMapper = (
  values: DiscountFormValues,
  conditions: ConditionMap
): Omit<AdminPostDiscountsReq, "is_disabled"> => {
  return {
    code: values.code!,
    rule: {
      allocation:
        values.rule.type === DiscountRuleType.FIXED
          ? values.rule.allocation
          : AllocationType.TOTAL,
      type: values.rule.type,
      value: values.rule.type !== "free_shipping" ? values.rule.value : 0,
      description: values.rule.description,
      conditions: mapConditionsToCreate(conditions),
    },
    is_dynamic: values.is_dynamic,
    ends_at: values.ends_at ?? undefined,
    regions: values.regions?.map((r) => r.value) || [],
    starts_at: values.starts_at,
    usage_limit:
      values.usage_limit && values.usage_limit > 0
        ? values.usage_limit
        : undefined,
    valid_duration:
      values.is_dynamic && values.valid_duration?.length
        ? values.valid_duration
        : undefined,
    metadata: getSubmittableMetadata(values.metadata),
  }
}

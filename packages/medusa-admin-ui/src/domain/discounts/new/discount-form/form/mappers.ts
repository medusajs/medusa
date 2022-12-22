import {
  AdminPostDiscountsDiscountReq,
  AdminPostDiscountsReq,
  AdminUpsertCondition,
  Discount,
} from "@medusajs/medusa"
import { FieldValues } from "react-hook-form"
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
}

export enum DiscountConditionType {
  PRODUCTS = "products",
  PRODUCT_TYPES = "product_types",
  PRODUCT_COLLECTIONS = "product_collections",
  PRODUCT_TAGS = "product_tags",
  CUSTOMER_GROUPS = "customer_groups",
}

export const discountToFormValuesMapper = (
  discount: Discount
): DiscountFormValues => {
  return {
    code: discount.code,
    rule: {
      value: discount.rule.value,
      description: discount.rule.description,
      type: discount.rule.type,
      allocation: discount.rule.allocation,
    },
    starts_at: discount.starts_at && new Date(discount.starts_at),
    ends_at: discount.ends_at && new Date(discount.ends_at),
    is_dynamic: discount.is_dynamic,
    usage_limit: discount.usage_limit,
    valid_duration: discount.valid_duration,
    regions: discount.regions.map((r) => ({ label: r.name, value: r.id })),
  }
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
    regions: values.regions?.map((r) => r.value),
    starts_at: values.starts_at,
    usage_limit:
      values.usage_limit && values.usage_limit > 0
        ? values.usage_limit
        : undefined,
    valid_duration:
      values.is_dynamic && values.valid_duration?.length
        ? values.valid_duration
        : undefined,
  }
}

const mapConditionsToUpdate = (map: ConditionMap) => {
  const conditions: AdminUpsertCondition[] = []

  for (const [key, value] of Object.entries(map)) {
    if (value && value.items.length) {
      conditions.push({
        id: value.id,
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

export const formValuesToUpdateDiscountMapper = (
  ruleId: string,
  values: DiscountFormValues,
  conditions: ConditionMap
): AdminPostDiscountsDiscountReq => {
  return {
    code: values.code,
    rule: {
      allocation:
        values.rule.type === "fixed"
          ? AllocationType.ITEM
          : AllocationType.TOTAL,
      id: ruleId,
      value: values.rule.value,
      description: values.rule.description,
      conditions: mapConditionsToUpdate(conditions),
    },
    ends_at: values.ends_at,
    regions: values.regions?.map((r) => r.value),
    starts_at: values.starts_at,
    usage_limit: values.usage_limit,
    valid_duration: values.valid_duration?.length
      ? values.valid_duration
      : undefined,
  }
}

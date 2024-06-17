import {
  AllocationType,
  Discount,
  DiscountRule,
  DiscountRuleType,
} from "@medusajs/medusa"
import faker from "faker"
import { DataSource } from "typeorm"

export type DiscountRuleFactoryData = {
  type?: DiscountRuleType
  value?: number
  allocation?: AllocationType
}

export type DiscountFactoryData = {
  id?: string
  code?: string
  is_dynamic?: boolean
  rule?: DiscountRuleFactoryData
  regions?: string[]
  starts_at?: Date
  ends_at?: Date
}

export const simpleDiscountFactory = async (
  dataSource: DataSource,
  data: DiscountFactoryData = {},
  seed?: number
): Promise<Discount> => {
  if (typeof seed !== "undefined") {
    faker.seed(seed)
  }

  const manager = dataSource.manager

  const ruleData = data.rule ?? ({} as DiscountRuleFactoryData)
  const ruleToSave = manager.create(DiscountRule, {
    type: ruleData.type ?? DiscountRuleType.PERCENTAGE,
    value: ruleData.value ?? 10,
    allocation: ruleData.allocation ?? AllocationType.TOTAL,
  })

  const dRule = await manager.save(ruleToSave)

  const toSave = manager.create(Discount, {
    id: data.id,
    is_dynamic: data.is_dynamic ?? false,
    is_disabled: false,
    rule_id: dRule.id,
    code: data.code ?? "TESTCODE",
    regions: data.regions?.map((r) => ({ id: r })) || [],
    starts_at: data.starts_at,
    ends_at: data.ends_at,
  })

  return await manager.save(toSave)
}

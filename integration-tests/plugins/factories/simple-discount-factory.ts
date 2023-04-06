import { Connection } from "typeorm"
import faker from "faker"
import {
  Discount,
  DiscountRule,
  DiscountRuleType,
  AllocationType,
} from "@medusajs/medusa"

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
}

export const simpleDiscountFactory = async (
  connection: Connection,
  data: DiscountFactoryData = {},
  seed?: number
): Promise<Discount> => {
  if (typeof seed !== "undefined") {
    faker.seed(seed)
  }

  const manager = connection.manager

  const ruleData = data.rule ?? {}
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
  })

  const discount = await manager.save(toSave)
  return discount
}

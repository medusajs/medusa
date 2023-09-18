import { PriceRule, PriceSet, PriceSetMoneyAmount, RuleType } from "@models"

import { CreatePriceRuleDTO } from "@medusajs/types"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { createMoneyAmounts } from "../money-amount"
import { createRuleTypes } from "../rule-type"
import { defaultPriceRuleData } from "./data"

export async function createPriceRules(
  manager: SqlEntityManager,
  pricesRulesData: CreatePriceRuleDTO[] = defaultPriceRuleData
): Promise<PriceRule[]> {
  const priceRules: PriceRule[] = []

  for (let priceRuleData of pricesRulesData) {
    const priceRuleDataClone: any = { ...priceRuleData }

    if (priceRuleDataClone.price_set_id) {
      priceRuleDataClone.price_set = manager.getReference(
        PriceSet,
        priceRuleDataClone.price_set_id
      )
    }

    let dbRuleType: RuleType | null = await manager.findOne(RuleType, {
      id: priceRuleDataClone.rule_type_id,
    })

    if (!dbRuleType) {
      const [createdRuleType] = await createRuleTypes(manager, [
        {
          id: priceRuleDataClone.rule_type_id,
          name: "rule 1",
          rule_attribute: "region_id",
        },
      ])

      dbRuleType = createdRuleType
    }

    priceRuleDataClone.rule_type = manager.getReference(
      RuleType,
      dbRuleType!.id
    )

    const priceSetMoneyAmountId =
      priceRuleDataClone.price_set_money_amount_id ||
      priceRuleDataClone.price_set_money_amount?.id

    let psma: PriceSetMoneyAmount | null = await manager.findOne(
      PriceSetMoneyAmount,
      {
        id: priceSetMoneyAmountId,
      }
    )

    if (!psma) {
      const [ma] = await createMoneyAmounts(manager, [
        priceRuleDataClone.price_set_money_amount.money_amount ?? {
          amount: 100,
          currency_code: "EUR",
        },
      ])

      psma = manager.create(PriceSetMoneyAmount, {
        price_set: priceRuleDataClone.price_set.id,
        money_amount: ma.id,
        title: "test",
      })

      await manager.persist(psma).flush()
    }

    priceRuleDataClone.price_set_money_amount = psma?.id

    const priceRule = manager.create(PriceRule, priceRuleDataClone)

    priceRules.push(priceRule)
  }

  await manager.persistAndFlush(priceRules)

  return priceRules
}

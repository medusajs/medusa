import { IPricingModuleService } from "@medusajs/types"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { PriceSet } from "@models"

import { initialize } from "../../../../src"
import { createCurrencies } from "../../../__fixtures__/currency"
import {
  createMoneyAmounts,
  defaultMoneyAmountsData,
} from "../../../__fixtures__/money-amount"
import {
  createPriceRules,
  defaultPriceRuleData,
} from "../../../__fixtures__/price-rule"
import { createPriceSets } from "../../../__fixtures__/price-set"
import {
  createPriceSetMoneyAmounts,
  defaultPriceSetMoneyAmountsData,
} from "../../../__fixtures__/price-set-money-amount"

import { createPriceSetMoneyAmountRules } from "../../../__fixtures__/price-set-money-amount-rules"
import { createRuleTypes } from "../../../__fixtures__/rule-type"
import { DB_URL, MikroOrmWrapper } from "../../../utils"

jest.setTimeout(30000)

async function seedData({
  moneyAmountsData = defaultMoneyAmountsData,
  priceRuleData = defaultPriceRuleData,
  priceSetMoneyAmountsData = defaultPriceSetMoneyAmountsData,
} = {}) {
  const testManager = MikroOrmWrapper.forkManager()
  await createCurrencies(testManager)
  await createMoneyAmounts(testManager, moneyAmountsData)
  await createPriceSets(testManager)
  await createPriceSetMoneyAmounts(testManager, priceSetMoneyAmountsData)
  await createRuleTypes(testManager)
  await createPriceRules(testManager, priceRuleData)
  await createPriceSetMoneyAmountRules(testManager)
}

describe("PricingModule Service - Calculate Price", () => {
  let service: IPricingModuleService
  let testManager: SqlEntityManager
  let repositoryManager: SqlEntityManager
  let data!: PriceSet[]

  beforeEach(async () => {
    await MikroOrmWrapper.setupDatabase()
    repositoryManager = MikroOrmWrapper.forkManager()
    testManager = MikroOrmWrapper.forkManager()

    service = await initialize({
      database: {
        clientUrl: DB_URL,
        schema: process.env.MEDUSA_PRICING_DB_SCHEMA,
      },
    })
  })

  afterEach(async () => {
    await MikroOrmWrapper.clearDatabase()
  })

  describe("calculatePrices", () => {
    describe("single pricing context", () => {
      beforeEach(async () => await seedData())

      it("retrieves the calculated prices when no context is set", async () => {
        const priceSetsResult = await service.calculatePrices(
          { id: ["price-set-1", "price-set-2"] },
          {}
        )

        expect(priceSetsResult).toEqual([
          {
            id: "price-set-1",
            amount: null,
            currency_code: null,
            min_quantity: null,
            max_quantity: null,
          },
          {
            id: "price-set-2",
            amount: null,
            currency_code: null,
            min_quantity: null,
            max_quantity: null,
          },
        ])
      })

      it.only("retrieves the calculated prices when a context is set", async () => {
        const priceSetsResult = await service.calculatePrices(
          { id: ["price-set-1", "price-set-2"] },
          {
            context: {
              currency_code: "USD",
            },
          }
        )

        expect(priceSetsResult).toEqual([
          {
            id: "price-set-1",
            amount: "500",
            currency_code: "USD",
            min_quantity: "1",
            max_quantity: "10",
          },
          {
            id: "price-set-2",
            amount: null,
            currency_code: null,
            min_quantity: null,
            max_quantity: null,
          },
        ])
      })

      it("retrieves the calculated prices only when id exists in the database", async () => {
        const priceSetsResult = await service.calculatePrices(
          { id: ["price-set-doesnotexist", "price-set-1"] },
          {
            context: { currency_code: "USD" },
          }
        )

        expect(priceSetsResult).toEqual([
          {
            id: "price-set-1",
            amount: "500",
            currency_code: "USD",
            min_quantity: "1",
            max_quantity: "10",
          },
        ])
      })

      it("retrieves the calculated prices when a context is set, but not present in the db", async () => {
        const priceSetsResult = await service.calculatePrices(
          { id: ["price-set-1", "price-set-2"] },
          {
            context: {
              currency_code: "TEST",
            },
          }
        )

        expect(priceSetsResult).toEqual([
          {
            id: "price-set-1",
            amount: null,
            currency_code: null,
            min_quantity: null,
            max_quantity: null,
          },
          {
            id: "price-set-2",
            amount: null,
            currency_code: null,
            min_quantity: null,
            max_quantity: null,
          },
        ])
      })

      it("retrieves the calculated prices when a context is set but rule attribute doesnt exist the data layer", async () => {
        const priceSetsResult = await service.calculatePrices(
          { id: ["price-set-1", "price-set-2"] },
          {
            context: {
              city: "Berlin",
            } as any,
          }
        )

        expect(priceSetsResult).toEqual([
          {
            id: "price-set-1",
            amount: null,
            currency_code: null,
            min_quantity: null,
            max_quantity: null,
          },
          {
            id: "price-set-2",
            amount: null,
            currency_code: null,
            min_quantity: null,
            max_quantity: null,
          },
        ])
      })

      it("retrieves the calculated prices when a context is set with a totally random pricing attribute", async () => {
        await createCurrencies(testManager, [
          {
            name: "dollas",
            code: "DOLLA",
            symbol: "$",
            symbol_native: "$",
          },
        ])

        await createPriceSets(testManager, [
          {
            id: "price-set-city",
            money_amounts: [],
          } as any,
        ])

        await createMoneyAmounts(testManager, [
          {
            id: "money-amount-city",
            currency_code: "DOLLA",
            amount: 666,
          },
        ])

        await createPriceSetMoneyAmounts(testManager, [
          {
            id: "price-set-money-amount-city",
            title: "psma city",
            price_set: "price-set-city",
            money_amount: "money-amount-city",
          },
        ])

        await createRuleTypes(testManager, [
          {
            id: "rule-type-city",
            name: "rule type city",
            rule_attribute: "city",
          },
        ])

        await createPriceRules(testManager, [
          {
            id: "price-rule-city",
            price_set_id: "price-set-city",
            rule_type_id: "rule-type-city",
            price_set_money_amount_id: "price-set-money-amount-city",
            value: "Berlin",
            price_list_id: "test",
          },
        ])

        const priceSetsResult = await service.calculatePrices(
          { id: ["price-set-city"] },
          {
            context: {
              city: "Berlin",
            } as any,
          }
        )

        expect(priceSetsResult).toEqual([
          {
            id: "price-set-city",
            amount: "666",
            currency_code: "DOLLA",
            min_quantity: null,
            max_quantity: null,
          },
        ])
      })
    })

    describe("multiple pricing context", () => {
      beforeEach(async () => {
        const moneyAmountsData = [
          ...defaultMoneyAmountsData,
          {
            id: "money-amount-USD-region",
            currency_code: "USD",
            amount: 222,
            min_quantity: 1,
            max_quantity: 10,
          },
        ]

        const priceSetMoneyAmountsData = [
          ...defaultPriceSetMoneyAmountsData,
          {
            id: "price-set-money-amount-USD-region",
            title: "price set money amount USD for US region",
            price_set: "price-set-1",
            money_amount: "money-amount-USD-region",
          },
        ]

        const priceRuleData = [
          ...defaultPriceRuleData,
          {
            id: "price-rule-3",
            price_set_id: "price-set-1",
            rule_type_id: "rule-type-2", // region_id
            value: "US",
            price_list_id: "test",
            price_set_money_amount_id: "price-set-money-amount-USD-region",
          },
          {
            id: "price-rule-4",
            price_set_id: "price-set-1",
            rule_type_id: "rule-type-1",
            value: "USD",
            price_list_id: "test",
            price_set_money_amount_id: "price-set-money-amount-USD-region",
          },
        ]

        await seedData({
          moneyAmountsData,
          priceRuleData,
          priceSetMoneyAmountsData,
        })
      })

      it("retrieves the calculated prices when multiple context is set", async () => {
        const priceSetsResult = await service.calculatePrices(
          { id: ["price-set-1", "price-set-2"] },
          {
            context: {
              currency_code: "USD",
              region_id: "US",
            },
          }
        )

        expect(priceSetsResult).toEqual([
          {
            id: "price-set-1",
            amount: "222",
            currency_code: "USD",
            min_quantity: "1",
            max_quantity: "10",
          },
          {
            id: "price-set-2",
            amount: null,
            currency_code: null,
            min_quantity: null,
            max_quantity: null,
          },
        ])
      })

      it("retrieves the null calculated prices when multiple context is set that does not exist", async () => {
        const priceSetsResult = await service.calculatePrices(
          { id: ["price-set-1"] },
          {
            context: {
              currency_code: "USD",
              region_id: "US",
              doesnotexist: "doesnotexist",
            },
          }
        )

        expect(priceSetsResult).toEqual([
          {
            id: "price-set-1",
            amount: null,
            currency_code: null,
            min_quantity: null,
            max_quantity: null,
          },
        ])
      })

      it("returns null conditions for a singular rule type that is part of a compound rule", async () => {
        const priceSetsResult = await service.calculatePrices(
          { id: ["price-set-1"] },
          {
            context: {
              // A rule with region_id alone is not seeded
              region_id: "US",
            },
          }
        )

        expect(priceSetsResult).toEqual([
          {
            id: "price-set-1",
            amount: null,
            currency_code: null,
            min_quantity: null,
            max_quantity: null,
          },
        ])
      })

      it("retrieves the calculated prices only when id exists in the database", async () => {
        const priceSetsResult = await service.calculatePrices(
          { id: ["price-set-doesnotexist", "price-set-1"] },
          {
            context: { currency_code: "USD", region_id: "US" },
          }
        )

        expect(priceSetsResult).toEqual([
          {
            id: "price-set-1",
            amount: "222",
            currency_code: "USD",
            min_quantity: "1",
            max_quantity: "10",
          },
        ])
      })

      it("retrieves the calculated prices when a context is set, but price rule value is not present in the db", async () => {
        const priceSetsResult = await service.calculatePrices(
          { id: ["price-set-1", "price-set-2"] },
          {
            context: {
              currency_code: "TEST",
              region_id: "DE",
            },
          }
        )

        expect(priceSetsResult).toEqual([
          {
            id: "price-set-1",
            amount: null,
            currency_code: null,
            min_quantity: null,
            max_quantity: null,
          },
          {
            id: "price-set-2",
            amount: null,
            currency_code: null,
            min_quantity: null,
            max_quantity: null,
          },
        ])
      })

      it("retrieves the calculated prices when a context is set but rule attribute doesnt exist the data layer", async () => {
        const priceSetsResult = await service.calculatePrices(
          { id: ["price-set-1", "price-set-2"] },
          {
            context: {
              city: "Berlin",
              region_id: "DE",
            } as any,
          }
        )

        expect(priceSetsResult).toEqual([
          {
            id: "price-set-1",
            amount: null,
            currency_code: null,
            min_quantity: null,
            max_quantity: null,
          },
          {
            id: "price-set-2",
            amount: null,
            currency_code: null,
            min_quantity: null,
            max_quantity: null,
          },
        ])
      })
    })
  })
})

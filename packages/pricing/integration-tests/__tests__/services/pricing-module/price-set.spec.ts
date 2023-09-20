import { CreatePriceSetDTO, IPricingModuleService } from "@medusajs/types"
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
}

describe("PricingModule Service - PriceSet", () => {
  let service: IPricingModuleService
  let testManager: SqlEntityManager
  let repositoryManager: SqlEntityManager
  let data!: PriceSet[]

  beforeEach(async () => {
    await MikroOrmWrapper.setupDatabase()
    repositoryManager = MikroOrmWrapper.forkManager()

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
      beforeEach(async () => {
        testManager = MikroOrmWrapper.forkManager()

        await createCurrencies(testManager)
        await createMoneyAmounts(testManager)
        await createPriceSets(testManager)
        await createPriceSetMoneyAmounts(testManager)
        await createRuleTypes(testManager)
        await createPriceRules(testManager)
      })

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

      it("retrieves the calculated prices when a context is set", async () => {
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

      it("retrieves the calculated prices when multiple context is set", async () => {
        const priceSetsResult = await service.calculatePrices(
          { id: ["price-set-1", "price-set-2"] },
          {
            context: {
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

      it("retrieves the calculated prices when a context is set, but not present in the db", async () => {
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

  describe("list", () => {
    beforeEach(async () => await seedData())

    it("list priceSets", async () => {
      const priceSetsResult = await service.list()

      expect(priceSetsResult).toEqual([
        expect.objectContaining({
          id: "price-set-1",
        }),
        expect.objectContaining({
          id: "price-set-2",
        }),
        expect.objectContaining({
          id: "price-set-3",
        }),
      ])
    })

    it("list priceSets by id", async () => {
      const priceSetsResult = await service.list({
        id: ["price-set-1"],
      })

      expect(priceSetsResult).toEqual([
        expect.objectContaining({
          id: "price-set-1",
        }),
      ])
    })

    it("list priceSets with relations and selects", async () => {
      const priceSetsResult = await service.list(
        {
          id: ["price-set-1"],
        },
        {
          select: ["id", "money_amounts.id", "money_amounts.amount"],
          relations: ["money_amounts"],
        }
      )

      const serialized = JSON.parse(JSON.stringify(priceSetsResult))

      expect(serialized).toEqual([
        {
          id: "price-set-1",
          money_amounts: [{ id: "money-amount-USD", amount: "500" }],
        },
      ])
    })
  })

  describe("listAndCount", () => {
    beforeEach(async () => await seedData())

    it("should return priceSets and count", async () => {
      const [priceSetsResult, count] = await service.listAndCount()

      expect(count).toEqual(3)
      expect(priceSetsResult).toEqual([
        expect.objectContaining({
          id: "price-set-1",
        }),
        expect.objectContaining({
          id: "price-set-2",
        }),
        expect.objectContaining({
          id: "price-set-3",
        }),
      ])
    })

    it("should return priceSets and count when filtered", async () => {
      const [priceSetsResult, count] = await service.listAndCount({
        id: ["price-set-1"],
      })

      expect(count).toEqual(1)
      expect(priceSetsResult).toEqual([
        expect.objectContaining({
          id: "price-set-1",
        }),
      ])
    })

    it("list priceSets with relations and selects", async () => {
      const [priceSetsResult, count] = await service.listAndCount(
        {
          id: ["price-set-1"],
        },
        {
          select: ["id", "min_quantity", "money_amounts.id"],
          relations: ["money_amounts"],
        }
      )

      const serialized = JSON.parse(JSON.stringify(priceSetsResult))

      expect(count).toEqual(1)
      expect(serialized).toEqual([
        {
          id: "price-set-1",
          money_amounts: [{ id: "money-amount-USD" }],
        },
      ])
    })

    it("should return priceSets and count when using skip and take", async () => {
      const [priceSetsResult, count] = await service.listAndCount(
        {},
        { skip: 1, take: 1 }
      )

      expect(count).toEqual(3)
      expect(priceSetsResult).toEqual([
        expect.objectContaining({
          id: "price-set-2",
        }),
      ])
    })

    it("should return requested fields", async () => {
      const [priceSetsResult, count] = await service.listAndCount(
        {},
        {
          take: 1,
          select: ["id"],
        }
      )

      const serialized = JSON.parse(JSON.stringify(priceSetsResult))

      expect(count).toEqual(3)
      expect(serialized).toEqual([
        {
          id: "price-set-1",
        },
      ])
    })
  })

  describe("retrieve", () => {
    beforeEach(async () => await seedData())
    const id = "price-set-1"

    it("should return priceSet for the given id", async () => {
      const priceSet = await service.retrieve(id)

      expect(priceSet).toEqual(
        expect.objectContaining({
          id,
        })
      )
    })

    it("should throw an error when priceSet with id does not exist", async () => {
      let error

      try {
        await service.retrieve("does-not-exist")
      } catch (e) {
        error = e
      }

      expect(error.message).toEqual(
        "PriceSet with id: does-not-exist was not found"
      )
    })

    it("should throw an error when a id is not provided", async () => {
      let error

      try {
        await service.retrieve(undefined as unknown as string)
      } catch (e) {
        error = e
      }

      expect(error.message).toEqual('"priceSetId" must be defined')
    })

    it("should return priceSet based on config select param", async () => {
      const priceSet = await service.retrieve(id, {
        select: ["id"],
      })

      const serialized = JSON.parse(JSON.stringify(priceSet))

      expect(serialized).toEqual({
        id,
      })
    })
  })

  describe("delete", () => {
    beforeEach(async () => await seedData())
    const id = "price-set-1"

    it("should delete the priceSets given an id successfully", async () => {
      await service.delete([id])

      const priceSets = await service.list({
        id: [id],
      })

      expect(priceSets).toHaveLength(0)
    })
  })

  describe("update", () => {
    beforeEach(async () => await seedData())
    const id = "price-set-1"

    it("should throw an error when a id does not exist", async () => {
      let error

      try {
        await service.update([
          {
            id: "does-not-exist",
          },
        ])
      } catch (e) {
        error = e
      }

      expect(error.message).toEqual(
        'PriceSet with id "does-not-exist" not found'
      )
    })
  })

  describe("create", () => {
    beforeEach(async () => await seedData())

    it("should throw an error when a id does not exist", async () => {
      let error

      try {
        await service.update([
          {
            random: "does-not-exist",
          } as any,
        ])
      } catch (e) {
        error = e
      }

      expect(error.message).toEqual('PriceSet with id "undefined" not found')
    })

    it("should create a priceSet successfully", async () => {
      await service.create([
        {
          id: "price-set-new",
        } as unknown as CreatePriceSetDTO,
      ])

      const [priceSet] = await service.list({
        id: ["price-set-new"],
      })

      expect(priceSet).toEqual(
        expect.objectContaining({
          id: "price-set-new",
        })
      )
    })
  })
})

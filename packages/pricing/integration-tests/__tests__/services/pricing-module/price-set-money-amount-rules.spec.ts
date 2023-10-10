import { IPricingModuleService } from "@medusajs/types"
import { SqlEntityManager } from "@mikro-orm/postgresql"

import { initialize } from "../../../../src"
import { createCurrencies } from "../../../__fixtures__/currency"
import { createMoneyAmounts } from "../../../__fixtures__/money-amount"
import { createPriceSets } from "../../../__fixtures__/price-set"
import { createPriceSetMoneyAmounts } from "../../../__fixtures__/price-set-money-amount"
import { createPriceSetMoneyAmountRules } from "../../../__fixtures__/price-set-money-amount-rules"
import { createRuleTypes } from "../../../__fixtures__/rule-type"
import { DB_URL, MikroOrmWrapper } from "../../../utils"

jest.setTimeout(30000)

describe("PricingModule Service - PriceSetMoneyAmountRules", () => {
  let service: IPricingModuleService
  let testManager: SqlEntityManager
  let repositoryManager: SqlEntityManager

  beforeEach(async () => {
    await MikroOrmWrapper.setupDatabase()
    repositoryManager = await MikroOrmWrapper.forkManager()
    service = await initialize({
      database: {
        clientUrl: DB_URL,
        schema: process.env.MEDUSA_PRICING_DB_SCHEMA,
      },
    })

    testManager = await MikroOrmWrapper.forkManager()

    await createCurrencies(testManager)
    await createMoneyAmounts(testManager)
    await createPriceSets(testManager)
    await createRuleTypes(testManager)
    await createPriceSetMoneyAmounts(testManager)
    await createPriceSetMoneyAmountRules(testManager)
  })

  afterEach(async () => {
    await MikroOrmWrapper.clearDatabase()
  })

  describe("listPriceSetMoneyAmountRules", () => {
    it("should list psmar records", async () => {
      const priceSetMoneyAmountRulesResult =
        await service.listPriceSetMoneyAmountRules()

      expect(priceSetMoneyAmountRulesResult).toEqual([
        expect.objectContaining({
          id: "psmar-1",
        }),
        expect.objectContaining({
          id: "psmar-2",
        }),
        expect.objectContaining({
          id: "psmar-3",
        }),
      ])
    })

    it("should list psmar record by id", async () => {
      const priceSetMoneyAmountRulesResult =
        await service.listPriceSetMoneyAmountRules({
          id: ["psmar-1"],
        })

      expect(priceSetMoneyAmountRulesResult).toEqual([
        expect.objectContaining({
          id: "psmar-1",
        }),
      ])
    })
  })

  describe("listAndCount", () => {
    it("should return psmar records and count", async () => {
      const [priceSetMoneyAmountRulesResult, count] =
        await service.listAndCountPriceSetMoneyAmountRules()

      expect(count).toEqual(3)
      expect(priceSetMoneyAmountRulesResult).toEqual([
        expect.objectContaining({
          id: "psmar-1",
        }),
        expect.objectContaining({
          id: "psmar-2",
        }),
        expect.objectContaining({
          id: "psmar-3",
        }),
      ])
    })

    it("should return psmar records and count when filtered", async () => {
      const [priceSetMoneyAmountRulesResult, count] =
        await service.listAndCountPriceSetMoneyAmountRules({
          id: ["psmar-1"],
        })

      expect(count).toEqual(1)
      expect(priceSetMoneyAmountRulesResult).toEqual([
        expect.objectContaining({
          id: "psmar-1",
        }),
      ])
    })

    it("should return psmar and count when using skip and take", async () => {
      const [priceSetMoneyAmountRulesResult, count] =
        await service.listAndCountPriceSetMoneyAmountRules(
          {},
          { skip: 1, take: 1 }
        )

      expect(count).toEqual(3)
      expect(priceSetMoneyAmountRulesResult).toEqual([
        expect.objectContaining({
          id: "psmar-2",
        }),
      ])
    })

    it("should return requested fields", async () => {
      const [priceSetMoneyAmountRulesResult, count] =
        await service.listAndCountPriceSetMoneyAmountRules(
          {},
          {
            take: 1,
            select: ["value"],
          }
        )

      const serialized = JSON.parse(
        JSON.stringify(priceSetMoneyAmountRulesResult)
      )

      expect(count).toEqual(3)
      expect(serialized).toEqual([
        {
          id: "psmar-1",
          value: "EUR",
        },
      ])
    })
  })

  describe("retrievePriceSetMoneyAmountRules", () => {
    it("should return priceSetMoneyAmountRules for the given id", async () => {
      const priceSetMoneyAmountRules =
        await service.retrievePriceSetMoneyAmountRules("psmar-1")

      expect(priceSetMoneyAmountRules).toEqual(
        expect.objectContaining({
          id: "psmar-1",
        })
      )
    })

    it("should throw an error when priceSetMoneyAmountRules with id does not exist", async () => {
      let error

      try {
        await service.retrievePriceSetMoneyAmountRules("does-not-exist")
      } catch (e) {
        error = e
      }

      expect(error.message).toEqual(
        "PriceSetMoneyAmountRules with id: does-not-exist was not found"
      )
    })

    it("should throw an error when an id is not provided", async () => {
      let error

      try {
        await service.retrievePriceSetMoneyAmountRules(
          undefined as unknown as string
        )
      } catch (e) {
        error = e
      }

      expect(error.message).toEqual(
        '"priceSetMoneyAmountRulesId" must be defined'
      )
    })

    it("should return priceSetMoneyAmountRules based on config select param", async () => {
      const priceSetMoneyAmountRulesResult =
        await service.retrievePriceSetMoneyAmountRules("psmar-1", {
          select: ["value"],
        })

      const serialized = JSON.parse(
        JSON.stringify(priceSetMoneyAmountRulesResult)
      )

      expect(serialized).toEqual({
        value: "EUR",
        id: "psmar-1",
      })
    })
  })

  describe("deletePriceSetMoneyAmountRules", () => {
    const id = "psmar-1"

    it("should delete the priceSetMoneyAmountRuless given an id successfully", async () => {
      await service.deletePriceSetMoneyAmountRules([id])

      const currencies = await service.listPriceSetMoneyAmountRules({
        id: [id],
      })

      expect(currencies).toHaveLength(0)
    })
  })

  describe("updatePriceSetMoneyAmountRules", () => {
    const id = "psmar-1"

    it("should update the value of the priceSetMoneyAmountRules successfully", async () => {
      await service.updatePriceSetMoneyAmountRules([
        {
          id,
          value: "New value",
        },
      ])

      const psmar = await service.retrievePriceSetMoneyAmountRules(id)

      expect(psmar.value).toEqual("New value")
    })

    it("should throw an error when a id does not exist", async () => {
      let error

      try {
        await service.updatePriceSetMoneyAmountRules([
          {
            id: "does-not-exist",
            value: "random value",
          },
        ])
      } catch (e) {
        error = e
      }

      expect(error.message).toEqual(
        'PriceSetMoneyAmountRules with id "does-not-exist" not found'
      )
    })
  })

  describe("createPriceSetMoneyAmountRules", () => {
    it("should create a priceSetMoneyAmountRules successfully", async () => {
      await service.createPriceSetMoneyAmountRules([
        {
          price_set_money_amount: "price-set-money-amount-EUR",
          rule_type: "rule-type-2",
          value: "New priceSetMoneyAmountRule",
        },
      ])

      const priceSetMoneyAmountRules =
        await service.listPriceSetMoneyAmountRules(
          {},
          {
            relations: ["price_set_money_amount", "rule_type"],
          }
        )

      const created =
        priceSetMoneyAmountRules[priceSetMoneyAmountRules.length - 1]

      expect(created).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          value: "New priceSetMoneyAmountRule",
          price_set_money_amount: expect.objectContaining({
            id: "price-set-money-amount-EUR",
          }),
          rule_type: expect.objectContaining({
            id: "rule-type-2",
          }),
        })
      )
    })
  })
})

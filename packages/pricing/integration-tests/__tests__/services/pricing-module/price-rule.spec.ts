import { CreatePriceRuleDTO, IPricingModuleService } from "@medusajs/types"
import { SqlEntityManager } from "@mikro-orm/postgresql"

import { PriceSetMoneyAmount, initialize } from "../../../../src"
import { createCurrencies } from "../../../__fixtures__/currency"
import { createMoneyAmounts } from "../../../__fixtures__/money-amount"
import { createPriceRules } from "../../../__fixtures__/price-rule"
import { createPriceSets } from "../../../__fixtures__/price-set"
import { createPriceSetMoneyAmounts } from "../../../__fixtures__/price-set-money-amount"
import { createPriceSetMoneyAmountRules } from "../../../__fixtures__/price-set-money-amount-rules"
import { createRuleTypes } from "../../../__fixtures__/rule-type"
import { DB_URL, MikroOrmWrapper } from "../../../utils"

jest.setTimeout(30000)

describe("PricingModule Service - PriceRule", () => {
  let service: IPricingModuleService
  let testManager: SqlEntityManager

  beforeEach(async () => {
    await MikroOrmWrapper.setupDatabase()
    testManager = MikroOrmWrapper.forkManager()

    service = await initialize({
      database: {
        clientUrl: DB_URL,
        schema: process.env.MEDUSA_PRICING_DB_SCHEMA,
      },
    })

    await createCurrencies(testManager)
    await createMoneyAmounts(testManager)
    await createPriceSets(testManager)
    await createRuleTypes(testManager)
    await createPriceSetMoneyAmounts(testManager)
    await createPriceSetMoneyAmountRules(testManager)
    await createPriceRules(testManager)
  })

  afterEach(async () => {
    await MikroOrmWrapper.clearDatabase()
  })

  describe("list", () => {
    it("should list priceRules", async () => {
      const PriceRulesResult = await service.listPriceRules()
      const serialized = JSON.parse(JSON.stringify(PriceRulesResult))

      expect(serialized).toEqual([
        expect.objectContaining({
          id: "price-rule-1",
        }),
        expect.objectContaining({
          id: "price-rule-2",
        }),
      ])
    })

    it("should list priceRules by id", async () => {
      const priceRuleResult = await service.listPriceRules({
        id: ["price-rule-1"],
      })

      expect(priceRuleResult).toEqual([
        expect.objectContaining({
          id: "price-rule-1",
        }),
      ])
    })

    it("should list priceRules with relations and selects", async () => {
      const priceRulesResult = await service.listPriceRules(
        {
          id: ["price-rule-1"],
        },
        {
          select: ["id", "price_set.id"],
          relations: ["price_set"],
        }
      )

      const serialized = JSON.parse(JSON.stringify(priceRulesResult))

      expect(serialized).toEqual([
        {
          id: "price-rule-1",
          price_set: {
            id: "price-set-1",
          },
        },
      ])
    })

    describe("listAndCount", () => {
      it("should return priceRules and count", async () => {
        const [priceRulesResult, count] = await service.listAndCountPriceRules()

        expect(count).toEqual(2)
        expect(priceRulesResult).toEqual([
          expect.objectContaining({
            id: "price-rule-1",
          }),
          expect.objectContaining({
            id: "price-rule-2",
          }),
        ])
      })

      it("should return priceRules and count when filtered", async () => {
        const [priceRulesResult, count] = await service.listAndCountPriceRules({
          id: ["price-rule-1"],
        })

        expect(count).toEqual(1)
        expect(priceRulesResult).toEqual([
          expect.objectContaining({
            id: "price-rule-1",
          }),
        ])
      })

      it("should list PriceRules with relations and selects", async () => {
        const [PriceRulesResult, count] = await service.listAndCountPriceRules(
          {
            id: ["price-rule-1"],
          },
          {
            select: ["id", "price_set.id"],
            relations: ["price_set"],
          }
        )

        const serialized = JSON.parse(JSON.stringify(PriceRulesResult))

        expect(count).toEqual(1)
        expect(serialized).toEqual([
          {
            id: "price-rule-1",
            price_set: {
              id: "price-set-1",
            },
          },
        ])
      })

      it("should return PriceRules and count when using skip and take", async () => {
        const [PriceRulesResult, count] = await service.listAndCountPriceRules(
          {},
          { skip: 1, take: 1 }
        )

        expect(count).toEqual(2)
        expect(PriceRulesResult).toEqual([
          expect.objectContaining({
            id: "price-rule-2",
          }),
        ])
      })

      it("should return requested fields", async () => {
        const [PriceRulesResult, count] = await service.listAndCountPriceRules(
          {},
          {
            take: 1,
            select: ["id"],
          }
        )

        const serialized = JSON.parse(JSON.stringify(PriceRulesResult))

        expect(count).toEqual(2)
        expect(serialized).toEqual([
          {
            id: "price-rule-1",
          },
        ])
      })
    })

    describe("retrieve", () => {
      const id = "price-rule-1"

      it("should return PriceRule for the given id", async () => {
        const PriceRule = await service.retrievePriceRule(id)

        expect(PriceRule).toEqual(
          expect.objectContaining({
            id,
          })
        )
      })

      it("should throw an error when PriceRule with id does not exist", async () => {
        let error

        try {
          await service.retrievePriceRule("does-not-exist")
        } catch (e) {
          error = e
        }

        expect(error.message).toEqual(
          "PriceRule with id: does-not-exist was not found"
        )
      })

      it("should throw an error when a id is not provided", async () => {
        let error

        try {
          await service.retrievePriceRule(undefined as unknown as string)
        } catch (e) {
          error = e
        }

        expect(error.message).toEqual('"priceRuleId" must be defined')
      })

      it("should return PriceRule based on config select param", async () => {
        const PriceRule = await service.retrievePriceRule(id, {
          select: ["id"],
        })

        const serialized = JSON.parse(JSON.stringify(PriceRule))

        expect(serialized).toEqual({
          id,
        })
      })
    })

    describe("delete", () => {
      const id = "price-set-1"

      it("should delete the PriceRules given an id successfully", async () => {
        await service.deletePriceRules([id])

        const PriceRules = await service.listPriceRules({
          id: [id],
        })

        expect(PriceRules).toHaveLength(0)
      })
    })

    describe("update", () => {
      const id = "price-set-1"

      it("should throw an error when a id does not exist", async () => {
        let error

        try {
          await service.updatePriceRules([
            {
              id: "does-not-exist",
            },
          ])
        } catch (e) {
          error = e
        }

        expect(error.message).toEqual(
          'PriceRule with id "does-not-exist" not found'
        )
      })
    })

    describe("create", () => {
      it("should throw an error when a id does not exist", async () => {
        let error

        try {
          await service.updatePriceRules([
            {
              random: "does-not-exist",
            } as any,
          ])
        } catch (e) {
          error = e
        }

        expect(error.message).toEqual('PriceRule with id "undefined" not found')
      })

      it("should create a PriceRule successfully", async () => {
        const [ma] = await createMoneyAmounts(testManager, [
          {
            amount: 100,
            currency_code: "EUR",
          },
        ])

        const psma: PriceSetMoneyAmount = testManager.create(
          PriceSetMoneyAmount,
          {
            price_set: "price-set-1",
            money_amount: ma.id,
            title: "test",
          }
        )

        await testManager.persist(psma).flush()

        await service.createPriceRules([
          {
            id: "price-rule-new",
            price_set_id: "price-set-1",
            rule_type_id: "rule-type-1",
            value: "region_1",
            price_list_id: "test",
            price_set_money_amount_id: psma.id,
          } as unknown as CreatePriceRuleDTO,
        ])

        const [pricerule] = await service.listPriceRules({
          id: ["price-rule-new"],
        })

        expect(pricerule).toEqual(
          expect.objectContaining({
            id: "price-rule-new",
          } as unknown as CreatePriceRuleDTO)
        )
      })
    })
  })
})

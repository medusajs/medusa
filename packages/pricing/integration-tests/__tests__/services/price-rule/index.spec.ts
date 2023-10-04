import { PriceSetMoneyAmount } from "@models"

import { CreatePriceRuleDTO } from "@medusajs/types"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { PriceRuleRepository } from "@repositories"
import { PriceRuleService } from "@services"
import { createCurrencies } from "../../../__fixtures__/currency"
import { createMoneyAmounts } from "../../../__fixtures__/money-amount"
import { createPriceRules } from "../../../__fixtures__/price-rule"
import { createPriceSets } from "../../../__fixtures__/price-set"
import { createPriceSetMoneyAmounts } from "../../../__fixtures__/price-set-money-amount"
import { createPriceSetMoneyAmountRules } from "../../../__fixtures__/price-set-money-amount-rules"
import { createRuleTypes } from "../../../__fixtures__/rule-type"
import { MikroOrmWrapper } from "../../../utils"

jest.setTimeout(30000)

describe("PriceRule Service", () => {
  let service: PriceRuleService
  let testManager: SqlEntityManager
  let repositoryManager: SqlEntityManager

  beforeEach(async () => {
    await MikroOrmWrapper.setupDatabase()
    repositoryManager = await MikroOrmWrapper.forkManager()
    testManager = await MikroOrmWrapper.forkManager()

    const priceRuleRepository = new PriceRuleRepository({
      manager: repositoryManager,
    })

    service = new PriceRuleService({
      priceRuleRepository: priceRuleRepository,
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
      const priceRuleResult = await service.list()
      const serialized = JSON.parse(JSON.stringify(priceRuleResult))

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
      const priceRuleResult = await service.list({
        id: ["price-rule-1"],
      })

      expect(priceRuleResult).toEqual([
        expect.objectContaining({
          id: "price-rule-1",
        }),
      ])
    })

    it("should list priceRules with relations and selects", async () => {
      const priceRulesResult = await service.list(
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
        const [priceRulesResult, count] = await service.listAndCount()

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
        const [priceRulesResult, count] = await service.listAndCount({
          id: ["price-rule-1"],
        })

        expect(count).toEqual(1)
        expect(priceRulesResult).toEqual([
          expect.objectContaining({
            id: "price-rule-1",
          }),
        ])
      })

      it("should list priceRules with relations and selects", async () => {
        const [priceRulesResult, count] = await service.listAndCount(
          {
            id: ["price-rule-1"],
          },
          {
            select: ["id", "price_set.id"],
            relations: ["price_set"],
          }
        )

        const serialized = JSON.parse(JSON.stringify(priceRulesResult))

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

      it("should return priceRules and count when using skip and take", async () => {
        const [priceRulesResult, count] = await service.listAndCount(
          {},
          { skip: 1, take: 1 }
        )

        expect(count).toEqual(2)
        expect(priceRulesResult).toEqual([
          expect.objectContaining({
            id: "price-rule-2",
          }),
        ])
      })

      it("should return requested fields", async () => {
        const [priceRulesResult, count] = await service.listAndCount(
          {},
          {
            take: 1,
            select: ["id"],
          }
        )

        const serialized = JSON.parse(JSON.stringify(priceRulesResult))

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

      it("should return priceRule for the given id", async () => {
        const priceRule = await service.retrieve(id)

        expect(priceRule).toEqual(
          expect.objectContaining({
            id,
          })
        )
      })

      it("should throw an error when priceRule with id does not exist", async () => {
        let error

        try {
          await service.retrieve("does-not-exist")
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
          await service.retrieve(undefined as unknown as string)
        } catch (e) {
          error = e
        }

        expect(error.message).toEqual('"priceRuleId" must be defined')
      })

      it("should return priceRule based on config select param", async () => {
        const priceRule = await service.retrieve(id, {
          select: ["id"],
        })

        const serialized = JSON.parse(JSON.stringify(priceRule))

        expect(serialized).toEqual({
          id,
        })
      })
    })

    describe("delete", () => {
      const id = "price-set-1"

      it("should delete the priceRules given an id successfully", async () => {
        await service.delete([id])

        const priceRules = await service.list({
          id: [id],
        })

        expect(priceRules).toHaveLength(0)
      })
    })

    describe("update", () => {
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
          'PriceRule with id "does-not-exist" not found'
        )
      })
    })

    describe("create", () => {
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

        expect(error.message).toEqual('PriceRule with id "undefined" not found')
      })

      it("should create a priceRule successfully", async () => {
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

        await service.create([
          {
            id: "price-rule-new",
            price_set_id: "price-set-1",
            rule_type_id: "rule-type-1",
            value: "region_1",
            price_list_id: "test",
            price_set_money_amount_id: psma.id,
          } as unknown as CreatePriceRuleDTO,
        ])

        const [pricerule] = await service.list({
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

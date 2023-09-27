import { SqlEntityManager } from "@mikro-orm/postgresql"

import { PriceSetMoneyAmountRulesRepository } from "@repositories"
import { PriceSetMoneyAmountRulesService } from "@services"

import { seedPriceData } from "../../../__fixtures__/seed-price-data"
import { MikroOrmWrapper } from "../../../utils"

jest.setTimeout(30000)

describe("PriceSetMoneyAmountRules Service", () => {
  let service: PriceSetMoneyAmountRulesService
  let testManager: SqlEntityManager
  let repositoryManager: SqlEntityManager

  beforeEach(async () => {
    await MikroOrmWrapper.setupDatabase()
    repositoryManager = await MikroOrmWrapper.forkManager()

    const priceSetMoneyAmountRulesRepository =
      new PriceSetMoneyAmountRulesRepository({
        manager: repositoryManager,
      })

    service = new PriceSetMoneyAmountRulesService({
      priceSetMoneyAmountRulesRepository,
    })

    testManager = await MikroOrmWrapper.forkManager()

    await seedPriceData(testManager)
  })

  afterEach(async () => {
    await MikroOrmWrapper.clearDatabase()
  })

  describe("list", () => {
    it("should list psmar records", async () => {
      const priceSetMoneyAmountRulesResult = await service.list()

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
      const priceSetMoneyAmountRulesResult = await service.list({
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
        await service.listAndCount()

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
        await service.listAndCount({
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
        await service.listAndCount({}, { skip: 1, take: 1 })

      expect(count).toEqual(3)
      expect(priceSetMoneyAmountRulesResult).toEqual([
        expect.objectContaining({
          id: "psmar-2",
        }),
      ])
    })

    it("should return requested fields", async () => {
      const [priceSetMoneyAmountRulesResult, count] =
        await service.listAndCount(
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

  describe("retrieve", () => {
    it("should return priceSetMoneyAmountRules for the given id", async () => {
      const priceSetMoneyAmountRules = await service.retrieve("psmar-1")

      expect(priceSetMoneyAmountRules).toEqual(
        expect.objectContaining({
          id: "psmar-1",
        })
      )
    })

    it("should throw an error when priceSetMoneyAmountRules with id does not exist", async () => {
      let error

      try {
        await service.retrieve("does-not-exist")
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
        await service.retrieve(undefined as unknown as string)
      } catch (e) {
        error = e
      }

      expect(error.message).toEqual(
        '"priceSetMoneyAmountRulesId" must be defined'
      )
    })

    it("should return priceSetMoneyAmountRules based on config select param", async () => {
      const priceSetMoneyAmountRulesResult = await service.retrieve("psmar-1", {
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

  describe("delete", () => {
    const id = "psmar-1"

    it("should delete the priceSetMoneyAmountRules given an id successfully", async () => {
      await service.delete([id])

      const priceSetMoneyAmountRules = await service.list({
        id: [id],
      })

      expect(priceSetMoneyAmountRules).toHaveLength(0)
    })
  })

  describe("update", () => {
    const id = "psmar-1"

    it("should update the value of the priceSetMoneyAmountRules successfully", async () => {
      await service.update([
        {
          id,
          value: "New value",
          price_set_money_amount: "price-set-money-amount-CAD",
          rule_type: "rule-type-2",
        },
      ])

      const psmar = await service.retrieve(id, {
        relations: ["price_set_money_amount", "rule_type"],
      })

      expect(psmar).toEqual(
        expect.objectContaining({
          id,
          value: "New value",
          price_set_money_amount: expect.objectContaining({
            id: "price-set-money-amount-CAD",
          }),
          rule_type: expect.objectContaining({
            id: "rule-type-2",
          }),
        })
      )
    })

    it("should throw an error when a id does not exist", async () => {
      let error

      try {
        await service.update([
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

  describe("create", () => {
    it("should create a priceSetMoneyAmountRules successfully", async () => {
      const created = await service.create([
        {
          price_set_money_amount: "price-set-money-amount-EUR",
          rule_type: "rule-type-2",
          value: "New priceSetMoneyAmountRule",
        },
      ])

      const [priceSetMoneyAmountRules] = await service.list(
        {
          id: [created[0]?.id],
        },
        {
          relations: ["price_set_money_amount", "rule_type"],
        }
      )

      expect(priceSetMoneyAmountRules).toEqual(
        expect.objectContaining({
          id: created[0]?.id,
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

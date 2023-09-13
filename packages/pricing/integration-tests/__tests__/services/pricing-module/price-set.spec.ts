import { CreatePriceSetDTO, IPricingModuleService } from "@medusajs/types"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { PriceSet } from "@models"

import { initialize } from "../../../../src"
import { createCurrencies } from "../../../__fixtures__/currency"
import { createMoneyAmounts } from "../../../__fixtures__/money-amount"
import { createPriceSets } from "../../../__fixtures__/price-set"
import { DB_URL, MikroOrmWrapper } from "../../../utils"

jest.setTimeout(30000)

describe("PricingModule Service - PriceSet", () => {
  let service: IPricingModuleService
  let testManager: SqlEntityManager
  let repositoryManager: SqlEntityManager
  let data!: PriceSet[]

  const moneyAmountsInputData = [
    {
      id: "money-amount-USD",
      currency_code: "USD",
      amount: 500,
      min_quantity: 1,
      max_quantity: 10,
    },
    {
      id: "money-amount-EUR",
      currency_code: "EUR",
      amount: 500,
      min_quantity: 1,
      max_quantity: 10,
    },
  ]

  const priceSetInputData = [
    {
      id: "price-set-1",
      money_amounts: [{ id: "money-amount-USD" }],
    },
    {
      id: "price-set-2",
      money_amounts: [{ id: "money-amount-EUR" }],
    },
    {
      id: "price-set-3",
      money_amounts: [],
    },
  ]

  beforeEach(async () => {
    await MikroOrmWrapper.setupDatabase()
    repositoryManager = MikroOrmWrapper.forkManager()

    service = await initialize({
      database: {
        clientUrl: DB_URL,
        schema: process.env.MEDUSA_PRICING_DB_SCHEMA,
      },
    })

    testManager = MikroOrmWrapper.forkManager()
    await createCurrencies(testManager)
    await createMoneyAmounts(testManager, moneyAmountsInputData)
    data = await createPriceSets(testManager, priceSetInputData)
  })

  afterEach(async () => {
    await MikroOrmWrapper.clearDatabase()
  })

  describe("calculatePrices", () => {
    it("retrieves the calculated prices when no context is set", async () => {
      const priceSetsResult = await service.calculatePrices(
        ["price-set-1", "price-set-2"],
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
        ["price-set-1", "price-set-2"],
        {
          currency_code: "USD",
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
        ["price-set-doesnotexist", "price-set-1"],
        {
          currency_code: "USD",
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
  })

  describe("list", () => {
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

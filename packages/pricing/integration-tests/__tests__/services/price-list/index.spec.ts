import { SqlEntityManager } from "@mikro-orm/postgresql"

import { Currency, MoneyAmount } from "@models"
import { PriceListRepository } from "@repositories"
import { PriceListService } from "@services"

import { MikroOrmWrapper } from "../../../utils"
import { createPriceLists } from "../../../__fixtures__/price-list"

jest.setTimeout(30000)

describe("MoneyAmount Service", () => {
  let service: PriceListService
  let testManager: SqlEntityManager
  let repositoryManager: SqlEntityManager
  let data!: MoneyAmount[]
  let currencyData!: Currency[]

  beforeEach(async () => {
    await MikroOrmWrapper.setupDatabase()
    repositoryManager = await MikroOrmWrapper.forkManager()

    const priceListRepository = new PriceListRepository({
      manager: repositoryManager,
    })

    service = new PriceListService({
      priceListRepository,
    })

    testManager = await MikroOrmWrapper.forkManager()
    data = await createPriceLists(testManager)
  })

  afterEach(async () => {
    await MikroOrmWrapper.clearDatabase()
  })

  describe("list", () => {
    it("list priceLists", async () => {
      const priceListResult = await service.list()

      expect(priceListResult).toEqual([
        expect.objectContaining({
          id: "price-list-1",
        }),
        expect.objectContaining({
          id: "price-list-2",
        }),
      ])
    })

    it("list pricelists by id", async () => {
      const priceListResult = await service.list({
        id: ["price-list-1"],
      })

      expect(priceListResult).toEqual([
        expect.objectContaining({
          id: "price-list-1",
        }),
      ])
    })
  })

  describe("listAndCount", () => {
    it("should return pricelists and count", async () => {
      const [priceListResult, count] = await service.listAndCount()

      expect(count).toEqual(2)
      expect(priceListResult).toEqual([
        expect.objectContaining({
          id: "price-list-1",
        }),
        expect.objectContaining({
          id: "price-list-2",
        }),
      ])
    })

    it("should return pricelists and count when filtered", async () => {
      const [priceListResult, count] = await service.listAndCount({
        id: ["price-list-1"],
      })

      expect(count).toEqual(1)
      expect(priceListResult).toEqual([
        expect.objectContaining({
          id: "price-list-1",
        }),
      ])
    })

    it("should return pricelists and count when using skip and take", async () => {
      const [priceListResult, count] = await service.listAndCount(
        {},
        { skip: 1, take: 1 }
      )

      expect(count).toEqual(2)
      expect(priceListResult).toEqual([
        expect.objectContaining({
          id: "price-list-2",
        }),
      ])
    })

    it("should return requested fields", async () => {
      const [priceListResult, count] = await service.listAndCount(
        {},
        {
          take: 1,
          select: ["id"],
        }
      )

      const serialized = JSON.parse(JSON.stringify(priceListResult))

      expect(count).toEqual(3)
      expect(serialized).toEqual([
        {
          id: "price-list-1",
        },
      ])
    })
  })

  describe("retrieve", () => {
    const id = "money-amount-USD"
    const amount = "500"

    it("should return moneyAmount for the given id", async () => {
      const priceListResult = await service.retrieve(id)

      expect(priceListResult).toEqual(
        expect.objectContaining({
          id,
        })
      )
    })

    it("should throw an error when moneyAmount with id does not exist", async () => {
      let error

      try {
        await service.retrieve("does-not-exist")
      } catch (e) {
        error = e
      }

      expect(error.message).toEqual(
        "MoneyAmount with id: does-not-exist was not found"
      )
    })

    it("should throw an error when a id is not provided", async () => {
      let error

      try {
        await service.retrieve(undefined as unknown as string)
      } catch (e) {
        error = e
      }

      expect(error.message).toEqual('"moneyAmountId" must be defined')
    })

    it("should return moneyAmount based on config select param", async () => {
      const priceListResult = await service.retrieve(id, {
        select: ["id", "amount"],
      })

      const serialized = JSON.parse(JSON.stringify(priceListResult))

      expect(serialized).toEqual({
        id,
        amount,
      })
    })
  })

  describe("delete", () => {
    const id = "money-amount-USD"

    it("should delete the pricelists given an id successfully", async () => {
      await service.delete([id])

      const priceListResult = await service.list({
        id: [id],
      })

      expect(priceListResult).toHaveLength(0)
    })
  })

  describe("update", () => {
    const id = "money-amount-USD"

    it("should update the amount of the moneyAmount successfully", async () => {
      await service.update([
        {
          id,
          amount: 700,
        },
      ])

      const moneyAmount = await service.retrieve(id)

      expect(moneyAmount.amount).toEqual("700")
    })

    it("should update the currency of the moneyAmount successfully", async () => {
      await service.update([
        {
          id,
          currency_code: "EUR",
        },
      ])

      const moneyAmount = await service.retrieve(id)

      expect(moneyAmount.currency_code).toEqual("EUR")
      expect(moneyAmount.currency?.code).toEqual("EUR")
    })

    it("should throw an error when a id does not exist", async () => {
      let error

      try {
        await service.update([
          {
            id: "does-not-exist",
            amount: 666,
          },
        ])
      } catch (e) {
        error = e
      }

      expect(error.message).toEqual(
        'MoneyAmount with id "does-not-exist" not found'
      )
    })
  })

  describe("create", () => {
    it("should create a moneyAmount successfully", async () => {
      await service.create([
        {
          id: "money-amount-TESM",
          currency_code: "USD",
          amount: 333,
          min_quantity: 1,
          max_quantity: 4,
        },
      ])

      const [moneyAmount] = await service.list({
        id: ["money-amount-TESM"],
      })

      expect(moneyAmount).toEqual(
        expect.objectContaining({
          id: "money-amount-TESM",
          currency_code: "USD",
          amount: "333",
          min_quantity: "1",
          max_quantity: "4",
        })
      )
    })
  })
})

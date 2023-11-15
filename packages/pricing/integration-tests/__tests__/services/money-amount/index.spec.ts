import { SqlEntityManager } from "@mikro-orm/postgresql"

import { Currency, MoneyAmount } from "@models"
import { MoneyAmountRepository } from "@repositories"
import { MoneyAmountService } from "@services"

import { createCurrencies } from "../../../__fixtures__/currency"
import { createMoneyAmounts } from "../../../__fixtures__/money-amount"
import { MikroOrmWrapper } from "../../../utils"

jest.setTimeout(30000)

describe("MoneyAmount Service", () => {
  let service: MoneyAmountService
  let testManager: SqlEntityManager
  let repositoryManager: SqlEntityManager
  let data!: MoneyAmount[]
  let currencyData!: Currency[]

  beforeEach(async () => {
    await MikroOrmWrapper.setupDatabase()
    repositoryManager = await MikroOrmWrapper.forkManager()

    const moneyAmountRepository = new MoneyAmountRepository({
      manager: repositoryManager,
    })

    service = new MoneyAmountService({
      moneyAmountRepository,
    })

    testManager = await MikroOrmWrapper.forkManager()
    currencyData = await createCurrencies(testManager)
    data = await createMoneyAmounts(testManager)
  })

  afterEach(async () => {
    await MikroOrmWrapper.clearDatabase()
  })

  describe("list", () => {
    it("should list all moneyAmounts", async () => {
      const moneyAmountsResult = await service.list()

      expect(JSON.parse(JSON.stringify(moneyAmountsResult))).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: "money-amount-USD",
            amount: 500,
          }),
          expect.objectContaining({
            id: "money-amount-EUR",
            amount: 400,
          }),
          expect.objectContaining({
            id: "money-amount-CAD",
            amount: 600,
          }),
        ])
      )
    })

    it("should list moneyAmounts by id", async () => {
      const moneyAmountsResult = await service.list({
        id: ["money-amount-USD"],
      })

      expect(JSON.parse(JSON.stringify(moneyAmountsResult))).toEqual([
        expect.objectContaining({
          id: "money-amount-USD",
        }),
      ])
    })

    it("should list moneyAmounts with relations and selects", async () => {
      const moneyAmountsResult = await service.list(
        {
          id: ["money-amount-USD"],
        },
        {
          select: ["id", "min_quantity", "currency.code", "amount"],
          relations: ["currency"],
        }
      )

      const serialized = JSON.parse(JSON.stringify(moneyAmountsResult))

      expect(serialized).toEqual([
        {
          id: "money-amount-USD",
          amount: 500,
          min_quantity: "1",
          currency_code: "USD",
          currency: {
            code: "USD",
          },
        },
      ])
    })

    it("should list moneyAmounts scoped by currency_code", async () => {
      const moneyAmountsResult = await service.list(
        {
          currency_code: ["USD"],
        },
        {
          select: ["id", "min_quantity", "currency.code", "amount"],
          relations: ["currency"],
        }
      )

      const serialized = JSON.parse(JSON.stringify(moneyAmountsResult))

      expect(serialized).toEqual([
        {
          id: "money-amount-USD",
          min_quantity: "1",
          currency_code: "USD",
          amount: 500,
          currency: {
            code: "USD",
          },
        },
      ])
    })
  })

  describe("listAndCount", () => {
    it("should return moneyAmounts and count", async () => {
      const [moneyAmountsResult, count] = await service.listAndCount()

      expect(count).toEqual(3)
      expect(JSON.parse(JSON.stringify(moneyAmountsResult))).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: "money-amount-USD",
          }),
          expect.objectContaining({
            id: "money-amount-EUR",
          }),
          expect.objectContaining({
            id: "money-amount-CAD",
          }),
        ])
      )
    })

    it("should return moneyAmounts and count when filtered", async () => {
      const [moneyAmountsResult, count] = await service.listAndCount({
        id: ["money-amount-USD"],
      })

      expect(count).toEqual(1)
      expect(moneyAmountsResult).toEqual([
        expect.objectContaining({
          id: "money-amount-USD",
        }),
      ])
    })

    it("list moneyAmounts with relations and selects", async () => {
      const [moneyAmountsResult, count] = await service.listAndCount(
        {
          id: ["money-amount-USD"],
        },
        {
          select: ["id", "min_quantity", "currency.code", "amount"],
          relations: ["currency"],
        }
      )

      const serialized = JSON.parse(JSON.stringify(moneyAmountsResult))

      expect(count).toEqual(1)
      expect(serialized).toEqual([
        {
          id: "money-amount-USD",
          amount: 500,
          min_quantity: "1",
          currency_code: "USD",
          currency: {
            code: "USD",
          },
        },
      ])
    })

    it("should return moneyAmounts and count when using skip and take", async () => {
      const [moneyAmountsResult, count] = await service.listAndCount(
        {},
        { skip: 1, take: 1 }
      )

      expect(count).toEqual(3)
      expect(moneyAmountsResult).toEqual([
        expect.objectContaining({
          id: "money-amount-EUR",
        }),
      ])
    })

    it("should return requested fields", async () => {
      const [moneyAmountsResult, count] = await service.listAndCount(
        {},
        {
          take: 1,
          select: ["id", "amount"],
        }
      )

      const serialized = JSON.parse(JSON.stringify(moneyAmountsResult))

      expect(count).toEqual(3)
      expect(serialized).toEqual([
        {
          id: "money-amount-USD",
          amount: 500,
        },
      ])
    })
  })

  describe("retrieve", () => {
    const id = "money-amount-USD"
    const amount = 500

    it("should return moneyAmount for the given id", async () => {
      const moneyAmount = await service.retrieve(id)

      expect(moneyAmount).toEqual(
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
      const moneyAmount = await service.retrieve(id, {
        select: ["id", "amount"],
      })

      const serialized = JSON.parse(JSON.stringify(moneyAmount))

      expect(serialized).toEqual({
        id,
        amount,
      })
    })
  })

  describe("delete", () => {
    const id = "money-amount-USD"

    it("should delete the moneyAmounts given an id successfully", async () => {
      await service.delete([id])

      const moneyAmounts = await service.list({
        id: [id],
      })

      expect(moneyAmounts).toHaveLength(0)
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

      const moneyAmount = JSON.parse(JSON.stringify(await service.retrieve(id)))

      expect(moneyAmount.amount).toEqual(700)
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

      expect(JSON.parse(JSON.stringify(moneyAmount))).toEqual(
        expect.objectContaining({
          id: "money-amount-TESM",
          currency_code: "USD",
          amount: 333,
          min_quantity: "1",
          max_quantity: "4",
        })
      )
    })
  })
})

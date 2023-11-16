import { IPricingModuleService } from "@medusajs/types"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { Currency, MoneyAmount } from "@models"

import { initialize } from "../../../../src"
import { createCurrencies } from "../../../__fixtures__/currency"
import { createMoneyAmounts } from "../../../__fixtures__/money-amount"
import { DB_URL, MikroOrmWrapper } from "../../../utils"

jest.setTimeout(30000)

describe("PricingModule Service - MoneyAmount", () => {
  let service: IPricingModuleService
  let testManager: SqlEntityManager
  let repositoryManager: SqlEntityManager
  let data!: MoneyAmount[]
  let currencyData!: Currency[]

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

    testManager = await MikroOrmWrapper.forkManager()
    currencyData = await createCurrencies(testManager)
    data = await createMoneyAmounts(testManager)
  })

  afterEach(async () => {
    await MikroOrmWrapper.clearDatabase()
  })

  describe("listMoneyAmounts", () => {
    it("list moneyAmounts", async () => {
      const moneyAmountsResult = await service.listMoneyAmounts()

      expect(moneyAmountsResult).toEqual(
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
      const moneyAmountsResult = await service.listMoneyAmounts({
        id: ["money-amount-USD"],
      })

      expect(moneyAmountsResult).toEqual([
        expect.objectContaining({
          id: "money-amount-USD",
        }),
      ])
    })

    it("should list moneyAmounts with relations and selects", async () => {
      const moneyAmountsResult = await service.listMoneyAmounts(
        {
          id: ["money-amount-USD"],
        },
        {
          select: ["id", "min_quantity", "currency.code"],
          relations: ["currency"],
        }
      )

      const serialized = JSON.parse(JSON.stringify(moneyAmountsResult))

      expect(serialized).toEqual([
        {
          id: "money-amount-USD",
          amount: null,
          min_quantity: "1",
          currency_code: "USD",
          currency: {
            code: "USD",
          },
        },
      ])
    })
  })

  describe("listAndCountMoneyAmounts", () => {
    it("should return moneyAmounts and count", async () => {
      const [moneyAmountsResult, count] =
        await service.listAndCountMoneyAmounts()

      expect(count).toEqual(3)
      expect(moneyAmountsResult).toEqual(
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
      const [moneyAmountsResult, count] =
        await service.listAndCountMoneyAmounts({
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
      const [moneyAmountsResult, count] =
        await service.listAndCountMoneyAmounts(
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
      const [moneyAmountsResult, count] =
        await service.listAndCountMoneyAmounts({}, { skip: 1, take: 1 })

      expect(count).toEqual(3)
      expect(moneyAmountsResult).toEqual([
        expect.objectContaining({
          id: "money-amount-EUR",
        }),
      ])
    })

    it("should return requested fields", async () => {
      const [moneyAmountsResult, count] =
        await service.listAndCountMoneyAmounts(
          {},
          {
            take: 1,
            select: ["id"],
          }
        )

      const serialized = JSON.parse(JSON.stringify(moneyAmountsResult))

      expect(count).toEqual(3)
      expect(serialized).toEqual([
        {
          id: "money-amount-USD",
          amount: null,
        },
      ])
    })
  })

  describe("retrieveMoneyAmount", () => {
    const id = "money-amount-USD"
    const amount = 500

    it("should return moneyAmount for the given id", async () => {
      const moneyAmount = await service.retrieveMoneyAmount(id)

      expect(moneyAmount).toEqual(
        expect.objectContaining({
          id,
        })
      )
    })

    it("should throw an error when moneyAmount with id does not exist", async () => {
      let error

      try {
        await service.retrieveMoneyAmount("does-not-exist")
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
        await service.retrieveMoneyAmount(undefined as unknown as string)
      } catch (e) {
        error = e
      }

      expect(error.message).toEqual('"moneyAmountId" must be defined')
    })

    it("should return moneyAmount based on config select param", async () => {
      const moneyAmount = await service.retrieveMoneyAmount(id, {
        select: ["id", "amount"],
      })

      const serialized = JSON.parse(JSON.stringify(moneyAmount))

      expect(serialized).toEqual({
        id,
        amount,
      })
    })
  })

  describe("deleteMoneyAmounts", () => {
    const id = "money-amount-USD"

    it("should delete the moneyAmounts given an id successfully", async () => {
      await service.deleteMoneyAmounts([id])

      const moneyAmounts = await service.listMoneyAmounts({
        id: [id],
      })

      expect(moneyAmounts).toHaveLength(0)
    })
  })

  describe("updateMoneyAmounts", () => {
    const id = "money-amount-USD"

    it("should update the amount of the moneyAmount successfully", async () => {
      await service.updateMoneyAmounts([
        {
          id,
          amount: 700,
        },
      ])

      const moneyAmount = JSON.parse(
        JSON.stringify(
          await service.retrieveMoneyAmount(id, { select: ["amount"] })
        )
      )

      expect(moneyAmount.amount).toEqual(700)
    })

    it("should update the currency of the moneyAmount successfully", async () => {
      await service.updateMoneyAmounts([
        {
          id,
          currency_code: "EUR",
        },
      ])

      const moneyAmount = await service.retrieveMoneyAmount(id, {
        relations: ["currency"],
      })

      expect(moneyAmount.currency_code).toEqual("EUR")
      expect(moneyAmount.currency?.code).toEqual("EUR")
    })

    it("should throw an error when a id does not exist", async () => {
      let error

      try {
        await service.updateMoneyAmounts([
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

  describe("createMoneyAmounts", () => {
    it("should create a moneyAmount successfully", async () => {
      await service.createMoneyAmounts([
        {
          id: "money-amount-TESM",
          currency_code: "USD",
          amount: 333,
          min_quantity: 1,
          max_quantity: 4,
        },
      ])

      const [moneyAmount] = await service.listMoneyAmounts({
        id: ["money-amount-TESM"],
      })

      expect(moneyAmount).toEqual(
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

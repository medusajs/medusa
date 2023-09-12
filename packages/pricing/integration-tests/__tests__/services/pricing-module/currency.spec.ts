import { IPricingModuleService } from "@medusajs/types"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { Currency } from "@models"

import { initialize } from "../../../../src"
import { createCurrencies } from "../../../__fixtures__/currency"
import { DB_URL, MikroOrmWrapper } from "../../../utils"

describe("PricingModule Service - Currency", () => {
  let service: IPricingModuleService
  let testManager: SqlEntityManager
  let repositoryManager: SqlEntityManager
  let data!: Currency[]

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

    data = await createCurrencies(testManager)
  })

  afterEach(async () => {
    await MikroOrmWrapper.clearDatabase()
  })

  describe("listCurrencies", () => {
    it("list currencies", async () => {
      const currenciesResult = await service.listCurrencies()

      expect(currenciesResult).toEqual([
        expect.objectContaining({
          code: "USD",
          name: "US Dollar",
        }),
        expect.objectContaining({
          code: "CAD",
          name: "Canadian Dollar",
        }),
        expect.objectContaining({
          code: "EUR",
          name: "Euro",
        }),
      ])
    })

    it("list currencies by code", async () => {
      const currenciesResult = await service.listCurrencies({ code: ["USD"] })

      expect(currenciesResult).toEqual([
        expect.objectContaining({
          code: "USD",
          name: "US Dollar",
        }),
      ])
    })
  })

  describe("listAndCountCurrencies", () => {
    it("should return currencies and count", async () => {
      const [currenciesResult, count] = await service.listAndCountCurrencies()

      expect(count).toEqual(3)
      expect(currenciesResult).toEqual([
        expect.objectContaining({
          code: "USD",
          name: "US Dollar",
        }),
        expect.objectContaining({
          code: "CAD",
          name: "Canadian Dollar",
        }),
        expect.objectContaining({
          code: "EUR",
          name: "Euro",
        }),
      ])
    })

    it("should return currencies and count when filtered", async () => {
      const [currenciesResult, count] = await service.listAndCountCurrencies({
        code: ["USD"],
      })

      expect(count).toEqual(1)
      expect(currenciesResult).toEqual([
        expect.objectContaining({
          code: "USD",
          name: "US Dollar",
        }),
      ])
    })

    it("should return currencies and count when using skip and take", async () => {
      const [currenciesResult, count] = await service.listAndCountCurrencies(
        {},
        { skip: 1, take: 1 }
      )

      expect(count).toEqual(3)
      expect(currenciesResult).toEqual([
        expect.objectContaining({
          code: "CAD",
          name: "Canadian Dollar",
        }),
      ])
    })

    it("should return requested fields", async () => {
      const [currenciesResult, count] = await service.listAndCountCurrencies(
        {},
        {
          take: 1,
          select: ["code"],
        }
      )

      const serialized = JSON.parse(JSON.stringify(currenciesResult))

      expect(count).toEqual(3)
      expect(serialized).toEqual([
        {
          code: "USD",
        },
      ])
    })
  })

  describe("retrieveCurrency", () => {
    const code = "USD"
    const name = "US Dollar"

    it("should return currency for the given code", async () => {
      const currency = await service.retrieveCurrency(code)

      expect(currency).toEqual(
        expect.objectContaining({
          code,
        })
      )
    })

    it("should throw an error when currency with code does not exist", async () => {
      let error

      try {
        await service.retrieveCurrency("does-not-exist")
      } catch (e) {
        error = e
      }

      expect(error.message).toEqual(
        "Currency with code: does-not-exist was not found"
      )
    })

    it("should throw an error when a code is not provided", async () => {
      let error

      try {
        await service.retrieveCurrency(undefined as unknown as string)
      } catch (e) {
        error = e
      }

      expect(error.message).toEqual('"currencyCode" must be defined')
    })

    it("should return currency based on config select param", async () => {
      const currency = await service.retrieveCurrency(code, {
        select: ["code", "name"],
      })

      const serialized = JSON.parse(JSON.stringify(currency))

      expect(serialized).toEqual({
        code,
        name,
      })
    })
  })

  describe("deleteCurrencies", () => {
    const code = "USD"

    it("should delete the currencies given an code successfully", async () => {
      await service.deleteCurrencies([code])

      const currencies = await service.listCurrencies({
        code: [code],
      })

      expect(currencies).toHaveLength(0)
    })
  })

  describe("updateCurrencies", () => {
    const code = "USD"

    it("should update the name of the currency successfully", async () => {
      await service.updateCurrencies([
        {
          code,
          name: "United States Pounds",
        },
      ])

      const currency = await service.retrieveCurrency(code)

      expect(currency.name).toEqual("United States Pounds")
    })

    it("should throw an error when a code does not exist", async () => {
      let error

      try {
        await service.updateCurrencies([
          {
            code: "does-not-exist",
            name: "UK",
          },
        ])
      } catch (e) {
        error = e
      }

      expect(error.message).toEqual(
        'Currency with code "does-not-exist" not found'
      )
    })
  })

  describe("createCurrencies", () => {
    it("should create a currency successfully", async () => {
      await service.createCurrencies([
        {
          code: "TES",
          name: "Test Dollars",
          symbol: "TES1",
          symbol_native: "TES2",
        },
      ])

      const [currency] = await service.listCurrencies({
        code: ["TES"],
      })

      expect(currency).toEqual(
        expect.objectContaining({
          code: "TES",
          name: "Test Dollars",
          symbol: "TES1",
          symbol_native: "TES2",
        })
      )
    })
  })
})

import { SqlEntityManager } from "@mikro-orm/postgresql"

import { Currency } from "@models"
import { CurrencyRepository } from "@repositories"
import { CurrencyService } from "@services"

import { createCurrencies } from "../../../__fixtures__/currency"
import { MikroOrmWrapper } from "../../../utils"

jest.setTimeout(30000)

describe("Currency Service", () => {
  let service: CurrencyService
  let testManager: SqlEntityManager
  let repositoryManager: SqlEntityManager
  let data!: Currency[]

  const currencyData = [
    {
      symbol: "$",
      name: "US Dollar",
      symbol_native: "$",
      code: "USD",
    },
    {
      symbol: "CA$",
      name: "Canadian Dollar",
      symbol_native: "$",
      code: "CAD",
    },
  ]

  beforeEach(async () => {
    await MikroOrmWrapper.setupDatabase()
    repositoryManager = await MikroOrmWrapper.forkManager()

    const currencyRepository = new CurrencyRepository({
      manager: repositoryManager,
    })

    service = new CurrencyService({
      currencyRepository,
    })

    testManager = await MikroOrmWrapper.forkManager()

    data = await createCurrencies(testManager, currencyData)
  })

  afterEach(async () => {
    await MikroOrmWrapper.clearDatabase()
  })

  describe("list", () => {
    it("list currencies", async () => {
      const currenciesResult = await service.list()

      expect(currenciesResult).toEqual([
        expect.objectContaining({
          code: "USD",
          name: "US Dollar",
        }),
        expect.objectContaining({
          code: "CAD",
          name: "Canadian Dollar",
        }),
      ])
    })

    it("list currencies by code", async () => {
      const currenciesResult = await service.list({ code: ["USD"] })

      expect(currenciesResult).toEqual([
        expect.objectContaining({
          code: "USD",
          name: "US Dollar",
        }),
      ])
    })
  })

  describe("listAndCount", () => {
    it("should return currencies and count", async () => {
      const [currenciesResult, count] = await service.listAndCount()

      expect(count).toEqual(2)
      expect(currenciesResult).toEqual([
        expect.objectContaining({
          code: "USD",
          name: "US Dollar",
        }),
        expect.objectContaining({
          code: "CAD",
          name: "Canadian Dollar",
        }),
      ])
    })

    it("should return currencies and count when filtered", async () => {
      const [currenciesResult, count] = await service.listAndCount({
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
      const [currenciesResult, count] = await service.listAndCount(
        {},
        { skip: 1, take: 1 }
      )

      expect(count).toEqual(2)
      expect(currenciesResult).toEqual([
        expect.objectContaining({
          code: "CAD",
          name: "Canadian Dollar",
        }),
      ])
    })

    it("should return requested fields", async () => {
      const [currenciesResult, count] = await service.listAndCount(
        {},
        {
          take: 1,
          select: ["code"],
        }
      )

      const serialized = JSON.parse(JSON.stringify(currenciesResult))

      expect(count).toEqual(2)
      expect(serialized).toEqual([
        {
          code: "USD",
        },
      ])
    })
  })

  describe("retrieve", () => {
    const code = "USD"
    const name = "US Dollar"

    it("should return currency for the given code", async () => {
      const currency = await service.retrieve(code)

      expect(currency).toEqual(
        expect.objectContaining({
          code,
        })
      )
    })

    it("should throw an error when currency with code does not exist", async () => {
      let error

      try {
        await service.retrieve("does-not-exist")
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
        await service.retrieve(undefined as unknown as string)
      } catch (e) {
        error = e
      }

      expect(error.message).toEqual('"currencyCode" must be defined')
    })

    it("should return currency based on config select param", async () => {
      const currency = await service.retrieve(code, {
        select: ["code", "name"],
      })

      const serialized = JSON.parse(JSON.stringify(currency))

      expect(serialized).toEqual({
        code,
        name,
      })
    })
  })

  describe("delete", () => {
    const code = "USD"

    it("should delete the currencies given an code successfully", async () => {
      await service.delete([code])

      const currencies = await service.list({
        code: [code],
      })

      expect(currencies).toHaveLength(0)
    })
  })

  describe("update", () => {
    const code = "USD"

    it("should update the name of the currency successfully", async () => {
      await service.update([
        {
          code,
          name: "United States Pounds",
        },
      ])

      const currency = await service.retrieve(code)

      expect(currency.name).toEqual("United States Pounds")
    })

    it("should throw an error when a code does not exist", async () => {
      let error

      try {
        await service.update([
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

  describe("create", () => {
    it("should create a currency successfully", async () => {
      await service.create([
        {
          code: "TES",
          name: "Test Dollars",
          symbol: "TES1",
          symbol_native: "TES2",
        },
      ])

      const [currency] = await service.list({
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

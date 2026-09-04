import { asValue } from "@medusajs/deps/awilix"
import { createMedusaContainer } from "@medusajs/utils"
import { defaultCurrencies } from "@medusajs/framework/utils"
import initialDataLoader from "../initial-data"

describe("initial-data loader", () => {
  let container
  let rows: Map<string, any>
  let calls: { list: number; create: number; upsert: number }

  const logger = {
    debug: jest.fn(),
    warn: jest.fn(),
  }

  const makeCurrencyService = () => ({
    list: jest.fn(async (filters: any = {}) => {
      calls.list++
      const all = [...rows.values()]
      if (!filters?.code) {
        return all
      }
      const wanted = new Set(filters.code)
      return all.filter((r) => wanted.has(r.code))
    }),
    create: jest.fn(async (data: any) => {
      calls.create++
      const arr = Array.isArray(data) ? data : [data]
      arr.forEach((d) => rows.set(d.code, { ...d }))
      return arr
    }),
    upsert: jest.fn(async (data: any) => {
      calls.upsert++
      const arr = Array.isArray(data) ? data : [data]
      arr.forEach((d) => rows.set(d.code, { ...d }))
      return arr
    }),
  })

  const run = () => initialDataLoader({ container, options: {} } as any)

  beforeEach(() => {
    rows = new Map()
    calls = { list: 0, create: 0, upsert: 0 }
    container = createMedusaContainer()
    container.register({
      logger: asValue(logger),
      currencyModuleService: asValue({
        currencyService_: makeCurrencyService(),
      }),
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("seeds every default currency on a fresh database", async () => {
    await run()

    expect(rows.size).toEqual(Object.keys(defaultCurrencies).length)
    expect(calls.create).toEqual(1)
  })

  it("normalizes currency codes to lower case", async () => {
    await run()

    expect([...rows.keys()].every((code) => code === code.toLowerCase())).toBe(
      true
    )
  })

  it("does not write anything when all currencies are already seeded", async () => {
    await run()
    const createsAfterSeed = calls.create

    await run()

    expect(calls.create).toEqual(createsAfterSeed)
  })

  it("never overwrites existing rows, preserving user edits to `name`", async () => {
    await run()

    // Simulate a user renaming a currency through /admin/currencies
    rows.set("dkk", { ...rows.get("dkk"), name: "Danish Kroner" })

    await run()

    expect(rows.get("dkk").name).toEqual("Danish Kroner")
  })

  it("inserts only the missing currencies, leaving the others untouched", async () => {
    rows.set("usd", {
      code: "usd",
      symbol: "$",
      symbol_native: "$",
      name: "Dollaro USA",
      decimal_digits: 2,
      rounding: 0,
    })

    await run()

    expect(rows.size).toEqual(Object.keys(defaultCurrencies).length)
    expect(rows.get("usd").name).toEqual("Dollaro USA")
  })
})

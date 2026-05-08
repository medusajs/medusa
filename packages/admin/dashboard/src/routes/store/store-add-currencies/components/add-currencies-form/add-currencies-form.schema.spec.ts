import { describe, expect, it } from "vitest"

import { AddCurrenciesSchema } from "./add-currencies-form.schema"

describe("AddCurrenciesSchema", () => {
  it("allows saving without selecting new currencies", () => {
    expect(() =>
      AddCurrenciesSchema.parse({
        currencies: [],
        pricePreferences: {
          eur: true,
        },
      })
    ).not.toThrow()
  })

  it("accepts selected currencies", () => {
    expect(
      AddCurrenciesSchema.parse({
        currencies: ["usd"],
        pricePreferences: {
          usd: false,
        },
      })
    ).toEqual({
      currencies: ["usd"],
      pricePreferences: {
        usd: false,
      },
    })
  })
})

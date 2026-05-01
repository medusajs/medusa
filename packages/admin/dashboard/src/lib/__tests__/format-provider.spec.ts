import { describe, expect, it } from "vitest"

import { formatProvider } from "../format-provider"

describe("formatProvider", () => {
  it("formats a typical Medusa provider id", () => {
    expect(formatProvider("pp_stripe-blik_dkk")).toBe("Stripe Blik (DKK)")
  })

  it("returns the raw id when there is no second underscore segment (no throw)", () => {
    expect(formatProvider("manual")).toBe("manual")
    expect(formatProvider("stripe")).toBe("stripe")
  })

  it("returns empty string for nullish or empty input", () => {
    expect(formatProvider("")).toBe("")
    expect(formatProvider(null as unknown as string)).toBe("")
    expect(formatProvider(undefined as unknown as string)).toBe("")
  })

  it("returns the raw id when the name segment is empty", () => {
    expect(formatProvider("pp_")).toBe("pp_")
    expect(formatProvider("pp__usd")).toBe("pp__usd")
  })

  it("handles id with type segment after provider name", () => {
    expect(formatProvider("pp_system_default")).toBe("System (DEFAULT)")
  })
})

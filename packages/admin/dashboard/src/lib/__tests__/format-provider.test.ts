import { describe, expect, it } from "vitest"
import { formatProvider } from "../format-provider"

describe("formatProvider", () => {
  it("formats a standard provider ID", () => {
    expect(formatProvider("pp_stripe_usd")).toBe("Stripe (USD)")
  })

  it("formats a provider ID with hyphenated name", () => {
    expect(formatProvider("pp_stripe-blik_dkk")).toBe("Stripe Blik (DKK)")
  })

  it("formats a provider ID with no suffix", () => {
    expect(formatProvider("pp_stripe")).toBe("Stripe")
  })

  it("does not crash on 'manual' (no underscores)", () => {
    expect(formatProvider("manual")).toBe("Manual")
  })

  it("does not crash on 'system' (no underscores)", () => {
    expect(formatProvider("system")).toBe("System")
  })
})

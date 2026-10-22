import { describe, expect, it } from "vitest"
import { formatProvider } from "../format-provider"

describe("formatProvider", () => {
  it("formats the provider name and its type", () => {
    expect(formatProvider("pp_stripe-blik_dkk")).toBe("Stripe Blik (DKK)")
    expect(formatProvider("pp_system_default")).toBe("System (DEFAULT)")
  })

  it("formats a provider without a type", () => {
    expect(formatProvider("manual_manual")).toBe("Manual")
  })

  it("keeps identifiers that contain underscores intact", () => {
    expect(formatProvider("pp_medusa-payments_acct_1S8eRlDAQUIGJhSY")).toBe(
      "Medusa Payments (acct_1S8eRlDAQUIGJhSY)"
    )
  })

  it("returns IDs that don't follow the provider format as they are", () => {
    expect(formatProvider("custom")).toBe("custom")
  })
})

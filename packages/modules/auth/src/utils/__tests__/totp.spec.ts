import { generateTotpCode, verifyTotpCode } from "../totp"

describe("TOTP utilities", () => {
  const secret = "GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ"

  it("generates RFC 6238 compatible SHA1 codes", () => {
    expect(
      generateTotpCode({
        secret,
        digits: 8,
        timestamp: 59_000,
      })
    ).toBe("94287082")

    expect(
      generateTotpCode({
        secret,
        digits: 8,
        timestamp: 1_111_111_109_000,
      })
    ).toBe("07081804")
  })

  it("verifies codes inside the configured window", () => {
    const code = generateTotpCode({
      secret,
      digits: 8,
      timestamp: 59_000,
    })

    expect(
      verifyTotpCode({
        secret,
        code,
        digits: 8,
        timestamp: 89_000,
        window: 1,
      })
    ).toBe(true)

    expect(
      verifyTotpCode({
        secret,
        code,
        digits: 8,
        timestamp: 119_000,
        window: 1,
      })
    ).toBe(false)
  })
})

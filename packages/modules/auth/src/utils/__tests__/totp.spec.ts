import { generateTotpCode, generateTotpUri, verifyTotpCode } from "../totp"

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

  it("percent-encodes the otpauth issuer and label", () => {
    const uri = generateTotpUri({
      issuer: "Medusa Cloud",
      accountName: "test@example.com",
      secret,
    })

    expect(uri).toContain("otpauth://totp/Medusa%20Cloud:test%40example.com")
    expect(uri).toContain("issuer=Medusa%20Cloud")
    expect(uri).not.toContain("Medusa+Cloud")
  })
})

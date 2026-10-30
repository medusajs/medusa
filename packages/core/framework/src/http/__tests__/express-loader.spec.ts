import { isHealthCheck, resolveSessionCookieSecurity } from "../express-loader"
import { MedusaRequest } from "../types"

describe("resolveSessionCookieSecurity", () => {
  it("returns insecure, no SameSite outside of production/staging", () => {
    expect(
      resolveSessionCookieSecurity({ isProduction: false, isStaging: false })
    ).toEqual({ sameSite: false, secure: false })
  })

  it("returns sameSite=lax + secure in production", () => {
    expect(
      resolveSessionCookieSecurity({ isProduction: true, isStaging: false })
    ).toEqual({ sameSite: "lax", secure: true })
  })

  it("returns sameSite=lax + secure in staging", () => {
    expect(
      resolveSessionCookieSecurity({ isProduction: false, isStaging: true })
    ).toEqual({ sameSite: "lax", secure: true })
  })

  it("never returns sameSite=none — that would allow cross-site cookies on POST and reintroduce CSRF", () => {
    const envs = [
      { isProduction: true, isStaging: false },
      { isProduction: false, isStaging: true },
      { isProduction: true, isStaging: true },
      { isProduction: false, isStaging: false },
    ]

    for (const env of envs) {
      const { sameSite } = resolveSessionCookieSecurity(env)
      expect(sameSite).not.toBe("none")
    }
  })
})

describe("isHealthCheck", () => {
  it("matches the root health endpoint", () => {
    expect(isHealthCheck({ originalUrl: "/health" } as MedusaRequest)).toBe(
      true
    )
  })

  it("ignores the query string", () => {
    expect(
      isHealthCheck({ originalUrl: "/health?foo=bar" } as MedusaRequest)
    ).toBe(true)
  })

  it("does not match health paths under a mounted namespace", () => {
    for (const originalUrl of [
      "/admin/health",
      "/store/health",
      "/auth/health",
    ]) {
      expect(isHealthCheck({ originalUrl } as MedusaRequest)).toBe(false)
    }
  })
})

import express from "express"
import { AddressInfo } from "net"
import { HttpSecurityHeadersOptions } from "../../config"
import {
  applySecurityHeaders,
  isHealthCheck,
  resolveSessionCookieSecurity,
} from "../express-loader"
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

describe("applySecurityHeaders", () => {
  async function getHeaders(options?: HttpSecurityHeadersOptions) {
    const app = express()
    applySecurityHeaders(app, options)
    app.get("/", (_req, res) => {
      res.json({})
    })

    const server = app.listen(0)
    try {
      const { port } = server.address() as AddressInfo
      const response = await fetch(`http://127.0.0.1:${port}/`)
      return response.headers
    } finally {
      server.close()
    }
  }

  it("sets security headers and hides the X-Powered-By header", async () => {
    const headers = await getHeaders()

    expect(headers.get("x-powered-by")).toBeNull()
    expect(headers.get("x-content-type-options")).toBe("nosniff")
    expect(headers.get("x-frame-options")).toBe("SAMEORIGIN")
    expect(headers.get("content-security-policy")).toBe(
      "frame-ancestors 'self'"
    )
  })

  it("allows the configured frame ancestors and drops X-Frame-Options", async () => {
    const headers = await getHeaders({
      frameAncestors: ["'self'", "https://dashboard.example.com"],
    })

    expect(headers.get("x-frame-options")).toBeNull()
    expect(headers.get("content-security-policy")).toBe(
      "frame-ancestors 'self' https://dashboard.example.com"
    )
  })

  it("skips the security headers when disabled", async () => {
    const headers = await getHeaders({ enabled: false })

    expect(headers.get("x-powered-by")).toBeNull()
    expect(headers.get("x-content-type-options")).toBeNull()
    expect(headers.get("x-frame-options")).toBeNull()
    expect(headers.get("content-security-policy")).toBeNull()
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

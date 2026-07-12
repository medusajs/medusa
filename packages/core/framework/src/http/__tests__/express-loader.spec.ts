import { resolveSessionCookieSecurity, registerCompressionIfEnabled } from "../express-loader"
import compression from "compression"
import { shouldCompressResponse } from "../utils/http-compression"

jest.mock("compression", () => {
  const mockCompression = jest.fn(() => "mockCompressionMiddleware")
  return mockCompression
})

jest.mock("../utils/http-compression", () => ({
  shouldCompressResponse: jest.fn(),
  compressionOptions: jest.fn(),
}))

const { compressionOptions } = jest.requireMock("../utils/http-compression") as {
  compressionOptions: jest.Mock
}

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

describe("registerCompressionIfEnabled", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("registers the compression middleware when compression is enabled in config", () => {
    const mockApp = { use: jest.fn() } as any

    compressionOptions.mockReturnValue({
      enabled: true,
      level: 6,
      memLevel: 8,
      threshold: 1024,
    })

    registerCompressionIfEnabled(mockApp, {
      projectConfig: { http: { compression: { enabled: true } } },
    })

    expect(compression).toHaveBeenCalledWith({
      enabled: true,
      level: 6,
      memLevel: 8,
      threshold: 1024,
      filter: shouldCompressResponse,
    })
    expect(mockApp.use).toHaveBeenCalledWith("mockCompressionMiddleware")
  })

  it("does NOT register compression middleware when compression is disabled", () => {
    const mockApp = { use: jest.fn() } as any

    compressionOptions.mockReturnValue({
      enabled: false,
    })

    registerCompressionIfEnabled(mockApp, {
      projectConfig: { http: {} },
    })

    expect(compression).not.toHaveBeenCalled()
    expect(mockApp.use).not.toHaveBeenCalled()
  })

  it("does NOT register compression middleware when config is missing entirely", () => {
    const mockApp = { use: jest.fn() } as any

    compressionOptions.mockReturnValue({
      enabled: false,
    })

    registerCompressionIfEnabled(mockApp, {
      projectConfig: {},
    })

    expect(compression).not.toHaveBeenCalled()
    expect(mockApp.use).not.toHaveBeenCalled()
  })
})

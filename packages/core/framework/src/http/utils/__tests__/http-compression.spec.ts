import { compressionOptions, shouldCompressResponse } from "../http-compression"

describe("compressionOptions", () => {
  it("applies the documented defaults when compression is not configured", () => {
    expect(compressionOptions({ http: {} } as any)).toEqual({
      enabled: false,
      level: 6,
      memLevel: 8,
      threshold: 1024,
    })
  })

  it("keeps the values provided by the user", () => {
    const config = {
      http: {
        compression: {
          enabled: true,
          level: 9,
          memLevel: 9,
          threshold: "2kb",
        },
      },
    } as any

    expect(compressionOptions(config)).toEqual({
      enabled: true,
      level: 9,
      memLevel: 9,
      threshold: "2kb",
    })
  })
})

describe("shouldCompressResponse", () => {
  const makeReq = (compression: any, headers: Record<string, any> = {}) =>
    ({
      headers,
      scope: {
        resolve: () => ({ projectConfig: { http: { compression } } }),
      },
    } as any)

  it("does not compress when compression is disabled", () => {
    const req = makeReq({ enabled: false })
    expect(shouldCompressResponse(req, {} as any)).toBe(false)
  })

  it("does not compress when the x-no-compression header is set", () => {
    const req = makeReq({ enabled: true }, { "x-no-compression": "1" })
    expect(shouldCompressResponse(req, {} as any)).toBe(false)
  })
})

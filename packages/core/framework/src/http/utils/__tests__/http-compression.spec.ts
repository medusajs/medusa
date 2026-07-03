import compression from "compression"
import { compressionOptions, shouldCompressResponse } from "../http-compression"

describe("compressionOptions", () => {
  it("defaults to disabled with standard compression library defaults", () => {
    const config: any = { http: {} }

    expect(compressionOptions(config)).toEqual({
      enabled: false,
      level: 6,
      memLevel: 8,
      threshold: 1024,
    })
  })

  it("respects an explicit enabled: true", () => {
    const config: any = { http: { compression: { enabled: true } } }

    expect(compressionOptions(config).enabled).toBe(true)
  })

  it("respects custom level/memLevel/threshold overrides", () => {
    const config: any = {
      http: {
        compression: {
          enabled: true,
          level: 9,
          memLevel: 4,
          threshold: 0,
        },
      },
    }

    expect(compressionOptions(config)).toEqual({
      enabled: true,
      level: 9,
      memLevel: 4,
      threshold: 0,
    })
  })

  it("fills in defaults for any options left unset", () => {
    const config: any = {
      http: { compression: { enabled: true, threshold: 0 } },
    }

    expect(compressionOptions(config)).toEqual({
      enabled: true,
      level: 6,
      memLevel: 8,
      threshold: 0,
    })
  })
})

describe("shouldCompressResponse", () => {
  const buildReq = (projectConfig: any, headers: Record<string, string> = {}) =>
    ({
      headers,
      scope: {
        resolve: jest.fn().mockReturnValue({ projectConfig }),
      },
    } as any)

  const res = {} as any

  it("returns false when compression is disabled", () => {
    const req = buildReq({ http: {} })

    expect(shouldCompressResponse(req, res)).toBe(false)
  })

  it("returns false when the x-no-compression header is set, even if enabled", () => {
    const req = buildReq(
      { http: { compression: { enabled: true } } },
      { "x-no-compression": "1" }
    )

    expect(shouldCompressResponse(req, res)).toBe(false)
  })

  it("delegates to compression.filter when enabled and no opt-out header is present", () => {
    const filterSpy = jest.spyOn(compression, "filter").mockReturnValue(true)

    const req = buildReq({ http: { compression: { enabled: true } } })

    expect(shouldCompressResponse(req, res)).toBe(true)
    expect(filterSpy).toHaveBeenCalledWith(req, res)

    filterSpy.mockRestore()
  })

  it("returns false when enabled but compression.filter rejects the response", () => {
    const filterSpy = jest.spyOn(compression, "filter").mockReturnValue(false)

    const req = buildReq({ http: { compression: { enabled: true } } })

    expect(shouldCompressResponse(req, res)).toBe(false)

    filterSpy.mockRestore()
  })
})

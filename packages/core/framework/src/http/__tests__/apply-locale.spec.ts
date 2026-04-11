import { MedusaRequest, MedusaResponse } from "../types"
import { applyLocale } from "../middlewares/apply-locale"
import { MedusaContainer } from "@medusajs/types"

describe("applyLocale", () => {
  let mockRequest: Partial<MedusaRequest>
  let mockResponse: MedusaResponse
  let nextFunction: jest.Mock

  beforeEach(() => {
    mockRequest = {
      query: {},
      get: jest.fn(),
      scope: {
        resolve: jest.fn().mockReturnValue({
          graph: jest.fn().mockResolvedValue({
            data: [{ supported_locales: [{ locale_code: "en-US" }] }],
          }),
        }),
      } as unknown as MedusaContainer,
    }
    mockResponse = {} as MedusaResponse
    nextFunction = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("should set locale from query parameter", async () => {
    mockRequest.query = { locale: "en-US" }

    await applyLocale(mockRequest as MedusaRequest, mockResponse, nextFunction)

    expect(mockRequest.locale).toBe("en-US")
    expect(nextFunction).toHaveBeenCalledTimes(1)
  })

  it("should set locale from x-medusa-locale header when query param is not present", async () => {
    mockRequest.query = {}
    ;(mockRequest.get as jest.Mock).mockImplementation((header: string) => {
      if (header === "x-medusa-locale") {
        return "fr-FR"
      }
      return undefined
    })

    await applyLocale(mockRequest as MedusaRequest, mockResponse, nextFunction)

    expect(mockRequest.locale).toBe("fr-FR")
    expect(nextFunction).toHaveBeenCalledTimes(1)
  })

  it("should prioritize query parameter over x-medusa-locale header", async () => {
    mockRequest.query = { locale: "de-DE" }
    ;(mockRequest.get as jest.Mock).mockImplementation((header: string) => {
      if (header === "x-medusa-locale") {
        return "fr-FR"
      }
      return undefined
    })

    await applyLocale(mockRequest as MedusaRequest, mockResponse, nextFunction)

    expect(mockRequest.locale).toBe("de-DE")
    expect(mockRequest.get).not.toHaveBeenCalled()
    expect(nextFunction).toHaveBeenCalledTimes(1)
  })

  it("should not set locale when neither query param nor header is present", async () => {
    mockRequest.query = {}
    ;(mockRequest.get as jest.Mock).mockReturnValue(undefined)

    await applyLocale(mockRequest as MedusaRequest, mockResponse, nextFunction)

    expect(mockRequest.locale).toBeUndefined()
    expect(nextFunction).toHaveBeenCalledTimes(1)
  })

  it("should handle empty string in query parameter", async () => {
    mockRequest.query = { locale: "" }
    ;(mockRequest.get as jest.Mock).mockImplementation((header: string) => {
      if (header === "x-medusa-locale") {
        return "es-ES"
      }
      return undefined
    })

    await applyLocale(mockRequest as MedusaRequest, mockResponse, nextFunction)

    // Empty string is falsy, so it should fall back to header
    expect(mockRequest.locale).toBe("es-ES")
    expect(nextFunction).toHaveBeenCalledTimes(1)
  })

  it("should handle various locale formats", async () => {
    const locales = ["en", "en-US", "zh-Hans-CN", "pt-BR"]

    for (const locale of locales) {
      mockRequest.query = { locale }
      mockRequest.locale = undefined

      await applyLocale(
        mockRequest as MedusaRequest,
        mockResponse,
        nextFunction
      )

      expect(mockRequest.locale).toBe(locale)
    }
  })
})

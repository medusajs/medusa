import initialDataLoader from "../initial-data"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

describe("Currency initial-data loader", () => {
  let mockLogger: any
  let mockCurrencyService: any
  let mockContainer: any

  beforeEach(() => {
    mockLogger = {
      debug: jest.fn(),
      warn: jest.fn(),
      info: jest.fn(),
      error: jest.fn(),
    }

    mockCurrencyService = {
      list: jest.fn(),
      create: jest.fn(),
      upsert: jest.fn(),
    }

    mockContainer = {
      resolve: jest.fn((key: string) => {
        if (key === ContainerRegistrationKeys.LOGGER) {
          return mockLogger
        }
        if (key === "currencyModuleService") {
          return { currencyService_: mockCurrencyService }
        }
        return undefined
      }),
    }
  })

  it("should create only missing currencies and preserve existing currencies", async () => {
    // Simulate existing currency 'usd' with a modified name
    mockCurrencyService.list.mockResolvedValue([
      { code: "usd", name: "Custom USD Name" },
    ])
    mockCurrencyService.create.mockResolvedValue([])

    await initialDataLoader({
      container: mockContainer,
      options: {} as any,
    })

    expect(mockCurrencyService.list).toHaveBeenCalledWith(
      expect.objectContaining({
        code: expect.arrayContaining(["usd", "eur", "dkk"]),
      }),
      { select: ["code"] }
    )

    expect(mockCurrencyService.create).toHaveBeenCalled()
    const createdCurrencies = mockCurrencyService.create.mock.calls[0][0]
    
    // 'usd' was already present, so it should not be in the create list
    const createdCodes = createdCurrencies.map((c: any) => c.code)
    expect(createdCodes).not.toContain("usd")
    expect(createdCodes).toContain("eur")
    expect(createdCodes).toContain("dkk")
  })

  it("should not call create if all currencies already exist", async () => {
    mockCurrencyService.list.mockImplementation((filters: any) => {
      return filters.code.map((c: string) => ({ code: c }))
    })

    await initialDataLoader({
      container: mockContainer,
      options: {} as any,
    })

    expect(mockCurrencyService.create).not.toHaveBeenCalled()
  })
})

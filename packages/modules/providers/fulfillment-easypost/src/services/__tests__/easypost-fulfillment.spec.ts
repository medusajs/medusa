import { Logger } from "@medusajs/framework/types"
import { CalculateShippingOptionPriceContext } from "@medusajs/types"
import { EasyPostClient } from "../../core/easypost-client"
import { EasyPostFulfillmentService } from "../easypost-fulfillment"

// These tests hit the real EasyPost test-mode API (no mocking) for the
// "happy path" test, same as `easypost-client.spec.ts`, and so can
// occasionally hit this sandbox's documented network flakiness connecting
// to api.easypost.com (see Task 1's report) -- not a defect in this file.
const REAL_API_TEST_TIMEOUT_MS = 30_000

const fakeLogger: Logger = {
  panic: jest.fn(),
  shouldLog: jest.fn(),
  setLogLevel: jest.fn(),
  unsetLogLevel: jest.fn(),
  activity: jest.fn(),
  progress: jest.fn(),
  error: jest.fn(),
  failure: jest.fn(),
  success: jest.fn(),
  silly: jest.fn(),
  debug: jest.fn(),
  verbose: jest.fn(),
  http: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  log: jest.fn(),
}

const defaultParcel = { weight: 16, length: 10, width: 8, height: 4 }

describe("EasyPostFulfillmentService", () => {
  test(
    "getFulfillmentOptions returns one option per carrier+service this account's rates actually quote",
    async () => {
      const service = new EasyPostFulfillmentService(
        { logger: fakeLogger },
        { apiKey: process.env.EASYPOST_API_KEY!, defaultParcel }
      )
      const options = await service.getFulfillmentOptions()

      expect(options.length).toBeGreaterThan(0)
      // Every option's id must be parseable back into a carrier+service this
      // provider actually knows about -- not an arbitrary opaque string.
      for (const option of options) {
        expect(option.id).toMatch(/^\w+:\w+$/)
      }
    },
    REAL_API_TEST_TIMEOUT_MS
  )

  test("getFulfillmentOptions returns an empty list, not an error, when the representative shipment quotes no rates", async () => {
    const fakeClient = {
      createShipment: async () => ({ id: "shp_fake", rates: [] }),
    } as unknown as EasyPostClient
    const service = new EasyPostFulfillmentService(
      { logger: fakeLogger },
      { apiKey: "unused", defaultParcel, client: fakeClient }
    )

    const options = await service.getFulfillmentOptions()

    expect(options).toEqual([])
  })

  test("getFulfillmentOptions skips carriers this provider doesn't model, without throwing", async () => {
    const fakeClient = {
      createShipment: async () => ({
        id: "shp_fake",
        rates: [
          {
            id: "rate_1",
            carrier: "USPS",
            service: "Priority",
            rate: "8.01",
            currency: "USD",
          },
          {
            id: "rate_2",
            carrier: "SomeUnmappedCarrier",
            service: "Unknown",
            rate: "1.00",
            currency: "USD",
          },
        ],
      }),
    } as unknown as EasyPostClient
    const service = new EasyPostFulfillmentService(
      { logger: fakeLogger },
      { apiKey: "unused", defaultParcel, client: fakeClient }
    )

    const options = await service.getFulfillmentOptions()

    expect(options).toEqual([
      {
        id: "USPS:Priority",
        name: "USPS Priority",
        carrier: "USPS",
        service: "Priority",
      },
    ])
    expect(fakeLogger.warn).toHaveBeenCalledWith(
      expect.stringContaining("SomeUnmappedCarrier")
    )
  })

  describe("canCalculate", () => {
    test("returns true for any option whose nested data.id matches this provider's carrier:service id shape", async () => {
      const service = new EasyPostFulfillmentService(
        { logger: fakeLogger },
        { apiKey: "unused", defaultParcel }
      )

      // `canCalculate` receives the *whole* shipping-option-creation DTO --
      // the id to check lives on its nested `data` property, not on `data`
      // itself.
      expect(
        await service.canCalculate({
          data: { id: "UspsAccount:Priority" },
        } as any)
      ).toBe(true)
    })

    test("returns false when the nested data.id is missing or doesn't match the carrier:service shape", async () => {
      const service = new EasyPostFulfillmentService(
        { logger: fakeLogger },
        { apiKey: "unused", defaultParcel }
      )

      expect(await service.canCalculate({ data: {} } as any)).toBe(false)
      expect(
        await service.canCalculate({ data: { id: "no-colon-here" } } as any)
      ).toBe(false)
      expect(await service.canCalculate({} as any)).toBe(false)
    })
  })

  describe("validateOption", () => {
    test("returns true for data whose own id matches the carrier:service id shape (no nesting, unlike canCalculate)", async () => {
      const service = new EasyPostFulfillmentService(
        { logger: fakeLogger },
        { apiKey: "unused", defaultParcel }
      )

      expect(await service.validateOption({ id: "USPS:Priority" } as any)).toBe(
        true
      )
    })

    test("returns false when data.id doesn't match the carrier:service shape", async () => {
      const service = new EasyPostFulfillmentService(
        { logger: fakeLogger },
        { apiKey: "unused", defaultParcel }
      )

      expect(await service.validateOption({} as any)).toBe(false)
      expect(await service.validateOption({ id: "no-colon-here" } as any)).toBe(
        false
      )
    })
  })

  describe("calculatePrice", () => {
    const validContextFixture = {
      id: "cart_test",
      shipping_address: {
        address_1: "417 montgomery st",
        city: "San Francisco",
        province: "CA",
        postal_code: "94104",
        country_code: "us",
      },
      from_location: {
        address: {
          address_1: "118 2nd street",
          city: "San Francisco",
          province: "CA",
          postal_code: "94105",
          country_code: "us",
        },
      },
      items: [
        {
          quantity: 1,
          variant: { weight: 16, length: 10, width: 8, height: 4 },
        },
      ],
    } as unknown as CalculateShippingOptionPriceContext

    test(
      "returns a real EasyPost rate for the cart's real destination and parcel",
      async () => {
        const service = new EasyPostFulfillmentService(
          { logger: fakeLogger },
          { apiKey: process.env.EASYPOST_API_KEY!, defaultParcel }
        )

        const price = await service.calculatePrice(
          { carrier: "USPS", service: "Priority" },
          {},
          validContextFixture
        )

        expect(price.calculated_amount).toBeGreaterThan(0)
        expect(price.is_calculated_price_tax_inclusive).toBe(false)
      },
      REAL_API_TEST_TIMEOUT_MS
    )

    test(
      "throws a clear error when EasyPost's rates for this shipment don't include the requested carrier+service",
      async () => {
        const service = new EasyPostFulfillmentService(
          { logger: fakeLogger },
          { apiKey: process.env.EASYPOST_API_KEY!, defaultParcel }
        )

        await expect(
          service.calculatePrice(
            { carrier: "NotARealCarrier", service: "Fake" },
            {},
            validContextFixture
          )
        ).rejects.toThrow(/NotARealCarrier/)
      },
      REAL_API_TEST_TIMEOUT_MS
    )

    test("throws a clear error when the destination address is incomplete", async () => {
      const service = new EasyPostFulfillmentService(
        { logger: fakeLogger },
        { apiKey: "unused", defaultParcel }
      )

      const context = {
        ...validContextFixture,
        shipping_address: { city: "San Francisco" },
      } as unknown as CalculateShippingOptionPriceContext

      await expect(
        service.calculatePrice(
          { carrier: "USPS", service: "Priority" },
          {},
          context
        )
      ).rejects.toThrow()
    })
  })
})

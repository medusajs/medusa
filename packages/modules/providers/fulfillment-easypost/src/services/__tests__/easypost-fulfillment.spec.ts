import { Logger } from "@medusajs/framework/types"
import { MedusaError } from "@medusajs/framework/utils"
import { CalculateShippingOptionPriceContext } from "@medusajs/types"
import { EasyPostClient } from "../../core/easypost-client"
import { EasyPostFulfillmentService } from "../easypost-fulfillment"

// These tests hit the real EasyPost test-mode API (no mocking) for the
// "happy path" test, same as `easypost-client.spec.ts`, and so can
// occasionally hit this sandbox's documented network flakiness connecting
// to api.easypost.com (see Task 1's report) -- not a defect in this file.
const REAL_API_TEST_TIMEOUT_MS = 30_000

// Real-API tests only run when an EasyPost (test-mode) API key is provided.
// CI has no EASYPOST_API_KEY, and the SDK's constructor throws without one,
// so these are skipped -- not failed -- there. The fake-client tests below
// are deterministic and stay on unconditionally: they are what protects
// this provider in CI.
const realApiTest = process.env.EASYPOST_API_KEY ? test : test.skip

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

/**
 * A shipment as `EasyPostClient.retrieveShipment` returns it for a shipment
 * `validateFulfillmentData` created at checkout time -- addresses in the
 * shape EasyPost stores them (country upper-cased, missing fields `null`).
 */
function persistedShipment(
  overrides: Partial<{ id: string; purchased: boolean }> = {}
) {
  return {
    id: "shp_persisted",
    rates: [
      {
        id: "rate_persisted",
        carrier: "USPS",
        service: "Priority",
        rate: "8.01",
        currency: "USD",
        deliveryDays: 2,
      },
    ],
    toAddress: {
      name: "Test Buyer",
      company: null,
      street1: "417 montgomery st",
      street2: null,
      city: "San Francisco",
      state: "CA",
      zip: "94104",
      country: "US",
    },
    fromAddress: {
      name: null,
      street1: "118 2nd street",
      street2: null,
      city: "San Francisco",
      state: "CA",
      zip: "94105",
      country: "US",
    },
    parcel: { ...defaultParcel },
    purchased: false,
    ...overrides,
  }
}

describe("EasyPostFulfillmentService", () => {
  realApiTest(
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

    realApiTest(
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

    test("returns the configured fallback price, without throwing, when EasyPost's rates don't include the requested carrier+service", async () => {
      // This is the routine "this carrier doesn't reach this destination"
      // case, not an error -- calculatePrice calls for every option on a
      // cart are batched through core's `promiseAll`, which re-throws the
      // first rejection and would fail the WHOLE cart's shipping options
      // over just this one unquotable option. So this case must resolve,
      // not reject.
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
          ],
        }),
      } as unknown as EasyPostClient
      const service = new EasyPostFulfillmentService(
        { logger: fakeLogger },
        {
          apiKey: "unused",
          defaultParcel,
          unquotableFallbackPrice: 123456,
          client: fakeClient,
        }
      )

      const price = await service.calculatePrice(
        { carrier: "NotARealCarrier", service: "Fake" },
        {},
        validContextFixture
      )

      expect(price).toEqual({
        calculated_amount: 123456,
        is_calculated_price_tax_inclusive: false,
      })
      expect(fakeLogger.warn).toHaveBeenCalledWith(
        expect.stringContaining("NotARealCarrier")
      )
    })

    test("uses the default fallback price when unquotableFallbackPrice isn't configured", async () => {
      const fakeClient = {
        createShipment: async () => ({ id: "shp_fake", rates: [] }),
      } as unknown as EasyPostClient
      const service = new EasyPostFulfillmentService(
        { logger: fakeLogger },
        { apiKey: "unused", defaultParcel, client: fakeClient }
      )

      const price = await service.calculatePrice(
        { carrier: "USPS", service: "Priority" },
        {},
        validContextFixture
      )

      expect(price.calculated_amount).toBe(999_999)
      expect(price.is_calculated_price_tax_inclusive).toBe(false)
    })

    test("still throws when the EasyPost API call itself fails (a genuine connectivity/auth failure, not just an unquotable rate)", async () => {
      const fakeClient = {
        createShipment: async () => {
          throw new Error("ECONNREFUSED: could not reach EasyPost")
        },
      } as unknown as EasyPostClient
      const service = new EasyPostFulfillmentService(
        { logger: fakeLogger },
        { apiKey: "unused", defaultParcel, client: fakeClient }
      )

      await expect(
        service.calculatePrice(
          { carrier: "USPS", service: "Priority" },
          {},
          validContextFixture
        )
      ).rejects.toThrow(/ECONNREFUSED/)
    })

    // Like "no matching rate": calculatePrice calls are batched through
    // core's `promiseAll`, so one stock location with an incomplete address
    // (e.g. test-project's seeded "European Warehouse", attached to the US
    // zone) must not throw and break shipping options for every cart.
    test("returns the fallback price, without throwing or calling EasyPost, when the from-address (stock location) is incomplete", async () => {
      const createShipment = jest.fn()
      const fakeClient = { createShipment } as unknown as EasyPostClient
      const service = new EasyPostFulfillmentService(
        { logger: fakeLogger },
        {
          apiKey: "unused",
          defaultParcel,
          unquotableFallbackPrice: 4242,
          client: fakeClient,
        }
      )

      const context = {
        ...validContextFixture,
        from_location: {
          address: {
            address_1: "",
            city: "Copenhagen",
            postal_code: "1000",
            country_code: "dk",
          },
        },
      } as unknown as CalculateShippingOptionPriceContext

      const price = await service.calculatePrice(
        { carrier: "USPS", service: "Priority" },
        {},
        context
      )

      expect(price).toEqual({
        calculated_amount: 4242,
        is_calculated_price_tax_inclusive: false,
      })
      expect(createShipment).not.toHaveBeenCalled()
      expect(fakeLogger.warn).toHaveBeenCalledWith(
        expect.stringMatching(/origin address.*address_1, province/)
      )
    })

    test("returns the default fallback price, without throwing, when the destination address is incomplete", async () => {
      const createShipment = jest.fn()
      const fakeClient = { createShipment } as unknown as EasyPostClient
      const service = new EasyPostFulfillmentService(
        { logger: fakeLogger },
        { apiKey: "unused", defaultParcel, client: fakeClient }
      )

      const context = {
        ...validContextFixture,
        shipping_address: { city: "San Francisco" },
      } as unknown as CalculateShippingOptionPriceContext

      const price = await service.calculatePrice(
        { carrier: "USPS", service: "Priority" },
        {},
        context
      )

      expect(price.calculated_amount).toBe(999_999)
      expect(createShipment).not.toHaveBeenCalled()
    })
  })

  describe("validateFulfillmentData", () => {
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

    realApiTest(
      "persists a real shipment id and matching rate id for later purchase",
      async () => {
        const service = new EasyPostFulfillmentService(
          { logger: fakeLogger },
          { apiKey: process.env.EASYPOST_API_KEY!, defaultParcel }
        )

        const result = await service.validateFulfillmentData(
          { carrier: "USPS", service: "Priority" },
          {},
          validContextFixture as any
        )

        expect(result.easypost_shipment_id).toMatch(/^shp_/)
        expect(result.easypost_rate_id).toBeDefined()
        expect(result.easypost_carrier).toBe("USPS")
        expect(result.easypost_service).toBe("Priority")
      },
      REAL_API_TEST_TIMEOUT_MS
    )

    test("merges the persisted ids onto the existing data object rather than replacing it", async () => {
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
          ],
        }),
      } as unknown as EasyPostClient
      const service = new EasyPostFulfillmentService(
        { logger: fakeLogger },
        { apiKey: "unused", defaultParcel, client: fakeClient }
      )

      const result = await service.validateFulfillmentData(
        { carrier: "USPS", service: "Priority" },
        { some_existing_field: "keep-me" },
        validContextFixture as any
      )

      expect(result).toEqual({
        some_existing_field: "keep-me",
        easypost_shipment_id: "shp_fake",
        easypost_rate_id: "rate_1",
        easypost_carrier: "USPS",
        easypost_service: "Priority",
      })
    })

    // Review Focus: unlike `calculatePrice`, this method throws -- it has no
    // sensible fake-data fallback, since its whole job is to persist the
    // REAL ids `createFulfillment` will later use to buy an actual label.
    realApiTest(
      "throws when EasyPost can't quote this carrier+service for the destination (Review Focus)",
      async () => {
        const service = new EasyPostFulfillmentService(
          { logger: fakeLogger },
          { apiKey: process.env.EASYPOST_API_KEY!, defaultParcel }
        )

        await expect(
          service.validateFulfillmentData(
            { carrier: "NotARealCarrier", service: "Fake" },
            {},
            validContextFixture as any
          )
        ).rejects.toThrow()
      },
      REAL_API_TEST_TIMEOUT_MS
    )

    test("the thrown error names the specific carrier+service that failed to quote", async () => {
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
          ],
        }),
      } as unknown as EasyPostClient
      const service = new EasyPostFulfillmentService(
        { logger: fakeLogger },
        { apiKey: "unused", defaultParcel, client: fakeClient }
      )

      await expect(
        service.validateFulfillmentData(
          { carrier: "NotARealCarrier", service: "Fake" },
          {},
          validContextFixture as any
        )
      ).rejects.toThrow(/NotARealCarrier.*Fake/)
    })

    test("still throws when the EasyPost API call itself fails", async () => {
      const fakeClient = {
        createShipment: async () => {
          throw new Error("ECONNREFUSED: could not reach EasyPost")
        },
      } as unknown as EasyPostClient
      const service = new EasyPostFulfillmentService(
        { logger: fakeLogger },
        { apiKey: "unused", defaultParcel, client: fakeClient }
      )

      await expect(
        service.validateFulfillmentData(
          { carrier: "USPS", service: "Priority" },
          {},
          validContextFixture as any
        )
      ).rejects.toThrow(/ECONNREFUSED/)
    })

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
        service.validateFulfillmentData(
          { carrier: "USPS", service: "Priority" },
          {},
          context as any
        )
      ).rejects.toThrow()
    })
  })

  describe("createFulfillment", () => {
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

    realApiTest(
      "buys the exact persisted rate and returns a tracking code + label",
      async () => {
        const service = new EasyPostFulfillmentService(
          { logger: fakeLogger },
          { apiKey: process.env.EASYPOST_API_KEY!, defaultParcel }
        )
        const validated = await service.validateFulfillmentData(
          { carrier: "USPS", service: "Priority" },
          {},
          validContextFixture as any
        )

        const result = await service.createFulfillment(
          validated,
          [],
          undefined,
          {} as any
        )

        expect(result.data.easypost_tracking_code).toBeDefined()
        expect(result.data.easypost_shipment_id).toBe(
          validated.easypost_shipment_id
        )
        expect(result.data.easypost_rate_id).toBe(validated.easypost_rate_id)
        expect(result.labels[0].tracking_number).toBe(
          result.data.easypost_tracking_code
        )
        expect(result.labels[0].label_url).toMatch(/^https?:\/\//)
        expect(result.labels[0].tracking_url).toMatch(/^https?:\/\//)
      },
      REAL_API_TEST_TIMEOUT_MS
    )

    realApiTest(
      "re-fulfilling an already-bought persisted shipment buys a fresh shipment instead of surfacing EasyPost's 422",
      async () => {
        const service = new EasyPostFulfillmentService(
          { logger: fakeLogger },
          { apiKey: process.env.EASYPOST_API_KEY!, defaultParcel }
        )
        const validated = await service.validateFulfillmentData(
          { carrier: "USPS", service: "Priority" },
          {},
          validContextFixture as any
        )

        // First buy succeeds against the persisted shipment itself.
        const first = await service.createFulfillment(
          validated,
          [],
          undefined,
          {} as any
        )
        expect(first.data.easypost_shipment_id).toBe(
          validated.easypost_shipment_id
        )

        // A second fulfillment from the same persisted data (split order /
        // re-fulfil after cancel) would get HTTP 422 SHIPMENT.POSTAGE.EXISTS
        // if bought as-is -- so it must re-shop a fresh shipment for the
        // same carrier+service instead.
        const second = await service.createFulfillment(
          validated,
          [],
          undefined,
          {} as any
        )
        expect(second.data.easypost_shipment_id).not.toBe(
          validated.easypost_shipment_id
        )
        expect(second.data.easypost_carrier).toBe("USPS")
        expect(second.data.easypost_service).toBe("Priority")
        expect(second.data.easypost_tracking_code).toBeDefined()
        expect(second.data.easypost_tracking_code).not.toBe(
          first.data.easypost_tracking_code
        )
      },
      REAL_API_TEST_TIMEOUT_MS * 3
    )

    test("throws a clear error when the persisted data is missing the shipment or rate id", async () => {
      const service = new EasyPostFulfillmentService(
        { logger: fakeLogger },
        { apiKey: "unused", defaultParcel }
      )

      await expect(
        service.createFulfillment({}, [], undefined, {} as any)
      ).rejects.toThrow(/easypost_shipment_id/)
    })

    test("maps a successful buyShipment result into the exact CreateFulfillmentResult shape", async () => {
      const fakeClient = {
        retrieveShipment: async (shipmentId: string) =>
          persistedShipment({ id: shipmentId }),
        buyShipment: jest.fn(async (shipmentId: string, rateId: string) => ({
          id: shipmentId,
          rates: [],
          trackingCode: "9400111899223197428490",
          labelUrl: "https://easypost-test.s3.amazonaws.com/label.png",
          trackerId: "trk_fake123",
          trackingUrl: "https://track.easypost.com/djE6dHJrX2Zha2Ux",
        })),
      } as unknown as EasyPostClient
      const service = new EasyPostFulfillmentService(
        { logger: fakeLogger },
        { apiKey: "unused", defaultParcel, client: fakeClient }
      )

      const result = await service.createFulfillment(
        {
          easypost_shipment_id: "shp_fake",
          easypost_rate_id: "rate_fake",
          easypost_carrier: "USPS",
          easypost_service: "Priority",
        },
        [],
        undefined,
        {} as any
      )

      expect(fakeClient.buyShipment).toHaveBeenCalledWith(
        "shp_fake",
        "rate_fake"
      )
      expect(result).toEqual({
        data: {
          easypost_shipment_id: "shp_fake",
          easypost_rate_id: "rate_fake",
          easypost_carrier: "USPS",
          easypost_service: "Priority",
          easypost_tracking_code: "9400111899223197428490",
          easypost_label_url:
            "https://easypost-test.s3.amazonaws.com/label.png",
          easypost_tracker_id: "trk_fake123",
        },
        labels: [
          {
            tracking_number: "9400111899223197428490",
            tracking_url: "https://track.easypost.com/djE6dHJrX2Zha2Ux",
            label_url: "https://easypost-test.s3.amazonaws.com/label.png",
          },
        ],
      })
    })

    test("still throws when the EasyPost API call itself fails", async () => {
      const fakeClient = {
        retrieveShipment: async (shipmentId: string) =>
          persistedShipment({ id: shipmentId }),
        buyShipment: async () => {
          throw new Error("ECONNREFUSED: could not reach EasyPost")
        },
      } as unknown as EasyPostClient
      const service = new EasyPostFulfillmentService(
        { logger: fakeLogger },
        { apiKey: "unused", defaultParcel, client: fakeClient }
      )

      await expect(
        service.createFulfillment(
          { easypost_shipment_id: "shp_fake", easypost_rate_id: "rate_fake" },
          [],
          undefined,
          {} as any
        )
      ).rejects.toThrow(/ECONNREFUSED/)
    })

    describe("stale or already-bought persisted shipments", () => {
      const persistedData = {
        easypost_shipment_id: "shp_persisted",
        easypost_rate_id: "rate_persisted",
        easypost_carrier: "USPS",
        easypost_service: "Priority",
      }

      // The fulfillment's resolved delivery address, in Medusa's own address
      // shape -- matches the persisted shipment's EasyPost to_address.
      const unchangedDeliveryAddress = {
        first_name: "Test",
        last_name: "Buyer",
        address_1: "417 montgomery st",
        city: "San Francisco",
        province: "CA",
        postal_code: "94104",
        country_code: "us",
      }

      const boughtResult = (shipmentId: string) => ({
        id: shipmentId,
        rates: [],
        trackingCode: `tracking-${shipmentId}`,
        labelUrl: "https://example.com/label.png",
        trackerId: "trk_fake",
        trackingUrl: "https://example.com/track",
      })

      const freshShipment = {
        id: "shp_fresh",
        rates: [
          {
            id: "rate_fresh_ups",
            carrier: "UPS",
            service: "Ground",
            rate: "9.00",
            currency: "USD",
          },
          {
            id: "rate_fresh",
            carrier: "USPS",
            service: "Priority",
            rate: "8.50",
            currency: "USD",
          },
        ],
      }

      const buildFakeClient = (
        retrieved: ReturnType<typeof persistedShipment>,
        overrides: Record<string, unknown> = {}
      ) =>
        ({
          retrieveShipment: jest.fn(async () => retrieved),
          createShipment: jest.fn(async () => freshShipment),
          buyShipment: jest.fn(async (shipmentId: string) =>
            boughtResult(shipmentId)
          ),
          ...overrides,
        } as unknown as EasyPostClient & {
          retrieveShipment: jest.Mock
          createShipment: jest.Mock
          buyShipment: jest.Mock
        })

      test("(a) buys the persisted shipment as-is when it is still valid and unpurchased", async () => {
        const fakeClient = buildFakeClient(persistedShipment())
        const service = new EasyPostFulfillmentService(
          { logger: fakeLogger },
          { apiKey: "unused", defaultParcel, client: fakeClient }
        )

        const result = await service.createFulfillment(
          persistedData,
          [],
          undefined,
          { delivery_address: unchangedDeliveryAddress } as any
        )

        expect(fakeClient.retrieveShipment).toHaveBeenCalledWith(
          "shp_persisted"
        )
        expect(fakeClient.createShipment).not.toHaveBeenCalled()
        expect(fakeClient.buyShipment).toHaveBeenCalledWith(
          "shp_persisted",
          "rate_persisted"
        )
        expect(result.data.easypost_shipment_id).toBe("shp_persisted")
        expect(result.data.easypost_rate_id).toBe("rate_persisted")
      })

      test("(b) re-shops and buys a fresh shipment for the same carrier+service when the persisted one was already bought", async () => {
        const fakeClient = buildFakeClient(
          persistedShipment({ purchased: true })
        )
        const service = new EasyPostFulfillmentService(
          { logger: fakeLogger },
          { apiKey: "unused", defaultParcel, client: fakeClient }
        )

        const result = await service.createFulfillment(
          persistedData,
          [],
          undefined,
          { delivery_address: unchangedDeliveryAddress } as any
        )

        expect(fakeClient.createShipment).toHaveBeenCalledTimes(1)
        expect(fakeClient.buyShipment).toHaveBeenCalledTimes(1)
        expect(fakeClient.buyShipment).toHaveBeenCalledWith(
          "shp_fresh",
          "rate_fresh"
        )
        expect(result.data).toEqual(
          expect.objectContaining({
            easypost_shipment_id: "shp_fresh",
            easypost_rate_id: "rate_fresh",
            easypost_carrier: "USPS",
            easypost_service: "Priority",
            easypost_tracking_code: "tracking-shp_fresh",
          })
        )
      })

      test("(b) re-shops to the fulfillment's CURRENT delivery address when it no longer matches the persisted shipment", async () => {
        const fakeClient = buildFakeClient(persistedShipment())
        const service = new EasyPostFulfillmentService(
          { logger: fakeLogger },
          { apiKey: "unused", defaultParcel, client: fakeClient }
        )

        const result = await service.createFulfillment(
          persistedData,
          [],
          undefined,
          {
            delivery_address: {
              ...unchangedDeliveryAddress,
              address_1: "1 new street",
              postal_code: "94110",
            },
          } as any
        )

        expect(fakeClient.createShipment).toHaveBeenCalledWith(
          expect.objectContaining({
            toAddress: expect.objectContaining({
              street1: "1 new street",
              zip: "94110",
            }),
            // The origin isn't on the fulfillment context -- it's reused
            // from the persisted shipment.
            fromAddress: expect.objectContaining({
              street1: "118 2nd street",
              zip: "94105",
            }),
          })
        )
        expect(fakeClient.buyShipment).toHaveBeenCalledWith(
          "shp_fresh",
          "rate_fresh"
        )
        expect(fakeClient.buyShipment).not.toHaveBeenCalledWith(
          "shp_persisted",
          expect.anything()
        )
        expect(result.data.easypost_shipment_id).toBe("shp_fresh")
      })

      test("(b) re-shops with a parcel built from only the fulfilled items (split fulfillment)", async () => {
        const fakeClient = buildFakeClient(persistedShipment())
        const service = new EasyPostFulfillmentService(
          { logger: fakeLogger },
          { apiKey: "unused", defaultParcel, client: fakeClient }
        )

        await service.createFulfillment(
          persistedData,
          [{ line_item_id: "item_1", quantity: 1 }] as any,
          {
            items: [
              {
                id: "item_1",
                variant: { weight: 5, length: 6, width: 4, height: 2 },
              },
              {
                id: "item_2",
                variant: { weight: 11, length: 10, width: 8, height: 4 },
              },
            ],
          } as any,
          { delivery_address: unchangedDeliveryAddress } as any
        )

        expect(fakeClient.createShipment).toHaveBeenCalledWith(
          expect.objectContaining({
            parcel: { weight: 5, length: 6, width: 4, height: 2 },
          })
        )
        expect(fakeClient.buyShipment).toHaveBeenCalledWith(
          "shp_fresh",
          "rate_fresh"
        )
      })

      test("(a) buys the persisted shipment as-is for a kit/managed-inventory line item split across several reservation-based fulfillment items", async () => {
        // Core creates one FulfillmentItemDTO per inventory reservation for
        // a managed-inventory line item (one per inventory item in a kit, or
        // one per reservation row for a single inventory item split across
        // lots) -- all sharing the same line_item_id. If the parcel builder
        // summed each entry's weight independently, this would wrongly look
        // like the parcel changed since checkout and trigger an unnecessary
        // (and possibly pricier) re-shop.
        const fakeClient = buildFakeClient(persistedShipment())
        const service = new EasyPostFulfillmentService(
          { logger: fakeLogger },
          { apiKey: "unused", defaultParcel, client: fakeClient }
        )

        const result = await service.createFulfillment(
          persistedData,
          [
            { line_item_id: "item_1", inventory_item_id: "inv_a", quantity: 2 },
            { line_item_id: "item_1", inventory_item_id: "inv_b", quantity: 3 },
          ] as any,
          {
            items: [
              {
                id: "item_1",
                variant: { weight: 16, length: 10, width: 8, height: 4 },
              },
            ],
          } as any,
          { delivery_address: unchangedDeliveryAddress } as any
        )

        expect(fakeClient.createShipment).not.toHaveBeenCalled()
        expect(fakeClient.buyShipment).toHaveBeenCalledWith(
          "shp_persisted",
          "rate_persisted"
        )
        expect(result.data.easypost_shipment_id).toBe("shp_persisted")
      })

      test("(b) re-shops instead of surfacing EasyPost's 422 when the as-is buy is rejected with SHIPMENT.POSTAGE.EXISTS", async () => {
        const postageExists = Object.assign(
          new Error("Postage already exists for this shipment."),
          { code: "SHIPMENT.POSTAGE.EXISTS", statusCode: 422 }
        )
        const buyShipment = jest.fn(async (shipmentId: string) => {
          if (shipmentId === "shp_persisted") {
            throw postageExists
          }
          return boughtResult(shipmentId)
        })
        const fakeClient = buildFakeClient(persistedShipment(), {
          buyShipment,
        })
        const service = new EasyPostFulfillmentService(
          { logger: fakeLogger },
          { apiKey: "unused", defaultParcel, client: fakeClient }
        )

        const result = await service.createFulfillment(
          persistedData,
          [],
          undefined,
          { delivery_address: unchangedDeliveryAddress } as any
        )

        expect(buyShipment).toHaveBeenLastCalledWith("shp_fresh", "rate_fresh")
        expect(result.data.easypost_shipment_id).toBe("shp_fresh")
      })

      test("throws a clear error when the fresh shipment no longer quotes the original carrier+service", async () => {
        const fakeClient = buildFakeClient(
          persistedShipment({ purchased: true }),
          {
            createShipment: jest.fn(async () => ({
              id: "shp_fresh",
              rates: [freshShipment.rates[0]],
            })),
          }
        )
        const service = new EasyPostFulfillmentService(
          { logger: fakeLogger },
          { apiKey: "unused", defaultParcel, client: fakeClient }
        )

        await expect(
          service.createFulfillment(persistedData, [], undefined, {} as any)
        ).rejects.toThrow(/USPS.*Priority/)
        expect(fakeClient.buyShipment).not.toHaveBeenCalled()
      })

      test("still throws on an incomplete current delivery address rather than buying for it", async () => {
        const fakeClient = buildFakeClient(persistedShipment())
        const service = new EasyPostFulfillmentService(
          { logger: fakeLogger },
          { apiKey: "unused", defaultParcel, client: fakeClient }
        )

        await expect(
          service.createFulfillment(persistedData, [], undefined, {
            delivery_address: { city: "San Francisco" },
          } as any)
        ).rejects.toThrow(/destination address/)
        expect(fakeClient.buyShipment).not.toHaveBeenCalled()
      })
    })
  })

  describe("createReturnFulfillment", () => {
    // Confirmed against the real Medusa core code (packages/modules/fulfillment/src/services/fulfillment-module-service.ts):
    // `createReturnFulfillment`'s `fromData` always carries `shipping_option.data`
    // (the same `{ id, name, carrier, service }` shape `getFulfillmentOptions`
    // produces and `validateOption` validates), and `delivery_address` is always
    // the return's own destination -- the merchant's stock location address,
    // NOT the customer's. It never carries `order` (and therefore never
    // `order.shipping_address`): the module service destructures `order` out of
    // its input and never forwards it to the provider, in every return-creating
    // workflow (plain return, exchange, claim). This provider still checks
    // `order?.shipping_address` first in case that's ever fixed upstream, but
    // the ONLY way to supply the customer's origin address today is this
    // provider's own documented extension point, `metadata.return_from_address`.
    const returnFulfillmentFixture = {
      delivery_address: {
        first_name: "Test",
        last_name: "Seller",
        address_1: "118 2nd street",
        city: "San Francisco",
        province: "CA",
        postal_code: "94105",
        country_code: "us",
      },
      shipping_option: {
        data: {
          id: "USPS:Priority",
          name: "USPS Priority",
          carrier: "USPS",
          service: "Priority",
        },
      },
      metadata: {
        return_from_address: {
          first_name: "Test",
          last_name: "Buyer",
          address_1: "417 montgomery st",
          city: "San Francisco",
          province: "CA",
          postal_code: "94104",
          country_code: "us",
        },
      },
      items: [],
    }

    realApiTest(
      "buys a return label reusing the original carrier+service, with to/from addresses reversed",
      async () => {
        const service = new EasyPostFulfillmentService(
          { logger: fakeLogger },
          { apiKey: process.env.EASYPOST_API_KEY!, defaultParcel }
        )

        const result = await service.createReturnFulfillment(
          returnFulfillmentFixture
        )

        expect(result.data.easypost_tracking_code).toBeDefined()
        expect(result.data.easypost_carrier).toBe("USPS")
        expect(result.data.easypost_service).toBe("Priority")
        expect(result.labels[0].label_url).toMatch(/^https?:\/\//)
      },
      REAL_API_TEST_TIMEOUT_MS
    )

    test("passes delivery_address as the EasyPost to_address and metadata.return_from_address as the from_address", async () => {
      const createShipment = jest.fn(async () => ({
        id: "shp_fake_return",
        rates: [
          {
            id: "rate_1",
            carrier: "USPS",
            service: "Priority",
            rate: "8.01",
            currency: "USD",
          },
        ],
      }))
      const fakeClient = {
        createShipment,
        buyShipment: async (shipmentId: string, rateId: string) => ({
          id: shipmentId,
          rates: [],
          trackingCode: "tracking-fake",
          labelUrl: "https://example.com/label.png",
          trackerId: "trk_fake",
          trackingUrl: "https://example.com/track",
        }),
      } as unknown as EasyPostClient
      const service = new EasyPostFulfillmentService(
        { logger: fakeLogger },
        { apiKey: "unused", defaultParcel, client: fakeClient }
      )

      await service.createReturnFulfillment(returnFulfillmentFixture)

      expect(createShipment).toHaveBeenCalledWith(
        expect.objectContaining({
          toAddress: expect.objectContaining({
            street1: "118 2nd street",
            city: "San Francisco",
          }),
          fromAddress: expect.objectContaining({
            street1: "417 montgomery st",
            city: "San Francisco",
          }),
        })
      )
    })

    // cancelFulfillment requires `easypost_shipment_id`, and core calls it
    // both on an explicit cancel and as createReturnFulfillmentStep's own
    // compensation -- without the id on the returned data, a rollback would
    // fail and leave a paid, unrefunded return label.
    test("returns easypost_shipment_id and easypost_rate_id on data, so the return can be cancelled/compensated", async () => {
      const refundShipment = jest.fn(async (shipmentId: string) => ({
        id: shipmentId,
        rates: [],
        refundStatus: "submitted",
      }))
      const fakeClient = {
        createShipment: async () => ({
          id: "shp_fake_return",
          rates: [
            {
              id: "rate_return",
              carrier: "USPS",
              service: "Priority",
              rate: "8.01",
              currency: "USD",
            },
          ],
        }),
        buyShipment: async (shipmentId: string) => ({
          id: shipmentId,
          rates: [],
          trackingCode: "tracking-fake",
          labelUrl: "https://example.com/label.png",
        }),
        refundShipment,
      } as unknown as EasyPostClient
      const service = new EasyPostFulfillmentService(
        { logger: fakeLogger },
        { apiKey: "unused", defaultParcel, client: fakeClient }
      )

      const result = await service.createReturnFulfillment(
        returnFulfillmentFixture
      )

      expect(result.data).toEqual(
        expect.objectContaining({
          easypost_shipment_id: "shp_fake_return",
          easypost_rate_id: "rate_return",
          easypost_carrier: "USPS",
          easypost_service: "Priority",
          easypost_tracking_code: "tracking-fake",
        })
      )

      await service.cancelFulfillment(result.data)
      expect(refundShipment).toHaveBeenCalledWith("shp_fake_return")
    })

    test("prefers order.shipping_address over metadata.return_from_address when both are present", async () => {
      const createShipment = jest.fn(async () => ({
        id: "shp_fake_return",
        rates: [
          {
            id: "rate_1",
            carrier: "USPS",
            service: "Priority",
            rate: "8.01",
            currency: "USD",
          },
        ],
      }))
      const fakeClient = {
        createShipment,
        buyShipment: async (shipmentId: string) => ({
          id: shipmentId,
          rates: [],
          trackingCode: "tracking-fake",
          labelUrl: "https://example.com/label.png",
        }),
      } as unknown as EasyPostClient
      const service = new EasyPostFulfillmentService(
        { logger: fakeLogger },
        { apiKey: "unused", defaultParcel, client: fakeClient }
      )

      await service.createReturnFulfillment({
        ...returnFulfillmentFixture,
        order: {
          shipping_address: {
            first_name: "Order",
            last_name: "Address",
            address_1: "1 order shipping address way",
            city: "Order City",
            province: "CA",
            postal_code: "90000",
            country_code: "us",
          },
        },
      })

      expect(createShipment).toHaveBeenCalledWith(
        expect.objectContaining({
          fromAddress: expect.objectContaining({
            street1: "1 order shipping address way",
          }),
        })
      )
    })

    // Returns are descoped for v1 (no core change): with no origin address
    // reachable, the error must say returns aren't supported in this
    // version pending a core fix -- not read like a data problem.
    test("throws an explicit 'return labels not supported in this version' error when no customer origin address is available", async () => {
      const service = new EasyPostFulfillmentService(
        { logger: fakeLogger },
        { apiKey: "unused", defaultParcel }
      )

      const { metadata, ...withoutOriginAddress } = returnFulfillmentFixture

      const rejection = service.createReturnFulfillment(withoutOriginAddress)

      await expect(rejection).rejects.toThrow(
        /return labels are not supported in this version/i
      )
      await expect(rejection).rejects.toThrow(/core/i)
      await expect(rejection).rejects.toMatchObject({
        type: MedusaError.Types.NOT_ALLOWED,
      })
    })

    test("throws a clear error when the shipping option's data doesn't carry a carrier and service", async () => {
      const service = new EasyPostFulfillmentService(
        { logger: fakeLogger },
        { apiKey: "unused", defaultParcel }
      )

      await expect(
        service.createReturnFulfillment({
          ...returnFulfillmentFixture,
          shipping_option: { data: {} },
        })
      ).rejects.toThrow()
    })

    test("throws when EasyPost can't quote the original carrier+service for the return route", async () => {
      const fakeClient = {
        createShipment: async () => ({
          id: "shp_fake_return",
          rates: [
            {
              id: "rate_1",
              carrier: "FedExDefault",
              service: "FEDEX_GROUND",
              rate: "12.00",
              currency: "USD",
            },
          ],
        }),
      } as unknown as EasyPostClient
      const service = new EasyPostFulfillmentService(
        { logger: fakeLogger },
        { apiKey: "unused", defaultParcel, client: fakeClient }
      )

      await expect(
        service.createReturnFulfillment(returnFulfillmentFixture)
      ).rejects.toThrow(/USPS.*Priority/)
    })
  })

  describe("cancelFulfillment", () => {
    realApiTest(
      "submits a refund request for a bought shipment",
      async () => {
        const service = new EasyPostFulfillmentService(
          { logger: fakeLogger },
          { apiKey: process.env.EASYPOST_API_KEY!, defaultParcel }
        )
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

        const validated = await service.validateFulfillmentData(
          { carrier: "USPS", service: "Priority" },
          {},
          validContextFixture as any
        )
        const created = await service.createFulfillment(
          validated,
          [],
          undefined,
          {} as any
        )

        const cancelled = (await service.cancelFulfillment(created.data)) as {
          refundStatus?: string
        }

        expect(cancelled).toBeDefined()
        expect(cancelled.refundStatus).toBeDefined()
      },
      REAL_API_TEST_TIMEOUT_MS * 2
    )

    test("throws a clear error when data is missing the shipment id", async () => {
      const service = new EasyPostFulfillmentService(
        { logger: fakeLogger },
        { apiKey: "unused", defaultParcel }
      )

      await expect(service.cancelFulfillment({})).rejects.toThrow(
        /easypost_shipment_id/
      )
    })

    test("returns whatever refundShipment resolves with", async () => {
      const fakeClient = {
        refundShipment: jest.fn(async (shipmentId: string) => ({
          id: shipmentId,
          rates: [],
          refundStatus: "submitted",
        })),
      } as unknown as EasyPostClient
      const service = new EasyPostFulfillmentService(
        { logger: fakeLogger },
        { apiKey: "unused", defaultParcel, client: fakeClient }
      )

      const result = (await service.cancelFulfillment({
        easypost_shipment_id: "shp_fake",
      })) as { refundStatus?: string }

      expect(fakeClient.refundShipment).toHaveBeenCalledWith("shp_fake")
      expect(result.refundStatus).toBe("submitted")
    })
  })
})

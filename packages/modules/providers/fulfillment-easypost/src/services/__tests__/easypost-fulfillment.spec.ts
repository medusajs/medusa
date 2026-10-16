import { Logger } from "@medusajs/framework/types"
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
})

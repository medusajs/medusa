import crypto from "crypto"
import EasyPostApi from "@easypost/api"
import { EasyPostClient } from "../easypost-client"

// These tests hit the real EasyPost test-mode API (no mocking), and some
// chain multiple sequential HTTP calls (create -> buy -> refund) against
// a live network, which can comfortably exceed Jest's default 5000ms
// per-test timeout.
const REAL_API_TEST_TIMEOUT_MS = 30_000

const shipmentFixture = {
  toAddress: {
    name: "Test Buyer",
    street1: "417 montgomery st",
    city: "San Francisco",
    state: "CA",
    zip: "94104",
    country: "US",
  },
  fromAddress: {
    name: "Test Seller",
    street1: "118 2nd street",
    city: "San Francisco",
    state: "CA",
    zip: "94105",
    country: "US",
  },
  parcel: { weight: 16, length: 10, width: 8, height: 4 },
}

describe("EasyPostClient", () => {
  test(
    "listCarrierAccounts rejects a test-mode API key, as EasyPost's API requires production for this endpoint",
    async () => {
      // The plan brief originally assumed a fresh EasyPost test-mode account's
      // default USPS carrier could be listed through this endpoint. Reading
      // the real, installed @easypost/api SDK's own type definitions (Step 2)
      // surfaced a documented caveat on `CarrierAccount.all()` -- "Only
      // Production API keys may be used to retrieve this list, as there is
      // no test mode equivalent" -- and calling the real API with this
      // task's test-mode key confirms it: the request is rejected rather
      // than returning the account list. This test asserts the real,
      // confirmed behavior instead of the brief's incorrect assumption.
      const client = new EasyPostClient({
        apiKey: process.env.EASYPOST_API_KEY!,
      })
      await expect(client.listCarrierAccounts()).rejects.toThrow(
        /production API Key/i
      )
    },
    REAL_API_TEST_TIMEOUT_MS
  )

  test(
    "createShipment returns real rates for a real test-mode shipment",
    async () => {
      const client = new EasyPostClient({
        apiKey: process.env.EASYPOST_API_KEY!,
      })
      const shipment = await client.createShipment(shipmentFixture)
      expect(shipment.id).toMatch(/^shp_/)
      expect(shipment.rates.length).toBeGreaterThan(0)
      expect(shipment.rates[0]).toMatchObject({
        carrier: expect.any(String),
        service: expect.any(String),
        rate: expect.any(String),
      })
    },
    REAL_API_TEST_TIMEOUT_MS
  )

  test(
    "buyShipment purchases the given rate and returns a tracking code + label",
    async () => {
      const client = new EasyPostClient({
        apiKey: process.env.EASYPOST_API_KEY!,
      })
      const shipment = await client.createShipment(shipmentFixture)
      const bought = await client.buyShipment(shipment.id, shipment.rates[0].id)
      expect(bought.trackingCode).toBeDefined()
      expect(bought.labelUrl).toMatch(/^https?:\/\//)
    },
    REAL_API_TEST_TIMEOUT_MS
  )

  test(
    "refundShipment submits a refund request for a bought shipment",
    async () => {
      const client = new EasyPostClient({
        apiKey: process.env.EASYPOST_API_KEY!,
      })
      const shipment = await client.createShipment(shipmentFixture)
      const bought = await client.buyShipment(shipment.id, shipment.rates[0].id)
      const refunded = await client.refundShipment(bought.id)
      expect(refunded.refundStatus).toBeDefined()
    },
    REAL_API_TEST_TIMEOUT_MS
  )

  test("verifyWebhookSignature returns true for a correctly-signed payload and false for a tampered one", () => {
    const client = new EasyPostClient({
      apiKey: "ek_test_unused_for_this_test",
    })
    const secret = "whsec_test"
    const rawBody = JSON.stringify({
      description: "tracker.updated",
      result: { id: "trk_1" },
    })

    // Compute the real EasyPost HMAC scheme confirmed by reading the
    // installed SDK's source (src/utils/util.js): HMAC-SHA256 over the raw
    // body, keyed with the NFKD-normalized, UTF-8-encoded secret, hex
    // digest prefixed with "hmac-sha256-hex=".
    const expectedDigest = crypto
      .createHmac("sha256", Buffer.from(secret.normalize("NFKD"), "utf8"))
      .update(Buffer.from(rawBody, "utf8"))
      .digest("hex")
    const validSignature = `hmac-sha256-hex=${expectedDigest}`

    // Cross-check against the real, installed @easypost/api SDK's own
    // webhook verifier, to confirm `validSignature` isn't just
    // self-consistent with this test's own computation but is actually
    // accepted by EasyPost's real verification logic.
    const verifiedBody = new EasyPostApi(
      "ek_test_unused_for_this_test"
    ).Utils.validateWebhook(
      Buffer.from(rawBody, "utf8"),
      { "X-Hmac-Signature": validSignature },
      secret
    )
    expect(verifiedBody).toEqual(JSON.parse(rawBody))

    expect(client.verifyWebhookSignature(rawBody, validSignature, secret)).toBe(
      true
    )
    expect(
      client.verifyWebhookSignature(
        rawBody + "tampered",
        validSignature,
        secret
      )
    ).toBe(false)
  })
})

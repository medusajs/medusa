import { PaymentIntentDataByStatus } from "../../__fixtures__/data"
import { PaymentSessionStatus } from "@medusajs/medusa"
import PaypalProvider from "../paypal-provider";

const container = {}

describe("PaypalProvider", () => {
  describe("getPaymentStatus", function () {
    let stripeTest

    beforeAll(async () => {
      const scopedContainer = { ...container }
      stripeTest = new PaypalProvider(scopedContainer, { sandbox: true, client_id: "fake", client_secret: "fake" })
      await stripeTest.init()
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("should return the correct status", async () => {
      let status: PaymentSessionStatus

      status = await stripeTest.getPaymentStatus({
        id: PaymentIntentDataByStatus.REQUIRES_PAYMENT_METHOD.id,
      })
      expect(status).toBe(PaymentSessionStatus.PENDING)

      status = await stripeTest.getPaymentStatus({
        id: PaymentIntentDataByStatus.REQUIRES_CONFIRMATION.id,
      })
      expect(status).toBe(PaymentSessionStatus.PENDING)

      status = await stripeTest.getPaymentStatus({
        id: PaymentIntentDataByStatus.PROCESSING.id,
      })
      expect(status).toBe(PaymentSessionStatus.PENDING)

      status = await stripeTest.getPaymentStatus({
        id: PaymentIntentDataByStatus.REQUIRES_ACTION.id,
      })
      expect(status).toBe(PaymentSessionStatus.REQUIRES_MORE)

      status = await stripeTest.getPaymentStatus({
        id: PaymentIntentDataByStatus.CANCELED.id,
      })
      expect(status).toBe(PaymentSessionStatus.CANCELED)

      status = await stripeTest.getPaymentStatus({
        id: PaymentIntentDataByStatus.REQUIRES_CAPTURE.id,
      })
      expect(status).toBe(PaymentSessionStatus.AUTHORIZED)

      status = await stripeTest.getPaymentStatus({
        id: PaymentIntentDataByStatus.SUCCEEDED.id,
      })
      expect(status).toBe(PaymentSessionStatus.AUTHORIZED)

      status = await stripeTest.getPaymentStatus({
        id: "unknown-id",
      })
      expect(status).toBe(PaymentSessionStatus.PENDING)
    })
  })
})

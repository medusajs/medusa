import { StripeTest } from "../__fixtures__/stripe-test";
import { PaymentIntentDataByStatus } from "../../__fixtures__/data";
import { PaymentSessionStatus } from "@medusajs/medusa";

const container = {}

const stripeTest = new StripeTest(container, { api_key: "test" })

describe("StripeTest", () => {
  describe('getPaymentStatus', function () {
    it("should return the correct status", async () => {
      let status: PaymentSessionStatus

      status = await stripeTest.getPaymentStatus(PaymentIntentDataByStatus.REQUIRE_PAYMENT_METHOD.id)
      expect(status).toBe(PaymentSessionStatus.PENDING)

      status = await stripeTest.getPaymentStatus(PaymentIntentDataByStatus.REQUIRES_CONFIRMATION.id)
      expect(status).toBe(PaymentSessionStatus.PENDING)

      status = await stripeTest.getPaymentStatus(PaymentIntentDataByStatus.PROCESSING.id)
      expect(status).toBe(PaymentSessionStatus.PENDING)

      status = await stripeTest.getPaymentStatus(PaymentIntentDataByStatus.REQUIRES_ACTION.id)
      expect(status).toBe(PaymentSessionStatus.REQUIRES_MORE)

      status = await stripeTest.getPaymentStatus(PaymentIntentDataByStatus.CANCELED.id)
      expect(status).toBe(PaymentSessionStatus.CANCELED)
    })
  });
})

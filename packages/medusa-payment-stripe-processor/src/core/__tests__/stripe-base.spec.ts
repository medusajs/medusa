import { StripeTest } from "../__fixtures__/stripe-test"
import { PaymentIntentDataByStatus } from "../../__fixtures__/data"
import { PaymentSessionStatus } from "@medusajs/medusa"
import {
  initiatePaymentContextWithExistingCustomer,
  initiatePaymentContextWithExistingCustomerStripeId,
  initiatePaymentContextWithFailIntentCreation,
  initiatePaymentContextWithWrongEmail
} from "../__fixtures__/data"
import { STRIPE_ID, StripeMock } from "../../__mocks__/stripe"

const container = {}

describe("StripeTest", () => {
  describe('getPaymentStatus', function () {
    let stripeTest

    beforeAll(async () => {
      const scopedContainer = { ...container }
      stripeTest = new StripeTest(scopedContainer, { api_key: "test" })
      await stripeTest.init()
    })

    it("should return the correct status", async () => {
      let status: PaymentSessionStatus

      status = await stripeTest.getPaymentStatus({
        id: PaymentIntentDataByStatus.REQUIRE_PAYMENT_METHOD.id
      })
      expect(status).toBe(PaymentSessionStatus.PENDING)

      status = await stripeTest.getPaymentStatus({
        id: PaymentIntentDataByStatus.REQUIRES_CONFIRMATION.id
      })
      expect(status).toBe(PaymentSessionStatus.PENDING)

      status = await stripeTest.getPaymentStatus({
        id: PaymentIntentDataByStatus.PROCESSING.id
      })
      expect(status).toBe(PaymentSessionStatus.PENDING)

      status = await stripeTest.getPaymentStatus({
        id: PaymentIntentDataByStatus.REQUIRES_ACTION.id
      })
      expect(status).toBe(PaymentSessionStatus.REQUIRES_MORE)

      status = await stripeTest.getPaymentStatus({
        id: PaymentIntentDataByStatus.CANCELED.id
      })
      expect(status).toBe(PaymentSessionStatus.CANCELED)

      status = await stripeTest.getPaymentStatus({
        id: PaymentIntentDataByStatus.REQUIRES_CAPTURE.id
      })
      expect(status).toBe(PaymentSessionStatus.AUTHORIZED)

      status = await stripeTest.getPaymentStatus({
        id: PaymentIntentDataByStatus.SUCCEEDED.id
      })
      expect(status).toBe(PaymentSessionStatus.AUTHORIZED)

      status = await stripeTest.getPaymentStatus({
        id: "unknown"
      })
      expect(status).toBe(PaymentSessionStatus.PENDING)
    })
  })

  describe('initiatePayment', function () {
    let stripeTest

    beforeAll(async () => {
      const scopedContainer = { ...container }
      stripeTest = new StripeTest(scopedContainer, { api_key: "test" })
      await stripeTest.init()
    })

    it("should succeed with an existing customer but no stripe id", async () => {
      const result = await stripeTest.initiatePayment(initiatePaymentContextWithExistingCustomer)

      expect(StripeMock.customers.create).toHaveBeenCalled()
      expect(StripeMock.customers.create).toHaveBeenCalledWith({
        email: initiatePaymentContextWithExistingCustomer.email
      })

      expect(StripeMock.paymentIntents.create).toHaveBeenCalled()
      expect(StripeMock.paymentIntents.create).toHaveBeenCalledWith(
        expect.objectContaining({
          description: undefined,
          amount: initiatePaymentContextWithExistingCustomer.amount,
          currency: initiatePaymentContextWithExistingCustomer.currency_code,
          metadata: { resource_id: initiatePaymentContextWithExistingCustomer.resource_id },
          capture_method: "manual"
        })
      )

      expect(result).toEqual(
        expect.objectContaining({
          session_data: expect.any(Object),
          update_requests: {
            customer_metadata: {
              stripe_id: STRIPE_ID
            }
          }
        })
      )
    })

    it("should succeed with an existing customer with an existing stripe id", async () => {
      const result = await stripeTest.initiatePayment(initiatePaymentContextWithExistingCustomerStripeId)

      expect(StripeMock.customers.create).not.toHaveBeenCalled()

      expect(StripeMock.paymentIntents.create).toHaveBeenCalled()
      expect(StripeMock.paymentIntents.create).toHaveBeenCalledWith(
        expect.objectContaining({
          description: undefined,
          amount: initiatePaymentContextWithExistingCustomer.amount,
          currency: initiatePaymentContextWithExistingCustomer.currency_code,
          metadata: { resource_id: initiatePaymentContextWithExistingCustomer.resource_id },
          capture_method: "manual"
        })
      )

      expect(result).toEqual(
        expect.objectContaining({
          session_data: expect.any(Object),
          update_requests: undefined
        })
      )
    })

    it("should fail on customer creation", async () => {
      const result = await stripeTest.initiatePayment(initiatePaymentContextWithWrongEmail)

      expect(StripeMock.customers.create).toHaveBeenCalled()
      expect(StripeMock.customers.create).toHaveBeenCalledWith({
        email: initiatePaymentContextWithWrongEmail.email
      })

      expect(StripeMock.paymentIntents.create).not.toHaveBeenCalled()

      expect(result).toEqual({
        error: "An error occurred in InitiatePayment during the creation of the stripe customer",
        code: undefined,
        detail: undefined
      })
    })

    it("should fail on payment intents creation", async () => {
      const result = await stripeTest.initiatePayment(initiatePaymentContextWithFailIntentCreation)

      expect(StripeMock.customers.create).toHaveBeenCalled()
      expect(StripeMock.customers.create).toHaveBeenCalledWith({
        email: initiatePaymentContextWithFailIntentCreation.email
      })

      expect(StripeMock.paymentIntents.create).toHaveBeenCalled()
      expect(StripeMock.paymentIntents.create).toHaveBeenCalledWith(
        expect.objectContaining({
          description: initiatePaymentContextWithFailIntentCreation.context.description,
          amount: initiatePaymentContextWithExistingCustomer.amount,
          currency: initiatePaymentContextWithExistingCustomer.currency_code,
          metadata: { resource_id: initiatePaymentContextWithExistingCustomer.resource_id },
          capture_method: "manual"
        })
      )

      expect(result).toEqual({
        error: "An error occurred in InitiatePayment during the creation of the stripe payment intent",
        code: undefined,
        detail: undefined
      })
    })
  })
})

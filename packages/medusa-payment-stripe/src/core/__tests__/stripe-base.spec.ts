import { EOL } from "os"
import { StripeTest } from "../__fixtures__/stripe-test"
import { PaymentIntentDataByStatus } from "../../__fixtures__/data"
import { PaymentSessionStatus } from "@medusajs/medusa"
import {
  authorizePaymentSuccessData,
  cancelPaymentFailData,
  cancelPaymentPartiallyFailData,
  cancelPaymentSuccessData,
  capturePaymentContextFailData,
  capturePaymentContextPartiallyFailData,
  capturePaymentContextSuccessData,
  deletePaymentFailData,
  deletePaymentPartiallyFailData,
  deletePaymentSuccessData,
  initiatePaymentContextWithExistingCustomer,
  initiatePaymentContextWithExistingCustomerStripeId,
  initiatePaymentContextWithFailIntentCreation,
  initiatePaymentContextWithWrongEmail,
  refundPaymentFailData,
  refundPaymentSuccessData,
  retrievePaymentFailData,
  retrievePaymentSuccessData,
  updatePaymentContextFailWithDifferentAmount,
  updatePaymentContextWithDifferentAmount,
  updatePaymentContextWithExistingCustomer,
  updatePaymentContextWithExistingCustomerStripeId,
  updatePaymentContextWithWrongEmail,
} from "../__fixtures__/data"
import {
  PARTIALLY_FAIL_INTENT_ID,
  STRIPE_ID,
  StripeMock,
} from "../../__mocks__/stripe"
import { ErrorIntentStatus } from "../../types"

const container = {}

describe("StripeTest", () => {
  describe("getPaymentStatus", function () {
    let stripeTest

    beforeAll(async () => {
      const scopedContainer = { ...container }
      stripeTest = new StripeTest(scopedContainer, { api_key: "test" })
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

  describe("initiatePayment", function () {
    let stripeTest

    beforeAll(async () => {
      const scopedContainer = { ...container }
      stripeTest = new StripeTest(scopedContainer, { api_key: "test" })
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("should succeed with an existing customer but no stripe id", async () => {
      const result = await stripeTest.initiatePayment(
        initiatePaymentContextWithExistingCustomer
      )

      expect(StripeMock.customers.create).toHaveBeenCalled()
      expect(StripeMock.customers.create).toHaveBeenCalledWith({
        email: initiatePaymentContextWithExistingCustomer.email,
      })

      expect(StripeMock.paymentIntents.create).toHaveBeenCalled()
      expect(StripeMock.paymentIntents.create).toHaveBeenCalledWith(
        expect.objectContaining({
          description: undefined,
          amount: initiatePaymentContextWithExistingCustomer.amount,
          currency: initiatePaymentContextWithExistingCustomer.currency_code,
          metadata: {
            resource_id: initiatePaymentContextWithExistingCustomer.resource_id,
          },
          capture_method: "manual",
        })
      )

      expect(result).toEqual(
        expect.objectContaining({
          session_data: expect.any(Object),
          update_requests: {
            customer_metadata: {
              stripe_id: STRIPE_ID,
            },
          },
        })
      )
    })

    it("should succeed with an existing customer with an existing stripe id", async () => {
      const result = await stripeTest.initiatePayment(
        initiatePaymentContextWithExistingCustomerStripeId
      )

      expect(StripeMock.customers.create).not.toHaveBeenCalled()

      expect(StripeMock.paymentIntents.create).toHaveBeenCalled()
      expect(StripeMock.paymentIntents.create).toHaveBeenCalledWith(
        expect.objectContaining({
          description: undefined,
          amount: initiatePaymentContextWithExistingCustomer.amount,
          currency: initiatePaymentContextWithExistingCustomer.currency_code,
          metadata: {
            resource_id: initiatePaymentContextWithExistingCustomer.resource_id,
          },
          capture_method: "manual",
        })
      )

      expect(result).toEqual(
        expect.objectContaining({
          session_data: expect.any(Object),
          update_requests: undefined,
        })
      )
    })

    it("should fail on customer creation", async () => {
      const result = await stripeTest.initiatePayment(
        initiatePaymentContextWithWrongEmail
      )

      expect(StripeMock.customers.create).toHaveBeenCalled()
      expect(StripeMock.customers.create).toHaveBeenCalledWith({
        email: initiatePaymentContextWithWrongEmail.email,
      })

      expect(StripeMock.paymentIntents.create).not.toHaveBeenCalled()

      expect(result).toEqual({
        error:
          "An error occurred in initiatePayment when creating a Stripe customer",
        code: "",
        detail: "Error",
      })
    })

    it("should fail on payment intents creation", async () => {
      const result = await stripeTest.initiatePayment(
        initiatePaymentContextWithFailIntentCreation
      )

      expect(StripeMock.customers.create).toHaveBeenCalled()
      expect(StripeMock.customers.create).toHaveBeenCalledWith({
        email: initiatePaymentContextWithFailIntentCreation.email,
      })

      expect(StripeMock.paymentIntents.create).toHaveBeenCalled()
      expect(StripeMock.paymentIntents.create).toHaveBeenCalledWith(
        expect.objectContaining({
          description:
            initiatePaymentContextWithFailIntentCreation.context
              .payment_description,
          amount: initiatePaymentContextWithFailIntentCreation.amount,
          currency: initiatePaymentContextWithFailIntentCreation.currency_code,
          metadata: {
            resource_id:
              initiatePaymentContextWithFailIntentCreation.resource_id,
          },
          capture_method: "manual",
        })
      )

      expect(result).toEqual({
        error:
          "An error occurred in InitiatePayment during the creation of the stripe payment intent",
        code: "",
        detail: "Error",
      })
    })
  })

  describe("authorizePayment", function () {
    let stripeTest

    beforeAll(async () => {
      const scopedContainer = { ...container }
      stripeTest = new StripeTest(scopedContainer, { api_key: "test" })
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("should succeed", async () => {
      const result = await stripeTest.authorizePayment(
        authorizePaymentSuccessData
      )

      expect(result).toEqual({
        data: authorizePaymentSuccessData,
        status: PaymentSessionStatus.AUTHORIZED,
      })
    })
  })

  describe("cancelPayment", function () {
    let stripeTest

    beforeAll(async () => {
      const scopedContainer = { ...container }
      stripeTest = new StripeTest(scopedContainer, { api_key: "test" })
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("should succeed", async () => {
      const result = await stripeTest.cancelPayment(cancelPaymentSuccessData)

      expect(result).toEqual({
        id: PaymentIntentDataByStatus.SUCCEEDED.id,
      })
    })

    it("should fail on intent cancellation but still return the intent", async () => {
      const result = await stripeTest.cancelPayment(
        cancelPaymentPartiallyFailData
      )

      expect(result).toEqual({
        id: PARTIALLY_FAIL_INTENT_ID,
        status: ErrorIntentStatus.CANCELED,
      })
    })

    it("should fail on intent cancellation", async () => {
      const result = await stripeTest.cancelPayment(cancelPaymentFailData)

      expect(result).toEqual({
        error: "An error occurred in cancelPayment",
        code: "",
        detail: "Error",
      })
    })
  })

  describe("capturePayment", function () {
    let stripeTest

    beforeAll(async () => {
      const scopedContainer = { ...container }
      stripeTest = new StripeTest(scopedContainer, { api_key: "test" })
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("should succeed", async () => {
      const result = await stripeTest.capturePayment(
        capturePaymentContextSuccessData.paymentSessionData
      )

      expect(result).toEqual({
        id: PaymentIntentDataByStatus.SUCCEEDED.id,
      })
    })

    it("should fail on intent capture but still return the intent", async () => {
      const result = await stripeTest.capturePayment(
        capturePaymentContextPartiallyFailData.paymentSessionData
      )

      expect(result).toEqual({
        id: PARTIALLY_FAIL_INTENT_ID,
        status: ErrorIntentStatus.SUCCEEDED,
      })
    })

    it("should fail on intent capture", async () => {
      const result = await stripeTest.capturePayment(
        capturePaymentContextFailData.paymentSessionData
      )

      expect(result).toEqual({
        error: "An error occurred in capturePayment",
        code: "",
        detail: "Error",
      })
    })
  })

  describe("deletePayment", function () {
    let stripeTest

    beforeAll(async () => {
      const scopedContainer = { ...container }
      stripeTest = new StripeTest(scopedContainer, { api_key: "test" })
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("should succeed", async () => {
      const result = await stripeTest.cancelPayment(deletePaymentSuccessData)

      expect(result).toEqual({
        id: PaymentIntentDataByStatus.SUCCEEDED.id,
      })
    })

    it("should fail on intent cancellation but still return the intent", async () => {
      const result = await stripeTest.cancelPayment(
        deletePaymentPartiallyFailData
      )

      expect(result).toEqual({
        id: PARTIALLY_FAIL_INTENT_ID,
        status: ErrorIntentStatus.CANCELED,
      })
    })

    it("should fail on intent cancellation", async () => {
      const result = await stripeTest.cancelPayment(deletePaymentFailData)

      expect(result).toEqual({
        error: "An error occurred in cancelPayment",
        code: "",
        detail: "Error",
      })
    })
  })

  describe("refundPayment", function () {
    let stripeTest
    const refundAmount = 500

    beforeAll(async () => {
      const scopedContainer = { ...container }
      stripeTest = new StripeTest(scopedContainer, { api_key: "test" })
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("should succeed", async () => {
      const result = await stripeTest.refundPayment(
        refundPaymentSuccessData,
        refundAmount
      )

      expect(result).toEqual({
        id: PaymentIntentDataByStatus.SUCCEEDED.id,
      })
    })

    it("should fail on refund creation", async () => {
      const result = await stripeTest.refundPayment(
        refundPaymentFailData,
        refundAmount
      )

      expect(result).toEqual({
        error: "An error occurred in refundPayment",
        code: "",
        detail: "Error",
      })
    })
  })

  describe("retrievePayment", function () {
    let stripeTest

    beforeAll(async () => {
      const scopedContainer = { ...container }
      stripeTest = new StripeTest(scopedContainer, { api_key: "test" })
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("should succeed", async () => {
      const result = await stripeTest.retrievePayment(
        retrievePaymentSuccessData
      )

      expect(result).toEqual({
        id: PaymentIntentDataByStatus.SUCCEEDED.id,
        status: PaymentIntentDataByStatus.SUCCEEDED.status,
      })
    })

    it("should fail on refund creation", async () => {
      const result = await stripeTest.retrievePayment(retrievePaymentFailData)

      expect(result).toEqual({
        error: "An error occurred in retrievePayment",
        code: "",
        detail: "Error",
      })
    })
  })

  describe("updatePayment", function () {
    let stripeTest

    beforeAll(async () => {
      const scopedContainer = { ...container }
      stripeTest = new StripeTest(scopedContainer, { api_key: "test" })
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("should succeed to initiate a payment with an existing customer but no stripe id", async () => {
      const result = await stripeTest.updatePayment(
        updatePaymentContextWithExistingCustomer
      )

      expect(StripeMock.customers.create).toHaveBeenCalled()
      expect(StripeMock.customers.create).toHaveBeenCalledWith({
        email: updatePaymentContextWithExistingCustomer.email,
      })

      expect(StripeMock.paymentIntents.create).toHaveBeenCalled()
      expect(StripeMock.paymentIntents.create).toHaveBeenCalledWith(
        expect.objectContaining({
          description: undefined,
          amount: updatePaymentContextWithExistingCustomer.amount,
          currency: updatePaymentContextWithExistingCustomer.currency_code,
          metadata: {
            resource_id: updatePaymentContextWithExistingCustomer.resource_id,
          },
          capture_method: "manual",
        })
      )

      expect(result).toEqual(
        expect.objectContaining({
          session_data: expect.any(Object),
          update_requests: {
            customer_metadata: {
              stripe_id: STRIPE_ID,
            },
          },
        })
      )
    })

    it("should fail to initiate a payment with an existing customer but no stripe id", async () => {
      const result = await stripeTest.updatePayment(
        updatePaymentContextWithWrongEmail
      )

      expect(StripeMock.customers.create).toHaveBeenCalled()
      expect(StripeMock.customers.create).toHaveBeenCalledWith({
        email: updatePaymentContextWithWrongEmail.email,
      })

      expect(StripeMock.paymentIntents.create).not.toHaveBeenCalled()

      expect(result).toEqual({
        error:
          "An error occurred in updatePayment during the initiate of the new payment for the new customer",
        code: "",
        detail:
          "An error occurred in initiatePayment when creating a Stripe customer" +
          EOL +
          "Error",
      })
    })

    it("should succeed but no update occurs when the amount did not changed", async () => {
      const result = await stripeTest.updatePayment(
        updatePaymentContextWithExistingCustomerStripeId
      )

      expect(StripeMock.paymentIntents.update).not.toHaveBeenCalled()

      expect(result).not.toBeDefined()
    })

    it("should succeed to update the intent with the new amount", async () => {
      const result = await stripeTest.updatePayment(
        updatePaymentContextWithDifferentAmount
      )

      expect(StripeMock.paymentIntents.update).toHaveBeenCalled()
      expect(StripeMock.paymentIntents.update).toHaveBeenCalledWith(
        updatePaymentContextWithDifferentAmount.paymentSessionData.id,
        {
          amount: updatePaymentContextWithDifferentAmount.amount,
        }
      )

      expect(result).toEqual({
        session_data: expect.objectContaining({
          amount: updatePaymentContextWithDifferentAmount.amount,
        }),
      })
    })

    it("should fail to update the intent with the new amount", async () => {
      const result = await stripeTest.updatePayment(
        updatePaymentContextFailWithDifferentAmount
      )

      expect(StripeMock.paymentIntents.update).toHaveBeenCalled()
      expect(StripeMock.paymentIntents.update).toHaveBeenCalledWith(
        updatePaymentContextFailWithDifferentAmount.paymentSessionData.id,
        {
          amount: updatePaymentContextFailWithDifferentAmount.amount,
        }
      )

      expect(result).toEqual({
        error: "An error occurred in updatePayment",
        code: "",
        detail: "Error",
      })
    })
  })
})

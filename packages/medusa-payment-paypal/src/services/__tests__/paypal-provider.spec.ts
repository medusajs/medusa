import { PaymentIntentDataByStatus } from "../../__fixtures__/data"
import { PaymentSessionStatus } from "@medusajs/medusa"
import PaypalProvider from "../paypal-provider"
import {
  authorizePaymentSuccessData,
  cancelPaymentFailData,
  cancelPaymentRefundAlreadyCanceledSuccessData,
  cancelPaymentRefundAlreadyCaptureSuccessData,
  cancelPaymentSuccessData,
  capturePaymentContextFailData,
  capturePaymentContextSuccessData,
  initiatePaymentContextFail,
  initiatePaymentContextSuccess,
  refundPaymentSuccessData,
} from "../__fixtures__/data"
import PayPalMock, {
  INVOICE_ID,
  PayPalClientMock,
} from "../../__mocks__/@paypal/checkout-server-sdk"
import { roundToTwo } from "../utils/utils"
import { humanizeAmount } from "medusa-core-utils"

const container = {}

describe("PaypalProvider", () => {
  describe("getPaymentStatus", function () {
    let paypalProvider

    beforeAll(async () => {
      const scopedContainer = { ...container }
      paypalProvider = new PaypalProvider(scopedContainer, {
        sandbox: true,
        client_id: "fake",
        client_secret: "fake",
      })
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("should return the correct status", async () => {
      let status: PaymentSessionStatus

      status = await paypalProvider.getPaymentStatus({
        id: PaymentIntentDataByStatus.CREATED.id,
      })
      expect(status).toBe(PaymentSessionStatus.PENDING)

      status = await paypalProvider.getPaymentStatus({
        id: PaymentIntentDataByStatus.SAVED.id,
      })
      expect(status).toBe(PaymentSessionStatus.REQUIRES_MORE)

      status = await paypalProvider.getPaymentStatus({
        id: PaymentIntentDataByStatus.APPROVED.id,
      })
      expect(status).toBe(PaymentSessionStatus.REQUIRES_MORE)

      status = await paypalProvider.getPaymentStatus({
        id: PaymentIntentDataByStatus.PAYER_ACTION_REQUIRED.id,
      })
      expect(status).toBe(PaymentSessionStatus.REQUIRES_MORE)

      status = await paypalProvider.getPaymentStatus({
        id: PaymentIntentDataByStatus.VOIDED.id,
      })
      expect(status).toBe(PaymentSessionStatus.CANCELED)

      status = await paypalProvider.getPaymentStatus({
        id: PaymentIntentDataByStatus.COMPLETED.id,
      })
      expect(status).toBe(PaymentSessionStatus.AUTHORIZED)

      status = await paypalProvider.getPaymentStatus({
        id: "unknown-id",
      })
      expect(status).toBe(PaymentSessionStatus.PENDING)
    })
  })

  describe("initiatePayment", function () {
    let paypalProvider

    beforeAll(async () => {
      const scopedContainer = { ...container }
      paypalProvider = new PaypalProvider(scopedContainer, {
        sandbox: true,
        client_id: "fake",
        client_secret: "fake",
      })
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("should succeed with an existing customer but no stripe id", async () => {
      const result = await paypalProvider.initiatePayment(
        initiatePaymentContextSuccess
      )

      expect(PayPalMock.orders.OrdersCreateRequest).toHaveBeenCalled()
      expect(PayPalClientMock.execute).toHaveBeenCalled()
      expect(PayPalClientMock.execute).toHaveBeenCalledWith(
        expect.objectContaining({
          body: {
            intent: "AUTHORIZE",
            application_context: {
              shipping_preference: "NO_SHIPPING",
            },
            purchase_units: [
              {
                custom_id: initiatePaymentContextSuccess.resource_id,
                amount: {
                  currency_code:
                    initiatePaymentContextSuccess.currency_code.toUpperCase(),
                  value: roundToTwo(
                    humanizeAmount(
                      initiatePaymentContextSuccess.amount,
                      initiatePaymentContextSuccess.currency_code
                    ),
                    initiatePaymentContextSuccess.currency_code
                  ),
                },
              },
            ],
          },
        })
      )

      expect(result).toEqual({
        session_data: expect.any(Object),
      })
    })

    it("should fail", async () => {
      const result = await paypalProvider.initiatePayment(
        initiatePaymentContextFail
      )

      expect(PayPalMock.orders.OrdersCreateRequest).toHaveBeenCalled()
      expect(PayPalClientMock.execute).not.toHaveBeenCalled()

      expect(result).toEqual({
        error: "An error occurred in initiatePayment",
        code: "",
        detail: "Error.",
      })
    })
  })

  describe("authorizePayment", function () {
    let paypalProvider

    beforeAll(async () => {
      const scopedContainer = { ...container }
      paypalProvider = new PaypalProvider(scopedContainer, {
        sandbox: true,
        client_id: "fake",
        client_secret: "fake",
      })
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("should succeed", async () => {
      const result = await paypalProvider.authorizePayment(
        authorizePaymentSuccessData
      )

      expect(result).toEqual({
        data: authorizePaymentSuccessData,
        status: PaymentSessionStatus.AUTHORIZED,
      })
    })
  })

  describe("cancelPayment", function () {
    let paypalProvider

    beforeAll(async () => {
      const scopedContainer = { ...container }
      paypalProvider = new PaypalProvider(scopedContainer, {
        sandbox: true,
        client_id: "fake",
        client_secret: "fake",
      })
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("should succeed to void the payment authorization", async () => {
      const result = await paypalProvider.cancelPayment(
        cancelPaymentSuccessData
      )

      expect(
        PayPalMock.payments.AuthorizationsVoidRequest
      ).toHaveBeenCalledTimes(1)
      expect(
        PayPalMock.payments.AuthorizationsVoidRequest
      ).toHaveBeenCalledWith(
        cancelPaymentSuccessData.purchase_units[0].payments.authorizations[0].id
      )

      expect(result).toEqual({
        id: cancelPaymentSuccessData.id,
        invoice_id: INVOICE_ID,
        status: PaymentIntentDataByStatus[cancelPaymentSuccessData.id].status,
      })
    })

    it("should succeed to refund an already captured payment", async () => {
      const result = await paypalProvider.cancelPayment(
        cancelPaymentRefundAlreadyCaptureSuccessData
      )

      expect(PayPalMock.payments.CapturesRefundRequest).toHaveBeenCalledTimes(1)
      expect(PayPalMock.payments.CapturesRefundRequest).toHaveBeenCalledWith(
        cancelPaymentRefundAlreadyCaptureSuccessData.purchase_units[0].payments
          .captures[0].id
      )

      expect(result).toEqual({
        id: cancelPaymentRefundAlreadyCaptureSuccessData.id,
        invoice_id: INVOICE_ID,
        status:
          PaymentIntentDataByStatus[
            cancelPaymentRefundAlreadyCaptureSuccessData.id
          ].status,
      })
    })

    it("should succeed to do nothing if already canceled or already fully refund", async () => {
      const result = await paypalProvider.cancelPayment(
        cancelPaymentRefundAlreadyCanceledSuccessData
      )

      expect(PayPalMock.payments.CapturesRefundRequest).not.toHaveBeenCalled()
      expect(
        PayPalMock.payments.AuthorizationsVoidRequest
      ).not.toHaveBeenCalled()

      expect(result).toEqual({
        id: cancelPaymentRefundAlreadyCanceledSuccessData.id,
        invoice_id: INVOICE_ID,
        status:
          PaymentIntentDataByStatus[
            cancelPaymentRefundAlreadyCanceledSuccessData.id
          ].status,
      })
    })

    it("should fail", async () => {
      const result = await paypalProvider.cancelPayment(cancelPaymentFailData)

      expect(result).toEqual({
        code: "",
        detail: "Error",
        error: "An error occurred in retrievePayment",
      })
    })
  })

  describe("capturePayment", function () {
    let paypalProvider

    beforeAll(async () => {
      const scopedContainer = { ...container }
      paypalProvider = new PaypalProvider(scopedContainer, {
        sandbox: true,
        client_id: "fake",
        client_secret: "fake",
      })
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("should succeed", async () => {
      const result = await paypalProvider.capturePayment(
        capturePaymentContextSuccessData
      )

      expect(result).toEqual({
        id: capturePaymentContextSuccessData.paymentSessionData.id,
        invoice_id: INVOICE_ID,
        status:
          PaymentIntentDataByStatus[
            capturePaymentContextSuccessData.paymentSessionData.id
          ].status,
      })
    })

    it("should fail", async () => {
      const result = await paypalProvider.capturePayment(
        capturePaymentContextFailData
      )

      expect(result).toEqual({
        error: "An error occurred in capturePayment",
        code: "",
        detail: "Error.",
      })
    })
  })

  describe("refundPayment", function () {
    let paypalProvider
    const refundAmount = 500

    beforeAll(async () => {
      const scopedContainer = { ...container }
      paypalProvider = new PaypalProvider(scopedContainer, {
        sandbox: true,
        client_id: "fake",
        client_secret: "fake",
      })
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("should succeed", async () => {
      const result = await paypalProvider.refundPayment(
        refundPaymentSuccessData,
        refundAmount
      )

      expect(result).toEqual({
        id: refundPaymentSuccessData.id,
      })
    })
    /*
    it("should fail on refund creation", async () => {
      const result = await paypalProvider.refundPayment(
        refundPaymentFailData,
        refundAmount
      )

      expect(result).toEqual({
        error: "An error occurred in refundPayment",
        code: "",
        detail: "Error",
      })
    })*/
  })
})

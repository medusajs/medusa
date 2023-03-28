import { PaymentIntentDataByStatus } from "../../__fixtures__/data"
import { PaymentProcessorContext, PaymentSessionStatus } from "@medusajs/medusa"
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
  refundPaymentFailData,
  refundPaymentFailNotYetCapturedData,
  refundPaymentSuccessData,
  retrievePaymentFailData,
  retrievePaymentSuccessData,
  updatePaymentFailData,
  updatePaymentSuccessData,
} from "../__fixtures__/data"
import axios from "axios"
import { INVOICE_ID, PayPalMock } from "../../core/__mocks__/paypal-sdk"
import { roundToTwo } from "../utils/utils"
import { humanizeAmount } from "medusa-core-utils"

jest.mock("axios")
const mockedAxios = axios as jest.Mocked<typeof axios>

jest.mock("../../core", () => {
  return {
    PaypalSdk: jest.fn().mockImplementation(() => PayPalMock),
  }
})

const container = {
  logger: {
    error: jest.fn(),
  } as any,
}

const paypalConfig = {
  sandbox: true,
  client_id: "fake",
  client_secret: "fake",
}

describe("PaypalProvider", () => {
  beforeAll(() => {
    mockedAxios.create.mockReturnThis()
  })

  describe("getPaymentStatus", function () {
    let paypalProvider: PaypalProvider

    beforeAll(async () => {
      const scopedContainer = { ...container }
      paypalProvider = new PaypalProvider(scopedContainer, paypalConfig)
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
    let paypalProvider: PaypalProvider

    beforeAll(async () => {
      const scopedContainer = { ...container }
      paypalProvider = new PaypalProvider(scopedContainer, paypalConfig)
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("should succeed with an existing customer but no stripe id", async () => {
      const result = await paypalProvider.initiatePayment(
        initiatePaymentContextSuccess as PaymentProcessorContext
      )

      expect(PayPalMock.createOrder).toHaveBeenCalled()
      expect(PayPalMock.createOrder).toHaveBeenCalledWith(
        expect.objectContaining({
          intent: "AUTHORIZE",
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
        })
      )

      expect(result).toEqual({
        session_data: expect.any(Object),
      })
    })

    it("should fail", async () => {
      const result = await paypalProvider.initiatePayment(
        initiatePaymentContextFail as unknown as PaymentProcessorContext
      )

      expect(PayPalMock.createOrder).toHaveBeenCalled()

      expect(result).toEqual({
        error: "An error occurred in initiatePayment",
        code: "",
        detail: "Error.",
      })
    })
  })

  describe("authorizePayment", function () {
    let paypalProvider: PaypalProvider

    beforeAll(async () => {
      const scopedContainer = { ...container }
      paypalProvider = new PaypalProvider(scopedContainer, paypalConfig)
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("should succeed", async () => {
      const result = await paypalProvider.authorizePayment(
        authorizePaymentSuccessData as Record<string, unknown>,
        {}
      )

      expect(result).toEqual({
        data: {
          id: authorizePaymentSuccessData.id,
          invoice_id: INVOICE_ID,
          status:
            PaymentIntentDataByStatus[authorizePaymentSuccessData.id].status,
        },
        status: "authorized",
      })
    })
  })

  describe("cancelPayment", function () {
    let paypalProvider: PaypalProvider

    beforeAll(async () => {
      const scopedContainer = { ...container }
      paypalProvider = new PaypalProvider(scopedContainer, paypalConfig)
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("should succeed to void the payment authorization", async () => {
      const result = await paypalProvider.cancelPayment(
        cancelPaymentSuccessData
      )

      expect(PayPalMock.cancelAuthorizedPayment).toHaveBeenCalledTimes(1)
      expect(PayPalMock.cancelAuthorizedPayment).toHaveBeenCalledWith(
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

      expect(PayPalMock.refundPayment).toHaveBeenCalledTimes(1)
      expect(PayPalMock.refundPayment).toHaveBeenCalledWith(
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

      expect(PayPalMock.captureAuthorizedPayment).not.toHaveBeenCalled()
      expect(PayPalMock.cancelAuthorizedPayment).not.toHaveBeenCalled()

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
    let paypalProvider: PaypalProvider

    beforeAll(async () => {
      const scopedContainer = { ...container }
      paypalProvider = new PaypalProvider(scopedContainer, paypalConfig)
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("should succeed", async () => {
      const result = await paypalProvider.capturePayment(
        capturePaymentContextSuccessData.paymentSessionData
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
        capturePaymentContextFailData.paymentSessionData
      )

      expect(result).toEqual({
        error: "An error occurred in capturePayment",
        code: "",
        detail: "Error.",
      })
    })
  })

  describe("refundPayment", function () {
    let paypalProvider: PaypalProvider
    const refundAmount = 500

    beforeAll(async () => {
      const scopedContainer = { ...container }
      paypalProvider = new PaypalProvider(scopedContainer, paypalConfig)
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("should succeed", async () => {
      const result = await paypalProvider.refundPayment(
        refundPaymentSuccessData,
        refundAmount
      )

      expect(PayPalMock.refundPayment).toHaveBeenCalled()
      expect(PayPalMock.refundPayment).toHaveBeenCalledWith(
        refundPaymentSuccessData.purchase_units[0].payments.captures[0].id,
        {
          amount: {
            currency_code:
              refundPaymentSuccessData.purchase_units[0].amount.currency_code,
            value: "5.00",
          },
        }
      )

      expect(result).toEqual({
        id: refundPaymentSuccessData.id,
        invoice_id: INVOICE_ID,
        status: PaymentIntentDataByStatus[refundPaymentSuccessData.id].status,
      })
    })

    it("should fail if not already captured", async () => {
      const result = await paypalProvider.refundPayment(
        refundPaymentFailNotYetCapturedData,
        refundAmount
      )

      expect(PayPalMock.refundPayment).not.toHaveBeenCalled()

      expect(result).toEqual({
        code: "",
        detail: "Cannot refund an uncaptured payment",
        error: "An error occurred in refundPayment",
      })
    })

    it("should fail", async () => {
      const result = await paypalProvider.refundPayment(
        refundPaymentFailData,
        refundAmount
      )

      expect(PayPalMock.refundPayment).toHaveBeenCalled()
      expect(PayPalMock.refundPayment).toHaveBeenCalledWith(
        refundPaymentFailData.purchase_units[0].payments.captures[0].id,
        {
          amount: {
            currency_code:
              refundPaymentFailData.purchase_units[0].amount.currency_code,
            value: "5.00",
          },
        }
      )

      expect(result).toEqual({
        code: "",
        detail: "Error",
        error: "An error occurred in retrievePayment",
      })
    })
  })

  describe("retrievePayment", function () {
    let paypalProvider

    beforeAll(async () => {
      const scopedContainer = { ...container }
      paypalProvider = new PaypalProvider(scopedContainer, paypalConfig)
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("should succeed", async () => {
      const result = await paypalProvider.retrievePayment(
        retrievePaymentSuccessData
      )

      expect(result).toEqual({
        id: retrievePaymentSuccessData.id,
        invoice_id: INVOICE_ID,
        status: PaymentIntentDataByStatus[retrievePaymentSuccessData.id].status,
      })
    })

    it("should fail on refund creation", async () => {
      const result = await paypalProvider.retrievePayment(
        retrievePaymentFailData
      )

      expect(result).toEqual({
        error: "An error occurred in retrievePayment",
        code: "",
        detail: "Error",
      })
    })
  })

  describe("updatePayment", function () {
    let paypalProvider: PaypalProvider

    beforeAll(async () => {
      const scopedContainer = { ...container }
      paypalProvider = new PaypalProvider(scopedContainer, paypalConfig)
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("should succeed", async () => {
      const result = await paypalProvider.updatePayment(
        updatePaymentSuccessData as unknown as PaymentProcessorContext
      )

      expect(PayPalMock.patchOrder).toHaveBeenCalled()
      expect(PayPalMock.patchOrder).toHaveBeenCalledWith(
        updatePaymentSuccessData.paymentSessionData.id,
        [
          {
            op: "replace",
            path: "/purchase_units/@reference_id=='default'",
            value: {
              amount: {
                currency_code: updatePaymentSuccessData.currency_code,
                value: "10.00",
              },
            },
          },
        ]
      )

      expect(result).toEqual(
        expect.objectContaining({
          session_data: expect.any(Object),
        })
      )
    })

    it("should fail", async () => {
      const result = await paypalProvider.updatePayment(
        updatePaymentFailData as unknown as PaymentProcessorContext
      )

      expect(PayPalMock.patchOrder).toHaveBeenCalled()
      expect(PayPalMock.patchOrder).toHaveBeenCalledWith(
        updatePaymentFailData.paymentSessionData.id,
        [
          {
            op: "replace",
            path: "/purchase_units/@reference_id=='default'",
            value: {
              amount: {
                currency_code: updatePaymentFailData.currency_code,
                value: "10.00",
              },
            },
          },
        ]
      )

      expect(result).toEqual({
        code: "",
        detail: "Error.",
        error: "An error occurred in initiatePayment",
      })
    })
  })
})

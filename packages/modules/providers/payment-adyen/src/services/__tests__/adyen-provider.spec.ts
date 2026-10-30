import { hmacValidator, Types } from "@adyen/api-library"
import {
  MedusaError,
  PaymentActions,
  PaymentSessionStatus,
} from "@medusajs/framework/utils"
import AdyenProviderService from "../adyen-provider"

const HMAC_KEY =
  "44782DEF547AAA06C910C43932B1EB0C71FC68D9D0C057550C48EC2ACF6BA056"
const MERCHANT_ACCOUNT = "TestMerchant"
const SESSION_ID = "payses_123"
const APPLICATION_INFO = {
  externalPlatform: {
    name: "Medusa",
    integrator: "medusajs",
  },
}

const logger = {
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}

const createProvider = (options = {}) => {
  const provider = new AdyenProviderService({ logger } as any, {
    apiKey: "test_key",
    merchantAccount: MERCHANT_ACCOUNT,
    hmacKey: HMAC_KEY,
    returnUrl: "https://store.test/checkout",
    ...options,
  })

  const checkout = {
    PaymentsApi: {
      paymentMethods: jest.fn().mockResolvedValue({ paymentMethods: [] }),
      payments: jest.fn(),
      paymentsDetails: jest.fn(),
    },
    ModificationsApi: {
      captureAuthorisedPayment: jest
        .fn()
        .mockResolvedValue({ pspReference: "CAPTURE_PSP" }),
      refundCapturedPayment: jest.fn().mockResolvedValue({}),
      cancelAuthorisedPaymentByPspReference: jest.fn().mockResolvedValue({}),
      refundOrCancelPayment: jest.fn().mockResolvedValue({}),
    },
    RecurringApi: {
      getTokensForStoredPaymentDetails: jest.fn().mockResolvedValue({
        storedPaymentMethods: [
          { id: "TOKEN_1", brand: "visa", lastFour: "1142" },
          { id: "TOKEN_2", brand: "mc", lastFour: "1115" },
        ],
      }),
      storedPaymentMethods: jest
        .fn()
        .mockResolvedValue({ id: "TOKEN_3", brand: "visa", lastFour: "1142" }),
      deleteTokenForStoredPaymentDetails: jest
        .fn()
        .mockResolvedValue(undefined),
    },
  }
  ;(provider as any).checkout_ = checkout

  return { provider, checkout }
}

const sessionData = (overrides = {}) => ({
  session_id: SESSION_ID,
  amount: 1000,
  currency: "EUR",
  capture: false,
  psp_reference: null,
  result_code: null,
  action: null,
  ...overrides,
})

const authorizedData = (overrides = {}) =>
  sessionData({
    psp_reference: "PSP_123",
    result_code: "Authorised",
    ...overrides,
  })

const webhook = (
  item: Partial<Types.notification.NotificationRequestItem>,
  key = HMAC_KEY
) => {
  const notification = {
    pspReference: "PSP_123",
    originalReference: "",
    merchantAccountCode: MERCHANT_ACCOUNT,
    merchantReference: SESSION_ID,
    amount: { value: 1000, currency: "EUR" },
    eventCode:
      Types.notification.NotificationRequestItem.EventCodeEnum.Authorisation,
    success: Types.notification.NotificationRequestItem.SuccessEnum.True,
    ...item,
  } as Types.notification.NotificationRequestItem

  notification.additionalData = {
    hmacSignature: new hmacValidator().calculateHmac(notification, key),
  }

  return {
    data: { notificationItems: [{ NotificationRequestItem: notification }] },
    rawData: "",
    headers: {},
  }
}

describe("AdyenProviderService", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("validateOptions", () => {
    it("requires the API key and merchant account", () => {
      expect(() =>
        AdyenProviderService.validateOptions({ merchantAccount: "x" })
      ).toThrow("Required option `apiKey` is missing")
      expect(() =>
        AdyenProviderService.validateOptions({ apiKey: "x" })
      ).toThrow("Required option `merchantAccount` is missing")
    })

    it("requires the live endpoint prefix in live", () => {
      expect(() =>
        AdyenProviderService.validateOptions({
          apiKey: "x",
          merchantAccount: "x",
          environment: "LIVE",
        })
      ).toThrow("Option `liveEndpointUrlPrefix` is required")
    })
  })

  describe("initiatePayment", () => {
    it("fetches the payment methods and owns the payment state", async () => {
      const { provider, checkout } = createProvider()

      const result = await provider.initiatePayment({
        amount: 10,
        currency_code: "eur",
        data: {
          session_id: SESSION_ID,
          country_code: "nl",
          psp_reference: "INJECTED",
          result_code: "Authorised",
        },
      })

      expect(checkout.PaymentsApi.paymentMethods).toHaveBeenCalledWith(
        expect.objectContaining({
          merchantAccount: MERCHANT_ACCOUNT,
          amount: { currency: "EUR", value: 1000 },
          countryCode: "NL",
        })
      )
      expect(result).toEqual({
        id: SESSION_ID,
        status: PaymentSessionStatus.PENDING,
        data: expect.objectContaining({
          ...sessionData(),
          payment_methods: { paymentMethods: [] },
        }),
      })
    })
  })

  describe("updatePayment", () => {
    it("starts a new attempt when a payment method is submitted after a refusal", async () => {
      const { provider } = createProvider()

      const result = await provider.updatePayment({
        amount: 10,
        currency_code: "eur",
        data: sessionData({
          psp_reference: "PSP_123",
          result_code: "Refused",
          client: { payment_method: { type: "scheme" } },
        }),
      })

      expect(result).toEqual({
        status: PaymentSessionStatus.PENDING,
        data: expect.objectContaining({
          amount: 1000,
          psp_reference: null,
          result_code: null,
          action: null,
        }),
      })
    })

    it("keeps the status when no payment method is submitted", async () => {
      const { provider } = createProvider()

      const result = await provider.updatePayment({
        amount: 10,
        currency_code: "eur",
        data: sessionData({
          result_code: "ChallengeShopper",
          client: { details: { threeDSResult: "abc" } },
        }),
      })

      expect(result.status).toBeUndefined()
      expect(result.data).toEqual(
        expect.objectContaining({ result_code: "ChallengeShopper" })
      )
    })
  })

  describe("authorizePayment", () => {
    const paymentMethod = { type: "scheme", encryptedCardNumber: "enc" }

    it("submits the client's payment method with the session's amount", async () => {
      const { provider, checkout } = createProvider()
      checkout.PaymentsApi.payments.mockResolvedValue({
        resultCode: "Authorised",
        pspReference: "PSP_123",
      })

      const result = await provider.authorizePayment({
        data: sessionData({
          client: {
            payment_method: paymentMethod,
            browser_info: { language: "en-US" },
            amount: 1,
            reference: "other",
          },
        }),
      })

      expect(checkout.PaymentsApi.payments).toHaveBeenCalledWith(
        expect.objectContaining({
          merchantAccount: MERCHANT_ACCOUNT,
          amount: { currency: "EUR", value: 1000 },
          reference: SESSION_ID,
          paymentMethod,
          browserInfo: { language: "en-US" },
          returnUrl: "https://store.test/checkout",
          additionalData: { manualCapture: "true" },
          applicationInfo: APPLICATION_INFO,
        }),
        { idempotencyKey: expect.stringMatching(/^payses_123-[a-f0-9]{16}$/) }
      )
      expect(result).toEqual({
        status: PaymentSessionStatus.AUTHORIZED,
        data: expect.objectContaining({
          psp_reference: "PSP_123",
          result_code: "Authorised",
          client: expect.objectContaining({
            payment_method: null,
            browser_info: null,
            details: null,
          }),
        }),
      })
    })

    it("uses the same idempotency key when the same payment method is retried", async () => {
      const { provider, checkout } = createProvider()
      checkout.PaymentsApi.payments.mockResolvedValue({ resultCode: "Refused" })

      const data = sessionData({ client: { payment_method: paymentMethod } })
      await provider.authorizePayment({ data })
      await provider.authorizePayment({ data })
      await provider.authorizePayment({
        data: sessionData({
          client: {
            payment_method: { ...paymentMethod, encryptedCardNumber: "new" },
          },
        }),
      })

      const keys = checkout.PaymentsApi.payments.mock.calls.map(
        ([, options]) => options.idempotencyKey
      )
      expect(keys[0]).toEqual(keys[1])
      expect(keys[2]).not.toEqual(keys[0])
    })

    it("returns captured when auto-capture is enabled", async () => {
      const { provider, checkout } = createProvider({ capture: true })
      checkout.PaymentsApi.payments.mockResolvedValue({
        resultCode: "Authorised",
        pspReference: "PSP_123",
      })

      const result = await provider.authorizePayment({
        data: sessionData({
          capture: true,
          client: { payment_method: paymentMethod },
        }),
      })

      const request = checkout.PaymentsApi.payments.mock.calls[0][0]
      expect(request.captureDelayHours).toEqual(0)
      expect(request.additionalData).toBeUndefined()
      expect(result.status).toEqual(PaymentSessionStatus.CAPTURED)
    })

    it("returns the 3DS action, then submits the details", async () => {
      const { provider, checkout } = createProvider()
      const action = { type: "threeDS2", paymentData: "pd", token: "t" }
      checkout.PaymentsApi.payments.mockResolvedValue({
        resultCode: "ChallengeShopper",
        pspReference: "PSP_123",
        action,
      })
      checkout.PaymentsApi.paymentsDetails.mockResolvedValue({
        resultCode: "Authorised",
        pspReference: "PSP_123",
      })

      const challenged = await provider.authorizePayment({
        data: sessionData({ client: { payment_method: paymentMethod } }),
      })

      expect(challenged).toEqual({
        status: PaymentSessionStatus.REQUIRES_MORE,
        data: expect.objectContaining({
          result_code: "ChallengeShopper",
          action,
        }),
      })

      const result = await provider.authorizePayment({
        data: {
          ...challenged.data,
          client: { details: { threeDSResult: "abc" } },
        },
      })

      expect(checkout.PaymentsApi.paymentsDetails).toHaveBeenCalledWith(
        { details: { threeDSResult: "abc" }, paymentData: "pd" },
        expect.any(Object)
      )
      expect(result).toEqual({
        status: PaymentSessionStatus.AUTHORIZED,
        data: expect.objectContaining({ action: null }),
      })
    })

    it("returns an error status when the payment is refused", async () => {
      const { provider, checkout } = createProvider()
      checkout.PaymentsApi.payments.mockResolvedValue({
        resultCode: "Refused",
        refusalReason: "Expired Card",
      })

      const result = await provider.authorizePayment({
        data: sessionData({ client: { payment_method: paymentMethod } }),
      })

      expect(result.status).toEqual(PaymentSessionStatus.ERROR)
      expect(result.data).not.toHaveProperty("refusal_reason")
    })

    it("doesn't call Adyen again for an authorized payment", async () => {
      const { provider, checkout } = createProvider()

      const result = await provider.authorizePayment({
        data: authorizedData({ client: { payment_method: paymentMethod } }),
      })

      expect(checkout.PaymentsApi.payments).not.toHaveBeenCalled()
      expect(result.status).toEqual(PaymentSessionStatus.AUTHORIZED)
    })

    it("returns the stored status when there's no client data", async () => {
      const { provider, checkout } = createProvider()

      const result = await provider.authorizePayment({ data: sessionData() })

      expect(checkout.PaymentsApi.payments).not.toHaveBeenCalled()
      expect(result.status).toEqual(PaymentSessionStatus.PENDING)
    })

    it("hides Adyen's error details", async () => {
      const { provider, checkout } = createProvider()
      checkout.PaymentsApi.payments.mockRejectedValue(
        Object.assign(new Error("Invalid card number"), {
          statusCode: 422,
          errorCode: "101",
        })
      )

      const error = await provider
        .authorizePayment({
          data: sessionData({ client: { payment_method: paymentMethod } }),
        })
        .catch((e) => e)

      expect(error).toBeInstanceOf(MedusaError)
      expect(error.type).toEqual(MedusaError.Types.INVALID_DATA)
      expect(error.message).toEqual(
        "An error occurred in authorizePayment with Adyen"
      )
      expect(logger.error).toHaveBeenCalledWith(
        expect.stringContaining("Invalid card number")
      )
    })
  })

  it("returns an unexpected state error for authentication failures", async () => {
    const { provider, checkout } = createProvider()
    checkout.ModificationsApi.captureAuthorisedPayment.mockRejectedValue(
      Object.assign(new Error("Unauthorized"), { statusCode: 401 })
    )

    const error = await provider
      .capturePayment({ data: authorizedData() })
      .catch((e) => e)

    expect(error.type).toEqual(MedusaError.Types.UNEXPECTED_STATE)
  })

  describe("capturePayment", () => {
    it("captures the authorized amount", async () => {
      const { provider, checkout } = createProvider()

      const result = await provider.capturePayment({
        data: authorizedData(),
        context: { idempotency_key: "capt_123" },
      })

      expect(
        checkout.ModificationsApi.captureAuthorisedPayment
      ).toHaveBeenCalledWith(
        "PSP_123",
        {
          merchantAccount: MERCHANT_ACCOUNT,
          amount: { currency: "EUR", value: 1000 },
          reference: SESSION_ID,
          applicationInfo: APPLICATION_INFO,
        },
        { idempotencyKey: "capt_123" }
      )
      expect(result.data).toEqual(
        expect.objectContaining({ capture_psp_reference: "CAPTURE_PSP" })
      )
    })

    it("doesn't capture a payment that's already captured", async () => {
      const { provider, checkout } = createProvider()

      await provider.capturePayment({
        data: authorizedData({ capture_psp_reference: "CAPTURE_PSP" }),
      })

      expect(
        checkout.ModificationsApi.captureAuthorisedPayment
      ).not.toHaveBeenCalled()
    })

    it("doesn't capture auto-captured payments", async () => {
      const { provider, checkout } = createProvider()

      await provider.capturePayment({ data: authorizedData({ capture: true }) })

      expect(
        checkout.ModificationsApi.captureAuthorisedPayment
      ).not.toHaveBeenCalled()
    })
  })

  describe("refundPayment", () => {
    it("refunds the amount in minor units", async () => {
      const { provider, checkout } = createProvider()

      await provider.refundPayment({
        amount: 4.5,
        data: authorizedData(),
        context: { idempotency_key: "a".repeat(80) },
      })

      expect(
        checkout.ModificationsApi.refundCapturedPayment
      ).toHaveBeenCalledWith(
        "PSP_123",
        expect.objectContaining({
          amount: { currency: "EUR", value: 450 },
          applicationInfo: APPLICATION_INFO,
        }),
        { idempotencyKey: expect.stringMatching(/^[a-f0-9]{64}$/) }
      )
    })
  })

  describe("cancelPayment", () => {
    it("cancels an authorized payment", async () => {
      const { provider, checkout } = createProvider()

      await provider.cancelPayment({ data: authorizedData() })

      expect(
        checkout.ModificationsApi.cancelAuthorisedPaymentByPspReference
      ).toHaveBeenCalledWith(
        "PSP_123",
        {
          merchantAccount: MERCHANT_ACCOUNT,
          reference: SESSION_ID,
          applicationInfo: APPLICATION_INFO,
        },
        expect.any(Object)
      )
    })

    it("reverses an auto-captured payment", async () => {
      const { provider, checkout } = createProvider()

      await provider.cancelPayment({ data: authorizedData({ capture: true }) })

      expect(
        checkout.ModificationsApi.refundOrCancelPayment
      ).toHaveBeenCalledWith(
        "PSP_123",
        expect.objectContaining({ applicationInfo: APPLICATION_INFO }),
        expect.any(Object)
      )
    })

    it("skips payments that aren't authorized", async () => {
      const { provider, checkout } = createProvider()

      await provider.cancelPayment({ data: sessionData() })

      expect(
        checkout.ModificationsApi.cancelAuthorisedPaymentByPspReference
      ).not.toHaveBeenCalled()
    })
  })

  describe("getWebhookActionAndData", () => {
    it("maps a successful authorisation", async () => {
      const { provider } = createProvider()

      expect(await provider.getWebhookActionAndData(webhook({}))).toEqual({
        action: PaymentActions.AUTHORIZED,
        data: { session_id: SESSION_ID, amount: 10 },
      })
    })

    it("maps an authorisation to captured when auto-capture is enabled", async () => {
      const { provider } = createProvider({ capture: true })

      const result = await provider.getWebhookActionAndData(webhook({}))

      expect(result.action).toEqual(PaymentActions.SUCCESSFUL)
    })

    it("maps a failed authorisation", async () => {
      const { provider } = createProvider()

      const result = await provider.getWebhookActionAndData(
        webhook({
          success: Types.notification.NotificationRequestItem.SuccessEnum.False,
        })
      )

      expect(result.action).toEqual(PaymentActions.FAILED)
    })

    it("rejects an invalid signature", async () => {
      const { provider } = createProvider()

      const result = await provider.getWebhookActionAndData(
        webhook({}, "00".repeat(32))
      )

      expect(result).toEqual({ action: PaymentActions.NOT_SUPPORTED })
    })

    it("rejects webhooks when no HMAC key is configured", async () => {
      const { provider } = createProvider({ hmacKey: undefined })

      const result = await provider.getWebhookActionAndData(webhook({}))

      expect(result).toEqual({ action: PaymentActions.NOT_SUPPORTED })
    })

    it("ignores other merchant accounts and references", async () => {
      const { provider } = createProvider()

      const results = await Promise.all([
        provider.getWebhookActionAndData(
          webhook({ merchantAccountCode: "OtherMerchant" })
        ),
        provider.getWebhookActionAndData(
          webhook({ merchantReference: "order_123" })
        ),
      ])

      expect(results).toEqual([
        { action: PaymentActions.NOT_SUPPORTED },
        { action: PaymentActions.NOT_SUPPORTED },
      ])
    })

    it("logs failed captures", async () => {
      const { provider } = createProvider()

      const result = await provider.getWebhookActionAndData(
        webhook({
          eventCode:
            Types.notification.NotificationRequestItem.EventCodeEnum
              .CaptureFailed,
          reason: "Insufficient balance",
        })
      )

      expect(result).toEqual({ action: PaymentActions.NOT_SUPPORTED })
      expect(logger.error).toHaveBeenCalledWith(
        expect.stringContaining("Insufficient balance")
      )
    })
  })

  describe("saved payment methods", () => {
    const accountHolder = { data: { id: "cus_123" } }
    const paymentMethod = { type: "scheme", encryptedCardNumber: "enc" }

    it("fetches the shopper's saved cards when initiating a payment", async () => {
      const { provider, checkout } = createProvider()

      const result = await provider.initiatePayment({
        amount: 10,
        currency_code: "eur",
        data: { session_id: SESSION_ID },
        context: { account_holder: accountHolder },
      })

      expect(checkout.PaymentsApi.paymentMethods).toHaveBeenCalledWith(
        expect.objectContaining({ shopperReference: "cus_123" })
      )
      expect(result.data).toEqual(
        expect.objectContaining({ shopper_reference: "cus_123" })
      )
    })

    it("saves the card when the shopper chooses to", async () => {
      const { provider, checkout } = createProvider()
      checkout.PaymentsApi.payments.mockResolvedValue({
        resultCode: "Authorised",
        pspReference: "PSP_123",
      })

      await provider.authorizePayment({
        data: sessionData({
          shopper_reference: "cus_123",
          client: { payment_method: paymentMethod, store_payment_method: true },
        }),
      })

      expect(checkout.PaymentsApi.payments).toHaveBeenCalledWith(
        expect.objectContaining({
          shopperReference: "cus_123",
          storePaymentMethod: true,
          recurringProcessingModel: "CardOnFile",
        }),
        expect.any(Object)
      )
    })

    it("doesn't save the card without an account holder", async () => {
      const { provider, checkout } = createProvider()
      checkout.PaymentsApi.payments.mockResolvedValue({
        resultCode: "Authorised",
        pspReference: "PSP_123",
      })

      await provider.authorizePayment({
        data: sessionData({
          client: { payment_method: paymentMethod, store_payment_method: true },
        }),
      })

      const request = checkout.PaymentsApi.payments.mock.calls[0][0]
      expect(request.shopperReference).toBeUndefined()
      expect(request.storePaymentMethod).toBeUndefined()
      expect(request.recurringProcessingModel).toBeUndefined()
    })

    it("pays with a saved card using the session's shopper reference", async () => {
      const { provider, checkout } = createProvider()
      checkout.PaymentsApi.payments.mockResolvedValue({
        resultCode: "Authorised",
        pspReference: "PSP_123",
      })

      await provider.authorizePayment({
        data: sessionData({
          shopper_reference: "cus_123",
          client: {
            payment_method: {
              type: "scheme",
              storedPaymentMethodId: "TOKEN_1",
            },
          },
        }),
      })

      expect(checkout.PaymentsApi.payments).toHaveBeenCalledWith(
        expect.objectContaining({
          shopperReference: "cus_123",
          recurringProcessingModel: "CardOnFile",
          paymentMethod: { type: "scheme", storedPaymentMethodId: "TOKEN_1" },
        }),
        expect.any(Object)
      )
      expect(
        checkout.PaymentsApi.payments.mock.calls[0][0].storePaymentMethod
      ).toBeUndefined()
    })

    it("lists the shopper's saved cards", async () => {
      const { provider, checkout } = createProvider()

      const result = await provider.listPaymentMethods({
        context: { account_holder: accountHolder },
      })

      expect(
        checkout.RecurringApi.getTokensForStoredPaymentDetails
      ).toHaveBeenCalledWith("cus_123", MERCHANT_ACCOUNT)
      expect(result).toEqual([
        {
          id: "TOKEN_1",
          data: { id: "TOKEN_1", brand: "visa", lastFour: "1142" },
        },
        {
          id: "TOKEN_2",
          data: { id: "TOKEN_2", brand: "mc", lastFour: "1115" },
        },
      ])
    })

    it("lists no saved cards without an account holder", async () => {
      const { provider, checkout } = createProvider()

      expect(await provider.listPaymentMethods({ context: {} })).toEqual([])
      expect(
        checkout.RecurringApi.getTokensForStoredPaymentDetails
      ).not.toHaveBeenCalled()
    })

    it("saves a card without a payment", async () => {
      const { provider, checkout } = createProvider()

      const result = await provider.savePaymentMethod({
        data: { payment_method: paymentMethod },
        context: {
          account_holder: accountHolder,
          customer: { id: "cus_123", email: "a@b.c" },
          idempotency_key: "key_123",
        },
      })

      expect(checkout.RecurringApi.storedPaymentMethods).toHaveBeenCalledWith(
        {
          merchantAccount: MERCHANT_ACCOUNT,
          shopperReference: "cus_123",
          paymentMethod,
          recurringProcessingModel: "CardOnFile",
          shopperEmail: "a@b.c",
        },
        { idempotencyKey: "key_123" }
      )
      expect(result).toEqual({
        id: "TOKEN_3",
        data: { id: "TOKEN_3", brand: "visa", lastFour: "1142" },
      })
    })

    it("requires an account holder to save a card", async () => {
      const { provider } = createProvider()

      await expect(
        provider.savePaymentMethod({
          data: { payment_method: paymentMethod },
          context: {},
        })
      ).rejects.toThrow("Adyen saved payment methods require an account holder")
    })

    it("deletes a saved card", async () => {
      const { provider, checkout } = createProvider()

      await provider.deletePaymentMethod({
        data: { id: "TOKEN_1" },
        context: { account_holder: accountHolder },
      })

      expect(
        checkout.RecurringApi.deleteTokenForStoredPaymentDetails
      ).toHaveBeenCalledWith("TOKEN_1", "cus_123", MERCHANT_ACCOUNT)
    })

    it("deletes the saved cards with the account holder", async () => {
      const { provider, checkout } = createProvider()

      await provider.deleteAccountHolder({
        context: { account_holder: accountHolder },
      })

      expect(
        checkout.RecurringApi.deleteTokenForStoredPaymentDetails.mock.calls
      ).toEqual([
        ["TOKEN_1", "cus_123", MERCHANT_ACCOUNT],
        ["TOKEN_2", "cus_123", MERCHANT_ACCOUNT],
      ])
    })
  })

  describe("createAccountHolder", () => {
    it("uses the customer ID as the shopper reference", async () => {
      const { provider } = createProvider()

      expect(
        await provider.createAccountHolder({
          context: { customer: { id: "cus_123", email: "a@b.c" } },
        })
      ).toEqual({ id: "cus_123", data: { id: "cus_123" } })
    })
  })
})

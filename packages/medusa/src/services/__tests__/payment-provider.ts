import { asValue, createContainer } from "awilix"
import { MockRepository } from "medusa-test-utils"
import PaymentProviderService from "../payment-provider"
import { defaultContainer, defaultPaymentSessionInputData, PaymentProcessor, } from "../__fixtures__/payment-provider"
import { testPayServiceMock } from "../__mocks__/test-pay"
import { EOL } from "os"
import { PaymentSessionStatus } from "../../models";

describe("PaymentProviderService", () => {
  describe("retrieveProvider", () => {
    const container = createContainer({}, defaultContainer)
    container.register("pp_default_provider", asValue("good"))

    const providerService = container.resolve("paymentProviderService")

    it("successfully retrieves payment provider", () => {
      const provider = providerService.retrieveProvider("default_provider")
      expect(provider).toEqual("good")
    })

    it("fails when payment provider not found", () => {
      try {
        providerService.retrieveProvider("unregistered")
      } catch (err) {
        expect(err.message).toEqual(
          "Could not find a payment provider with id: unregistered"
        )
      }
    })
  })

  describe("createSession", () => {
    const container = createContainer({}, defaultContainer)
    container.register(
      "pp_default_provider",
      asValue({
        withTransaction: function () {
          return this
        },
        createPayment: jest.fn().mockReturnValue(Promise.resolve({})),
      })
    )

    const providerService = container.resolve("paymentProviderService")

    it("successfully creates session", async () => {
      await providerService.createSession("default_provider", {
        object: "cart",
        region: {
          currency_code: "usd",
        },
        total: 100,
      })

      const defaultProvider = container.resolve("pp_default_provider")

      expect(defaultProvider.createPayment).toBeCalledTimes(1)
      expect(defaultProvider.createPayment).toBeCalledWith({
        amount: 100,
        object: "cart",
        total: 100,
        region: {
          currency_code: "usd",
        },
        cart: {
          context: undefined,
          email: undefined,
          id: undefined,
          shipping_address: undefined,
          shipping_methods: undefined,
        },
        currency_code: "usd",
      })
    })
  })

  describe("updateSession", () => {
    const container = createContainer({}, defaultContainer)
    container
      .register(
        "paymentSessionRepository",
        asValue(
          MockRepository({
            findOne: () =>
              Promise.resolve({
                id: "session",
                provider_id: "default_provider",
                data: {
                  id: "1234",
                },
              }),
          })
        )
      )
      .register(
        "pp_default_provider",
        asValue({
          withTransaction: function () {
            return this
          },
          updatePayment: jest.fn().mockReturnValue(Promise.resolve({})),
        })
      )

    const providerService = container.resolve("paymentProviderService")

    it("successfully creates session", async () => {
      await providerService.updateSession(
        {
          id: "session",
          provider_id: "default_provider",
          data: {
            id: "1234",
          },
        },
        {
          object: "cart",
          total: 100,
        }
      )

      const defaultProvider = container.resolve("pp_default_provider")

      expect(defaultProvider.updatePayment).toBeCalledTimes(1)
      expect(defaultProvider.updatePayment).toBeCalledWith(
        { id: "1234" },
        {
          object: "cart",
          amount: 100,
          total: 100,
          cart: {
            context: undefined,
            email: undefined,
            id: undefined,
            shipping_address: undefined,
            shipping_methods: undefined,
          },
          currency_code: undefined,
        }
      )
    })
  })
})

describe(`PaymentProviderService`, () => {
  const container = createContainer({}, defaultContainer)
  container.register("pp_default_provider", asValue(testPayServiceMock))
  container
    .register(
      "paymentSessionRepository",
      asValue(
        MockRepository({
          findOne: () =>
            Promise.resolve({
              id: "session",
              provider_id: "default_provider",
              data: {
                id: "1234",
              },
            }),
        })
      )
    )
    .register(
      "paymentRepository",
      asValue(
        MockRepository({
          findOne: () =>
            Promise.resolve({
              id: "pay_jadazdjk",
              provider_id: "default_provider",
              data: {
                id: "1234",
              },
            }),
          find: () =>
            Promise.resolve([
              {
                id: "pay_jadazdjk",
                provider_id: "default_provider",
                data: {
                  id: "1234",
                },
                captured_at: new Date(),
                amount: 100,
                amount_refunded: 0,
              },
            ]),
        })
      )
    )

  const providerService = container.resolve("paymentProviderService")

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("successfully retrieves payment provider", () => {
    const provider = providerService.retrieveProvider("default_provider")
    expect(provider.identifier).toEqual("test-pay")
  })

  it("successfully creates session", async () => {
    await providerService.createSession("default_provider", {
      object: "cart",
      region: {
        currency_code: "usd",
      },
      total: 100,
    })

    expect(testPayServiceMock.createPayment).toBeCalledTimes(1)
    expect(testPayServiceMock.createPayment).toBeCalledWith({
      amount: 100,
      object: "cart",
      total: 100,
      region: {
        currency_code: "usd",
      },
      cart: {
        context: undefined,
        email: undefined,
        id: undefined,
        shipping_address: undefined,
        shipping_methods: undefined,
      },
      currency_code: "usd",
    })
  })

  it("successfully update session", async () => {
    await providerService.updateSession(
      {
        id: "session",
        provider_id: "default_provider",
        data: {
          id: "1234",
        },
      },
      {
        object: "cart",
        total: 100,
      }
    )

    expect(testPayServiceMock.updatePayment).toBeCalledTimes(1)
    expect(testPayServiceMock.updatePayment).toBeCalledWith(
      { id: "1234" },
      {
        amount: 100,
        object: "cart",
        total: 100,
        cart: {
          context: undefined,
          email: undefined,
          id: undefined,
          shipping_address: undefined,
          shipping_methods: undefined,
        },
      }
    )
  })

  it("successfully refresh session", async () => {
    await providerService.refreshSession(
      {
        id: "session",
        provider_id: "default_provider",
        data: {
          id: "1234",
        },
      },
      {
        provider_id: "default_provider",
        amount: 100,
        currency_code: "usd",
      }
    )

    expect(testPayServiceMock.deletePayment).toBeCalledTimes(1)
    expect(testPayServiceMock.createPayment).toBeCalledTimes(1)
  })

  it("successfully delete session", async () => {
    await providerService.deleteSession({
      id: "session",
      provider_id: "default_provider",
      data: {
        id: "1234",
      },
    })

    expect(testPayServiceMock.deletePayment).toBeCalledTimes(1)
  })

  it("successfully delete session", async () => {
    await providerService.deleteSession({
      id: "session",
      provider_id: "default_provider",
      data: {
        id: "1234",
      },
    })

    expect(testPayServiceMock.deletePayment).toBeCalledTimes(1)
  })

  it("successfully authorize payment", async () => {
    await providerService.authorizePayment(
      {
        id: "session",
        provider_id: "default_provider",
        data: {
          id: "1234",
        },
      },
      {}
    )

    expect(testPayServiceMock.authorizePayment).toBeCalledTimes(1)
  })

  it("successfully update session data", async () => {
    await providerService.updateSessionData(
      {
        id: "session",
        provider_id: "default_provider",
        data: {
          id: "1234",
        },
      },
      {}
    )

    expect(testPayServiceMock.updatePaymentData).toBeCalledTimes(1)
  })

  it("successfully cancel payment", async () => {
    await providerService.cancelPayment({
      id: "pay_jadazdjk",
    })
    expect(testPayServiceMock.cancelPayment).toBeCalledTimes(1)
  })

  it("successfully capture payment", async () => {
    await providerService.capturePayment({
      id: "pay_jadazdjk",
    })
    expect(testPayServiceMock.capturePayment).toBeCalledTimes(1)
  })

  it("successfully refund payment", async () => {
    await providerService.refundPayment(
      [
        {
          id: "pay_jadazdjk",
        },
      ],
      50
    )
    expect(testPayServiceMock.refundPayment).toBeCalledTimes(1)
  })
})

describe("PaymentProviderService using AbstractPaymentProcessor", () => {
  const paymentProcessorResolutionKey = "pp_payment_processor"
  const paymentServiceResolutionKey = "paymentProviderService"
  const paymentProviderId = "payment_processor"

  describe("createSession", () => {
    const container = createContainer({}, defaultContainer)

    const mockPaymentProcessor = new PaymentProcessor(container)
    mockPaymentProcessor.initiatePayment = jest
      .fn()
      .mockReturnValue(Promise.resolve({ session_data: {} }))

    container.register(
      paymentProcessorResolutionKey,
      asValue(mockPaymentProcessor)
    )

    const providerService = container.resolve(paymentServiceResolutionKey)

    it("successfully creates session", async () => {
      await providerService.createSession(defaultPaymentSessionInputData)

      const provider = container.resolve(paymentProcessorResolutionKey)

      expect(provider.initiatePayment).toBeCalledTimes(1)
      expect(provider.initiatePayment).toBeCalledWith({
        billing_address: defaultPaymentSessionInputData.cart.billing_address,
        email: defaultPaymentSessionInputData.cart.email,
        currency_code: defaultPaymentSessionInputData.currency_code,
        amount: defaultPaymentSessionInputData.amount,
        resource_id: undefined,
        customer: undefined,
        context: {},
        paymentSessionData: {},
      })
    })

    it("throw an error using the provider error response", async () => {
      const errResponse = {
        error: "Error",
        code: 400,
        details: "Error details",
      }

      const mockPaymentProcessor = new PaymentProcessor(container)
      mockPaymentProcessor.initiatePayment = jest
        .fn()
        .mockReturnValue(Promise.resolve(errResponse))

      container.register(
        paymentProcessorResolutionKey,
        asValue(mockPaymentProcessor)
      )

      const providerService = container.resolve(paymentServiceResolutionKey)

      const err = await providerService
        .createSession(defaultPaymentSessionInputData)
        .catch((e) => e)

      expect(err.message).toBe(
        `${errResponse.error}:${EOL}${errResponse.details}`
      )
    })
  })

  describe("refreshSession", () => {
    const sessionId = "test-session"
    const externalId = "external-id"
    const paymentSessionData = { id: externalId }

    const container = createContainer({}, defaultContainer)

    const mockPaymentProcessor = new PaymentProcessor(container)
    mockPaymentProcessor.deletePayment = jest
      .fn()
      .mockReturnValue(Promise.resolve())
    mockPaymentProcessor.initiatePayment = jest
      .fn()
      .mockReturnValue(Promise.resolve({ session_data: paymentSessionData }))

    container
      .register(paymentProcessorResolutionKey, asValue(mockPaymentProcessor))
      .register(
        "paymentSessionRepository",
        asValue(
          MockRepository({
            findOne: jest
              .fn()
              .mockImplementation(async () => ({ data: paymentSessionData })),
          })
        )
      )

    const providerService = container.resolve(paymentServiceResolutionKey)

    it("successfully refresh a session", async () => {
      await providerService.refreshSession(
        {
          id: sessionId,
          data: paymentSessionData,
          provider_id: paymentProviderId,
        },
        defaultPaymentSessionInputData
      )

      const provider = container.resolve(paymentProcessorResolutionKey)

      expect(provider.deletePayment).toBeCalledTimes(1)
      expect(provider.deletePayment).toBeCalledWith({ id: externalId })

      expect(provider.initiatePayment).toBeCalledTimes(1)
      expect(provider.initiatePayment).toBeCalledWith({
        billing_address: defaultPaymentSessionInputData.cart.billing_address,
        email: defaultPaymentSessionInputData.cart.email,
        currency_code: defaultPaymentSessionInputData.currency_code,
        amount: defaultPaymentSessionInputData.amount,
        resource_id: undefined,
        customer: undefined,
        context: {},
        paymentSessionData: {},
      })
    })

    it("throw an error using the provider error response", async () => {
      const errResponse = {
        error: "Error",
        code: 400,
        details: "Error details",
      }

      const mockPaymentProcessor = new PaymentProcessor(container)
      mockPaymentProcessor.deletePayment = jest
        .fn()
        .mockReturnValue(Promise.resolve(errResponse))

      container.register(
        paymentProcessorResolutionKey,
        asValue(mockPaymentProcessor)
      )

      const providerService = container.resolve(paymentServiceResolutionKey)

      const err = await providerService
        .refreshSession(
          {
            id: sessionId,
            data: paymentSessionData,
            provider_id: paymentProviderId,
          },
          defaultPaymentSessionInputData
        )
        .catch((e) => e)

      expect(err.message).toBe(
        `${errResponse.error}:${EOL}${errResponse.details}`
      )
    })
  })

  describe("updateSession", () => {
    const sessionId = "test-session"
    const externalId = "external-id"
    const paymentSessionData = { id: externalId }

    const container = createContainer({}, defaultContainer)

    const mockPaymentProcessor = new PaymentProcessor(container)
    mockPaymentProcessor.updatePayment = jest
      .fn()
      .mockReturnValue(Promise.resolve({ session_data: paymentSessionData }))

    container
      .register(paymentProcessorResolutionKey, asValue(mockPaymentProcessor))
      .register(
        "paymentSessionRepository",
        asValue(
          MockRepository({
            findOne: jest
              .fn()
              .mockImplementation(async () => ({ data: paymentSessionData })),
          })
        )
      )

    const providerService = container.resolve(paymentServiceResolutionKey)

    it("successfully update a session", async () => {
      await providerService.updateSession(
        {
          id: sessionId,
          data: paymentSessionData,
          provider_id: paymentProviderId,
        },
        defaultPaymentSessionInputData
      )

      const provider = container.resolve(paymentProcessorResolutionKey)

      expect(provider.updatePayment).toBeCalledTimes(1)
      expect(provider.updatePayment).toBeCalledWith({
        billing_address: defaultPaymentSessionInputData.cart.billing_address,
        email: defaultPaymentSessionInputData.cart.email,
        currency_code: defaultPaymentSessionInputData.currency_code,
        amount: defaultPaymentSessionInputData.amount,
        resource_id: undefined,
        customer: undefined,
        context: {},
        paymentSessionData,
      })
    })

    it("throw an error using the provider error response", async () => {
      const errResponse = {
        error: "Error",
        code: 400,
        details: "Error details",
      }

      const mockPaymentProcessor = new PaymentProcessor(container)
      mockPaymentProcessor.updatePayment = jest
        .fn()
        .mockReturnValue(Promise.resolve(errResponse))

      container.register(
        paymentProcessorResolutionKey,
        asValue(mockPaymentProcessor)
      )

      const providerService = container.resolve(paymentServiceResolutionKey)

      const err = await providerService
        .updateSession(
          {
            id: sessionId,
            data: paymentSessionData,
            provider_id: paymentProviderId,
          },
          defaultPaymentSessionInputData
        )
        .catch((e) => e)

      expect(err.message).toBe(
        `${errResponse.error}:${EOL}${errResponse.details}`
      )
    })
  })

  describe("deleteSession", () => {
    const sessionId = "test-session"
    const externalId = "external-id"
    const paymentSessionData = { id: externalId }

    const container = createContainer({}, defaultContainer)

    const mockPaymentProcessor = new PaymentProcessor(container)
    mockPaymentProcessor.deletePayment = jest.fn()

    container
      .register(paymentProcessorResolutionKey, asValue(mockPaymentProcessor))
      .register(
        "paymentSessionRepository",
        asValue(
          MockRepository({
            findOne: jest
              .fn()
              .mockImplementation(async () => ({ data: paymentSessionData })),
          })
        )
      )

    const providerService = container.resolve(paymentServiceResolutionKey)

    it("successfully delete a session", async () => {
      await providerService.deleteSession({
        id: sessionId,
        data: paymentSessionData,
        provider_id: paymentProviderId,
      })

      const provider = container.resolve(paymentProcessorResolutionKey)

      expect(provider.deletePayment).toBeCalledTimes(1)
      expect(provider.deletePayment).toBeCalledWith(paymentSessionData)
    })

    it("throw an error using the provider error response", async () => {
      const errResponse = {
        error: "Error",
        code: 400,
        details: "Error details",
      }

      const mockPaymentProcessor = new PaymentProcessor(container)
      mockPaymentProcessor.deletePayment = jest
        .fn()
        .mockReturnValue(Promise.resolve(errResponse))

      container.register(
        paymentProcessorResolutionKey,
        asValue(mockPaymentProcessor)
      )

      const providerService = container.resolve(paymentServiceResolutionKey)

      const err = await providerService
        .deleteSession({
          id: sessionId,
          data: paymentSessionData,
          provider_id: paymentProviderId,
        })
        .catch((e) => e)

      expect(err.message).toBe(
        `${errResponse.error}:${EOL}${errResponse.details}`
      )
    })
  })

  describe("createPayment", () => {
    const sessionId = "test-session"
    const externalId = "external-id"
    const paymentInput = {
      cart_id: defaultPaymentSessionInputData.cart.id,
      amount: defaultPaymentSessionInputData.amount,
      currency_code: defaultPaymentSessionInputData.currency_code,
      provider_id: defaultPaymentSessionInputData.provider_id,
      payment_session: {
        id: sessionId,
        data: { id: externalId }
      }
    }

    const container = createContainer({}, defaultContainer)

    const mockPaymentProcessor = new PaymentProcessor(container)
    mockPaymentProcessor.retrievePayment = jest.fn().mockReturnValue(Promise.resolve({}))

    container
      .register(paymentProcessorResolutionKey, asValue(mockPaymentProcessor))

    const providerService = container.resolve(paymentServiceResolutionKey)

    it("successfully create a payment", async () => {
      await providerService.createPayment(paymentInput)

      const provider = container.resolve(paymentProcessorResolutionKey)

      expect(provider.retrievePayment).toBeCalledTimes(1)
      expect(provider.retrievePayment).toBeCalledWith(paymentInput.payment_session.data)
    })

    it("throw an error using the provider error response", async () => {
      const errResponse = {
        error: "Error",
        code: 400,
        details: "Error details",
      }

      const mockPaymentProcessor = new PaymentProcessor(container)
      mockPaymentProcessor.retrievePayment = jest
        .fn()
        .mockReturnValue(Promise.resolve(errResponse))

      container.register(
        paymentProcessorResolutionKey,
        asValue(mockPaymentProcessor)
      )

      const providerService = container.resolve(paymentServiceResolutionKey)

      const err = await providerService
        .createPayment(paymentInput)
        .catch((e) => e)

      expect(err.message).toBe(
        `${errResponse.error}:${EOL}${errResponse.details}`
      )
    })
  })

  describe("authorizePayment", () => {
    const externalId = "external-id"
    const paymentSession = {
      id: "test-session",
      data: { id: externalId },
      provider_id: paymentProviderId
    }
    const context = { ip: "0.0.0.0" }

    const container = createContainer({}, defaultContainer)

    const mockPaymentProcessor = new PaymentProcessor(container)
    mockPaymentProcessor.authorizePayment = jest.fn().mockReturnValue(Promise.resolve({}))

    container
      .register(paymentProcessorResolutionKey, asValue(mockPaymentProcessor))
      .register(
          "paymentSessionRepository",
          asValue(
            MockRepository({
              findOne: jest
                .fn()
                .mockImplementation(async () => ({ data: {} })),
            })
          )
        )

    const providerService = container.resolve(paymentServiceResolutionKey)

    it("successfully authorize a payment", async () => {
      await providerService.authorizePayment(paymentSession, context)

      const provider = container.resolve(paymentProcessorResolutionKey)

      expect(provider.authorizePayment).toBeCalledTimes(1)
      expect(provider.authorizePayment).toBeCalledWith(paymentSession.data, context)
    })

    it("throw an error using the provider error response", async () => {
      const errResponse = {
        error: "Error",
        code: 400,
        details: "Error details",
      }

      const mockPaymentProcessor = new PaymentProcessor(container)
      mockPaymentProcessor.authorizePayment = jest
        .fn()
        .mockReturnValue(Promise.resolve(errResponse))

      container.register(
        paymentProcessorResolutionKey,
        asValue(mockPaymentProcessor)
      )

      const providerService = container.resolve(paymentServiceResolutionKey)

      const err = await providerService
        .authorizePayment(paymentSession, context)
        .catch((e) => e)

      expect(err.message).toBe(
        `${errResponse.error}:${EOL}${errResponse.details}`
      )
    })
  })

  describe("cancelPayment", () => {
    const externalId = "external-id"
    const payment = {
      id: "payment-id",
      data: { id: externalId },
      provider_id: paymentProviderId
    }

    const container = createContainer({}, defaultContainer)

    const mockPaymentProcessor = new PaymentProcessor(container)
    mockPaymentProcessor.cancelPayment = jest.fn().mockReturnValue(Promise.resolve())

    container
      .register(paymentProcessorResolutionKey, asValue(mockPaymentProcessor))
      .register(
          "paymentRepository",
          asValue(
            MockRepository({
              findOne: jest
                .fn()
                .mockImplementation(async () => payment),
            })
          )
        )

    const providerService = container.resolve(paymentServiceResolutionKey)

    it("successfully cancel a payment", async () => {
      await providerService.cancelPayment(payment)

      const provider = container.resolve(paymentProcessorResolutionKey)

      expect(provider.cancelPayment).toBeCalledTimes(1)
      expect(provider.cancelPayment).toBeCalledWith(payment.data)
    })

    it("throw an error using the provider error response", async () => {
      const errResponse = {
        error: "Error",
        code: 400,
        details: "Error details",
      }

      const mockPaymentProcessor = new PaymentProcessor(container)
      mockPaymentProcessor.cancelPayment = jest
        .fn()
        .mockReturnValue(Promise.resolve(errResponse))

      container.register(
        paymentProcessorResolutionKey,
        asValue(mockPaymentProcessor)
      )

      const providerService = container.resolve(paymentServiceResolutionKey)

      const err = await providerService
        .cancelPayment(payment)
        .catch((e) => e)

      expect(err.message).toBe(
        `${errResponse.error}:${EOL}${errResponse.details}`
      )
    })
  })

  describe("getStatus", () => {
    const payment = {
      data: { id: "id" },
      provider_id: paymentProviderId
    }

    const container = createContainer({}, defaultContainer)

    const mockPaymentProcessor = new PaymentProcessor(container)
    mockPaymentProcessor.getPaymentStatus = jest
      .fn()
      .mockReturnValue(Promise.resolve(PaymentSessionStatus.PENDING))

    container
      .register(paymentProcessorResolutionKey, asValue(mockPaymentProcessor))
      .register(
          "paymentRepository",
          asValue(
            MockRepository({
              findOne: jest
                .fn()
                .mockImplementation(async () => payment),
            })
          )
        )

    const providerService = container.resolve(paymentServiceResolutionKey)

    it("successfully cancel a payment", async () => {
      await providerService.getStatus(payment)

      const provider = container.resolve(paymentProcessorResolutionKey)

      expect(provider.getPaymentStatus).toBeCalledTimes(1)
      expect(provider.getPaymentStatus).toBeCalledWith(payment.data)
    })
  })

  describe("capturePayment", () => {
    const externalId = "external-id"
    const payment = {
      data: { id: externalId },
      id: "payment-id",
      provider_id: paymentProviderId
    }

    const container = createContainer({}, defaultContainer)

    const mockPaymentProcessor = new PaymentProcessor(container)
    mockPaymentProcessor.capturePayment = jest.fn().mockReturnValue(Promise.resolve(payment.data))

    container
      .register(paymentProcessorResolutionKey, asValue(mockPaymentProcessor))
      .register(
          "paymentRepository",
          asValue(
            MockRepository({
              findOne: jest
                .fn()
                .mockImplementation(async () => payment),
            })
          )
        )

    const providerService = container.resolve(paymentServiceResolutionKey)

    it("successfully capture a payment", async () => {
      await providerService.capturePayment(payment)

      const provider = container.resolve(paymentProcessorResolutionKey)

      expect(provider.capturePayment).toBeCalledTimes(1)
      expect(provider.capturePayment).toBeCalledWith(payment.data)
    })

    it("throw an error using the provider error response", async () => {
      const errResponse = {
        error: "Error",
        code: 400,
        details: "Error details",
      }

      const mockPaymentProcessor = new PaymentProcessor(container)
      mockPaymentProcessor.capturePayment = jest
        .fn()
        .mockReturnValue(Promise.resolve(errResponse))

      container.register(
        paymentProcessorResolutionKey,
        asValue(mockPaymentProcessor)
      )

      const providerService = container.resolve(paymentServiceResolutionKey)

      const err = await providerService
        .capturePayment(payment)
        .catch((e) => e)

      expect(err.message).toBe(
        `${errResponse.error}:${EOL}${errResponse.details}`
      )
    })
  })
})

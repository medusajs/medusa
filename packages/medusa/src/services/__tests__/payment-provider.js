import { asValue, createContainer } from "awilix"
import { MockRepository } from "medusa-test-utils"
import PaymentProviderService from "../payment-provider"
import { defaultContainer } from "../__fixtures__/payment-provider"
import { testPayServiceMock } from "../__mocks__/test-pay"

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
    container.register(
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
    container.register(
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
  container.register(
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
  container.register(
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

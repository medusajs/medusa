import { MockManager, MockRepository } from "medusa-test-utils"
import PaymentProviderService from "../payment-provider"
import { testPayServiceMock } from "../__mocks__/test-pay"
import { FlagRouter } from "../../utils/flag-router"
import { PostgresError } from "../../utils"

describe("PaymentProviderService", () => {
  describe("retrieveProvider", () => {
    const container = {
      manager: MockManager,
      paymentSessionRepository: MockRepository(),
      pp_default_provider: "good",
    }

    const providerService = new PaymentProviderService(container)

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
    const createPayment = jest.fn().mockReturnValue(Promise.resolve())
    const container = {
      manager: MockManager,
      paymentSessionRepository: MockRepository(),
      pp_default_provider: {
        withTransaction: function () {
          return this
        },
        createPayment,
      },
    }

    const providerService = new PaymentProviderService(container)

    it("successfully creates session", async () => {
      await providerService.createSession("default_provider", {
        total: 100,
      })

      expect(createPayment).toBeCalledTimes(1)
      expect(createPayment).toBeCalledWith({
        total: 100,
      })
    })
  })

  describe("updateSession", () => {
    const updatePayment = jest.fn().mockReturnValue(Promise.resolve())

    const container = {
      manager: MockManager,
      paymentSessionRepository: MockRepository({
        findOne: () =>
          Promise.resolve({
            id: "session",
            provider_id: "default_provider",
            data: {
              id: "1234",
            },
          }),
      }),
      pp_default_provider: {
        withTransaction: function () {
          return this
        },
        updatePayment,
      },
    }

    const providerService = new PaymentProviderService(container)

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
          total: 100,
        }
      )

      expect(updatePayment).toBeCalledTimes(1)
      expect(updatePayment).toBeCalledWith(
        { id: "1234" },
        {
          total: 100,
        }
      )
    })
  })
})

describe(`PaymentProviderService`, () => {
  const featureFlagRouter = new FlagRouter({
    order_editing: false,
  })

  const container = {
    manager: MockManager,
    paymentSessionRepository: MockRepository({
      findOne: () =>
        Promise.resolve({
          id: "session",
          provider_id: "default_provider",
          data: {
            id: "1234",
          },
        }),
    }),
    paymentRepository: MockRepository({
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
    }),
    refundRepository: MockRepository(),
    pp_default_provider: testPayServiceMock,
    featureFlagRouter,
  }
  const providerService = new PaymentProviderService(container)

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("successfully retrieves payment provider", () => {
    const provider = providerService.retrieveProvider("default_provider")
    expect(provider.identifier).toEqual("test-pay")
  })

  it("successfully creates session", async () => {
    await providerService.createSession("default_provider", {
      total: 100,
    })

    expect(testPayServiceMock.createPayment).toBeCalledTimes(1)
    expect(testPayServiceMock.createPayment).toBeCalledWith({
      total: 100,
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
        total: 100,
      }
    )

    expect(testPayServiceMock.updatePayment).toBeCalledTimes(1)
    expect(testPayServiceMock.updatePayment).toBeCalledWith(
      { id: "1234" },
      {
        total: 100,
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
        total: 100,
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

  describe("handleWebHookEvent", () => {
    let paymentProviderService
    const loggerMock = { warn: jest.fn() }

    beforeEach(() => {
      const container = {
        manager: MockManager,
        logger: loggerMock,
      }

      paymentProviderService = new PaymentProviderService(container)
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    it("should return statuCode 200", async () => {
      const handler = () => Promise.resolve()

      const { statusCode } = await paymentProviderService.handleWebHookEvent(
        "test",
        handler
      )

      expect(statusCode).toBe(200)
    })

    it("should return statusCode 409 and log a warning a message", async () => {
      const event = "test"
      const handler = () => Promise.reject(new Error(""))

      const { statusCode } = await paymentProviderService
        .withTransaction(MockManager)
        .handleWebHookEvent(event, handler)

      expect(statusCode).toBe(409)
      expect(loggerMock.warn).toHaveBeenCalledTimes(1)
      expect(loggerMock.warn).toHaveBeenCalledWith(
        `Payment webhook ${event} handling failed\n`
      )
    })

    it("should return statusCode 409 and log a SERIALIZATION_FAILURE warning a message", async () => {
      const event = "test"
      const handler = () => {
        return Promise.reject({
          code: PostgresError.SERIALIZATION_FAILURE,
          message: "failed",
        })
      }

      const { statusCode } = await paymentProviderService
        .withTransaction(MockManager)
        .handleWebHookEvent(event, handler)

      expect(statusCode).toBe(409)
      expect(loggerMock.warn).toHaveBeenCalledTimes(1)
      expect(loggerMock.warn).toHaveBeenCalledWith(
        `Payment webhook ${event} handle failed. This can happen when this webhook is triggered during a cart completion and can be ignored. This event should be retried automatically.\nfailed`
      )
    })
  })
})

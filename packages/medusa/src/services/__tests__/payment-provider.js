import { MockManager, MockRepository } from "medusa-test-utils"
import PaymentProviderService from "../payment-provider"
import TestPayService from "../__mocks__/test-pay"

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
        Promise.resolve([{
          id: "pay_jadazdjk",
          provider_id: "default_provider",
          data: {
            id: "1234",
          },
          captured_at: new Date(),
          amount: 100,
          amount_refunded: 0
        }]),
    }),
    refundRepository: MockRepository(),
    pp_default_provider: new TestPayService(),
  }
  const providerService = new PaymentProviderService(container)

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("successfully retrieves payment provider", () => {
    const provider = providerService.retrieveProvider("default_provider")
    expect(provider.constructor.identifier).toEqual("test-pay")
  })

  it("successfully creates session", async () => {
    await providerService.createSession("default_provider", {
      total: 100,
    })

    expect(TestPayService.prototype.createPayment).toBeCalledTimes(1)
    expect(TestPayService.prototype.createPayment).toBeCalledWith({
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

    expect(TestPayService.prototype.updatePayment).toBeCalledTimes(1)
    expect(TestPayService.prototype.updatePayment).toBeCalledWith(
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

    expect(TestPayService.prototype.deletePayment).toBeCalledTimes(1)
    expect(TestPayService.prototype.createPayment).toBeCalledTimes(1)
  })

  it("successfully delete session", async () => {
    await providerService.deleteSession(
      {
        id: "session",
        provider_id: "default_provider",
        data: {
          id: "1234",
        },
      }
    )

    expect(TestPayService.prototype.deletePayment).toBeCalledTimes(1)
  })

  it("successfully delete session", async () => {
    await providerService.deleteSession(
      {
        id: "session",
        provider_id: "default_provider",
        data: {
          id: "1234",
        },
      }
    )

    expect(TestPayService.prototype.deletePayment).toBeCalledTimes(1)
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

    expect(TestPayService.prototype.authorizePayment).toBeCalledTimes(1)
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

    expect(TestPayService.prototype.updatePaymentData).toBeCalledTimes(1)
  })

  it("successfully cancel payment", async () => {
    await providerService.cancelPayment({
      id: "pay_jadazdjk"
    })
    expect(TestPayService.prototype.cancelPayment).toBeCalledTimes(1)
  })

  it("successfully capture payment", async () => {
    await providerService.capturePayment({
      id: "pay_jadazdjk"
    })
    expect(TestPayService.prototype.capturePayment).toBeCalledTimes(1)
  })

  it("successfully refund payment", async () => {
    await providerService.refundPayment([{
      id: "pay_jadazdjk"
    }], 50)
    expect(TestPayService.prototype.refundPayment).toBeCalledTimes(1)
  })
})

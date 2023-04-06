import { isString } from "../../utils";

export const DefaultProviderMock = {
  getStatus: jest.fn().mockImplementation((data) => {
    if (data.money_id === "success") {
      return Promise.resolve("authorized")
    }

    if (data.money_id === "fail") {
      return Promise.resolve("fail")
    }

    return Promise.resolve("initial")
  }),
  retrievePayment: jest.fn().mockImplementation((data) => {
    return Promise.resolve(data)
  }),
  list: jest.fn().mockImplementation(() => {
    return Promise.resolve()
  }),
  capturePayment: jest.fn().mockReturnValue(Promise.resolve()),
  refundPayment: jest.fn().mockReturnValue(Promise.resolve()),
  cancelPayment: jest.fn().mockReturnValue(Promise.resolve({})),
  deletePayment: jest.fn().mockReturnValue(Promise.resolve({})),
  authorizePayment: jest.fn().mockReturnValue(Promise.resolve({})),
}

export const PaymentProviderServiceMock = {
  withTransaction: function () {
    return this
  },
  updateSession: jest.fn().mockImplementation((session, cart) => {
    return Promise.resolve({
      ...session,
      id: `${session.id}_updated`,
    })
  }),
  list: jest.fn().mockImplementation(() => {
    return Promise.resolve()
  }),
  registerInstalledProviders: jest.fn().mockImplementation(() => {
    return Promise.resolve()
  }),
  createSession: jest.fn().mockImplementation((providerIdOrSessionInput, cart) => {
    if (isString(providerIdOrSessionInput)) {
      return Promise.resolve({
        id: `${providerIdOrSessionInput}_session`,
        cartId: cart._id,
      })
    } else {
      return Promise.resolve({
        id: `${providerIdOrSessionInput.providerId}_session`,
      })
    }
  }),
  retrieveProvider: jest.fn().mockImplementation((providerId) => {
    if (providerId === "default_provider") {
      return DefaultProviderMock
    }
    throw new Error("Provider Not Found")
  }),
  refreshSession: jest.fn().mockImplementation((session, inputData) => {
    DefaultProviderMock.deletePayment()
    PaymentProviderServiceMock.createSession(inputData)
    return Promise.resolve({
      ...session,
      id: `${session.id}_refreshed`,
    })
  }),
  authorizePayment: jest
    .fn()
    .mockReturnValue(Promise.resolve({ status: "authorized" })),
  createPayment: jest.fn().mockImplementation((session, inputData) => {
    Promise.resolve(inputData)
  }),
}

const mock = jest.fn().mockImplementation(() => {
  return PaymentProviderServiceMock
})

export default mock

export const DefaultProviderMock = {
  getStatus: jest.fn().mockImplementation(data => {
    if (data.money_id === "success") {
      return Promise.resolve("authorized")
    }

    if (data.money_id === "fail") {
      return Promise.resolve("fail")
    }

    return Promise.resolve("initial")
  }),
}

export const PaymentProviderServiceMock = {
  retrieveProvider: jest.fn().mockImplementation(providerId => {
    if (providerId === "default_provider") {
      return DefaultProviderMock
    }
    return undefined
  }),
}

const mock = jest.fn().mockImplementation(() => {
  return PaymentProviderServiceMock
})

export default mock

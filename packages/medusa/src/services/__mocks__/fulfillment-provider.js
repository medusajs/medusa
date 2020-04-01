export const DefaultProviderMock = {
  validateOption: jest.fn().mockImplementation(data => {
    if (data.id === "new") {
      return Promise.resolve(true)
    }

    return Promise.resolve(false)
  }),
  canCalculate: jest.fn().mockImplementation(data => {
    if (data.id === "bonjour") {
      return Promise.resolve(true)
    }

    return Promise.resolve(false)
  }),
  calculatePrice: jest.fn().mockImplementation(data => {
    return Promise.resolve()
  }),
  createOrder: jest.fn().mockImplementation(data => {
    return Promise.resolve()
  }),
}

export const FulfillmentProviderServiceMock = {
  retrieveProvider: jest.fn().mockImplementation(providerId => {
    if (providerId === "default_provider") {
      return DefaultProviderMock
    }
    throw new Error("Provider Not Found")
  }),
}

const mock = jest.fn().mockImplementation(() => {
  return FulfillmentProviderServiceMock
})

export default mock

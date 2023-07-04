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
  cancelFulfillment: jest.fn().mockImplementation(data => {
    return {}
  }),
  calculatePrice: jest.fn().mockImplementation(data => {
    return Promise.resolve()
  }),
  createOrder: jest.fn().mockImplementation(data => {
    return Promise.resolve(data)
  }),
  getFulfillmentDocuments: jest.fn().mockImplementation(() => {
    return Promise.resolve([
      {
        name: "Test",
        type: "pdf",
        base_64: "verylong",
      },
    ])
  }),
  createReturn: jest.fn().mockImplementation(data => {
    return Promise.resolve({
      ...data,
      shipped: true,
    })
  }),
  getReturnDocuments: jest.fn().mockImplementation(() => {
    return Promise.resolve([
      {
        name: "Test Return",
        type: "pdf",
        base_64: "verylong return",
      },
    ])
  }),
  getShipmentDocuments: jest.fn().mockImplementation(() => {
    return Promise.resolve([
      {
        name: "Test Shipment",
        type: "pdf",
        base_64: "verylong shipment",
      },
    ])
  }),
}

export const FulfillmentProviderServiceMock = {
  retrieveProvider: jest.fn().mockImplementation(providerId => {
    if (providerId === "default_provider") {
      return DefaultProviderMock
    }
    throw new Error("Provider Not Found")
  }),
  list: jest.fn().mockImplementation(() => {
    return Promise.resolve()
  }),
}

const mock = jest.fn().mockImplementation(() => {
  return FulfillmentProviderServiceMock
})

export default mock

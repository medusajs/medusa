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
  updateSession: jest.fn().mockImplementation((session, cart) => {
    return Promise.resolve({
      provider_id: session.provider_id,
      data: {
        ...session.data,
        id: `${session.data.id}_updated`,
      },
    })
  }),
  createSession: jest.fn().mockImplementation((providerId, cart) => {
    return Promise.resolve({
      provider_id: providerId,
      data: {
        id: `${providerId}_session`,
        cartId: cart._id,
      },
    })
  }),
  retrieveProvider: jest.fn().mockImplementation(providerId => {
    if (providerId === "default_provider") {
      return DefaultProviderMock
    }
    throw new Error("Provider Not Found")
  }),
}

const mock = jest.fn().mockImplementation(() => {
  return PaymentProviderServiceMock
})

export default mock

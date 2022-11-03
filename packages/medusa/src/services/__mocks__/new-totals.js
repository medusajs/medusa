export const newTotalsServiceMock = {
  withTransaction: function () {
    return this
  },
  getLineItemsTotals: jest.fn().mockImplementation(() => {
    return Promise.resolve(new Map())
  }),
  getLineItemTotals: jest.fn().mockImplementation(() => {
    return Promise.resolve({})
  }),
  getOrderLineItemTotals: jest.fn().mockImplementation(() => {
    return Promise.resolve({})
  }),
  getGiftCardTotals: jest.fn().mockImplementation((order, lineItems) => {
    return Promise.resolve({})
  }),
  getGiftCardTransactionsTotals: jest
    .fn()
    .mockImplementation((order, lineItems) => {
      return Promise.resolve({})
    }),
  getCalculationContext: jest.fn().mockImplementation((order, lineItems) => {
    return Promise.resolve({})
  }),
  getShippingMethodsTotals: jest.fn().mockImplementation((order, lineItems) => {
    return Promise.resolve(new Map())
  }),
  getShippingMethodTotals: jest.fn().mockImplementation((order, lineItems) => {
    return Promise.resolve({})
  }),
  getOrderShippingMethodTotals: jest
    .fn()
    .mockImplementation((order, lineItems) => {
      return Promise.resolve({})
    }),
}

const mock = jest.fn().mockImplementation(() => {
  return newTotalsServiceMock
})

export default mock

export const newTotalsServiceMock = {
  withTransaction: function () {
    return this
  },
  getLineItemTotals: jest.fn().mockImplementation(() => {
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
  getShippingMethodTotals: jest.fn().mockImplementation((order, lineItems) => {
    return Promise.resolve({})
  }),
}

const mock = jest.fn().mockImplementation(() => {
  return newTotalsServiceMock
})

export default mock

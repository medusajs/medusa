export const taxProviderServiceMock = {
  withTransaction: function () {
    return this
  },
  createTaxLines: jest.fn().mockImplementation((order, calculationContext) => {
    return Promise.resolve()
  }),
  clearLineItemsTaxLines: jest.fn().mockImplementation((_) => {
    return Promise.resolve()
  }),
}

const mock = jest.fn().mockImplementation(() => {
  return taxProviderServiceMock
})

export default mock

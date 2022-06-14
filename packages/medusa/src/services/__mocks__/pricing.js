export const PricingServiceMock = {
  withTransaction: function () {
    return this
  },
  setProductPrices: jest.fn().mockImplementation((prod) => {
    return Promise.resolve(prod)
  }),
  setVariantPrices: jest.fn().mockImplementation((variant) => {
    return Promise.resolve(variant)
  }),
}

const mock = jest.fn().mockImplementation(() => {
  return PricingServiceMock
})

export default mock

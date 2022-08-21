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
  setShippingOptionPrices: jest.fn().mockImplementation((opts) => {
    return Promise.resolve(opts)
  }),
}

const mock = jest.fn().mockImplementation(() => {
  return PricingServiceMock
})

export default mock

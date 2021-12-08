import { medusaProducts } from "./test-products"

export const ShopifyProductServiceMock = {
  withTransaction: function () {
    return this
  },
  create: jest.fn().mockImplementation((_data) => {
    return Promise.resolve(medusaProducts.ipod)
  }),
}

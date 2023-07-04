import { medusaProducts } from "./test-products"

export const ProductServiceMock = {
  withTransaction: function () {
    return this
  },
  create: jest.fn().mockImplementation((data) => {
    if (data.handle === "ipod-nano") {
      return Promise.resolve(medusaProducts.ipod)
    }
  }),
  update: jest.fn().mockImplementation((_id, _update) => {
    return Promise.resolve(medusaProducts.ipod)
  }),
  retrieveByExternalId: jest.fn().mockImplementation((id) => {
    if (id === "shopify_ipod") {
      return Promise.resolve(medusaProducts.ipod)
    }
    if (id === "shopify_deleted") {
      return Promise.resolve(medusaProducts.ipod)
    }
    return Promise.resolve(undefined)
  }),
  retrieve: jest.fn().mockImplementation((_id, _config) => {
    if (_id === "prod_ipod") {
      return Promise.resolve(medusaProducts.ipod)
    }
  }),
  addOption: jest.fn().mockImplementation((_id, _title) => {
    return Promise.resolve()
  }),
}

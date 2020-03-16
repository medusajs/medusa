import { IdMap } from "medusa-test-utils"
import { MedusaError } from "medusa-core-utils"

export const products = {
  product1: {
    _id: IdMap.getId("product1"),
    name: "Product 1",
  },
  publishProduct: {
    _id: IdMap.getId("publish"),
    name: "Product 1",
    published: true,
  },
  product2: {
    _id: IdMap.getId("product2"),
    name: "Product 2",
  },
}

export const ProductServiceMock = {
  createDraft: jest.fn().mockImplementation(data => {
    return Promise.resolve(data)
  }),
  publish: jest.fn().mockImplementation(_ => {
    return Promise.resolve({
      _id: IdMap.getId("publish"),
      name: "Product 1",
      published: true,
    })
  }),
  retrieve: jest.fn().mockImplementation(productId => {
    if (productId === IdMap.getId("product1")) {
      return Promise.resolve(products.product1)
    }
    if (productId === IdMap.getId("publish")) {
      return Promise.resolve(products.publishProduct)
    }
    return Promise.resolve(undefined)
  }),
  update: jest.fn().mockImplementation((userId, data) => {
    return Promise.resolve()
  }),
  list: jest.fn().mockImplementation(data => {
    // Used to retrieve a product based on a variant id see
    // ProductVariantService.addOptionValue
    if (data.variants === IdMap.getId("testVariant")) {
      return Promise.resolve([
        {
          _id: "1234",
          title: "test",
          options: [
            {
              _id: IdMap.getId("testOptionId"),
              title: "testOption",
            },
          ],
        },
      ])
    }
    if (data.variants === IdMap.getId("eur-10-us-12")) {
      return Promise.resolve([
        {
          _id: "1234",
          title: "test",
        },
      ])
    }
    if (data.variants === IdMap.getId("failId")) {
      return Promise.resolve([])
    }

    return Promise.resolve([products.product1, products.product2])
  }),
}

const mock = jest.fn().mockImplementation(() => {
  return ProductServiceMock
})

export default mock

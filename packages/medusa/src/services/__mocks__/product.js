import { IdMap } from "medusa-test-utils"

export const products = {
  product1: {
    _id: IdMap.getId("product1"),
    name: "Product 1",
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

import { IdMap } from "medusa-test-utils"

export const products = {
  product1: {
    _id: IdMap.getId("test-product"),
    description: "Test description",
    title: "Product 1",
    variants: [IdMap.getId("test-variant-1")],
    // metadata: {
    //   add_ons: [IdMap.getId("test-add-on"), IdMap.getId("test-add-on-2")],
    // },
  },
  product2: {
    _id: IdMap.getId("test-product-2"),
    title: "Product 2",
    metadata: {},
  },
}

export const ProductServiceMock = {
  retrieve: jest.fn().mockImplementation((productId) => {
    if (productId === IdMap.getId("test-product")) {
      return Promise.resolve(products.product1)
    }
    if (productId === IdMap.getId("test-product-2")) {
      return Promise.resolve(products.product2)
    }
    return Promise.resolve(undefined)
  }),
  list: jest.fn().mockImplementation((query) => {
    return Promise.resolve([products.product1])
  }),
}

const mock = jest.fn().mockImplementation(() => {
  return ProductServiceMock
})

export default mock

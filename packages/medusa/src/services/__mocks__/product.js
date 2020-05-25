import { IdMap } from "medusa-test-utils"
import { MedusaError } from "medusa-core-utils"

export const products = {
  product1: {
    _id: IdMap.getId("product1"),
    title: "Product 1",
  },
  publishProduct: {
    _id: IdMap.getId("publish"),
    title: "Product 1",
    published: true,
  },
  product2: {
    _id: IdMap.getId("product2"),
    title: "Product 2",
  },
  productWithOptions: {
    _id: IdMap.getId("productWithOptions"),
    title: "Test",
    variants: [IdMap.getId("variant1")],
    options: [
      {
        _id: IdMap.getId("option1"),
        title: "Test",
        values: [IdMap.getId("optionValue1")],
      },
    ],
  },
}

export const ProductServiceMock = {
  createDraft: jest.fn().mockImplementation(data => {
    return Promise.resolve(products.product1)
  }),
  publish: jest.fn().mockImplementation(_ => {
    return Promise.resolve({
      _id: IdMap.getId("publish"),
      name: "Product 1",
      published: true,
    })
  }),
  delete: jest.fn().mockImplementation(_ => {
    return Promise.resolve()
  }),
  addVariant: jest.fn().mockImplementation((productId, variantId) => {
    return Promise.resolve(products.productWithOptions)
  }),
  removeVariant: jest.fn().mockImplementation((productId, variantId) => {
    return Promise.resolve(products.productWithOptions)
  }),
  decorate: jest.fn().mockImplementation((product, fields) => {
    product.decorated = true
    return product
  }),
  addOption: jest.fn().mockImplementation((productId, optionTitle) => {
    return Promise.resolve(products.productWithOptions)
  }),
  updateOption: jest.fn().mockReturnValue(Promise.resolve()),
  deleteOption: jest.fn().mockReturnValue(Promise.resolve()),
  retrieve: jest.fn().mockImplementation(productId => {
    if (productId === IdMap.getId("product1")) {
      return Promise.resolve(products.product1)
    }
    if (productId === IdMap.getId("product2")) {
      return Promise.resolve(products.product2)
    }
    if (productId === IdMap.getId("validId")) {
      return Promise.resolve({ _id: IdMap.getId("validId") })
    }
    if (productId === IdMap.getId("publish")) {
      return Promise.resolve(products.publishProduct)
    }
    if (productId === IdMap.getId("productWithOptions")) {
      return Promise.resolve(products.productWithOptions)
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
          thumbnail: "test.1234",
        },
      ])
    }
    if (data.variants === IdMap.getId("failId")) {
      return Promise.resolve([])
    }

    return Promise.resolve([
      { ...products.product1, decorated: true },
      { ...products.product2, decorated: true },
    ])
  }),
}

const mock = jest.fn().mockImplementation(() => {
  return ProductServiceMock
})

export default mock

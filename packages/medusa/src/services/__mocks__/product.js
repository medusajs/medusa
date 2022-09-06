import { IdMap } from "medusa-test-utils"

export const products = {
  product1: {
    id: IdMap.getId("product1"),
    title: "Product 1",
  },
  publishProduct: {
    id: IdMap.getId("publish"),
    title: "Product 1",
    published: true,
  },
  product2: {
    id: IdMap.getId("product2"),
    title: "Product 2",
  },
  productWithOptions: {
    id: IdMap.getId("productWithOptions"),
    title: "Test",
    variants: [IdMap.getId("variant1")],
    options: [
      {
        id: IdMap.getId("option1"),
        title: "Test",
        values: [IdMap.getId("optionValue1")],
      },
    ],
  },
  variantsWithPrices: {
    id: IdMap.getId("variantsWithPrices"),
    title: "Variant with prices",
    variants: [
      {
        id: IdMap.getId("variant_with_prices"),
        title: "Variant with prices",
        prices: [
          {
            id: "price_1",
            currency_code: "usd",
            amount: 100,
            sale_amount: null,
            variant_id: "variant_with_prices",
            region_id: null,
            created_at: "2021-03-16T21:24:13.657Z",
            updated_at: "2021-03-16T21:24:13.657Z",
            deleted_at: null,
          },
          {
            id: "price_2",
            currency_code: "dk",
            amount: 100,
            sale_amount: null,
            variant_id: "variant_with_prices",
            region_id: null,
            created_at: "2021-03-16T21:24:13.657Z",
            updated_at: "2021-03-16T21:24:13.657Z",
            deleted_at: null,
          },
        ],
      },
    ],
  },
}

export const ProductServiceMock = {
  withTransaction: function() {
    return this
  },
  create: jest.fn().mockImplementation((data) => {
    if (data.title === "Test Product") {
      return Promise.resolve(products.product1)
    }
    if (data.title === "Test Product with variants") {
      return Promise.resolve(products.productWithOptions)
    }
    return Promise.resolve({ ...data })
  }),
  count: jest.fn().mockReturnValue(4),
  publish: jest.fn().mockImplementation((_) => {
    return Promise.resolve({
      id: IdMap.getId("publish"),
      name: "Product 1",
      published: true,
    })
  }),
  delete: jest.fn().mockImplementation((_) => {
    return Promise.resolve()
  }),
  createVariant: jest.fn().mockImplementation((productId, value) => {
    return Promise.resolve(products.productWithOptions)
  }),
  deleteVariant: jest.fn().mockImplementation((productId, variantId) => {
    return Promise.resolve(products.productWithOptions)
  }),
  decorate: jest.fn().mockImplementation((product, fields) => {
    product.decorated = true
    return product
  }),
  addOption: jest.fn().mockImplementation((productId, optionTitle) => {
    return Promise.resolve(products.productWithOptions)
  }),
  updateOption: jest
    .fn()
    .mockReturnValue(Promise.resolve(products.productWithOptions)),
  updateOptionValue: jest.fn().mockReturnValue(Promise.resolve()),
  deleteOption: jest
    .fn()
    .mockReturnValue(Promise.resolve(products.productWithOptions)),
  retrieveVariants: jest.fn().mockImplementation((productId) => {
    if (productId === IdMap.getId("product1")) {
      return Promise.resolve([
        { id: IdMap.getId("1"), product_id: IdMap.getId("product1") },
        { id: IdMap.getId("2"), product_id: IdMap.getId("product1") },
      ])
    }

    return []
  }),
  retrieve: jest.fn().mockImplementation((productId) => {
    if (productId === IdMap.getId("product1")) {
      return Promise.resolve(products.product1)
    }
    if (productId === IdMap.getId("product2")) {
      return Promise.resolve(products.product2)
    }
    if (productId === IdMap.getId("validId")) {
      return Promise.resolve({ id: IdMap.getId("validId") })
    }
    if (productId === IdMap.getId("publish")) {
      return Promise.resolve(products.publishProduct)
    }
    if (productId === IdMap.getId("productWithOptions")) {
      return Promise.resolve(products.productWithOptions)
    }
    if (productId === IdMap.getId("variantsWithPrices")) {
      return Promise.resolve(products.variantsWithPrices)
    }
    return Promise.resolve(undefined)
  }),
  update: jest.fn().mockImplementation((product, data) => {
    return Promise.resolve(products.product1)
  }),
  listAndCount: jest.fn().mockImplementation((data) => {
    if (data?.id?.includes("sales_channel_1_product_1")) {
      return Promise.resolve([[{ id: "sales_channel_1_product_1" }], 1])
    }
    return Promise.resolve([[products.product1, products.product2], 2])
  }),
  list: jest.fn().mockImplementation((data) => {
    // Used to retrieve a product based on a variant id see
    // ProductVariantService.addOptionValue
    if (data.variants === IdMap.getId("giftCardVar")) {
      return Promise.resolve([
        {
          id: IdMap.getId("giftCardProd"),
          title: "Gift Card",
          is_giftcard: true,
          thumbnail: "1234",
        },
      ])
    }
    if (data.variants === IdMap.getId("testVariant")) {
      return Promise.resolve([
        {
          id: "1234",
          title: "test",
          options: [
            {
              id: IdMap.getId("testOptionId"),
              title: "testOption",
            },
          ],
        },
      ])
    }
    if (data.variants === IdMap.getId("eur-10-us-12")) {
      return Promise.resolve([
        {
          id: "1234",
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

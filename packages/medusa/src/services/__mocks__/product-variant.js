import { IdMap } from "medusa-test-utils"

const variant1 = {
  id: "1",
  title: "variant1",
  options: [
    {
      option_id: IdMap.getId("color_id"),
      value: "blue",
    },
    {
      option_id: IdMap.getId("size_id"),
      value: "160",
    },
  ],
}

const variant2 = {
  id: "2",
  title: "variant2",
  options: [
    {
      option_id: IdMap.getId("color_id"),
      value: "black",
    },
    {
      option_id: IdMap.getId("size_id"),
      value: "160",
    },
  ],
}

const variant3 = {
  id: "3",
  title: "variant3",
  options: [
    {
      option_id: IdMap.getId("color_id"),
      value: "blue",
    },
    {
      option_id: IdMap.getId("size_id"),
      value: "150",
    },
  ],
}

const variant4 = {
  id: "4",
  title: "variant4",
  options: [
    {
      option_id: IdMap.getId("color_id"),
      value: "blue",
    },
    {
      option_id: IdMap.getId("size_id"),
      value: "50",
    },
  ],
}

const variant5 = {
  id: "5",
  title: "Variant with valid id",
  options: [
    {
      option_id: IdMap.getId("color_id"),
      value: "blue",
    },
    {
      option_id: IdMap.getId("size_id"),
      value: "50",
    },
  ],
}

const invalidVariant = {
  id: "invalid_option",
  title: "variant3",
  options: [
    {
      option_id: "invalid_id",
      value: "blue",
    },
    {
      option_id: IdMap.getId("size_id"),
      value: "150",
    },
  ],
}

const variantWithPrices = {
  id: "variant_with_prices",
  title: "Variant with prices",
  prices: [
    {
      id: "price_1",
      currency_code: "usd",
      amount: 100,
      price_list_id: null,
      min_quantity: 1,
      max_quantity: 10,
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
      price_list_id: null,
      min_quantity: 1,
      max_quantity: 10,
      variant_id: "variant_with_prices",
      region_id: null,
      created_at: "2021-03-16T21:24:13.657Z",
      updated_at: "2021-03-16T21:24:13.657Z",
      deleted_at: null,
    },
  ],
}

const testVariant = {
  id: IdMap.getId("testVariant"),
  title: "test variant",
}

const emptyVariant = {
  id: "empty_option",
  title: "variant3",
  options: [],
}

const eur10us12 = {
  id: IdMap.getId("eur-10-us-12"),
  title: "EUR10US-12",
}

const giftCardVar = {
  id: IdMap.getId("giftCardVar"),
  title: "100 USD",
}

const outOfStockBackOrder = {
  id: "bo",
  title: "variant_popular",
  inventory_quantity: 0,
  allow_backorder: true,
  manage_inventory: true,
}

const outOfStockNoBackOrder = {
  id: "no_bo",
  title: "variant_popular",
  inventory_quantity: 0,
  allow_backorder: false,
  manage_inventory: true,
}

const outOfStockNoManage = {
  id: "no_manage",
  title: "variant_popular",
  inventory_quantity: 0,
  allow_backorder: false,
  manage_inventory: false,
}

const StockOf10Manage = {
  id: "10_man",
  title: "variant_popular",
  inventory_quantity: 10,
  allow_backorder: false,
  manage_inventory: true,
}

const StockOf1Manage = {
  id: "1_man",
  title: "variant_popular",
  inventory_quantity: 1,
  allow_backorder: false,
  manage_inventory: true,
}

export const variants = {
  one: variant1,
  two: variant2,
  three: variant3,
  four: variant4,
  invalid_variant: invalidVariant,
  empty_variant: emptyVariant,
  eur10us12: eur10us12,
  testVariant: testVariant,
  giftCard: giftCardVar,
  variantWithPrices: variantWithPrices,
}

export const ProductVariantServiceMock = {
  withTransaction: function() {
    return this
  },
  create: jest.fn().mockImplementation(data => {
    return Promise.resolve(testVariant)
  }),
  publish: jest.fn().mockImplementation(_ => {
    return Promise.resolve({
      id: IdMap.getId("publish"),
      name: "Product Variant",
      published: true,
    })
  }),
  retrieve: jest.fn().mockImplementation(variantId => {
    if (variantId === IdMap.getId("giftCardVar")) {
      return Promise.resolve(variants.giftCard)
    }
    if (variantId === "1") {
      return Promise.resolve(variant1)
    }
    if (variantId === "2") {
      return Promise.resolve(variant2)
    }
    if (variantId === "3") {
      return Promise.resolve(variant3)
    }
    if (variantId === "4") {
      return Promise.resolve(variant4)
    }
    if (variantId === "variant_with_prices") {
      return Promise.resolve(variantWithPrices)
    }
    if (variantId === IdMap.getId("validId")) {
      return Promise.resolve(variant5)
    }
    if (variantId === IdMap.getId("testVariant")) {
      return Promise.resolve(testVariant)
    }
    if (variantId === "invalid_option") {
      return Promise.resolve(invalidVariant)
    }
    if (variantId === "empty_option") {
      return Promise.resolve(emptyVariant)
    }
    if (variantId === IdMap.getId("eur-10-us-12")) {
      return Promise.resolve(eur10us12)
    }
    if (variantId === IdMap.getId("testVariant")) {
      return Promise.resolve(testVariant)
    }
    if (variantId === "bo") {
      return Promise.resolve(outOfStockBackOrder)
    }
    if (variantId === "no_bo") {
      return Promise.resolve(outOfStockNoBackOrder)
    }
    if (variantId === "no_manage") {
      return Promise.resolve(outOfStockNoManage)
    }
    if (variantId === "10_man") {
      return Promise.resolve(StockOf10Manage)
    }
    if (variantId === "1_man") {
      return Promise.resolve(StockOf1Manage)
    }
  }),
  getRegionPrice: jest.fn().mockImplementation((variantId, regionId) => {
    if (variantId === IdMap.getId("eur-10-us-12")) {
      if (regionId === IdMap.getId("region-france")) {
        return Promise.resolve(10)
      } else {
        return Promise.resolve(12)
      }
    }

    if (variantId === IdMap.getId("eur-8-us-10")) {
      if (regionId === IdMap.getId("region-france")) {
        return Promise.resolve(8)
      } else {
        return Promise.resolve(10)
      }
    }

    if (variantId === IdMap.getId("giftCardVar")) {
      return Promise.resolve(100)
    }

    return Promise.reject(new Error("Not found"))
  }),
  delete: jest.fn().mockReturnValue(Promise.resolve()),
  update: jest.fn().mockReturnValue(Promise.resolve()),
  updateVariantPrices: jest.fn().mockImplementation((variantId, prices) => {
    return Promise.resolve({})
  }),
  deleteVariantPrices: jest.fn().mockImplementation((variantId, priceIds) => {
    return Promise.resolve({})
  }),
  updateOptionValue: jest.fn().mockReturnValue(Promise.resolve()),
  addOptionValue: jest.fn().mockImplementation((variantId, optionId, value) => {
    return Promise.resolve({})
  }),
  list: jest.fn().mockImplementation(data => {
    return Promise.resolve([testVariant])
  }),
  listAndCount: jest.fn().mockImplementation(({ product_id }) => {
    if (product_id === IdMap.getId("product1")) {
      return Promise.resolve( [
          [
            { id: IdMap.getId("1"), product_id: IdMap.getId("product1") },
            { id: IdMap.getId("2"), product_id: IdMap.getId("product1") }
          ],
          2
        ],
      )
    }

    return []
  }),
  deleteOptionValue: jest.fn().mockImplementation((variantId, optionId) => {
    return Promise.resolve({})
  }),
}

const mock = jest.fn().mockImplementation(() => {
  return ProductVariantServiceMock
})

export default mock

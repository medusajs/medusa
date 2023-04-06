import { IdMap } from "medusa-test-utils"

export const profiles = {
  default: {
    id: IdMap.getId("default"),
    name: "default_profile",
    products: [IdMap.getId("product")],
    shipping_options: [],
  },
  other: {
    id: IdMap.getId("profile1"),
    name: "other_profile",
    products: [IdMap.getId("product")],
    shipping_options: [],
  },
}

export const ShippingProfileServiceMock = {
  withTransaction: function () {
    return this
  },
  update: jest.fn().mockImplementation((data) => {
    return Promise.resolve()
  }),
  create: jest.fn().mockImplementation((data) => {
    return Promise.resolve(data)
  }),
  createDefault: jest.fn().mockImplementation(() => {
    return Promise.resolve()
  }),
  createGiftCardDefault: jest.fn().mockImplementation(() => {
    return Promise.resolve()
  }),
  retrieve: jest.fn().mockImplementation((data) => {
    if (data === IdMap.getId("default")) {
      return Promise.resolve(profiles.default)
    }
    if (data === IdMap.getId("profile1")) {
      return Promise.resolve(profiles.other)
    }
    return Promise.resolve(profiles.default)
  }),
  retrieveGiftCardDefault: jest.fn().mockImplementation((data) => {
    return Promise.resolve({ id: IdMap.getId("giftCardProfile") })
  }),
  retrieveDefault: jest.fn().mockImplementation((data) => {
    return Promise.resolve({ id: IdMap.getId("default_shipping_profile") })
  }),
  list: jest.fn().mockImplementation((selector) => {
    if (!selector) {
      return Promise.resolve([])
    }
    if (selector.shipping_options === IdMap.getId("fail")) {
      return Promise.resolve([])
    }
    if (selector.shipping_options === IdMap.getId("freeShipping")) {
      return Promise.resolve([{ id: IdMap.getId("default_profile") }])
    }
    if (selector.shipping_options === IdMap.getId("additional")) {
      return Promise.resolve([{ id: IdMap.getId("additional_profile") }])
    }
    if (
      selector.products &&
      selector.products.$in.includes(IdMap.getId("product"))
    ) {
      return Promise.resolve([
        {
          name: "default",
          products: [IdMap.getId("product")],
          shipping_options: [
            {
              id: IdMap.getId("freeShipping"),
              name: "Free Shipping",
              region_id: IdMap.getId("testRegion"),
              price: {
                type: "flat_rate",
                amount: 10,
              },
              requirements: [{ type: "max_subtotal", value: 1000 }],
              data: {
                id: "fs",
              },
              provider_id: "test_shipper",
            },
          ],
        },
      ])
    }

    if (
      selector.products &&
      selector.products.$in.includes(IdMap.getId("product1"))
    ) {
      return Promise.resolve([
        {
          name: "default1",
          products: [IdMap.getId("product1")],
          shipping_options: [
            {
              id: IdMap.getId("freeShipping"),
              name: "Free Shipping",
              region_id: IdMap.getId("testRegion"),
              price: {
                type: "flat_rate",
                amount: 10,
              },
              requirements: [{ type: "max_subtotal", value: 1000 }],
              data: {
                id: "fs",
              },
              provider_id: "test_shipper",
            },
          ],
        },
        {
          name: "default2",
          products: [IdMap.getId("product2")],
          shipping_options: [
            {
              id: IdMap.getId("freeShipping"),
              name: "Free French Shipping",
              region_id: IdMap.getId("region-france"),
              price: {
                type: "flat_rate",
                amount: 10,
              },
              requirements: [{ type: "max_subtotal", value: 1000 }],
              data: {
                id: "fs",
              },
              provider_id: "test_shipper",
            },
          ],
        },
      ])
    }
  }),
  decorate: jest.fn().mockImplementation((d) => Promise.resolve(d)),
  addShippingOption: jest.fn().mockImplementation(() => Promise.resolve()),
  removeShippingOption: jest.fn().mockImplementation(() => Promise.resolve()),
  addProduct: jest.fn().mockImplementation(() => Promise.resolve()),
  removeProduct: jest.fn().mockImplementation(() => Promise.resolve()),
  fetchCartOptions: jest.fn().mockImplementation(() => {
    return Promise.resolve([{ id: IdMap.getId("cartShippingOption") }])
  }),
  fetchOptionsByProductIds: jest.fn().mockImplementation(() => {
    return Promise.resolve([{ id: IdMap.getId("cartShippingOption") }])
  }),
}

const mock = jest.fn().mockImplementation(() => {
  return ShippingProfileServiceMock
})

export default mock

import { IdMap } from "medusa-test-utils"

export const shippingOptions = {
  freeShipping: {
    _id: IdMap.getId("freeShipping"),
    name: "Free Shipping",
    region_id: IdMap.getId("testRegion"),
    profile_id: IdMap.getId("default-profile"),
    data: {
      id: "fs",
    },
    price: {
      type: "flat_rate",
      amount: 10,
    },
    provider_id: "test_shipper",
  },
  expensiveShipping: {
    _id: IdMap.getId("expensiveShipping"),
    name: "Expensive Shipping",
    profile_id: IdMap.getId("fragile-profile"),
    region_id: IdMap.getId("testRegion"),
    data: {
      id: "es",
    },
    price: {
      type: "flat_rate",
      amount: 100,
    },
    provider_id: "test_shipper",
  },
  franceShipping: {
    _id: IdMap.getId("franceShipping"),
    name: "FR Shipping",
    profile_id: IdMap.getId("default-profile"),
    region_id: IdMap.getId("region-france"),
    data: {
      id: "bonjour",
    },
    price: {
      type: "flat_rate",
      amount: 20,
    },
    provider_id: "test_shipper",
  },
}

export const ShippingOptionServiceMock = {
  retrieve: jest.fn().mockImplementation(optionId => {
    if (optionId === IdMap.getId("freeShipping")) {
      return Promise.resolve(shippingOptions.freeShipping)
    }
    return Promise.resolve(undefined)
  }),
  list: jest.fn().mockImplementation(data => {
    if (data.region_id === IdMap.getId("region-france")) {
      return Promise.resolve([shippingOptions.franceShipping])
    }
    if (data.region_id === IdMap.getId("testRegion")) {
      return Promise.resolve([
        shippingOptions.freeShipping,
        shippingOptions.expensiveShipping,
      ])
    }
  }),
  validateCartOption: jest.fn().mockImplementation((method, cart) => {
    if (method._id === IdMap.getId("freeShipping")) {
      return Promise.resolve(true)
    }
    if (method._id === IdMap.getId("franceShipping")) {
      return Promise.resolve(true)
    }
    if (method._id === IdMap.getId("fail")) {
      return Promise.resolve(false)
    }
  }),
  fetchCartOptions: jest.fn().mockImplementation(cart => {
    if (cart._id === IdMap.getId("cartWithLine")) {
      return Promise.resolve([
        {
          _id: IdMap.getId("freeShipping"),
          name: "Free Shipping",
          region_id: IdMap.getId("testRegion"),
          price: 10,
          data: {
            id: "fs",
          },
          provider_id: "test_shipper",
        },
      ])
    }
  }),
}

const mock = jest.fn().mockImplementation(() => {
  return ShippingOptionServiceMock
})

export default mock

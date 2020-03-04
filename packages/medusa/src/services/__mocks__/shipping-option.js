import { IdMap } from "medusa-test-utils"

export const shippingOptions = {
  freeShipping: {
    _id: IdMap.getId("freeShipping"),
    name: "Free Shipping",
    region_id: IdMap.getId("testRegion"),
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
  checkAvailability: jest.fn().mockImplementation((optionId, cart) => {
    if (optionId === IdMap.getId("freeShipping")) {
      return Promise.resolve(true)
    }
    if (optionId === IdMap.getId("franceShipping")) {
      return Promise.resolve(true)
    }
  }),
  fetchPrice: jest.fn().mockImplementation((optionId, cart) => {
    if (optionId === IdMap.getId("freeShipping")) {
      return Promise.resolve(10)
    }
    if (optionId === IdMap.getId("expensiveShipping")) {
      return Promise.resolve(100)
    }
    if (optionId === IdMap.getId("franceShipping")) {
      return Promise.resolve(20)
    }
  }),
}

const mock = jest.fn().mockImplementation(() => {
  return ShippingOptionServiceMock
})

export default mock

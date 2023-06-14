import { IdMap } from "medusa-test-utils"

export const shippingOptions = {
  returnShipping: {
    _id: IdMap.getId("return-shipping"),
    is_return: true,
    name: "Return Shipping",
    region_id: IdMap.getId("region-france"),
    profile_id: IdMap.getId("default-profile"),
    data: {
      id: "return_shipment",
    },
    price: {
      type: "flat_rate",
      amount: 20,
    },
    provider_id: "default_provider",
  },
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
  shipping1: {
    _id: IdMap.getId("shipping1"),
  },
  validId: {
    _id: IdMap.getId("validId"),
  },
}

export const ShippingOptionServiceMock = {
  withTransaction: function () {
    return this
  },
  retrieve: jest.fn().mockImplementation((optionId) => {
    if (optionId === IdMap.getId("return-shipping")) {
      return Promise.resolve(shippingOptions.returnShipping)
    }
    if (optionId === IdMap.getId("shipping1")) {
      return Promise.resolve(shippingOptions.shipping1)
    }
    if (optionId === IdMap.getId("validId")) {
      return Promise.resolve(shippingOptions.validId)
    }
    if (optionId === IdMap.getId("franceShipping")) {
      return Promise.resolve(shippingOptions.franceShipping)
    }
    if (optionId === IdMap.getId("freeShipping")) {
      return Promise.resolve(shippingOptions.freeShipping)
    }
    return Promise.resolve(undefined)
  }),
  update: jest.fn().mockReturnValue(Promise.resolve()),
  updateShippingprofile: jest.fn().mockReturnValue(Promise.resolve()),
  listAndCount: jest.fn().mockImplementation((data) => {
    if (data.region_id === IdMap.getId("region-france")) {
      return Promise.resolve([[shippingOptions.franceShipping], 1])
    }
    if (data.region_id === IdMap.getId("testRegion")) {
      return Promise.resolve([
        [shippingOptions.freeShipping, shippingOptions.expensiveShipping],
        2,
      ])
    }
    return Promise.resolve([[], 0])
  }),
  list: jest.fn().mockImplementation((data) => {
    if (!data) {
      return Promise.resolve([])
    }
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
  create: jest.fn().mockImplementation((data) => {
    return Promise.resolve(data)
  }),
  validateFulfillmentData: jest
    .fn()
    .mockImplementation((methodId, data, cart) => {
      return Promise.resolve(data)
    }),
  validateCartOption: jest.fn().mockImplementation((methodId, cart) => {
    if (methodId === IdMap.getId("freeShipping")) {
      return Promise.resolve({
        _id: IdMap.getId("freeShipping"),
        price: 0,
        provider_id: "default_provider",
      })
    }
    if (methodId === IdMap.getId("additional")) {
      return Promise.resolve({
        _id: IdMap.getId("additional"),
        price: 0,
        provider_id: "default_provider",
      })
    }
    if (methodId === IdMap.getId("fail")) {
      return Promise.resolve({
        _id: IdMap.getId("fail"),
      })
    }
    return Promise.resolve({ _id: methodId })
  }),
  delete: jest.fn().mockReturnValue(Promise.resolve()),
}

const mock = jest.fn().mockImplementation(() => {
  return ShippingOptionServiceMock
})

export default mock

import { IdMap } from "medusa-test-utils"

export const options = {
  validOption: {
    _id: IdMap.getId("validId"),
    name: "Default Option",
    region_id: IdMap.getId("fr-region"),
    provider_id: "default_provider",
    data: {
      id: "bonjour",
    },
    requirements: [
      {
        _id: "requirement_id",
        type: "min_subtotal",
        value: 100,
      },
    ],
    price: {
      type: "flat_rate",
      amount: 10,
    },
  },
  noCalc: {
    _id: IdMap.getId("noCalc"),
    name: "No Calc",
    region_id: IdMap.getId("fr-region"),
    provider_id: "default_provider",
    data: {
      id: "bobo",
    },
    requirements: [
      {
        _id: "requirement_id",
        type: "min_subtotal",
        value: 100,
      },
    ],
    price: {
      type: "flat_rate",
      amount: 10,
    },
  },
}

export const ShippingOptionModelMock = {
  create: jest.fn().mockReturnValue(Promise.resolve()),
  updateOne: jest.fn().mockImplementation((query, update) => {
    return Promise.resolve()
  }),
  deleteOne: jest.fn().mockReturnValue(Promise.resolve()),
  findOne: jest.fn().mockImplementation(query => {
    if (query._id === IdMap.getId("noCalc")) {
      return Promise.resolve(options.noCalc)
    }
    if (query._id === IdMap.getId("validId")) {
      return Promise.resolve(options.validOption)
    }
    return Promise.resolve(undefined)
  }),
}

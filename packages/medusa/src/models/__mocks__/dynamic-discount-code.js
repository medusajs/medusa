import { IdMap } from "medusa-test-utils"

export const dynamicDiscounts = {
  dynamicOff: {
    _id: IdMap.getId("dynamicOff"),
    discount_id: IdMap.getId("dynamic"),
    code: "DYNAMICOFF",
    disabled: false,
    usage_count: 0,
  },
}

export const DynamicDiscountCodeModelMock = {
  create: jest.fn().mockReturnValue(Promise.resolve()),
  updateOne: jest.fn().mockImplementation((query, update) => {
    return Promise.resolve()
  }),
  deleteOne: jest.fn().mockReturnValue(Promise.resolve()),
  findOne: jest.fn().mockImplementation(query => {
    if (query.code === "DYNAMICOFF") {
      return Promise.resolve(dynamicDiscounts.dynamicOff)
    }
    return Promise.resolve(undefined)
  }),
}

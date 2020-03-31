import { IdMap } from "medusa-test-utils"

export const profiles = {
  validProfile: {
    _id: IdMap.getId("validId"),
    name: "Default Profile",
    products: [IdMap.getId("validId")],
    shipping_options: [IdMap.getId("validId")],
  },
}

export const ShippingProfileModelMock = {
  create: jest.fn().mockReturnValue(Promise.resolve()),
  updateOne: jest.fn().mockImplementation((query, update) => {
    return Promise.resolve()
  }),
  deleteOne: jest.fn().mockReturnValue(Promise.resolve()),
  findOne: jest.fn().mockImplementation(query => {
    if (query._id === IdMap.getId("validId")) {
      return Promise.resolve(profiles.validProfile)
    }
    return Promise.resolve(undefined)
  }),
}

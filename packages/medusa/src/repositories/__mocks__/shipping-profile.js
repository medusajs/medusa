import { IdMap } from "medusa-test-utils"

export const profiles = {
  validProfile: {
    _id: IdMap.getId("validId"),
    name: "Default Profile",
    products: [IdMap.getId("validId")],
    shipping_options: [IdMap.getId("validId")],
  },
  profile1: {
    _id: IdMap.getId("profile1"),
    name: "Profile One",
    products: [IdMap.getId("product1")],
    shipping_options: [IdMap.getId("shipping_1")],
  },
  profile2: {
    _id: IdMap.getId("profile2"),
    name: "Profile two",
    products: [IdMap.getId("product2")],
    shipping_options: [IdMap.getId("shipping_2")],
  },
}

export const ShippingProfileModelMock = {
  create: jest.fn().mockReturnValue(Promise.resolve()),
  updateOne: jest.fn().mockImplementation((query, update) => {
    return Promise.resolve()
  }),
  find: jest.fn().mockImplementation(query => {
    if (query.products && query.products.$in) {
      return Promise.resolve([profiles.profile1, profiles.profile2])
    }

    return Promise.resolve([])
  }),
  deleteOne: jest.fn().mockReturnValue(Promise.resolve()),
  findOne: jest.fn().mockImplementation(query => {
    if (query.shipping_options === IdMap.getId("validId")) {
      return Promise.resolve(profiles.validProfile)
    }
    if (query.products === IdMap.getId("validId")) {
      return Promise.resolve(profiles.validProfile)
    }
    if (query._id === IdMap.getId("validId")) {
      return Promise.resolve(profiles.validProfile)
    }
    if (query._id === IdMap.getId("profile1")) {
      return Promise.resolve(profiles.profile1)
    }
    return Promise.resolve(undefined)
  }),
}

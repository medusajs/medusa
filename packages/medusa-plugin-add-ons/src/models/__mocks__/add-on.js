import { IdMap } from "medusa-test-utils"

export const addOns = {
  testAddOn: {
    _id: IdMap.getId("test-add-on"),
    name: "Chili",
    prices: [
      {
        currency_code: "DKK",
        amount: 20,
      },
    ],
    valid_for: [IdMap.getId("test-product")],
  },
  testAddOn2: {
    _id: IdMap.getId("test-add-on-2"),
    name: "Chili",
    prices: [
      {
        currency_code: "DKK",
        amount: 20,
      },
    ],
    valid_for: [IdMap.getId("test-product")],
  },
}

export const AddOnModelMock = {
  create: jest.fn().mockReturnValue(Promise.resolve()),
  find: jest.fn().mockImplementation((query) => {
    return Promise.resolve([addOns.testAddOn, addOns.testAddOn2])
  }),
  updateOne: jest.fn().mockImplementation((query, update) => {
    return Promise.resolve()
  }),
  deleteOne: jest.fn().mockReturnValue(Promise.resolve()),
  findOne: jest.fn().mockImplementation((query) => {
    if (query._id === IdMap.getId("test-add-on")) {
      return Promise.resolve(addOns.testAddOn)
    }
    if (query._id === IdMap.getId("test-add-on-2")) {
      return Promise.resolve(addOns.testAddOn2)
    }
    return Promise.resolve(undefined)
  }),
}

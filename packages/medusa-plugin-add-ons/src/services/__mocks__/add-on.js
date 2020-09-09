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
  testAddOn3: {
    _id: IdMap.getId("test-add-on-3"),
    name: "Herbs",
    prices: [
      {
        currency_code: "DKK",
        amount: 20,
      },
    ],
    valid_for: [],
  },
}

export const AddOnServiceMock = {
  retrieve: jest.fn().mockImplementation((addOnId) => {
    if (addOnId === IdMap.getId("test-add-on")) {
      return Promise.resolve(addOns.testAddOn)
    }
    if (addOnId === IdMap.getId("test-add-on-2")) {
      return Promise.resolve(addOns.testAddOn2)
    }
    if (addOnId === IdMap.getId("test-add-on-3")) {
      return Promise.resolve(addOns.testAddOn3)
    }
    return Promise.resolve(undefined)
  }),
  getRegionPrice: jest.fn().mockImplementation((addOnId, regionId) => {
    if (addOnId === IdMap.getId("test-add-on")) {
      return Promise.resolve(20)
    }
    if (addOnId === IdMap.getId("test-add-on-2")) {
      return Promise.resolve(20)
    }
    if (addOnId === IdMap.getId("test-add-on-3")) {
      return Promise.resolve(20)
    }
    return Promise.resolve(undefined)
  }),
}

const mock = jest.fn().mockImplementation(() => {
  return AddOnServiceMock
})

export default mock

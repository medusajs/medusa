import { IdMap } from "medusa-test-utils"
import { discounts } from "../../models/__mocks__/discount"

export const DiscountServiceMock = {
  create: jest.fn().mockImplementation(data => {
    return Promise.resolve(data)
  }),
  retrieveByCode: jest.fn().mockImplementation(data => {
    if (data === "10%OFF") {
      return Promise.resolve(discounts.total10Percent)
    }
    if (data === "FREESHIPPING") {
      return Promise.resolve(discounts.freeShipping)
    }
    if (data === "US10") {
      return Promise.resolve(discounts.USDiscount)
    }
    return Promise.resolve(undefined)
  }),
  retrieve: jest.fn().mockImplementation(data => {
    if (data === IdMap.getId("total10")) {
      return Promise.resolve(discounts.total10Percent)
    }
    if (data === IdMap.getId("item10Percent")) {
      return Promise.resolve(discounts.item10Percent)
    }
    if (data === IdMap.getId("freeshipping")) {
      return Promise.resolve(discounts.freeShipping)
    }
    return Promise.resolve(undefined)
  }),
  update: jest.fn().mockImplementation(data => {
    return Promise.resolve()
  }),
  delete: jest.fn().mockImplementation(data => {
    return Promise.resolve({
      _id: IdMap.getId("total10"),
      object: "discount",
      deleted: true,
    })
  }),
  list: jest.fn().mockImplementation(data => {
    return Promise.resolve([])
  }),
  addRegion: jest.fn().mockReturnValue(Promise.resolve()),
  removeRegion: jest.fn().mockReturnValue(Promise.resolve()),
  addValidVariant: jest.fn().mockReturnValue(Promise.resolve()),
  removeValidVariant: jest.fn().mockReturnValue(Promise.resolve()),
}

const mock = jest.fn().mockImplementation(() => {
  return DiscountServiceMock
})

export default mock

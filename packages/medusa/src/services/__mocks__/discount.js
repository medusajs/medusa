import { IdMap } from "medusa-test-utils"
import { discounts } from "../../models/__mocks__/discount"

export const DiscountServiceMock = {
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
}

const mock = jest.fn().mockImplementation(() => {
  return DiscountServiceMock
})

export default mock

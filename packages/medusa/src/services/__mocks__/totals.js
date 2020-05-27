import { IdMap } from "medusa-test-utils"

export const TotalsServiceMock = {
  getTotal: jest.fn().mockImplementation(cart => {
    if (cart.total) {
      return cart.total
    }
    return 0
  }),
  getSubtotal: jest.fn().mockImplementation(cart => {
    if (cart.subtotal) {
      return cart.subtotal
    }
    if (cart._id === IdMap.getId("discount-cart")) {
      return 280
    }
    return 0
  }),
  getRefundTotal: jest.fn().mockImplementation((order, lineItems) => {
    if (order._id === IdMap.getId("processed-order")) {
      return 1230
    }
    return 0
  }),
}

const mock = jest.fn().mockImplementation(() => {
  return TotalsServiceMock
})

export default mock

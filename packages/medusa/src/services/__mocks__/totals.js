import { IdMap } from "medusa-test-utils"

export const TotalsServiceMock = {
  withTransaction: function () {
    return this
  },
  getTotal: jest.fn().mockImplementation((cart) => {
    if (cart.total) {
      return cart.total
    }
    return 0
  }),
  getGiftCardableAmount: jest.fn().mockImplementation((cart) => {
    if (cart.subtotal) {
      return cart.subtotal
    }
    return 0
  }),
  getSubtotal: jest.fn().mockImplementation((cart) => {
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
  getRefundedTotal: jest.fn().mockImplementation((order, lineItems) => {
    return Promise.resolve()
  }),
  getCalculationContext: jest.fn().mockImplementation((order, lineItems) => {
    return Promise.resolve({})
  }),
  getLineItemTotals: jest.fn().mockImplementation(() => {
    return Promise.resolve({})
  }),
}

const mock = jest.fn().mockImplementation(() => {
  return TotalsServiceMock
})

export default mock

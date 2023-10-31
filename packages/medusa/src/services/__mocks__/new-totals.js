const NewTotalsService = require("../new-totals")

export const newTotalsServiceMock = {
  withTransaction: function () {
    return this
  },
  getLineItemTotals: jest.fn().mockImplementation(() => {
    return Promise.resolve({})
  }),
  getGiftCardTotals: jest.fn().mockImplementation((order, lineItems) => {
    return Promise.resolve({})
  }),
  getGiftCardTransactionsTotals: jest
    .fn()
    .mockImplementation((order, lineItems) => {
      return Promise.resolve({})
    }),
  getShippingMethodTotals: jest.fn().mockImplementation((order, lineItems) => {
    return Promise.resolve({})
  }),
  getGiftCardableAmount: jest
    .fn()
    .mockImplementation(
      ({
        gift_cards_taxable,
        subtotal,
        shipping_total,
        discount_total,
        tax_total,
      }) => {
        return Promise.resolve(
          (gift_cards_taxable
            ? subtotal + shipping_total - discount_total
            : subtotal + shipping_total + tax_total - discount_total) || 0
        )
      }
    ),
}

const mock = jest.fn().mockImplementation(() => {
  return newTotalsServiceMock
})

export default mock

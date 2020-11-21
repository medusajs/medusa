export const TotalsServiceMock = {
  getTotal: jest.fn(),
  getTaxTotal: jest.fn(),
  getAllocationItemDiscounts: jest.fn(),
  getDiscountTotal: jest.fn(),
}

const mock = jest.fn().mockImplementation(() => {
  return TotalsServiceMock
})

export default mock

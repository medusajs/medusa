import { IdMap } from "medusa-test-utils"

export const TotalsServiceMock = {
  getSubtotal: jest.fn().mockImplementation(order => {
    return order.subtotal
  }),
}

const mock = jest.fn().mockImplementation(() => {
  return TotalsServiceMock
})

export default mock

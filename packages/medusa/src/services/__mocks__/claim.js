import { IdMap } from "medusa-test-utils"
export const ClaimServiceMock = {
  withTransaction: function() {
    return this
  },
  retrieve: jest.fn().mockImplementation((data) => {
    return Promise.resolve({ order_id: IdMap.getId("test-order") })
  }),

  cancel: jest.fn().mockImplementation((f) => {
    return Promise.resolve({ f })
  }),

  cancelFulfillment: jest.fn().mockImplementation((f) => {
    return Promise.resolve({ f })
  }),
  create: jest.fn().mockImplementation((f) => {
    return Promise.resolve(f)
  }),
}

const mock = jest.fn().mockImplementation(() => {
  return ClaimServiceMock
})

export default mock

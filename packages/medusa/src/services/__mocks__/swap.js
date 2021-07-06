import { IdMap } from "medusa-test-utils"

export const SwapServiceMock = {
  withTransaction: function() {
    return this
  },
  registerCartCompletion: jest.fn().mockImplementation(data => {
    return Promise.resolve({ id: "test-swap" })
  }),
  create: jest.fn().mockImplementation(data => {
    return Promise.resolve()
  }),
  retrieve: jest.fn().mockImplementation(data => {
    switch (data) {
      case IdMap.getId("test-swap"):
        return Promise.resolve({
          id: "test-swap",
          order_id: IdMap.getId("test-order"),
        })
      default:
        return Promise.resolve({ id: "test-swap" })
    }
  }),
  cancel: jest.fn().mockImplementation(f => f),
}

const mock = jest.fn().mockImplementation(() => {
  return SwapServiceMock
})

export default mock

import { IdMap } from "medusa-test-utils"

export const ReturnService = {
  withTransaction: function() {
    return this
  },
  create: jest.fn(() => Promise.resolve({ id: "return" })),
  fulfill: jest.fn(),
  update: jest.fn(),
  receive: jest.fn(() =>
    Promise.resolve({
      id: IdMap.getId("test-return"),
      order_id: IdMap.getId("test-order"),
    })
  ),
  retrieve: jest.fn(() => Promise.resolve("test-return")),
}

const mock = jest.fn().mockImplementation(() => {
  return ReturnService
})

export default mock

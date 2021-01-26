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
    return Promise.resolve({ id: "test-swap" })
  }),
}

const mock = jest.fn().mockImplementation(() => {
  return SwapServiceMock
})

export default mock

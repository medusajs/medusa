import { IdMap } from "medusa-test-utils"

export const LineItemServiceMock = {
  validateLineItem: jest.fn().mockImplementation(data => {
    if (data.title === "invalid lineitem") {
      throw new Error(`"content" is required`)
    }
    return data
  }),
}

const mock = jest.fn().mockImplementation(() => {
  return LineItemServiceMock
})

export default mock

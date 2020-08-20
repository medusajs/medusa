import { IdMap } from "medusa-test-utils"

export const CounterServiceMock = {
  getNext: jest.fn().mockImplementation(counter => {
    if (counter === "orders") {
      return Promise.resolve("1233")
    }
  }),
}

export const CounterServiceMock = {
  getNext: jest.fn().mockImplementation(data => {
    return Promise.resolve("1233")
  }),
}

const mock = jest.fn().mockImplementation(() => {
  return CounterServiceMock
})

export default mock

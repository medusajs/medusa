export const CounterServiceMock = {
  getNext: jest.fn().mockImplementation(data => {
    return Promise.resolve()
  }),
}

const mock = jest.fn().mockImplementation(() => {
  return CounterServiceMock
})

export default mock

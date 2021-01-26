export const ReturnService = {
  withTransaction: function() {
    return this
  },
  create: jest.fn(() => Promise.resolve({ id: "return" })),
  fulfill: jest.fn(),
  update: jest.fn(),
}

const mock = jest.fn().mockImplementation(() => {
  return ReturnService
})

export default mock

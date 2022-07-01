export const strategyResolverServiceMock = {
  withTransaction: function() {
    return this
  },
}

const mock = jest.fn().mockImplementation(() => {
  return strategyResolverServiceMock
})

export default mock

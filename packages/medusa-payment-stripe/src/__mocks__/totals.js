export const TotalsServiceMock = {
  withTransaction: function () {
    return this
  },
  getTotal: jest.fn(),
}

const mock = jest.fn().mockImplementation(() => {
  return TotalsServiceMock
})

export default mock

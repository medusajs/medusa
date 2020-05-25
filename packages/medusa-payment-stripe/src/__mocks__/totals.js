export const TotalsServiceMock = {
  getTotal: jest.fn(),
}

const mock = jest.fn().mockImplementation(() => {
  return TotalsServiceMock
})

export default mock

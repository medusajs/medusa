export const TotalsServiceMock = {
  getTotal: jest.fn(()=>100*100),
}

const mock = jest.fn().mockImplementation(() => {
  return TotalsServiceMock
})

export default mock

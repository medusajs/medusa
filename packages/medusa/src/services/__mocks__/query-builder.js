export const QueryBuilderServiceMock = {
  buildQuery: jest.fn().mockImplementation(data => {
    return Promise.resolve()
  }),
}

const mock = jest.fn().mockImplementation(() => {
  return QueryBuilderServiceMock
})

export default mock

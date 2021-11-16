export const SearchServiceMock = {
  search: jest.fn(() => Promise.resolve([])),
}

const mock = jest.fn().mockImplementation(() => {
  return SearchServiceMock
})

export default mock

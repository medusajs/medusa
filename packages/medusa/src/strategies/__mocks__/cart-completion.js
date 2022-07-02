export const CompletionStrategyMock = {
  complete: jest.fn(() =>
    Promise.resolve({
      response_code: 200,
      response_body: {},
    })
  ),
}

const mock = jest.fn().mockImplementation(() => {
  return CompletionStrategyMock
})

export default mock

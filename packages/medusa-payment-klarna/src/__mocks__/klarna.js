export const KlarnaMock = {
  get: jest.fn().mockImplementation(() => {
    return Promise.resolve()
  }),
  post: jest.fn().mockImplementation(() => {
    return Promise.resolve()
  }),
}

const klarna = jest.fn(() => KlarnaMock)

export default klarna

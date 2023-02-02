export const buildClient = jest.fn()

const mock = jest.fn().mockImplementation(() => {
  return { buildClient }
})

export default mock

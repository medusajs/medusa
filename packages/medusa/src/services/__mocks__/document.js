import { IdMap } from "medusa-test-utils"

export const DocumentServiceMock = {
  create: jest.fn().mockImplementation(data => {
    return Promise.resolve({
      _id: "doc1234",
    })
  }),
  retrieve: jest.fn().mockImplementation(data => {
    return Promise.resolve(undefined)
  }),
  update: jest.fn().mockImplementation(data => {
    return Promise.resolve()
  }),
}

const mock = jest.fn().mockImplementation(() => {
  return DocumentServiceMock
})

export default mock

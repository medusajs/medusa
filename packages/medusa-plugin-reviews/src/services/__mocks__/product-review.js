import { IdMap } from "medusa-test-utils"

export const ProductReviewServiceMock = {
  withTransaction: function () {
    return this
  },
  create: jest.fn().mockImplementation((data) => {
    return Promise.resolve({ id: IdMap.getId("prev"), ...data })
  }),
  retrieve: jest.fn().mockImplementation((id) => {
    if (id === IdMap.getId("prev")) {
      return Promise.resolve({
        id: IdMap.getId("prev"),
        email: "admin@medusa-test.com",
      })
    }
  }),
  delete: jest.fn().mockReturnValue(Promise.resolve()),
  update: jest.fn().mockReturnValue(Promise.resolve()),
  list: jest.fn().mockImplementation((data) => {
    return Promise.resolve([
      { id: IdMap.getId("prev"), email: "admin@medusa-test.com" },
    ])
  }),
  listAndCount: jest.fn().mockImplementation((data) => {
    return Promise.resolve([
      [
        {
          id: IdMap.getId("prev"),
          email: "admin@medusa-test.com",
        },
      ],
      1,
    ])
  }),
}

const mock = jest.fn().mockImplementation(() => {
  return ProductReviewServiceMock
})

export default mock

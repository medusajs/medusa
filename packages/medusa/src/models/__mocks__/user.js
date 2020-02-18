import { IdMap } from "medusa-test-utils"

export const users = {
  testUser: {
    _id: IdMap.getId("test-user"),
    email: "oliver@medusa.test",
    passwordHash: "123456789",
  },
}

export const UserModelMock = {
  create: jest.fn().mockReturnValue(Promise.resolve()),
  updateOne: jest.fn().mockImplementation((query, update) => {
    return Promise.resolve()
  }),
  deleteOne: jest.fn().mockReturnValue(Promise.resolve()),
  findOne: jest.fn().mockImplementation(query => {
    if (query._id === IdMap.getId("test-user")) {
      return Promise.resolve(users.testUser)
    }
    return Promise.resolve(undefined)
  }),
}

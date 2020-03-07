import { MedusaError } from "medusa-core-utils"
import { IdMap } from "medusa-test-utils"

export const users = {
  testUser: {
    _id: IdMap.getId("testUser"),
    email: "oliver@test.dk",
    password: "hashed123456789",
  },
}

export const UserServiceMock = {
  create: jest.fn().mockImplementation(data => {
    if (data.email === "oliver@test.dk") {
      return Promise.resolve(users.testUser)
    }
    if (data.email === "olivertest.dk") {
      throw new MedusaError(MedusaError.Types.INVALID_DATA, "")
    }
  }),
  retrieve: jest.fn().mockImplementation(userId => {
    if (userId === IdMap.getId("testUser")) {
      return Promise.resolve(users.testUser)
    }
    return Promise.resolve(undefined)
  }),
  setPassword: jest.fn().mockImplementation((userId, password) => {
    return Promise.resolve()
  }),
}

const mock = jest.fn().mockImplementation(() => {
  return UserServiceMock
})

export default mock

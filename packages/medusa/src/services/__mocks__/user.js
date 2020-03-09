import { IdMap } from "medusa-test-utils"
import _ from "lodash"

export const users = {
  testUser: {
    _id: IdMap.getId("test-user"),
    email: "oliver@test.dk",
    password: "hashed123456789",
  },
  deleteUser: {
    _id: IdMap.getId("delete-user"),
    email: "oliver@deletetest.dk",
    password: "hashed123456789",
  },
}

export const UserServiceMock = {
  create: jest.fn().mockImplementation(data => {
    if (data.email === "oliver@test.dk") {
      return Promise.resolve(users.testUser)
    }
    return Promise.resolve(undefined)
  }),
  delete: jest.fn().mockImplementation(data => {
    if (data === IdMap.getId("delete-user")) {
      return Promise.resolve({
        id: IdMap.getId("delete-user"),
        object: "user",
        deleted: true,
      })
    }
    return Promise.resolve(undefined)
  }),
  retrieve: jest.fn().mockImplementation(userId => {
    if (userId === IdMap.getId("test-user")) {
      return Promise.resolve(users.testUser)
    }
    return Promise.resolve(undefined)
  }),
  setPassword: jest.fn().mockImplementation((userId, password) => {
    return Promise.resolve()
  }),
  decorate: jest.fn().mockImplementation((user, fields) => {
    const requiredFields = ["_id", "metadata"]
    const decorated = _.pick(user, fields.concat(requiredFields))
    return decorated
  }),
  generateResetPasswordToken: jest
    .fn()
    .mockReturnValue(Promise.resolve("JSONWEBTOKEN")),
}

const mock = jest.fn().mockImplementation(() => {
  return UserServiceMock
})

export default mock

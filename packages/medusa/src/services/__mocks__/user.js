import { IdMap } from "medusa-test-utils"
import Scrypt from "scrypt-kdf"

export const users = {
  testUser: {
    id: IdMap.getId("test-user"),
    email: "oliver@test.dk",
    password_hash: "hashed123456789",
  },
  vanDijk: {
    id: IdMap.getId("vandijk"),
    email: "vandijk@test.dk",
    password_hash: "hashed123456789",
  },
  jwtUser: {
    id: "test-user-id",
    email: "oliver@test.dk",
    password_hash: "123456789hash",
  },
  deleteUser: {
    id: IdMap.getId("delete-user"),
    email: "oliver@deletetest.dk",
    password_hash: "hashed123456789",
  },
}

export const UserServiceMock = {
  withTransaction: function () {
    return this
  },
  create: jest.fn().mockImplementation((data) => {
    if (data.email === "oliver@test.dk") {
      return Promise.resolve(users.testUser)
    }
    return Promise.resolve(undefined)
  }),
  update: jest.fn().mockReturnValue(Promise.resolve()),
  list: jest.fn().mockReturnValue(Promise.resolve([])),
  listAndCount: jest.fn().mockReturnValue(Promise.resolve([[], 0])),
  delete: jest.fn().mockImplementation((data) => {
    if (data === IdMap.getId("delete-user")) {
      return Promise.resolve({
        id: IdMap.getId("delete-user"),
        object: "user",
        deleted: true,
      })
    }
    return Promise.resolve(undefined)
  }),
  retrieve: jest.fn().mockImplementation((userId) => {
    if (userId === IdMap.getId("test-user")) {
      return Promise.resolve(users.testUser)
    }
    if (userId === IdMap.getId("vandijk")) {
      return Promise.resolve(users.vanDijk)
    }
    // used for jwt token tests
    if (userId === "test-user-id") {
      return Promise.resolve(users.jwtUser)
    }
    return Promise.resolve(undefined)
  }),
  setPassword_: jest.fn().mockImplementation((userId) => {
    if (userId === IdMap.getId("test-user")) {
      return Promise.resolve(users.testUser)
    }
    if (userId === IdMap.getId("vandijk")) {
      return Promise.resolve(users.vanDijk)
    }
    // used for jwt token tests
    if (userId === "test-user-id") {
      return Promise.resolve(users.jwtUser)
    }
    return Promise.resolve(undefined)
  }),
  decorate: jest.fn().mockImplementation((user, fields) => {
    user.decorated = true
    return user
  }),
  generateResetPasswordToken: jest
    .fn()
    .mockReturnValue(Promise.resolve("JSONWEBTOKEN")),
  retrieveByApiToken: jest.fn().mockImplementation((token) => {
    if (token === "123456789") {
      return Promise.resolve(users.user1)
    }
    return Promise.resolve(undefined)
  }),
  retrieveByEmail: jest.fn().mockImplementation((email) => {
    if (email === "vandijk@test.dk") {
      return Promise.resolve({
        id: IdMap.getId("vandijk"),
        email,
        password_hash: "1234",
      })
    }
    if (email === "oliver@test.dk") {
      return Scrypt.kdf("123456789", { logN: 1, r: 1, p: 1 }).then((hash) => ({
        email,
        password_hash: hash.toString("base64"),
      }))
    }
    return Promise.resolve(undefined)
  }),
}

const mock = jest.fn().mockImplementation(() => {
  return UserServiceMock
})

export default mock

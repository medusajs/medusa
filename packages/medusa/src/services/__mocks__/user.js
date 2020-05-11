import bcrypt from "bcrypt"
import { IdMap } from "medusa-test-utils"
import _ from "lodash"

export const users = {
  testUser: {
    _id: IdMap.getId("test-user"),
    email: "oliver@test.dk",
    password_hash: "hashed123456789",
  },
  vanDijk: {
    _id: IdMap.getId("vandijk"),
    email: "vandijk@test.dk",
    password_hash: "hashed123456789",
  },
  jwtUser: {
    _id: "test-user-id",
    email: "oliver@test.dk",
    password_hash: "123456789hash",
  },
  deleteUser: {
    _id: IdMap.getId("delete-user"),
    email: "oliver@deletetest.dk",
    password_hash: "hashed123456789",
  },
}

export const UserServiceMock = {
  create: jest.fn().mockImplementation(data => {
    if (data.email === "oliver@test.dk") {
      return Promise.resolve(users.testUser)
    }
    return Promise.resolve(undefined)
  }),
  update: jest.fn().mockReturnValue(Promise.resolve()),
  list: jest.fn().mockReturnValue(Promise.resolve([])),
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
    if (userId === IdMap.getId("vandijk")) {
      return Promise.resolve(users.vanDijk)
    }
    // used for jwt token tests
    if (userId === "test-user-id") {
      return Promise.resolve(users.jwtUser)
    }
    return Promise.resolve(undefined)
  }),
  setPassword: jest.fn().mockImplementation(userId => {
    return Promise.resolve()
  }),
  decorate: jest.fn().mockImplementation((user, fields) => {
    user.decorated = true
    return user
  }),
  generateResetPasswordToken: jest
    .fn()
    .mockReturnValue(Promise.resolve("JSONWEBTOKEN")),
  retrieveByApiToken: jest.fn().mockImplementation(token => {
    if (token === "123456789") {
      return Promise.resolve(users.user1)
    }
    return Promise.resolve(undefined)
  }),
  retrieveByEmail: jest.fn().mockImplementation(email => {
    if (email === "vandijk@test.dk") {
      return Promise.resolve({
        _id: IdMap.getId("vandijk"),
        email,
        password_hash: "1234",
      })
    }
    if (email === "oliver@test.dk") {
      return bcrypt
        .hash("123456789", 10)
        .then(hash => ({ email, password_hash: hash }))
    }
    return Promise.resolve(undefined)
  }),
}

const mock = jest.fn().mockImplementation(() => {
  return UserServiceMock
})

export default mock

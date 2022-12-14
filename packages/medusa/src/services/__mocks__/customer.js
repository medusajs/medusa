import { IdMap } from "medusa-test-utils"
import Scrypt from "scrypt-kdf"

export const CustomerServiceMock = {
  withTransaction: function () {
    return this
  },
  create: jest.fn().mockImplementation((data) => {
    return Promise.resolve({ ...data, id: IdMap.getId("lebron") })
  }),
  update: jest.fn().mockImplementation((id, data) => {
    return Promise.resolve({ ...data, id: IdMap.getId("lebron") })
  }),
  decorate: jest.fn().mockImplementation((data) => {
    const d = Object.assign({}, data)
    d.decorated = true
    return d
  }),
  generateResetPasswordToken: jest.fn().mockImplementation((id) => {
    return Promise.resolve()
  }),
  retrieve: jest.fn().mockImplementation((id) => {
    if (id === IdMap.getId("lebron")) {
      return Promise.resolve({
        id: IdMap.getId("lebron"),
        first_name: "LeBron",
        last_name: "James",
        email: "lebron@james.com",
        password_hash: "1234",
      })
    }
    return Promise.resolve()
  }),
  retrieveByEmail: jest.fn().mockImplementation((email) => {
    if (email === "lebron@james.com") {
      return Promise.resolve({
        id: IdMap.getId("lebron"),
        email,
        password_hash: "1234",
      })
    }
    if (email === "test@testdom.com") {
      return Promise.resolve({
        id: IdMap.getId("testdom"),
        email,
        password_hash: "1234",
      })
    }
    return Promise.resolve(undefined)
  }),
  retrieveRegisteredByEmail: jest.fn().mockImplementation((email) => {
    if (email === "oliver@test.dk") {
      return Scrypt.kdf("123456789", { logN: 1, r: 1, p: 1 }).then((hash) => ({
        email,
        password_hash: hash.toString("base64"),
        has_account: true,
      }))
    }
    if (email === "lebron@james1.com") {
      return Promise.resolve({
        id: IdMap.getId("lebron"),
        email,
        password_hash: "1234",
      })
    }
    return Promise.resolve(undefined)
  }),
}

const mock = jest.fn().mockImplementation(() => {
  return CustomerServiceMock
})

export default mock

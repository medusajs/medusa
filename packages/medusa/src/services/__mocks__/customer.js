import bcrypt from "bcrypt"
import { IdMap } from "medusa-test-utils"

export const CustomerServiceMock = {
  create: jest.fn().mockImplementation(data => {
    return Promise.resolve(data)
  }),
  update: jest.fn().mockImplementation((id, data) => {
    return Promise.resolve(data)
  }),
  decorate: jest.fn().mockImplementation(data => {
    let d = Object.assign({}, data)
    d.decorated = true
    return d
  }),
  generateResetPasswordToken: jest.fn().mockImplementation(id => {
    return Promise.resolve()
  }),
  retrieve: jest.fn().mockImplementation(id => {
    if (id === IdMap.getId("lebron")) {
      return Promise.resolve({
        _id: IdMap.getId("lebron"),
        first_name: "LeBron",
        last_name: "James",
        email: "lebron@james.com",
        password_hash: "1234",
      })
    }
  }),
  retrieveByEmail: jest.fn().mockImplementation(email => {
    if (email === "lebron@james.com") {
      return Promise.resolve({
        _id: IdMap.getId("lebron"),
        email,
        password_hash: "1234",
      })
    }
    if (email === "test@testdom.com") {
      return Promise.resolve({
        _id: IdMap.getId("testdom"),
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
  return CustomerServiceMock
})

export default mock

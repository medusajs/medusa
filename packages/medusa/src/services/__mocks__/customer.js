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
  retrieveByEmail: jest.fn().mockImplementation(email => {
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

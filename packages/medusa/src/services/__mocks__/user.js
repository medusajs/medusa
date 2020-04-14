import bcrypt from "bcrypt"

export const users = {
  user1: {
    email: "oliver@test.dk",
    password_hash: "123456789",
    api_token: "123456789",
  },
}

export const UserServiceMock = {
  retrieveByApiToken: jest.fn().mockImplementation(token => {
    if (token === "123456789") {
      return Promise.resolve(users.user1)
    }
    return Promise.resolve(undefined)
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
  return UserServiceMock
})

export default mock

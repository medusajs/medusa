import { IdMap } from "medusa-test-utils"

const adminUser = {
  _id: IdMap.getId("admin_user", true),
  password: "1235",
  name: "hi",
}

const mock = jest.fn().mockImplementation(() => {
  return {
    authenticate: jest.fn().mockImplementation((email, password) => {
      return Promise.resolve({
        success: true,
        user: adminUser,
      })
    }),
    authenticateAPIToken: jest.fn().mockImplementation(token => {
      return Promise.resolve({
        success: true,
        user: adminUser,
      })
    }),
    authenticateCustomer: jest.fn().mockImplementation((email) => {
      if (email === "lebron@james.com") {
        return Promise.resolve({
          success: true,
          customer: {
            id: IdMap.getId("lebron"),
            first_name: "LeBron",
            last_name: "James",
            email: "lebron@james.com",
            password_hash: "1234",
          }
        })
      }
    }),
    retrieveAuthenticationStrategy: jest.fn().mockImplementation((req, scope) => {
        return scope === "admin"
          ? req.scope.resolve("auth_core-admin-default-auth")
          : req.scope.resolve("auth_core-store-default-auth")
      }
    )
  }
})

export default mock

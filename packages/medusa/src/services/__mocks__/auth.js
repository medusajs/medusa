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
    retrieveAuthenticationStrategy: jest.fn().mockImplementation((req, scope) => {
        const strategyResolverService = req.scope.resolve(
          "strategyResolverService"
        )

        return scope === "admin"
          ? strategyResolverService.resolveAuthByType(
              "core-admin-default-auth"
            )
          : strategyResolverService.resolveAuthByType(
              "core-store-default-auth"
            )
      }
    )
  }
})

export default mock

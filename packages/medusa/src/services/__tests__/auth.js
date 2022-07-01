import AuthService from "../auth"
import { MockManager } from "medusa-test-utils"
import { users, UserServiceMock } from "../__mocks__/user"
import { CustomerServiceMock } from "../__mocks__/customer"
import { strategyResolverServiceMock } from "../__mocks__/strategy-resolver"
import { asFunction, asValue, createContainer } from "awilix"
import AdminDefaultAuthenticationStrategy from "../../strategies/admin-authentication"
import StoreDefaultAuthenticationStrategy from "../../strategies/store-authentication"
import StrategyResolver from "../strategy-resolver"

const managerMock = MockManager

describe("AuthService", () => {
  const authService = new AuthService({
    manager: managerMock,
    userService: UserServiceMock,
    customerService: CustomerServiceMock,
    strategyResolverService: strategyResolverServiceMock
  })

  describe("authenticate", () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("returns success and user when passwords match", async () => {
      const result = await authService.authenticate(
        "oliver@test.dk",
        "123456789"
      )

      expect(result.success).toEqual(true)
      expect(result.user.email).toEqual("oliver@test.dk")
    })

    it("returns failure when passwords don't match", async () => {
      const result = await authService.authenticate(
        "oliver@test.dk",
        "invalid-password"
      )

      expect(result.success).toEqual(false)
      expect(result.error).toEqual("Invalid email or password")
      expect(result.user).toEqual(undefined)
    })
  })

  describe("authenticateCustomer", () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("returns success and user when passwords match", async () => {
      const result = await authService.authenticateCustomer(
        "oliver@test.dk",
        "123456789"
      )

      expect(result.success).toEqual(true)
      expect(result.customer.email).toEqual("oliver@test.dk")
    })

    it("returns failure when passwords don't match", async () => {
      const result = await authService.authenticateCustomer(
        "oliver@test.dk",
        "invalid-password"
      )

      expect(result.success).toEqual(false)
      expect(result.error).toEqual("Invalid email or password")
      expect(result.customer).toEqual(undefined)
    })
  })

  describe("authenticateAPIToken", () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("returns success and user when passwords match", async () => {
      const result = await authService.authenticateAPIToken("123456789")

      expect(result.success).toEqual(true)
      expect(result.user).toEqual(users.user1)
    })
  })

  describe("retrieveAuthenticationStrategy", () => {
    const container = createContainer()
    container.register({
      manager: asValue(managerMock),
      userService: asValue(UserServiceMock),
      customerService: asValue(CustomerServiceMock),
      strategyResolverService: asFunction((cradle) => new StrategyResolver(cradle)),
      authService: asFunction((cradle) => new AuthService(cradle)),
      [`auth_${AdminDefaultAuthenticationStrategy.identifier}`]: asFunction(
        (cradle) => new AdminDefaultAuthenticationStrategy(cradle, {})
      ).singleton(),
      [`auth_${StoreDefaultAuthenticationStrategy.identifier}`]: asFunction(
        (cradle) => new StoreDefaultAuthenticationStrategy(cradle, {})
      ).singleton(),
    })
    container.register({
      "authenticationStrategies": asValue([
        container.resolve(
          `auth_${AdminDefaultAuthenticationStrategy.identifier}`
        ),
        container.resolve(
          `auth_${StoreDefaultAuthenticationStrategy.identifier}`
        ),
      ]),
    })
    const authService = container.resolve("authService")

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("returns the appropriate strategy", async () => {
      const reqMock = { scope: container.createScope() }
      const adminAuthStrategy = await authService
        .retrieveAuthenticationStrategy(reqMock, "admin")

      expect(adminAuthStrategy).toBeTruthy()
      expect(adminAuthStrategy).toBeInstanceOf(
        AdminDefaultAuthenticationStrategy
      )

      const storeAuthStrategy = await authService
        .retrieveAuthenticationStrategy(reqMock, "store")

      expect(storeAuthStrategy).toBeTruthy()
      expect(storeAuthStrategy).toBeInstanceOf(
        StoreDefaultAuthenticationStrategy
      )
    })
})
})

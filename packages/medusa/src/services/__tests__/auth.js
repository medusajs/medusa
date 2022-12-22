import AuthService from "../auth"
import { MockManager } from "medusa-test-utils"
import { users, UserServiceMock } from "../__mocks__/user"
import { CustomerServiceMock } from "../__mocks__/customer"

const managerMock = MockManager

describe("AuthService", () => {
  const authService = new AuthService({
    manager: managerMock,
    userService: UserServiceMock,
    customerService: CustomerServiceMock,
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
})

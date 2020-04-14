import bcrypt from "bcrypt"
import AuthService from "../auth"
import { users, UserServiceMock } from "../__mocks__/user"

describe("AuthService", () => {
  describe("authenticate", () => {
    let authService
    authService = new AuthService({ userService: UserServiceMock })
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

  describe("authenticateAPIToken", () => {
    let authService
    authService = new AuthService({ userService: UserServiceMock })
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

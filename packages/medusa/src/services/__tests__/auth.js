import bcrypt from "bcrypt"
import AuthService from "../auth"

const UserModelMock = {
  findOne: opt => {
    return bcrypt
      .hash("123456", 10)
      .then(hash => ({ email: "email@mail.com", passwordHash: hash }))
  },
}

describe("AuthService", () => {
  describe("constructor", () => {
    let authService
    beforeAll(() => {
      authService = new AuthService({ userModel: UserModelMock })
    })

    it("assigns userModel", () => {
      expect(authService.userModel_).toEqual(UserModelMock)
    })
  })

  describe("authenticate", () => {
    let authService
    beforeEach(() => {
      authService = new AuthService({ userModel: UserModelMock })
    })

    it("returns success when passwords match", async () => {
      const result = await authService.authenticate("email@mail.com", "123456")

      expect(result.success).toEqual(true)
      expect(result.user.email).toEqual("email@mail.com")
    })

    it("returns failure when passwords don't match", async () => {
      const result = await authService.authenticate("email@mail.com", "not")

      expect(result.success).toEqual(false)
      expect(result.user).toEqual(undefined)
    })
  })
})

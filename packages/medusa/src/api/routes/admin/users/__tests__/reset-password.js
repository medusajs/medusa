import { IdMap } from "medusa-test-utils"
import jwt from "jsonwebtoken"
import { request } from "../../../../../helpers/test-request"
import { UserServiceMock } from "../../../../../services/__mocks__/user"

describe("POST /admin/users/:id/reset-password", () => {
  describe("successfully resets password", () => {
    let subject

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("calls UserService setPassword", async () => {
      const exp = Math.floor(Date.now() / 1000) + 60 * 15
      const token = jwt.sign(
        {
          userId: "test-user-id",
          name: "Oliver Juhl",
          email: "oliver@test.dk",
          exp,
        },
        "123456789hash"
      )

      subject = await request(
        "POST",
        `/admin/users/test-user-id/reset-password`,
        {
          payload: {
            token,
            password: "new-password",
          },
          adminSession: {
            jwt: {
              userId: IdMap.getId("admin_user"),
            },
          },
        }
      )
      expect(UserServiceMock.setPassword).toHaveBeenCalledTimes(1)
      expect(UserServiceMock.setPassword).toHaveBeenCalledWith(
        "test-user-id",
        "new-password"
      )
    })

    it("returns updated user", () => {
      expect(subject.body._id).toEqual("test-user-id")
    })

    it("returns 200", () => {
      expect(subject.status).toEqual(200)
    })
  })
})

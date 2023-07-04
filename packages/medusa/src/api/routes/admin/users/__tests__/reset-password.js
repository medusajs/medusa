import { IdMap } from "medusa-test-utils"
import jwt from "jsonwebtoken"
import { request } from "../../../../../helpers/test-request"
import { UserServiceMock } from "../../../../../services/__mocks__/user"

describe("POST /admin/users/reset-password", () => {
  describe("successfully resets password", () => {
    let subject

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("calls UserService setPassword", async () => {
      const exp = Math.floor(Date.now() / 1000) + 60 * 15

      subject = await request("POST", `/admin/users/reset-password`, {
        payload: {
          email: "vandijk@test.dk",
          token: jwt.sign(
            {
              user_id: IdMap.getId("vandijk"),
              name: "Virgil Van Dijk",
              email: "vandijk@test.dk",
              exp,
            },
            "1234"
          ),
          password: "new-password",
        },
        adminSession: {
          jwt: {
            userId: IdMap.getId("admin_user"),
          },
        },
      })
      expect(UserServiceMock.setPassword_).toHaveBeenCalledTimes(1)
      expect(UserServiceMock.setPassword_).toHaveBeenCalledWith(
        IdMap.getId("vandijk"),
        "new-password"
      )
    })

    it("returns updated user", () => {
      expect(subject.body.user.id).toEqual(IdMap.getId("vandijk"))
    })
    it("returns 200", () => {
      expect(subject.status).toEqual(200)
    })
  })
})

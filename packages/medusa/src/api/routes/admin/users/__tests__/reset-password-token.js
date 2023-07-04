import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { UserServiceMock } from "../../../../../services/__mocks__/user"

describe("POST /admin/users/password-token", () => {
  describe("successfully generates reset password token", () => {
    let subject

    beforeAll(async () => {
      subject = await request("POST", `/admin/users/password-token`, {
        payload: {
          email: "vandijk@test.dk",
        },
      })
    })

    it("calls UserService retrieve", () => {
      expect(UserServiceMock.retrieveByEmail).toHaveBeenCalledTimes(1)
      expect(UserServiceMock.retrieveByEmail).toHaveBeenCalledWith(
        "vandijk@test.dk"
      )
    })

    it("calls UserService generateResetPasswordToken", () => {
      expect(UserServiceMock.generateResetPasswordToken).toHaveBeenCalledTimes(
        1
      )
      expect(UserServiceMock.generateResetPasswordToken).toHaveBeenCalledWith(
        IdMap.getId("vandijk")
      )
    })

    it("returns 204", () => {
      expect(subject.status).toEqual(204)
    })
  })
})

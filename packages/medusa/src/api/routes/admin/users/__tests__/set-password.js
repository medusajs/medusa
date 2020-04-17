import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { UserServiceMock } from "../../../../../services/__mocks__/user"

describe("POST /admin/users/:id/set-password", () => {
  describe("successfully sets password", () => {
    let subject

    beforeAll(async () => {
      subject = await request(
        "POST",
        `/admin/users/${IdMap.getId("test-user")}/set-password`,
        {
          payload: {
            password: "987654321",
          },
          adminSession: {
            jwt: {
              userId: IdMap.getId("admin_user"),
            },
          },
        }
      )
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("calls UserService setPassword", () => {
      expect(UserServiceMock.setPassword).toHaveBeenCalledTimes(1)
      expect(UserServiceMock.setPassword).toHaveBeenCalledWith(
        IdMap.getId("test-user"),
        "987654321"
      )
    })

    it("returns the user", () => {
      expect(subject.body._id).toEqual(IdMap.getId("test-user"))
    })

    it("returns 200", () => {
      expect(subject.status).toEqual(200)
    })
  })
})

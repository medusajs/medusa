import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { UserServiceMock } from "../../../../../services/__mocks__/user"

describe("GET /admin/users/:id", () => {
  describe("successfully gets a user", () => {
    let subject

    beforeAll(async () => {
      subject = await request(
        "GET",
        `/admin/users/${IdMap.getId("test-user")}`,
        {
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

    it("calls UserService retrieve", () => {
      expect(UserServiceMock.retrieve).toHaveBeenCalledTimes(1)
      expect(UserServiceMock.retrieve).toHaveBeenCalledWith(
        IdMap.getId("test-user")
      )
    })

    it("returns 200", () => {
      expect(subject.status).toEqual(200)
    })

    it("returns the user", () => {
      expect(subject.body.user.id).toEqual(IdMap.getId("test-user"))
    })
  })
})

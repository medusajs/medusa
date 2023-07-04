import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { UserServiceMock } from "../../../../../services/__mocks__/user"

describe("DELETE /admin/users/:id", () => {
  describe("successfully deletes a user", () => {
    let subject

    beforeAll(async () => {
      subject = await request(
        "DELETE",
        `/admin/users/${IdMap.getId("delete-user")}`,
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

    it("calls UserService create", () => {
      expect(UserServiceMock.delete).toHaveBeenCalledTimes(1)
      expect(UserServiceMock.delete).toHaveBeenCalledWith(
        IdMap.getId("delete-user")
      )
    })

    it("returns 200", () => {
      expect(subject.status).toEqual(200)
    })

    it("returns correct delete data", () => {
      expect(subject.body).toEqual({
        id: IdMap.getId("delete-user"),
        object: "user",
        deleted: true,
      })
    })
  })
})

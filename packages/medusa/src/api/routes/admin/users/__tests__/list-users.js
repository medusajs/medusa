import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { UserServiceMock } from "../../../../../services/__mocks__/user"

describe("GET /admin/users", () => {
  describe("successful retrieval", () => {
    let subject

    beforeAll(async () => {
      subject = await request("GET", `/admin/users`, {
        adminSession: {
          jwt: {
            userId: IdMap.getId("admin_user"),
          },
        },
      })
    })

    it("returns 200", () => {
      expect(subject.status).toEqual(200)
    })

    it("calls service retrieve", () => {
      expect(UserServiceMock.listAndCount).toHaveBeenCalledTimes(1)
      expect(UserServiceMock.listAndCount).toHaveBeenCalledWith(
        {},
        expect.objectContaining({
          order: { created_at: "DESC" },
          skip: 0,
          take: 50,
        })
      )
    })
  })
})

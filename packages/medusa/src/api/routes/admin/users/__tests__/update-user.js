import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { UserServiceMock } from "../../../../../services/__mocks__/user"

describe("POST /admin/users/:id", () => {
  describe("successful update", () => {
    let subject

    beforeAll(async () => {
      subject = await request(
        "POST",
        `/admin/users/${IdMap.getId("test-user")}`,
        {
          payload: {
            first_name: "Oliver",
            last_name: "Juhl",
          },
          adminSession: {
            jwt: {
              userId: IdMap.getId("admin_user"),
            },
          },
        }
      )
    })

    it("returns 200", () => {
      expect(subject.status).toEqual(200)
    })

    it("calls service method", () => {
      expect(UserServiceMock.update).toHaveBeenCalledTimes(1)
      expect(UserServiceMock.update).toHaveBeenCalledWith(
        IdMap.getId("test-user"),
        {
          first_name: "Oliver",
          last_name: "Juhl",
        }
      )
    })
  })
})

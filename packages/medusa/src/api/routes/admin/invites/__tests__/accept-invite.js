import { request } from "../../../../../helpers/test-request"
import { InviteServiceMock } from "../../../../../services/__mocks__/invite"

describe("POST /invites/accept", () => {
  describe("successfully accepts an invite", () => {
    let subject

    beforeAll(async () => {
      subject = await request("POST", `/admin/invites/accept`, {
        payload: {
          token: "jwt_test_invite",
          user: {
            first_name: "John",
            last_name: "Doe",
            password: "supersecret",
          },
        },
      })
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("returns 200", () => {
      expect(subject.status).toEqual(200)
    })

    it("calls InviteService accept", () => {
      expect(InviteServiceMock.accept).toHaveBeenCalledTimes(1)
      expect(InviteServiceMock.accept).toHaveBeenCalledWith("jwt_test_invite", {
        first_name: "John",
        last_name: "Doe",
        password: "supersecret",
      })
    })
  })
})

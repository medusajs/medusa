import { request } from "../../../../../helpers/test-request"
import { InviteServiceMock } from "../../../../../services/__mocks__/invite"

describe("POST /accounts/invite/accept", () => {
  describe("successfully accepts an invite", () => {
    let subject

    beforeAll(async () => {
      subject = await request("POST", `/admin/users/invite/accept`, {
        adminSession: {
          jwt: {
            id: "test_user",
          },
        },
        payload: {
          token: "jwt_test_invite",
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
      expect(InviteServiceMock.accept).toHaveBeenCalledWith(
        "jwt_test_invite",
        expect.objectContaining({
          id: "test_user",
          email: "lebron@james.com",
        })
      )
    })
  })
})

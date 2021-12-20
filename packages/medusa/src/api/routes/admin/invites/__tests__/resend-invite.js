import { request } from "../../../../../helpers/test-request"
import { InviteServiceMock } from "../../../../../services/__mocks__/invite"

describe("POST /invites/:invite_id/resend", () => {
  describe("successfully resends an invite", () => {
    let subject

    beforeAll(async () => {
      subject = await request("POST", `/admin/invites/invite_test/resend`, {
        adminSession: {
          jwt: {
            id: "test_user",
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
      expect(InviteServiceMock.resend).toHaveBeenCalledTimes(1)
      expect(InviteServiceMock.resend).toHaveBeenCalledWith("invite_test")
    })
  })
})

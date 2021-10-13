import { request } from "../../../../../helpers/test-request"
import { InviteServiceMock } from "../../../../../services/__mocks__/invite"

describe("POST /invites", () => {
  describe("checks validation rules", () => {
    let subject

    beforeAll(async () => {
      subject = await request("POST", `/admin/invites`, {
        payload: {
          role: "",
        },
        session: {
          jwt: {
            userId: "test_user",
          },
        },
      })
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("throws when role is empty", () => {
      expect(subject.error).toBeTruthy()
    })
  })
})

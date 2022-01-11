import { request } from "../../../../../helpers/test-request"
import { InviteServiceMock } from "../../../../../services/__mocks__/invite"
import { UserRole } from "../../../../../types/user"

describe("POST /invites", () => {
  describe("checks that role must not be empty", () => {
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

  describe("successfully creates an invite", () => {
    let subject

    beforeAll(async () => {
      subject = await request("POST", `/admin/invites`, {
        payload: {
          role: "admin",
          user: "lebron@james.com",
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

    it("calls InviteService create", () => {
      console.log(subject.error)
      expect(InviteServiceMock.create).toHaveBeenCalledTimes(1)
      expect(InviteServiceMock.create).toHaveBeenCalledWith(
        "lebron@james.com",
        UserRole.ADMIN
      )
    })
  })
})

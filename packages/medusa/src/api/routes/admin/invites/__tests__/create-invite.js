import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { InviteServiceMock } from "../../../../../services/__mocks__/invite"
import { UserRole } from "../../../../../types/user"

describe("POST /invites", () => {
  describe("checks that role must not be empty", () => {
    let subject

    beforeAll(async () => {
      subject = await request("POST", `/admin/invites`, {
        payload: {
          role: "admin",
        },
        adminSession: {
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
      expect(subject.error.text).toEqual(
        `{"type":"invalid_data","message":"user must be an email"}`
      )
      expect(subject.error.status).toEqual(400)
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
        adminSession: {
          jwt: {
            userId: IdMap.getId("admin_user"),
          },
        },
      })
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("calls InviteService create", () => {
      expect(InviteServiceMock.create).toHaveBeenCalledTimes(1)
      expect(InviteServiceMock.create).toHaveBeenCalledWith(
        "lebron@james.com",
        UserRole.ADMIN
      )
    })
  })
})

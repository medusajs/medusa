import { request } from "../../../../../helpers/test-request"
import { InviteServiceMock } from "../../../../../services/__mocks__/invite"

describe("POST /accounts/:id/users/invite", () => {
  describe("checks validation rules", () => {
    let subject

    beforeAll(async () => {
      subject = await request("POST", `/admin/users/invite`, {
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

  describe("checks validation rules", () => {
    let subject

    beforeAll(async () => {
      subject = await request("POST", `/admin/users/invite`, {
        payload: {
          users: [],
          role: "developer",
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

    it("throws when users is an empty array", () => {
      expect(subject.error).toBeTruthy()
    })
  })
})

import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { UserServiceMock } from "../../../../../services/__mocks__/user"

describe("POST /admin/users", () => {
  describe("successfully creates a user", () => {
    let subject

    beforeAll(async () => {
      subject = await request("POST", "/admin/users", {
        payload: {
          email: "oliver@test.dk",
          password: "123456789",
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

    it("calls UserService create", () => {
      expect(UserServiceMock.create).toHaveBeenCalledTimes(1)
      expect(UserServiceMock.create).toHaveBeenCalledWith(
        {
          email: "oliver@test.dk",
        },
        "123456789"
      )
    })

    it("returns 200", () => {
      expect(subject.status).toEqual(200)
    })

    it("returns the user", () => {
      expect(subject.body.user.id).toEqual(IdMap.getId("test-user"))
    })
  })

  describe("handles failed create operation", () => {
    let subject

    beforeAll(async () => {
      subject = await request("POST", "/admin/users", {
        payload: {
          email: "olivertest.dk",
          password: "123456789",
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

    it("returns 400 on invalid email", () => {
      expect(subject.status).toEqual(400)
    })
  })
})

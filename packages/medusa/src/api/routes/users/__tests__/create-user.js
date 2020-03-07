import { IdMap } from "medusa-test-utils"
import { request } from "../../../../helpers/test-request"
import { UserServiceMock } from "../../../../services/__mocks__/user"

describe("POST /store/users", () => {
  describe("successfully creates a user", () => {
    let subject

    beforeAll(async () => {
      subject = await request("POST", "/store/users", {
        payload: {
          email: "oliver@test.dk",
          password: "123456789",
        },
      })
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("calls UserService create", () => {
      expect(UserServiceMock.create).toHaveBeenCalledTimes(1)
      expect(UserServiceMock.create).toHaveBeenCalledWith({
        email: "oliver@test.dk",
        password: "123456789",
      })
    })

    it("returns 201", () => {
      expect(subject.status).toEqual(201)
    })

    it("returns the cart", () => {
      expect(subject.body._id).toEqual(IdMap.getId("testUser"))
    })
  })

  describe("handles failed create operation", () => {
    let subject

    beforeAll(async () => {
      subject = await request("POST", "/store/users", {
        payload: {
          email: IdMap.getId("fail"),
          password: "123456789",
        },
      })
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("returns error", () => {
      expect(subject.status).toEqual(400)
      expect(subject.body.message).toEqual("Region not found")
    })
  })
})

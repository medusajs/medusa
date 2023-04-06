import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { CustomerGroupServiceMock } from "../../../../../services/__mocks__/customer-group"

describe("POST /customer-groups", () => {
  describe("successfully calls create customer group", () => {
    let subject

    beforeAll(async () => {
      subject = await request("POST", `/admin/customer-groups`, {
        payload: {
          name: "test group",
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

    it("returns 200", () => {
      expect(subject.status).toEqual(200)
    })

    it("calls CustomerGroupService create", () => {
      expect(CustomerGroupServiceMock.create).toHaveBeenCalledTimes(1)
      expect(CustomerGroupServiceMock.create).toHaveBeenCalledWith({
        name: "test group",
      })
    })
  })

  describe("fails if no name is provided for the group ", () => {
    let subject

    beforeAll(async () => {
      subject = await request("POST", `/admin/customer-groups`, {
        payload: {},
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

    it("returns 400", () => {
      expect(subject.status).toEqual(400)
    })

    it("returns descriptive error that name is missing", () => {
      expect(subject.body.type).toEqual("invalid_data")
      expect(subject.body.message).toEqual("name must be a string")
    })
  })
})

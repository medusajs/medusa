import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { StoreServiceMock } from "../../../../../services/__mocks__/store"

describe("POST /admin/store", () => {
  describe("successful creation", () => {
    let subject

    beforeAll(async () => {
      jest.clearAllMocks()
      subject = await request("POST", "/admin/store", {
        payload: {
          name: "New Name",
        },
        adminSession: {
          jwt: {
            userId: IdMap.getId("admin_user"),
          },
        },
      })
    })

    it("returns 200", () => {
      expect(subject.status).toEqual(200)
    })

    it("calls service update", () => {
      expect(StoreServiceMock.update).toHaveBeenCalledTimes(1)
      expect(StoreServiceMock.update).toHaveBeenCalledWith({
        name: "New Name",
      })
    })
  })

  describe("successful creation", () => {
    let subject

    beforeAll(async () => {
      jest.clearAllMocks()
      subject = await request("POST", "/admin/store", {
        payload: {
          currencies: ["DKK", "USD"],
        },
        adminSession: {
          jwt: {
            userId: IdMap.getId("admin_user"),
          },
        },
      })
    })

    it("returns 200", () => {
      expect(subject.status).toEqual(200)
    })

    it("calls service update", () => {
      expect(StoreServiceMock.update).toHaveBeenCalledTimes(1)
      expect(StoreServiceMock.update).toHaveBeenCalledWith({
        currencies: ["DKK", "USD"],
      })
    })
  })

  describe("throws when currencies is not an array", () => {
    let subject

    beforeAll(async () => {
      jest.clearAllMocks()
      subject = await request("POST", "/admin/store", {
        payload: {
          currencies: "DKK",
        },
        adminSession: {
          jwt: {
            userId: IdMap.getId("admin_user"),
          },
        },
      })
    })

    it("returns 400", () => {
      expect(subject.status).toEqual(400)
    })

    it("throws a descriptive error", () => {
      expect(subject.body.message).toEqual("currencies must be an array")
    })
  })
})

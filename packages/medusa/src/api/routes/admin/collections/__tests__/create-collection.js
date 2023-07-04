import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { ProductCollectionServiceMock } from "../../../../../services/__mocks__/product-collection"

describe("POST /admin/collections", () => {
  describe("successful creation", () => {
    let subject

    beforeAll(async () => {
      subject = await request("POST", "/admin/collections", {
        payload: {
          title: "Suits",
          handle: "suits",
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

    it("returns created product collection", () => {
      expect(subject.body.collection.id).toEqual(IdMap.getId("col"))
    })

    it("calls production collection service create", () => {
      expect(ProductCollectionServiceMock.create).toHaveBeenCalledTimes(1)
      expect(ProductCollectionServiceMock.create).toHaveBeenCalledWith({
        title: "Suits",
        handle: "suits",
      })
    })
  })

  describe("invalid data returns error details", () => {
    let subject

    beforeAll(async () => {
      subject = await request("POST", "/admin/collections", {
        payload: {
          handle: "no-title-collection",
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

    it("returns error details", () => {
      expect(subject.body.type).toEqual("invalid_data")
      expect(subject.body.message).toEqual(
        "title should not be empty, title must be a string"
      )
    })
  })
})

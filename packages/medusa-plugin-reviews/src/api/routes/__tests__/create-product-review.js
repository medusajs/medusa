import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { ProductReviewServiceMock } from "../../../../services/__mocks__/product-review"

describe("POST /admin/reviews", () => {
  describe("successful creation", () => {
    let subject

    beforeAll(async () => {
      subject = await request("POST", "/admin/reviews", {
        payload: {
          product_id: "prod_01G7M7QXQEK3E24FSAN73YGYH3",
          rating: 5,
          email: "admin@medusa-test.com",
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

    it("returns created product review", () => {
      expect(subject.body.collection.id).toEqual(IdMap.getId("prev"))
    })

    it("calls production review service create", () => {
      expect(ProductReviewServiceMock.create).toHaveBeenCalledTimes(1)
      expect(ProductReviewServiceMock.create).toHaveBeenCalledWith({
        product_id: "prod_01G7M7QXQEK3E24FSAN73YGYH3",
        rating: 5,
        email: "admin@medusa-test.com",
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

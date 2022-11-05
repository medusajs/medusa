import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { ProductTypeServiceMock } from "../../../../../services/__mocks__/product-type"

describe("POST /admin/product-types", () => {
  describe("successful creation", () => {
    let subject

    beforeAll(async () => {
      subject = await request("POST", "/admin/product-types", {
        payload: {
          value: "Suits",
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

    it("returns created product type", () => {
      expect(subject.body.product_type.id).toEqual(IdMap.getId("ptyp"))
    })

    it("calls production type service create", () => {
      expect(ProductTypeServiceMock.create).toHaveBeenCalledTimes(1)
      expect(ProductTypeServiceMock.create).toHaveBeenCalledWith({
        value: "Suits",
      })
    })
  })

  describe("invalid data returns error details", () => {
    let subject

    beforeAll(async () => {
      subject = await request("POST", "/admin/product-types", {
        payload: {},
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
        "value should not be empty, value must be a string"
      )
    })
  })
})

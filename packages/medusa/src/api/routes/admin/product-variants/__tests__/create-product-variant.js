import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { ProductVariantServiceMock } from "../../../../../services/__mocks__/product-variant"

describe("POST /admin/product-variants", () => {
  describe("successful creation", () => {
    let subject

    beforeAll(async () => {
      subject = await request("POST", "/admin/product-variants", {
        payload: {
          title: "Test Product Variant",
          prices: [
            {
              currency_code: "DKK",
              amount: 1234,
            },
          ],
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

    it("returns created product draft", () => {
      expect(subject.body._id).toEqual(IdMap.getId("testVariant"))
    })

    it("calls service createDraft", () => {
      expect(ProductVariantServiceMock.createDraft).toHaveBeenCalledTimes(1)
      expect(ProductVariantServiceMock.createDraft).toHaveBeenCalledWith({
        title: "Test Product Variant",
        prices: [
          {
            currency_code: "DKK",
            amount: 1234,
          },
        ],
      })
    })
  })

  describe("invalid data returns error details", () => {
    let subject

    beforeAll(async () => {
      subject = await request("POST", "/admin/products", {
        payload: {
          image: "image",
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
      expect(subject.body.name).toEqual("invalid_data")
      expect(subject.body.message[0].message).toEqual(`"title" is required`)
    })
  })
})

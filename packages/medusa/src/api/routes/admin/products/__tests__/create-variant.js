import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { ProductServiceMock } from "../../../../../services/__mocks__/product"

describe("POST /admin/products/:id/variants", () => {
  describe("successful add variant", () => {
    let subject

    beforeAll(async () => {
      subject = await request(
        "POST",
        `/admin/products/${IdMap.getId("productWithOptions")}/variants`,
        {
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
        }
      )
    })

    it("returns 200", () => {
      expect(subject.status).toEqual(200)
    })

    it("calls service addVariant", () => {
      expect(ProductServiceMock.createVariant).toHaveBeenCalledTimes(1)
      expect(ProductServiceMock.createVariant).toHaveBeenCalledWith(
        IdMap.getId("productWithOptions"),
        {
          title: "Test Product Variant",
          prices: [
            {
              currency_code: "DKK",
              amount: 1234,
            },
          ],
        }
      )
    })

    it("returns the updated product decorated", () => {
      expect(subject.body._id).toEqual(IdMap.getId("productWithOptions"))
      expect(subject.body.decorated).toEqual(true)
    })
  })
})

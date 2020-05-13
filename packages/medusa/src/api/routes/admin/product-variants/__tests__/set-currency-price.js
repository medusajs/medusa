import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { ProductVariantServiceMock } from "../../../../../services/__mocks__/product-variant"

describe("POST /admin/product-variants/:id/currency-price", () => {
  describe("successful sets currency price", () => {
    let subject

    beforeAll(async () => {
      subject = await request(
        "POST",
        `/admin/product-variants/${IdMap.getId("testVariant")}/currency-price`,
        {
          payload: {
            currencyCode: "DKK",
            amount: 100,
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

    it("calls service setCurrencyPrice", () => {
      expect(ProductVariantServiceMock.setCurrencyPrice).toHaveBeenCalledTimes(
        1
      )
      expect(ProductVariantServiceMock.setCurrencyPrice).toHaveBeenCalledWith(
        IdMap.getId("testVariant"),
        "DKK",
        100
      )
    })
  })
})

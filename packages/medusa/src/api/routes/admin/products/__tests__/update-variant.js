import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { ProductVariantServiceMock } from "../../../../../services/__mocks__/product-variant"

describe("POST /admin/products/:id/variants/:variantId", () => {
  describe("successful updates variant prices", () => {
    let subject

    beforeAll(async () => {
      jest.clearAllMocks()
      subject = await request(
        "POST",
        `/admin/products/${IdMap.getId(
          "productWithOptions"
        )}/variants/${IdMap.getId("variant1")}`,
        {
          payload: {
            title: "hi",
            prices: [
              {
                region_id: IdMap.getId("region-fr"),
                amount: 100,
              },
              {
                currency_code: "DKK",
                amount: 100,
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

    it("filters prices", () => {
      expect(ProductVariantServiceMock.update).toHaveBeenCalledTimes(1)
      expect(ProductVariantServiceMock.update).toHaveBeenCalledWith(
        IdMap.getId("variant1"),
        expect.objectContaining({
          title: "hi",
          prices: [
            {
              region_id: IdMap.getId("region-fr"),
              amount: 100,
            },
            {
              currency_code: "DKK",
              amount: 100,
            },
          ],
        })
      )
    })

    it("returns decorated product with variant removed", () => {
      expect(subject.body.product.id).toEqual(IdMap.getId("productWithOptions"))
    })
  })
})

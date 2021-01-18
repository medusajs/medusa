import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { ProductVariantServiceMock } from "../../../../../services/__mocks__/product-variant"

describe("POST /admin/products/:id/variants/:variantId", () => {
  describe("successful removes variant", () => {
    let subject

    beforeAll(async () => {
      subject = await request(
        "DELETE",
        `/admin/products/${IdMap.getId(
          "productWithOptions"
        )}/variants/${IdMap.getId("variant1")}`,
        {
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

    it("calls service removeVariant", () => {
      expect(ProductVariantServiceMock.delete).toHaveBeenCalledTimes(1)
      expect(ProductVariantServiceMock.delete).toHaveBeenCalledWith(
        IdMap.getId("variant1")
      )
    })

    it("returns delete result", () => {
      expect(subject.body).toEqual({
        variant_id: IdMap.getId("variant1"),
        object: "product-variant",
        deleted: true,
        product: expect.any(Object),
      })
    })
  })
})

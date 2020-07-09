import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { ProductServiceMock } from "../../../../../services/__mocks__/product"

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
      expect(ProductServiceMock.deleteVariant).toHaveBeenCalledTimes(1)
      expect(ProductServiceMock.deleteVariant).toHaveBeenCalledWith(
        IdMap.getId("productWithOptions"),
        IdMap.getId("variant1")
      )
    })

    it("returns delete result", () => {
      expect(subject.body).toEqual({
        variant_id: IdMap.getId("variant1"),
        object: "product-variant",
        deleted: true,
        product: {
          _id: IdMap.getId("productWithOptions"),
          decorated: true,
          options: [
            {
              _id: IdMap.getId("option1"),
              title: "Test",
              values: [IdMap.getId("optionValue1")],
            },
          ],
          title: "Test",
          variants: [IdMap.getId("variant1")],
        },
      })
    })
  })
})

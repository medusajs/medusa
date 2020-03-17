import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { ProductServiceMock } from "../../../../../services/__mocks__/product"

describe("POST /admin/products/:id/variant/:variantId/remove", () => {
  describe("successful removes variant", () => {
    let subject

    beforeAll(async () => {
      subject = await request(
        "POST",
        `/admin/products/${IdMap.getId(
          "productWithOptions"
        )}/variant/${IdMap.getId("variant1")}/remove`,
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
      expect(ProductServiceMock.removeVariant).toHaveBeenCalledTimes(1)
      expect(ProductServiceMock.removeVariant).toHaveBeenCalledWith(
        IdMap.getId("productWithOptions"),
        IdMap.getId("variant1")
      )
    })

    it("returns correct delete information", () => {
      expect(subject.body).toEqual({
        id: IdMap.getId("variant1"),
        object: "variant",
        deleted: true,
      })
    })
  })
})

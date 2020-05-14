import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { ProductVariantServiceMock } from "../../../../../services/__mocks__/product-variant"

describe("POST /admin/product-variants/:id/publish", () => {
  describe("successful publish", () => {
    let subject

    beforeAll(async () => {
      subject = await request(
        "POST",
        `/admin/product-variants/${IdMap.getId("publish")}/publish`,
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

    it("returns product with published flag true", () => {
      expect(subject.body.published).toEqual(true)
    })

    it("calls service publish", () => {
      expect(ProductVariantServiceMock.publish).toHaveBeenCalledTimes(1)
      expect(ProductVariantServiceMock.publish).toHaveBeenCalledWith(
        IdMap.getId("publish")
      )
    })
  })
})

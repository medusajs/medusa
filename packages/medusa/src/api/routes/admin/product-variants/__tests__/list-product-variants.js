import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { ProductVariantServiceMock } from "../../../../../services/__mocks__/product-variant"

describe("GET /admin/product-variants", () => {
  describe("successfully lists product variants", () => {
    let subject

    beforeAll(async () => {
      subject = await request("GET", `/admin/product-variants`, {
        adminSession: {
          jwt: {
            userId: IdMap.getId("admin_user"),
          },
        },
      })
    })

    it("calls ProductVariantService list", () => {
      expect(ProductVariantServiceMock.list).toHaveBeenCalledTimes(1)
    })

    it("returns 200 and product variants", () => {
      expect(subject.status).toEqual(200)
      expect(subject.body[0]._id).toEqual(IdMap.getId("testVariant"))
    })
  })
})

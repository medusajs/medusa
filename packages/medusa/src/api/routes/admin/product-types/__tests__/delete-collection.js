import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { ProductTypeServiceMock } from "../../../../../services/__mocks__/product-type"

describe("DELETE /admin/product-types/:id", () => {
  describe("successful removes product type", () => {
    let subject

    beforeAll(async () => {
      subject = await request(
        "DELETE",
        `/admin/product-types/${IdMap.getId("product-type")}`,
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

    it("calls product type service delete", () => {
      expect(ProductTypeServiceMock.delete).toHaveBeenCalledTimes(1)
      expect(ProductTypeServiceMock.delete).toHaveBeenCalledWith(
        IdMap.getId("product-type")
      )
    })

    it("returns delete result", () => {
      expect(subject.body).toEqual({
        id: IdMap.getId("product-type"),
        object: "product-type",
        deleted: true,
      })
    })
  })
})

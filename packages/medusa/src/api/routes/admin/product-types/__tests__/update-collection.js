import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { ProductTypeServiceMock } from "../../../../../services/__mocks__/product-type"

describe("POST /admin/product-types/:id", () => {
  describe("successful update", () => {
    let subject

    beforeAll(async () => {
      subject = await request(
        "POST",
        `/admin/product-types/${IdMap.getId("ptyp")}`,
        {
          payload: {
            value: "Other Suits",
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

    it("returns updated product type", () => {
      expect(subject.body.product_type.id).toEqual(IdMap.getId("ptyp"))
    })

    it("product type service update", () => {
      expect(ProductTypeServiceMock.update).toHaveBeenCalledTimes(1)
      expect(ProductTypeServiceMock.update).toHaveBeenCalledWith(
        IdMap.getId("ptyp"),
        {
          value: "Other Suits",
        }
      )
    })
  })
})

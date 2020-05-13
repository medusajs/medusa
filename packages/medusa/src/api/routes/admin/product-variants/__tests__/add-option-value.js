import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { ProductVariantServiceMock } from "../../../../../services/__mocks__/product-variant"

describe("POST /admin/product-variants/:id/options", () => {
  describe("successful add option value", () => {
    let subject

    beforeAll(async () => {
      subject = await request(
        "POST",
        `/admin/product-variants/${IdMap.getId("testVariant")}/options`,
        {
          payload: {
            optionId: IdMap.getId("testOption"),
            optionValue: "test",
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

    it("calls service addOption", () => {
      expect(ProductVariantServiceMock.addOptionValue).toHaveBeenCalledTimes(1)
      expect(ProductVariantServiceMock.addOptionValue).toHaveBeenCalledWith(
        IdMap.getId("testVariant"),
        IdMap.getId("testOption"),
        "test"
      )
    })
  })
})

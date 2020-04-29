import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { ProductServiceMock } from "../../../../../services/__mocks__/product"

describe("POST /admin/products/:id/publish", () => {
  describe("successful publish", () => {
    let subject

    beforeAll(async () => {
      subject = await request(
        "POST",
        `/admin/products/${IdMap.getId("publish")}/publish`,
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
      expect(ProductServiceMock.publish).toHaveBeenCalledTimes(1)
      expect(ProductServiceMock.publish).toHaveBeenCalledWith(
        IdMap.getId("publish")
      )
    })
  })
})

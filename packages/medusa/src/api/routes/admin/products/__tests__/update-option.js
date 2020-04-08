import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { ProductServiceMock } from "../../../../../services/__mocks__/product"

describe("POST /admin/products/:id/options/:optionId", () => {
  describe("successfully updates an option", () => {
    let subject

    beforeAll(async () => {
      subject = await request(
        "POST",
        `/admin/products/${IdMap.getId(
          "productWithOptions"
        )}/options/${IdMap.getId("option1")}`,
        {
          payload: {
            title: "Updated option title",
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

    it("calls update", () => {
      expect(ProductServiceMock.updateOption).toHaveBeenCalledTimes(1)
      expect(ProductServiceMock.updateOption).toHaveBeenCalledWith(
        IdMap.getId("productWithOptions"),
        IdMap.getId("option1"),
        {
          title: "Updated option title",
        }
      )
    })
  })
})

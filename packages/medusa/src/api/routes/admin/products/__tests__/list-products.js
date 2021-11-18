import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import {
  products,
  ProductServiceMock,
} from "../../../../../services/__mocks__/product"

describe("GET /admin/products", () => {
  describe("successfully lists products", () => {
    let subject

    beforeAll(async () => {
      subject = await request("GET", `/admin/products`, {
        adminSession: {
          jwt: {
            userId: IdMap.getId("admin_user"),
          },
        },
      })
    })

    it("returns 200 and decorated products", () => {
      expect(subject.status).toEqual(200)
      expect(subject.body.products[0].id).toEqual(products.product1.id)
      expect(subject.body.products[1].id).toEqual(products.product2.id)
    })

    it("calls update", () => {
      expect(ProductServiceMock.listAndCount).toHaveBeenCalledTimes(1)
    })
  })
})

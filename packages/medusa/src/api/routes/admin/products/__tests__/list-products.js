import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import {
  ProductServiceMock,
  products,
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
      expect(subject.body[0]._id).toEqual(products.product1._id)
      expect(subject.body[0].decorated).toEqual(true)
      expect(subject.body[1]._id).toEqual(products.product2._id)
      expect(subject.body[1].decorated).toEqual(true)
    })

    it("calls update", () => {
      expect(ProductServiceMock.list).toHaveBeenCalledTimes(1)
    })
  })
})

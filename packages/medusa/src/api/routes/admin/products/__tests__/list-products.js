import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import {
  ProductServiceMock,
  products,
} from "../../../../../services/__mocks__/product"

describe("GET /admin/products", () => {
  const adminSession = {
    jwt: {
      userId: IdMap.getId("admin_user"),
    },
  }

  describe("successfully lists products", () => {
    let subject

    beforeAll(async () => {
      subject = await request("GET", `/admin/products`, {
        adminSession
      })
    })

    it("returns 200 and decorated products", () => {
      expect(subject.status).toEqual(200)
      expect(subject.body.products[0]._id).toEqual(products.product1._id)
      expect(subject.body.products[0].decorated).toEqual(true)
      expect(subject.body.products[1]._id).toEqual(products.product2._id)
      expect(subject.body.products[1].decorated).toEqual(true)
    })

    it("calls update", () => {
      expect(ProductServiceMock.list).toHaveBeenCalledTimes(1)
    })
  })

  describe("successfully sorts products", () => {
    it("sorts ascending title field properly", async () => {
      await request("GET", `/admin/products?order=title`, {
        adminSession
      })

      expect(ProductServiceMock.list).toHaveBeenCalledWith({}, { order: { title: "ASC" } })
    })

    it("sorts descending title field properly", async () => {
      await request("GET", `/admin/products?order=-title`, {
        adminSession
      })

      expect(ProductServiceMock.list).toHaveBeenCalledWith({}, { order: { title: "DESC" } })
    })

    it("sorts ascending date field properly", async () => {
      await request("GET", `/admin/products?order=created_at`, {
        adminSession
      })

      expect(ProductServiceMock.list).toHaveBeenCalledWith({}, { order: { created_at: "ASC" } })
    })

    it("sorts descending date field properly", async () => {
      await request("GET", `/admin/products?order=-updated_at`, {
        adminSession
      })

      expect(ProductServiceMock.list).toHaveBeenCalledWith({}, { order: { updated_at: "DESC" } })
    })

    it("doesn't support different order parameters", async () => {
      await request("GET", `/admin/products?order=other_field`, {
        adminSession
      })

      expect(ProductServiceMock.list).not.toHaveBeenCalledWith({}, { order: { other_field: "ASC" } })
      expect(ProductServiceMock.list).not.toHaveBeenCalledWith({}, { order: { other_field: "DESC" } })
    })
  })
})

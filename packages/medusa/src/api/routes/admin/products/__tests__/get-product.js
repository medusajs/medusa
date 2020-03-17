import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { ProductServiceMock } from "../../../../../services/__mocks__/product"

describe("GET /admin/products/:id", () => {
  describe("successfully gets a product", () => {
    let subject

    beforeAll(async () => {
      subject = await request(
        "GET",
        `/admin/products/${IdMap.getId("product1")}`,
        {
          adminSession: {
            jwt: {
              userId: IdMap.getId("admin_user"),
            },
          },
        }
      )
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("calls get product from productSerice", () => {
      expect(ProductServiceMock.retrieve).toHaveBeenCalledTimes(1)
      expect(ProductServiceMock.retrieve).toHaveBeenCalledWith(
        IdMap.getId("product1")
      )
    })

    it("returns product decorated", () => {
      expect(subject.body._id).toEqual(IdMap.getId("product1"))
      expect(subject.body.decorated).toEqual(true)
    })
  })

  describe("returns 404 on undefined cart", () => {
    let subject

    beforeAll(async () => {
      subject = await request("GET", `/admin/products/failure`, {
        adminSession: {
          jwt: {
            userId: IdMap.getId("admin_user"),
          },
        },
      })
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("calls get product from productSerice", () => {
      expect(ProductServiceMock.retrieve).toHaveBeenCalledTimes(1)
      expect(ProductServiceMock.retrieve).toHaveBeenCalledWith("failure")
    })

    it("returns 404 status", () => {
      expect(subject.status).toEqual(404)
    })
  })
})

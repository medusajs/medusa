import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { ProductServiceMock } from "../../../../../services/__mocks__/product"

describe("GET /admin/products/:id/variants", () => {
  describe("successfully gets a product", () => {
    let subject

    beforeAll(async () => {
      subject = await request(
        "GET",
        `/admin/products/${IdMap.getId("product1")}/variants`,
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
      expect(ProductServiceMock.retrieveVariants).toHaveBeenCalledTimes(1)
      expect(ProductServiceMock.retrieveVariants).toHaveBeenCalledWith(
        IdMap.getId("product1")
      )
    })

    it("returns variants", () => {
      expect(subject.body.variants[0]._id).toEqual(IdMap.getId("1"))
      expect(subject.body.variants[1]._id).toEqual(IdMap.getId("2"))
    })
  })
})

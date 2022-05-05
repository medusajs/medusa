import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { ProductServiceMock } from "../../../../../services/__mocks__/product"

describe("GET /admin/products/:id/variants", () => {
  describe("successfully gets a product variants", () => {
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
      expect(ProductServiceMock.retrieveVariants).toHaveBeenCalledWith(IdMap.getId("product1"))
    })

    it("returns product decorated", () => {
      expect(subject.body.variants.length).toEqual(2)
      expect(subject.body.variants).toEqual(expect.arrayContaining([
        expect.objectContaining({ product_id: IdMap.getId("product1") }),
        expect.objectContaining({ product_id: IdMap.getId("product1") }),
      ]))
    })
  })
})

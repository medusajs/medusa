import { IdMap } from "medusa-test-utils"
import { defaultStoreProductOptionRelations } from ".."
import { request } from "../../../../../helpers/test-request"
import { ProductOptionServiceMock } from "../../../../../services/__mocks__/product-option"

describe("GET /store/product-options", () => {
  describe("list all product options", () => {
    let subject

    beforeAll(async () => {
      subject = await request("GET", "/store/product-options")
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("calls get product option from productOptionService", () => {
      expect(ProductOptionServiceMock.listAndCount).toHaveBeenCalledTimes(1)
      expect(ProductOptionServiceMock.listAndCount).toHaveBeenCalledWith({
        relations: defaultStoreProductOptionRelations,
        skip: 0,
        take: 100,
      })
    })

    it("returns product options", () => {
      expect(subject.body.product_options[0].id).toEqual(
        IdMap.getId("product_option_1")
      )
      expect(subject.body.product_options[1].id).toEqual(
        IdMap.getId("product_option_2")
      )
    })
  })
})

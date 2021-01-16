import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { ProductVariantServiceMock } from "../../../../../services/__mocks__/product-variant"

describe("List variants", () => {
  describe("list variants successfull", async () => {
    let subject

    beforeAll(async () => {
      subject = await request("GET", `/store/variants`)
    })

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("calls list from variantSerice", () => {
      expect(ProductVariantServiceMock.list).toHaveBeenCalledTimes(1)
      expect(ProductVariantServiceMock.list).toHaveBeenCalledWith(
        {},
        { relations: [], skip: 0, take: 100 }
      )
    })

    it("returns variants", () => {
      expect(subject.body.variants[0].id).toEqual(IdMap.getId("testVariant"))
    })
  })
})

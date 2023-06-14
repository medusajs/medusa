import { request } from "../../../../../helpers/test-request"
import { ProductVariantServiceMock } from "../../../../../services/__mocks__/product-variant"

describe("Get variant by id", () => {
  describe("get variant by id successfull", () => {
    let subject
    beforeAll(async () => {
      subject = await request("GET", `/store/variants/1`)
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("calls get variant from variantSerice", () => {
      expect(ProductVariantServiceMock.retrieve).toHaveBeenCalledTimes(1)
      expect(ProductVariantServiceMock.retrieve).toHaveBeenCalledWith("1", {
        relations: ["prices", "options", "product"],
      })
    })

    it("returns variant decorated", () => {
      expect(subject.body.variant.id).toEqual("1")
    })
  })

  describe("get variant with prices", () => {
    let subject
    beforeAll(async () => {
      subject = await request("GET", `/store/variants/variant_with_prices`)
    })
    it("successfully retrieves variants with prices", async () => {
      expect(subject.status).toEqual(200)
      expect(subject.body.variant.prices[0].amount).toEqual(100)
    })
  })
})

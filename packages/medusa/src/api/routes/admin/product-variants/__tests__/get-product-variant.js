import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { ProductVariantServiceMock } from "../../../../../services/__mocks__/product-variant"

describe("GET /admin/product-variants/:id", () => {
  describe("successfully gets a product variant", () => {
    let subject

    beforeAll(async () => {
      subject = await request(
        "GET",
        `/admin/product-variants/${IdMap.getId("testVariant")}`,
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

    it("calls productVariantService retrieve", () => {
      expect(ProductVariantServiceMock.retrieve).toHaveBeenCalledTimes(1)
      expect(ProductVariantServiceMock.retrieve).toHaveBeenCalledWith(
        IdMap.getId("testVariant")
      )
    })

    it("returns product", () => {
      expect(subject.body._id).toEqual(IdMap.getId("testVariant"))
    })
  })
})

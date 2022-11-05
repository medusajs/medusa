import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { ProductTypeServiceMock } from "../../../../../services/__mocks__/product-type"
import { defaultAdminProductTypeRelations } from "../index"

describe("GET /admin/product-types/:id", () => {
  describe("get product type by id successfully", () => {
    let subject
    beforeAll(async () => {
      subject = await request(
        "GET",
        `/admin/product-types/${IdMap.getId("ptyp")}`,
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

    it("calls retrieve from product type service", () => {
      expect(ProductTypeServiceMock.retrieve).toHaveBeenCalledTimes(1)
      expect(ProductTypeServiceMock.retrieve).toHaveBeenCalledWith(
        IdMap.getId("col"),
        { relations: defaultAdminProductTypeRelations }
      )
    })

    it("returns variant decorated", () => {
      expect(subject.body.product_type.id).toEqual(IdMap.getId("ptyp"))
    })
  })
})

import { IdMap } from "medusa-test-utils"
import { ProductServiceMock } from "../../../../../services/__mocks__/product"
import { request } from "../../../../../helpers/test-request"

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
        IdMap.getId("product1"),
        {
          select: [
            "id",
            "title",
            "subtitle",
            "status",
            "external_id",
            "description",
            "handle",
            "is_giftcard",
            "discountable",
            "thumbnail",
            "collection_id",
            "type_id",
            "weight",
            "length",
            "height",
            "width",
            "hs_code",
            "origin_country",
            "mid_code",
            "material",
            "created_at",
            "updated_at",
            "deleted_at",
            "metadata",
          ],
          relations: [
            "collection",
            "images",
            "options",
            "profiles",
            "sales_channels",
            "tags",
            "type",
            "variants",
            "variants.options",
            "variants.prices",
          ],
        }
      )
    })

    it("returns product decorated", () => {
      expect(subject.body.product.id).toEqual(IdMap.getId("product1"))
    })
  })
})

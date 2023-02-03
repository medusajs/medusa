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
            "profile_id",
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
            "variants",
            "variants.prices",
            "variants.options",
            "images",
            "options",
            "tags",
            "type",
            "collection",
            "categories",
            "sales_channels",
          ],
        }
      )
    })

    it("returns product decorated", () => {
      expect(subject.body.product.id).toEqual(IdMap.getId("product1"))
    })
  })
})

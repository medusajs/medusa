import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { ProductVariantServiceMock } from "../../../../../services/__mocks__/product-variant"

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

    it("should cal the get product from productService with the expected parameters without giving any config", () => {
      expect(ProductVariantServiceMock.listAndCount).toHaveBeenCalledTimes(1)
      expect(ProductVariantServiceMock.listAndCount).toHaveBeenCalledWith(
        {
          product_id: IdMap.getId("product1"),
        },
        {
          relations: [],
          select: ["id", "product_id"],
          skip: 0,
          take: 100
        }
      )
    })

    it("should returns product decorated", () => {
      expect(subject.body.variants.length).toEqual(2)
      expect(subject.body.variants).toEqual(expect.arrayContaining([
        expect.objectContaining({ product_id: IdMap.getId("product1") }),
        expect.objectContaining({ product_id: IdMap.getId("product1") }),
      ]))
    })

    it("should call the get product from productService with the expected parameters including the config that has been given", async () => {
      await request(
        "GET",
        `/admin/products/${IdMap.getId("product1")}/variants`,
        {
          adminSession: {
            jwt: {
              userId: IdMap.getId("admin_user"),
            },
          },
          query: {
            expand: "variants.options",
            fields: "id, variants.id",
            limit: 10,
          }
        }
      )

      expect(ProductVariantServiceMock.listAndCount).toHaveBeenCalledTimes(2)
      expect(ProductVariantServiceMock.listAndCount).toHaveBeenLastCalledWith(
        {
          product_id: IdMap.getId("product1"),
        },
        {
          relations: ["variants.options"],
          select: ["id", "product_id", "variants.id"],
          skip: 0,
          take: 10
        }
      )
    })
  })
})

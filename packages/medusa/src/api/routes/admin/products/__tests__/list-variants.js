import { IdMap } from "medusa-test-utils"
import {
  defaultAdminGetProductsVariantsFields,
  defaultAdminGetProductsVariantsRelations,
} from ".."
import { request } from "../../../../../helpers/test-request"
import { ProductVariantServiceMock } from "../../../../../services/__mocks__/product-variant"

describe("GET /admin/products/:id/variants", () => {
  describe("successfully gets a product variants", () => {
    afterEach(() => {
      jest.clearAllMocks()
    })

    it("should call listAndCount with the default config", async () => {
      await request(
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

      expect(ProductVariantServiceMock.listAndCount).toHaveBeenCalledTimes(1)
      expect(ProductVariantServiceMock.listAndCount).toHaveBeenCalledWith(
        {
          product_id: IdMap.getId("product1"),
        },
        expect.objectContaining({
          relations: defaultAdminGetProductsVariantsRelations,
          select: defaultAdminGetProductsVariantsFields,
          skip: 0,
          take: 100,
        })
      )
    })

    it("should call listAndCount with the provided query params", async () => {
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
            expand: "product",
            fields: "id",
            limit: 10,
          },
        }
      )

      expect(ProductVariantServiceMock.listAndCount).toHaveBeenCalledTimes(1)
      expect(ProductVariantServiceMock.listAndCount).toHaveBeenLastCalledWith(
        {
          product_id: IdMap.getId("product1"),
        },
        expect.objectContaining({
          relations: ["product"],
          select: ["id", "created_at"],
          skip: 0,
          take: 10,
        })
      )
    })
  })
})

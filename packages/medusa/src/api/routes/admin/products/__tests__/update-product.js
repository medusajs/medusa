import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { ProductServiceMock } from "../../../../../services/__mocks__/product"
import { ProductVariantServiceMock } from "../../../../../services/__mocks__/product-variant"

describe("POST /admin/products/:id", () => {
  describe("successfully updates a product", () => {
    let subject

    beforeAll(async () => {
      subject = await request(
        "POST",
        `/admin/products/${IdMap.getId("multipleVariants")}`,
        {
          payload: {
            title: "Product 1",
            description: "Updated test description",
            handle: "handle",
            variants: [
              { id: IdMap.getId("testVariant"), title: "Green" },
              { title: "Blue" },
              { title: "Yellow" },
            ],
          },
          adminSession: {
            jwt: {
              userId: IdMap.getId("admin_user"),
            },
          },
        }
      )
    })

    it("returns 200", () => {
      expect(subject.status).toEqual(200)
    })

    it("calls update", () => {
      expect(ProductServiceMock.update).toHaveBeenCalledTimes(1)
      expect(ProductServiceMock.update).toHaveBeenCalledWith(
        IdMap.getId("multipleVariants"),
        expect.objectContaining({
          title: "Product 1",
          description: "Updated test description",
          handle: "handle",
        })
      )
    })

    it("successfully updates variants and create new ones", async () => {
      expect(ProductVariantServiceMock.update).toHaveBeenCalledTimes(1)
      expect(ProductVariantServiceMock.create).toHaveBeenCalledTimes(1)
    })
  })

  describe("handles failed update operation", () => {
    it("throws on wrong variant in update", async () => {
      const subject = await request(
        "POST",
        `/admin/products/${IdMap.getId("variantsWithPrices")}`,
        {
          payload: {
            title: "Product 1",
            variants: [{ id: "test_321", title: "Green" }],
          },
          adminSession: {
            jwt: {
              userId: IdMap.getId("admin_user"),
            },
          },
        }
      )
      expect(subject.status).toEqual(404)
      expect(subject.error.text).toEqual(
        `{"type":"not_found","message":"Variants with id: test_321 are not associated with this product"}`
      )
    })
  })
})

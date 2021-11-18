import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { ProductServiceMock } from "../../../../../services/__mocks__/product"

describe("POST /admin/products/:id", () => {
  describe("successfully updates a product", () => {
    let subject

    beforeAll(async () => {
      subject = await request(
        "POST",
        `/admin/products/${IdMap.getId("product1")}`,
        {
          payload: {
            title: "Product 1",
            description: "Updated test description",
            handle: "handle",
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
        IdMap.getId("product1"),
        expect.objectContaining({
          title: "Product 1",
          description: "Updated test description",
          handle: "handle",
        })
      )
    })
  })

  describe("handles failed update operation", () => {
    it("throws if metadata is to be updated", async () => {
      try {
        await request("POST", `/admin/products/${IdMap.getId("product1")}`, {
          payload: {
            _id: IdMap.getId("product1"),
            title: "Product 1",
            metadata: "Test Description",
          },
          adminSession: {
            jwt: {
              userId: IdMap.getId("admin_user"),
            },
          },
        })
      } catch (error) {
        expect(error.status).toEqual(400)
        expect(error.message).toEqual(
          "Use setMetadata to update metadata fields"
        )
      }
    })

    it("throws if variants is to be updated", async () => {
      try {
        await request("POST", `/admin/products/${IdMap.getId("product1")}`, {
          payload: {
            _id: IdMap.getId("product1"),
            title: "Product 1",
            metadata: "Test Description",
          },
          adminSession: {
            jwt: {
              userId: IdMap.getId("admin_user"),
            },
          },
        })
      } catch (error) {
        expect(error.status).toEqual(400)
        expect(error.message).toEqual(
          "Use addVariant, reorderVariants, removeVariant to update Product Variants"
        )
      }
    })
  })
})

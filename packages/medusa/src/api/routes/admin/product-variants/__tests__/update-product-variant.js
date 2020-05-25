import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { ProductVariantServiceMock } from "../../../../../services/__mocks__/product-variant"

describe("POST /admin/product-variants/:id", () => {
  describe("successful update", () => {
    let subject

    beforeAll(async () => {
      subject = await request(
        "POST",
        `/admin/product-variants/${IdMap.getId("testVariant")}`,
        {
          payload: {
            title: "Test Product Variant Updated",
            prices: [
              {
                currency_code: "DKK",
                amount: 1234,
              },
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

    it("calls service update", () => {
      expect(ProductVariantServiceMock.update).toHaveBeenCalledTimes(1)
      expect(ProductVariantServiceMock.update).toHaveBeenCalledWith(
        IdMap.getId("testVariant"),
        {
          title: "Test Product Variant Updated",
          prices: [
            {
              currency_code: "DKK",
              amount: 1234,
            },
          ],
        }
      )
    })
  })

  describe("handles failed update operation", () => {
    it("throws if metadata is to be updated", async () => {
      try {
        await request(
          "POST",
          `/admin/product-variants/${IdMap.getId("testVariant")}`,
          {
            payload: {
              _id: IdMap.getId("testVariant"),
              title: "Product 1",
              metadata: "Test Description",
            },
            adminSession: {
              jwt: {
                userId: IdMap.getId("admin_user"),
              },
            },
          }
        )
      } catch (error) {
        expect(error.status).toEqual(400)
        expect(error.message).toEqual(
          "Use setMetadata to update metadata fields"
        )
      }
    })
  })
})

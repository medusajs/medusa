import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { ProductVariantServiceMock } from "../../../../../services/__mocks__/product-variant"

describe("POST /admin/products/:id/variants", () => {
  describe("successful add variant", () => {
    let subject

    beforeAll(async() => {
      subject = await request(
        "POST",
        `/admin/products/${IdMap.getId("productWithOptions")}/variants`,
        {
          payload: {
            title: "Test Product Variant",
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
        },
      )
    })

    it("returns 200", () => {
      expect(subject.status).toEqual(200)
    })

    it("calls service addVariant", () => {
      expect(ProductVariantServiceMock.create).toHaveBeenCalledTimes(1)
      expect(ProductVariantServiceMock.create).toHaveBeenCalledWith(
        IdMap.getId("productWithOptions"),
        {
          allow_backorder: undefined,
          barcode: undefined,
          ean: undefined,
          height: undefined,
          hs_code: undefined,
          inventory_quantity: 0,
          length: undefined,
          manage_inventory: undefined,
          material: undefined,
          metadata: {},
          mid_code: undefined,
          options: [],
          origin_country: undefined,
          prices: [
            {
              amount: 1234,
              currency_code: "DKK",
              region_id: undefined,
              sale_amount: undefined,
            },
          ],
          sku: undefined,
          title: "Test Product Variant",
          upc: undefined,
          weight: undefined,
          width: undefined,
        },
      )
    })

    it("returns the updated product decorated", () => {
      expect(subject.body.product.id).toEqual(IdMap.getId("productWithOptions"))
    })
  })
})

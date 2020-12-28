import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { ProductServiceMock } from "../../../../../services/__mocks__/product"
import { ProductVariantServiceMock } from "../../../../../services/__mocks__/product-variant"

describe("POST /admin/products/:id/variants/:variantId", () => {
  describe("successful updates variant prices", () => {
    let subject

    beforeAll(async () => {
      jest.clearAllMocks()
      subject = await request(
        "POST",
        `/admin/products/${IdMap.getId(
          "productWithOptions"
        )}/variants/${IdMap.getId("variant1")}`,
        {
          payload: {
            title: "hi",
            prices: [
              {
                region_id: IdMap.getId("region-fr"),
                amount: 100,
              },
              {
                currency_code: "DKK",
                amount: 100,
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

    it("calls service removeVariant", () => {
      expect(ProductVariantServiceMock.setCurrencyPrice).toHaveBeenCalledTimes(
        1
      )
      expect(ProductVariantServiceMock.setCurrencyPrice).toHaveBeenCalledWith(
        IdMap.getId("variant1"),
        "DKK",
        100,
        undefined
      )

      expect(ProductVariantServiceMock.setRegionPrice).toHaveBeenCalledTimes(1)
      expect(ProductVariantServiceMock.setRegionPrice).toHaveBeenCalledWith(
        IdMap.getId("variant1"),
        IdMap.getId("region-fr"),
        100,
        undefined
      )
    })

    it("filters prices", () => {
      expect(ProductVariantServiceMock.update).toHaveBeenCalledTimes(1)
      expect(ProductVariantServiceMock.update).toHaveBeenCalledWith(
        IdMap.getId("variant1"),
        {
          title: "hi",
        }
      )
    })

    it("returns decorated product with variant removed", () => {
      expect(subject.body.product._id).toEqual(
        IdMap.getId("productWithOptions")
      )
      expect(subject.body.product.decorated).toEqual(true)
    })
  })

  describe("successful updates options", () => {
    let subject

    beforeAll(async () => {
      jest.clearAllMocks()
      subject = await request(
        "POST",
        `/admin/products/${IdMap.getId(
          "productWithOptions"
        )}/variants/${IdMap.getId("variant1")}`,
        {
          payload: {
            options: [
              {
                option_id: IdMap.getId("option_id"),
                value: 100,
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

    it("calls service removeVariant", () => {
      expect(ProductServiceMock.updateOptionValue).toHaveBeenCalledTimes(1)
      expect(ProductServiceMock.updateOptionValue).toHaveBeenCalledWith(
        IdMap.getId("productWithOptions"),
        IdMap.getId("variant1"),
        IdMap.getId("option_id"),
        100
      )
    })

    it("returns decorated product with variant removed", () => {
      expect(subject.body.product._id).toEqual(
        IdMap.getId("productWithOptions")
      )
      expect(subject.body.product.decorated).toEqual(true)
    })
  })

  describe("successful updates variant", () => {
    let subject

    beforeAll(async () => {
      jest.clearAllMocks()
      subject = await request(
        "POST",
        `/admin/products/${IdMap.getId(
          "productWithOptions"
        )}/variants/${IdMap.getId("variant1")}`,
        {
          payload: {
            title: "hi",
            inventory_quantity: 123,
            allow_backorder: true,
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

    it("calls variant update", () => {
      expect(ProductVariantServiceMock.update).toHaveBeenCalledTimes(1)
      expect(ProductVariantServiceMock.update).toHaveBeenCalledWith(
        IdMap.getId("variant1"),
        {
          title: "hi",
          inventory_quantity: 123,
          allow_backorder: true,
        }
      )
    })

    it("returns decorated product with variant removed", () => {
      expect(subject.body.product._id).toEqual(
        IdMap.getId("productWithOptions")
      )
      expect(subject.body.product.decorated).toEqual(true)
    })
  })
})

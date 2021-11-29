import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { ProductServiceMock } from "../../../../../services/__mocks__/product"
import { ProductVariantServiceMock } from "../../../../../services/__mocks__/product-variant"
import { ShippingProfileServiceMock } from "../../../../../services/__mocks__/shipping-profile"

describe("POST /admin/products", () => {
  describe("successful creation with variants", () => {
    let subject

    beforeAll(async() => {
      subject = await request("POST", "/admin/products", {
        payload: {
          title: "Test Product with variants",
          description: "Test Description",
          tags: [{ id: "test", value: "test" }],
          handle: "test-product",
          options: [{ title: "Test" }],
          variants: [
            {
              title: "Test",
              prices: [
                {
                  currency_code: "USD",
                  amount: 100,
                },
              ],
              options: [
                {
                  value: "100",
                },
              ],
            },
          ],
        },
        adminSession: {
          jwt: {
            userId: IdMap.getId("admin_user"),
          },
        },
      })
    })

    afterAll(async() => {
      jest.clearAllMocks()
    })

    it("returns 200", () => {
      expect(subject.status).toEqual(200)
    })

    it("assigns invokes productVariantService with ranked variants", () => {
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
          options: [
            {
              option_id:  IdMap.getId("option1"),
              value: "100",
            },
          ],
          origin_country: undefined,
          prices: [
            {
              amount: 100,
              currency_code: "USD",
              region_id: undefined,
              sale_amount: undefined,
            },
          ],
          sku: undefined,
          title: "Test",
          upc: undefined,
          variant_rank: 0,
          weight: undefined,
          width: undefined,
        },
      )
    })
  })

  describe("successful creation test", () => {
    let subject

    beforeAll(async() => {
      subject = await request("POST", "/admin/products", {
        payload: {
          title: "Test Product",
          description: "Test Description",
          tags: [{ id: "test", value: "test" }],
          handle: "test-product",
          options: [{ title: "Denominations" }],
        },
        adminSession: {
          jwt: {
            userId: IdMap.getId("admin_user"),
          },
        },
      })
    })

    it("returns 200", () => {
      expect(subject.status).toEqual(200)
    })

    it("returns created product draft", () => {
      expect(subject.body.product.id).toEqual(IdMap.getId("product1"))
    })

    it("calls service createDraft", () => {
      expect(ProductServiceMock.create).toHaveBeenCalledTimes(1)
      expect(ProductServiceMock.create).toHaveBeenCalledWith({
        title: "Test Product",
        discountable: true,
        description: "Test Description",
        tags: [{ id: "test", value: "test" }],
        handle: "test-product",
        status: "draft",
        is_giftcard: false,
        options: [{ title: "Denominations" }],
        profile_id: IdMap.getId("default_shipping_profile"),
        height: undefined,
        hs_code: undefined,
        images: [],
        collection_id: undefined,
        length: undefined,
        material: undefined,
        metadata: {},
        mid_code: undefined,
        origin_country: undefined,
        subtitle: undefined,
        thumbnail: undefined,
        type: {},
        weight: undefined,
        width: undefined,
      })
    })

    it("calls shipping profile default", () => {
      expect(ShippingProfileServiceMock.retrieveDefault).toHaveBeenCalledTimes(
        1,
      )
      expect(ShippingProfileServiceMock.retrieveDefault).toHaveBeenCalledWith()
    })
  })

  describe("successful creation of gift card product", () => {
    let subject

    beforeAll(async() => {
      jest.clearAllMocks()
      subject = await request("POST", "/admin/products", {
        payload: {
          title: "Gift Card",
          description: "make someone happy",
          handle: "test-gift-card",
          is_giftcard: true,
          options: [{ title: "Denominations" }],
          variants: [
            {
              title: "100 USD",
              prices: [
                {
                  currency_code: "USD",
                  amount: 100,
                },
              ],
              options: [
                {
                  value: "100",
                },
              ],
            },
          ],
        },
        adminSession: {
          jwt: {
            userId: IdMap.getId("admin_user"),
          },
        },
      })
    })

    it("calls service createDraft", () => {
      expect(ProductServiceMock.create).toHaveBeenCalledTimes(1)
      expect(ProductServiceMock.create).toHaveBeenCalledWith({
        collection_id: undefined,
        description: "make someone happy",
        discountable: true,
        handle: "test-gift-card",
        height: undefined,
        hs_code: undefined,
        images: [],
        is_giftcard: true,
        length: undefined,
        material: undefined,
        metadata: {},
        mid_code: undefined,
        options: [
          {
            title: "Denominations",
          },
        ],
        origin_country: undefined,
        profile_id: IdMap.getId("giftCardProfile"),
        status: "draft",
        subtitle: undefined,
        tags: [],
        thumbnail: undefined,
        title: "Gift Card",
        type: {},
        weight: undefined,
        width: undefined,
      })
    })

    it("calls profile service", () => {
      expect(
        ShippingProfileServiceMock.retrieveGiftCardDefault,
      ).toHaveBeenCalledTimes(1)
      expect(
        ShippingProfileServiceMock.retrieveGiftCardDefault,
      ).toHaveBeenCalledWith()
    })
  })

  describe("invalid data returns error details", () => {
    let subject

    beforeAll(async() => {
      subject = await request("POST", "/admin/products", {
        payload: {
          description: "Test Description",
          tags: "hi,med,dig",
          handle: "test-product",
        },
        adminSession: {
          jwt: {
            userId: IdMap.getId("admin_user"),
          },
        },
      })
    })

    it("returns 400", () => {
      expect(subject.status).toEqual(400)
    })

    it("returns error details", () => {
      expect(subject.body.type).toEqual("invalid_data")
      expect(subject.body.message).toEqual(
        expect.stringContaining(`title must be a string`),
      )
    })
  })
})

import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { ProductServiceMock } from "../../../../../services/__mocks__/product"
import { ProductVariantServiceMock } from "../../../../../services/__mocks__/product-variant"
import { ShippingProfileServiceMock } from "../../../../../services/__mocks__/shipping-profile"
import { SalesChannelServiceMock } from "../../../../../services/__mocks__/sales-channel"

describe("POST /admin/products", () => {
  describe("successful creation with variants", () => {
    let subject

    beforeAll(async () => {
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

    afterAll(async () => {
      jest.clearAllMocks()
    })

    it("returns 200", () => {
      expect(SalesChannelServiceMock.retrieveDefault).toHaveBeenCalledTimes(1)
      expect(subject.status).toEqual(200)
    })

    it("assigns invokes productVariantService with ranked variants", () => {
      expect(ProductVariantServiceMock.create).toHaveBeenCalledTimes(1)
      expect(ProductVariantServiceMock.create).toHaveBeenCalledWith(
        IdMap.getId("productWithOptions"),
        [
          {
            title: "Test",
            variant_rank: 0,
            prices: [
              {
                currency_code: "USD",
                amount: 100,
              },
            ],
            options: [
              {
                option_id: IdMap.getId("option1"),
                value: "100",
              },
            ],
            inventory_quantity: 0,
          },
        ]
      )
    })
  })

  describe("successful creation test", () => {
    let subject

    beforeAll(async () => {
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
        sales_channels: [
          {
            description: "sales channel 1 description",
            is_disabled: false,
            name: "sales channel 1 name",
          },
        ],
      })
    })

    it("calls shipping profile default", () => {
      expect(ShippingProfileServiceMock.retrieveDefault).toHaveBeenCalledTimes(
        1
      )
      expect(ShippingProfileServiceMock.retrieveDefault).toHaveBeenCalledWith()
    })
  })

  describe("successful creation of gift card product", () => {
    let subject

    beforeAll(async () => {
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
        title: "Gift Card",
        discountable: true,
        description: "make someone happy",
        options: [{ title: "Denominations" }],
        handle: "test-gift-card",
        is_giftcard: true,
        status: "draft",
        profile_id: IdMap.getId("giftCardProfile"),
        sales_channels: [
          {
            description: "sales channel 1 description",
            is_disabled: false,
            name: "sales channel 1 name",
          },
        ],
      })
    })

    it("calls profile service", () => {
      expect(
        ShippingProfileServiceMock.retrieveGiftCardDefault
      ).toHaveBeenCalledTimes(1)
      expect(
        ShippingProfileServiceMock.retrieveGiftCardDefault
      ).toHaveBeenCalledWith()
    })
  })

  describe("invalid data returns error details", () => {
    let subject

    beforeAll(async () => {
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
        expect.stringContaining(`title must be a string`)
      )
    })
  })
})

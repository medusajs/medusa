import { MockManager } from "medusa-test-utils"
import ShopifyProductService from "../shopify-product"
import { ProductServiceMock } from "../__mocks__/product-service"
import { ProductVariantServiceMock } from "../__mocks__/product-variant"
import { ShippingProfileServiceMock } from "../__mocks__/shipping-profile"
import { ShopifyClientServiceMock } from "../__mocks__/shopify-client"
import { ShopifyCacheServiceMock } from "../__mocks__/shopify-cache"
import { medusaProducts, shopifyProducts } from "../__mocks__/test-products"

describe("ShopifyProductService", () => {
  describe("normalizeProduct_", () => {
    const shopifyProductService = new ShopifyProductService({
      manager: MockManager,
      shopifyClientService: ShopifyClientServiceMock,
    })

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("succesfully normalizes a product from Shopify", async () => {
      const data = await ShopifyClientServiceMock.get({ path: "products/ipod" })

      const normalized = shopifyProductService.normalizeProduct_(data)

      expect(normalized).toMatchSnapshot()
    })
  })

  describe("create", () => {
    const shopifyProductService = new ShopifyProductService({
      manager: MockManager,
      shopifyClientService: ShopifyClientServiceMock,
      productService: ProductServiceMock,
      shopifyCacheService: ShopifyCacheServiceMock,
      shippingProfileService: ShippingProfileServiceMock,
      productVariantService: ProductVariantServiceMock,
    })

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("succesfully creates a product from Shopify", async () => {
      const data = shopifyProducts.new_ipod

      const product = await shopifyProductService.create(data)

      expect(ShopifyCacheServiceMock.shouldIgnore).toHaveBeenCalledTimes(1)
      expect(ShopifyCacheServiceMock.addIgnore).toHaveBeenCalledTimes(1)
      expect(ShippingProfileServiceMock.retrieveDefault).toHaveBeenCalledTimes(
        1
      )
      expect(ProductServiceMock.create).toHaveBeenCalledTimes(1)
      expect(ProductVariantServiceMock.create).toHaveBeenCalledTimes(4)
      expect(product).toEqual(
        expect.objectContaining({
          id: "prod_ipod",
        })
      )
    })
  })

  describe("update", () => {
    const shopifyProductService = new ShopifyProductService({
      manager: MockManager,
      shopifyClientService: ShopifyClientServiceMock,
      productService: ProductServiceMock,
      shopifyCacheService: ShopifyCacheServiceMock,
      shippingProfileService: ShippingProfileServiceMock,
      productVariantService: ProductVariantServiceMock,
    })

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("updates a product and adds 4 new variants", async () => {
      const data = shopifyProducts.ipod_update
      jest
        .spyOn(shopifyProductService, "addProductOptions_")
        .mockImplementation(() => ({
          ...medusaProducts.ipod,
          options: [
            ...medusaProducts.ipod.options,
            {
              id: "opt_01FHZ9ZFCPCQ7B1MPDD9X9YQX4",
              title: "Memory",
              product_id: "prod_01FHZ9ZFC3KKYKA35NXNJ5A7FR",
              created_at: "2021-10-14T11:46:10.391Z",
              updated_at: "2021-10-14T11:46:10.391Z",
              deleted_at: null,
              metadata: null,
            },
          ],
        }))

      await shopifyProductService.update(medusaProducts.ipod, data)

      expect(ProductVariantServiceMock.update).toHaveBeenCalledTimes(8)
      expect(ProductServiceMock.update).toHaveBeenCalledTimes(1)
    })

    it("updates a product and deletes 2 existing variants", async () => {
      const data = { ...shopifyProducts.ipod, id: "shopify_deleted" }
      data.variants = data.variants.slice(1, -1)
      await shopifyProductService.update(
        { ...medusaProducts.ipod, id: "shopify_deleted" },
        data
      )

      expect(ProductVariantServiceMock.delete).toHaveBeenCalledTimes(2)
      expect(ProductServiceMock.update).toHaveBeenCalledTimes(1)
    })
  })
})

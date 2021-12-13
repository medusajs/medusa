import { MockManager } from "medusa-test-utils"
import ShopifyCollectionService from "../shopify-collection"
import { ProductCollectionServiceMock } from "../__mocks__/product-collection"
import { ShopifyProductServiceMock } from "../__mocks__/shopify-product"
import { shopifyProducts } from "../__mocks__/test-products"

describe("ShopifyCollectionService", () => {
  describe("create", () => {
    const shopifyCollectionService = new ShopifyCollectionService({
      manager: MockManager,
      shopifyProductService: ShopifyProductServiceMock,
      productCollectionService: ProductCollectionServiceMock,
    })

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("creates a collection with a product", async () => {
      const collects = [
        {
          collection_id: "spring",
          created_at: "2018-04-25T13:51:12-04:00",
          id: 841564295,
          position: 2,
          product_id: "shopify_ipod",
          sort_value: "0000000002",
          updated_at: "2018-04-25T13:51:12-04:00",
        },
      ]
      const collections = [
        {
          id: "spring",
          body_html: "spring collection",
          title: "Spring",
          handle: "spring",
        },
      ]
      const products = [shopifyProducts.ipod]

      const results = await shopifyCollectionService.createWithProducts(
        collects,
        collections,
        products
      )

      expect(
        ProductCollectionServiceMock.retrieveByHandle
      ).toHaveBeenCalledTimes(1)
      expect(ProductCollectionServiceMock.create).toHaveBeenCalledTimes(1)
      expect(ShopifyProductServiceMock.create).toHaveBeenCalledTimes(1)
      expect(results).toEqual([
        {
          id: "col_spring",
          title: "Spring",
          handle: "spring",
          metadata: {
            sh_id: "spring",
            sh_body: "spring collection",
          },
        },
      ])
    })

    it("normalizes a collection from Shopify", () => {
      const shopifyCollection = {
        id: "spring",
        body_html: "spring collection",
        title: "Spring",
        handle: "spring",
      }

      const normalized = shopifyCollectionService.normalizeCollection_(
        shopifyCollection
      )

      expect(normalized).toMatchSnapshot()
    })
  })
})

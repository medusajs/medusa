import { QueryContext } from "@medusajs/utils"
import { integrationData } from "../__fixtures__/data"
import { setup, TestModules } from "../__fixtures__/setup"

describe("Query integration", () => {
  let query: ReturnType<typeof setup>["query"]
  let modules: TestModules

  beforeEach(() => {
    const env = setup()
    query = env.query
    modules = env.modules
  })

  describe("RemoteQuery + Query.graph", () => {
    it("should list products through query.graph", async () => {
      modules.product.list.mockResolvedValue(integrationData.products)

      await query.graph({
        entity: "product",
        fields: ["id", "title", "handle"],
      })

      expect(modules.product.list).toHaveBeenCalledTimes(1)
      expect(modules.product.list).toHaveBeenCalledWith(
        {},
        {
          select: ["id", "title", "handle"],
          relations: [],
          args: {},
        }
      )
    })

    it("should expand product variants through query.graph", async () => {
      modules.product.list.mockResolvedValue([
        {
          ...integrationData.products[0],
          variants: [integrationData.variants[0], integrationData.variants[1]],
        },
      ])

      await query.graph({
        entity: "product",
        fields: ["id", "title", "variants.id", "variants.sku"],
        filters: {
          id: "prod_1",
        },
      })

      expect(modules.product.list).toHaveBeenCalledTimes(1)
      expect(modules.product.list).toHaveBeenCalledWith(
        { id: ["prod_1"] },
        {
          select: [
            "id",
            "title",
            "variants.id",
            "variants.sku",
            "variants.product_id",
          ],
          relations: ["variants"],
          args: {},
          take: null,
        }
      )
    })

    it("should resolve variant price sets through a link module", async () => {
      modules.product.listProductVariants.mockResolvedValue([
        integrationData.variants[0],
      ])
      modules.link.list.mockResolvedValue([
        integrationData.variantPriceSetLinks[0],
      ])
      modules.pricing.listPriceSets.mockResolvedValue([
        {
          ...integrationData.priceSets[0],
          prices: [integrationData.prices[0]],
        },
      ])

      await query.graph({
        entity: "variant",
        fields: [
          "id",
          "sku",
          "price_set.id",
          "price_set.prices.amount",
          "price_set.prices.currency_code",
        ],
        filters: {
          id: "variant_1",
        },
        context: {
          price_set: {
            prices: QueryContext({
              currency_code: "usd",
            }),
          },
        },
      })

      expect(modules.product.listProductVariants).toHaveBeenCalledTimes(1)
      expect(modules.product.listProductVariants).toHaveBeenNthCalledWith(
        1,
        { id: ["variant_1"] },
        {
          select: ["id", "sku"],
          relations: [],
          args: {},
          take: null,
        }
      )

      expect(modules.link.list).toHaveBeenCalledTimes(1)
      expect(modules.link.list).toHaveBeenNthCalledWith(
        1,
        { variant_id: ["variant_1"] },
        {
          select: ["variant_id", "price_set_id"],
          relations: [],
          args: {},
          take: null,
        }
      )

      expect(modules.pricing.listPriceSets).toHaveBeenCalledTimes(1)
      expect(modules.pricing.listPriceSets).toHaveBeenNthCalledWith(
        1,
        {
          prices: [
            {
              name: "context",
              value: {
                currency_code: "usd",
              },
            },
          ],
          id: ["pset_1"],
        },
        {
          select: [
            "id",
            "prices.amount",
            "prices.currency_code",
            "prices.price_set_id",
          ],
          relations: ["prices"],
          args: {},
          take: null,
        }
      )

      expect(modules.pricing.listPrices).not.toHaveBeenCalled()
      expect(modules.product.list).not.toHaveBeenCalled()
      expect(modules.pricing.list).not.toHaveBeenCalled()
      expect(modules.pricing.listAndCountPriceSets).not.toHaveBeenCalled()
    })

    it("should resolve price set variants through the inverse link path", async () => {
      modules.pricing.listPriceSets.mockResolvedValue([
        integrationData.priceSets[1],
      ])
      modules.link.list.mockResolvedValue([
        integrationData.variantPriceSetLinks[1],
      ])
      modules.product.listProductVariants.mockResolvedValue([
        integrationData.variants[1],
      ])

      await query.graph({
        entity: "price_set",
        fields: ["id", "variant.id", "variant.sku"],
        filters: {
          id: "pset_2",
        },
      })

      expect(modules.pricing.listPriceSets).toHaveBeenCalledWith(
        { id: ["pset_2"] },
        {
          select: ["id"],
          relations: [],
          args: {},
          take: null,
        }
      )
      expect(modules.link.list).toHaveBeenCalledWith(
        { price_set_id: ["pset_2"] },
        {
          select: ["price_set_id", "variant_id"],
          relations: [],
          args: {},
          take: null,
        }
      )
      expect(modules.product.listProductVariants).toHaveBeenCalledWith(
        { id: ["variant_2"] },
        {
          select: ["id", "sku"],
          relations: [],
          args: {},
          take: null,
        }
      )
    })

    it("should return paginated price sets through query.graph", async () => {
      modules.pricing.listAndCountPriceSets.mockResolvedValue([
        [integrationData.priceSets[1]],
        integrationData.priceSets.length,
      ])

      const result = await query.graph({
        entity: "price_set",
        fields: ["id"],
        pagination: {
          skip: 1,
          take: 1,
        },
      })

      expect(modules.pricing.listAndCountPriceSets).toHaveBeenCalledTimes(1)
      expect(modules.pricing.listAndCountPriceSets).toHaveBeenCalledWith(
        {},
        {
          select: ["id"],
          relations: [],
          args: {},
          skip: 1,
          take: 1,
        }
      )
      expect(modules.pricing.listPriceSets).not.toHaveBeenCalled()
      expect(result.data).toEqual([{ id: "pset_2" }])
      expect(result.metadata).toEqual({
        skip: 1,
        take: 1,
        count: 3,
      })
    })
  })
})

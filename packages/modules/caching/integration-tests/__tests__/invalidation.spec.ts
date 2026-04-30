import { Modules } from "@medusajs/framework/utils"
import { moduleIntegrationTestRunner } from "@medusajs/test-utils"
import { ICachingModuleService } from "@medusajs/framework/types"
import { MedusaModule } from "@medusajs/framework/modules-sdk"
import { EventBusServiceMock } from "../__fixtures__/event-bus-mock"

jest.setTimeout(30000)

jest.spyOn(MedusaModule, "getAllJoinerConfigs").mockReturnValue([
  {
    schema: `
   type Product {
    id: ID
    title: String
    handle: String
    status: String
    type_id: String
    collection_id: String
    is_giftcard: Boolean
    external_id: String
    created_at: DateTime
    updated_at: DateTime

    variants: [ProductVariant]
    sales_channels: [SalesChannel]
  }

  type ProductVariant {
    id: ID
    product_id: String
    sku: String

    prices: [Price]
  }

  type Price {
    id: ID
    amount: Float
    currency_code: String
    variant_id: String
  }

  type SalesChannel {
    id: ID
    is_disabled: Boolean
  }

  type ProductCollection {
    id: ID
    title: String
    handle: String
  }

  type InventoryItem {
    id: ID
    sku: String
    title: String
    requires_shipping: Boolean
  }

  type ProductVariantInventoryItem {
    id: ID
    variant_id: String
    inventory_item_id: String
    required_quantity: Int
  }
`,
  },
])

const mockEventBus = new EventBusServiceMock()

moduleIntegrationTestRunner<ICachingModuleService>({
  moduleName: Modules.CACHING,
  injectedDependencies: {
    [Modules.EVENT_BUS]: mockEventBus,
  },
  moduleOptions: {
    in_memory: {
      enable: true,
    },
  },
  testSuite: ({ service }) => {
    describe("Cache Invalidation with Entity Relationships", () => {
      afterEach(async () => {
        await service.clear({ tags: ["*"] }).catch(() => {})
      })

      describe("Single Entity Caching", () => {
        it("should cache and retrieve a single product entity using computed keys", async () => {
          const product = {
            id: "prod_1",
            title: "Test Product",
            handle: "test-product",
            status: "published",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }

          const productKey = await service.computeKey(product)

          await service.set({
            key: productKey,
            data: product,
          })

          const cachedProduct = await service.get({ key: productKey })
          expect(cachedProduct).toEqual(product)
        })

        it("should auto-invalidate single entity when strategy clears computed tags", async () => {
          const product = {
            id: "prod_1",
            title: "Test Product",
            handle: "test-product",
          }

          const productKey = await service.computeKey(product)

          await service.set({
            key: productKey,
            data: product,
          })

          await mockEventBus.emit(
            [{ name: "product.updated", data: { id: product.id } }],
            {}
          )

          const result = await service.get({ key: productKey })
          expect(result).toBeNull()
        })

        it("should not auto-invalidate single entity with autoInvalidate=false", async () => {
          const product = {
            id: "prod_1",
            title: "Test Product",
            handle: "test-product",
          }

          const productKey = await service.computeKey(product)

          await service.set({
            key: productKey,
            data: product,
            options: { autoInvalidate: false },
          })

          await mockEventBus.emit(
            [{ name: "product.updated", data: { id: product.id } }],
            {}
          )

          const result = await service.get({ key: productKey })
          expect(result).toEqual(product)
        })
      })

      describe("Entity List Caching", () => {
        it("should cache and retrieve lists of entities using computed keys", async () => {
          const publishedProductsQuery = {
            entity: "product",
            filters: { status: "published" },
            fields: ["id", "title", "status"],
          }

          const allProductsQuery = {
            entity: "product",
            filters: {},
            fields: ["id", "title", "status"],
          }

          const publishedProducts = [
            { id: "prod_1", title: "Product 1", status: "published" },
            { id: "prod_2", title: "Product 2", status: "published" },
          ]

          const allProducts = [
            ...publishedProducts,
            { id: "prod_3", title: "Product 3", status: "draft" },
          ]

          const publishedProductsKey = await service.computeKey(
            publishedProductsQuery
          )
          const allProductsKey = await service.computeKey(allProductsQuery)

          await service.set({
            key: publishedProductsKey,
            data: publishedProducts,
          })

          await service.set({
            key: allProductsKey,
            data: allProducts,
          })

          const cachedPublished = await service.get({
            key: publishedProductsKey,
          })
          const cachedAll = await service.get({ key: allProductsKey })

          expect(cachedPublished).toEqual(publishedProducts)
          expect(cachedAll).toEqual(allProducts)
        })

        it("should invalidate related lists when individual product is updated", async () => {
          const listQuery = {
            entity: "product",
            filters: { status: "published" },
            includes: ["id", "title"],
          }

          const products = [
            { id: "prod_1", title: "Product 1", status: "published" },
            { id: "prod_2", title: "Product 2", status: "published" },
          ]

          const listKey = await service.computeKey(listQuery)

          await service.set({
            key: listKey,
            data: products,
          })

          await mockEventBus.emit(
            [
              {
                name: "product.updated",
                data: { id: "prod_1", title: "Updated Product 1" },
              },
            ],
            {}
          )

          const cachedList = await service.get({ key: listKey })

          expect(cachedList).toBeNull()
        })
      })

      describe("Nested Entity Caching", () => {
        it("should cache products with nested variants and prices using computed keys", async () => {
          const productWithVariants = {
            id: "prod_1",
            title: "Complex Product",
            variants: [
              {
                id: "var_1",
                product_id: "prod_1",
                sku: "SKU-001",
                prices: [
                  {
                    id: "price_1",
                    variant_id: "var_1",
                    amount: 1000,
                    currency_code: "USD",
                  },
                  {
                    id: "price_2",
                    variant_id: "var_1",
                    amount: 900,
                    currency_code: "EUR",
                  },
                ],
              },
              {
                id: "var_2",
                product_id: "prod_1",
                sku: "SKU-002",
                prices: [
                  {
                    id: "price_3",
                    variant_id: "var_2",
                    amount: 1200,
                    currency_code: "USD",
                  },
                ],
              },
            ],
          }

          const productKey = await service.computeKey(productWithVariants)

          await service.set({
            key: productKey,
            data: productWithVariants,
          })

          const cached = await service.get<typeof productWithVariants>({
            key: productKey,
          })
          expect(cached).toEqual(productWithVariants)
          expect(cached!.variants).toHaveLength(2)
          expect(cached!.variants[0].prices).toHaveLength(2)
        })

        it("should invalidate nested product when related variant is updated", async () => {
          const productWithVariants = {
            id: "prod_1",
            title: "Complex Product",
            variants: [{ id: "var_1", product_id: "prod_1", sku: "SKU-001" }],
          }

          const productKey = await service.computeKey(productWithVariants)

          await service.set({
            key: productKey,
            data: productWithVariants,
          })

          await mockEventBus.emit(
            [
              {
                name: "product_variant.updated",
                data: {
                  id: "var_1",
                  product_id: "prod_1",
                  sku: "SKU-001-UPDATED",
                },
              },
            ],
            {}
          )

          const result = await service.get({ key: productKey })
          expect(result).toBeNull()
        })

        it("should handle price updates affecting variant and product caches", async () => {
          const price = {
            id: "price_1",
            variant_id: "var_1",
            amount: 1000,
            currency_code: "USD",
          }

          const variant = {
            id: "var_1",
            product_id: "prod_1",
            sku: "SKU-001",
            prices: [price],
          }

          const product = {
            id: "prod_1",
            title: "Product",
            variants: [variant],
          }

          const priceKey = await service.computeKey(price)
          const variantKey = await service.computeKey(variant)
          const productKey = await service.computeKey(product)

          await service.set({
            key: priceKey,
            data: price,
          })
          await service.set({
            key: variantKey,
            data: variant,
          })
          await service.set({
            key: productKey,
            data: product,
          })

          await mockEventBus.emit(
            [
              {
                name: "price.updated",
                data: { id: "price_1", variant_id: "var_1", amount: 1100 },
              },
            ],
            {}
          )

          const cachedPrice = await service.get({ key: priceKey })
          const cachedVariant = await service.get({ key: variantKey })
          const cachedProduct = await service.get({ key: productKey })

          expect(cachedPrice).toBeNull()
          expect(cachedVariant).toBeNull()
          expect(cachedProduct).toBeNull()
        })
      })

      describe("Complex Query Caching", () => {
        it("should cache complex queries and invalidate based on entity relationships", async () => {
          const complexQuery = {
            entity: "product",
            filters: { status: "published", collection_id: "col_1" },
            includes: {
              variants: {
                include: {
                  prices: true,
                },
              },
              collection: true,
            },
            pagination: { limit: 10, offset: 0 },
          }

          const queryResult = {
            data: [
              {
                id: "prod_1",
                title: "Product 1",
                collection_id: "col_1",
                variants: [
                  {
                    id: "var_1",
                    product_id: "prod_1",
                    prices: [{ id: "price_1", amount: 1000 }],
                  },
                ],
                collection: { id: "col_1", title: "Collection 1" },
              },
            ],
            pagination: { total: 1, limit: 10, offset: 0 },
          }

          const queryKey = await service.computeKey(complexQuery)

          await service.set({
            key: queryKey,
            data: queryResult,
          })

          const cached = await service.get({ key: queryKey })
          expect(cached).toEqual(queryResult)

          await mockEventBus.emit(
            [
              {
                name: "price.updated",
                data: { id: "price_1", amount: 1100 },
              },
            ],
            {}
          )

          const cachedAfterUpdate = await service.get({ key: queryKey })
          expect(cachedAfterUpdate).toBeNull()
        })
      })

      describe("Variant Availability Cache Invalidation", () => {
        it("should invalidate cached variant inventory items list when an inventory item is created", async () => {
          const variantInventoryQuery = {
            entity: "product_variant_inventory_items",
            filters: { variant_id: ["var_1"] },
            fields: ["variant_id", "required_quantity"],
          }

          const queryKey = await service.computeKey(variantInventoryQuery)

          await service.set({
            key: queryKey,
            data: { result: [] },
            tags: [`ProductVariant:var_1`, "InventoryItem:list:*"],
          })

          const beforeInvalidation = await service.get({ key: queryKey })
          expect(beforeInvalidation).toEqual({ result: [] })

          await mockEventBus.emit(
            [
              {
                name: "inventory_item.created",
                data: {
                  id: "iitem_1",
                  sku: "SKU-001",
                  title: "New Inventory Item",
                  requires_shipping: true,
                },
              },
            ],
            {}
          )

          const afterInvalidation = await service.get({ key: queryKey })
          expect(afterInvalidation).toBeNull()
        })

        it("should invalidate cached variant inventory items list when the variant is updated", async () => {
          const variantInventoryQuery = {
            entity: "product_variant_inventory_items",
            filters: { variant_id: ["var_1"] },
            fields: ["variant_id", "required_quantity"],
          }

          const queryKey = await service.computeKey(variantInventoryQuery)

          await service.set({
            key: queryKey,
            data: { result: [] },
            tags: [`ProductVariant:var_1`, "InventoryItem:list:*"],
          })

          await mockEventBus.emit(
            [
              {
                name: "product_variant.updated",
                data: { id: "var_1", product_id: "prod_1" },
              },
            ],
            {}
          )

          const result = await service.get({ key: queryKey })
          expect(result).toBeNull()
        })
      })
    })
  },
})

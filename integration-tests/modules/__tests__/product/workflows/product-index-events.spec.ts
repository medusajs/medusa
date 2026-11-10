import {
  batchImageVariantsWorkflow,
  batchLinkProductsToCategoryWorkflow,
  batchLinkProductsToCollectionWorkflow,
  batchPriceListPricesWorkflow,
  batchVariantImagesWorkflow,
  createPriceListsWorkflow,
  createProductsWorkflow,
  deletePriceListsWorkflow,
  linkProductsToSalesChannelWorkflow,
  updatePriceListsWorkflow,
  upsertVariantPricesWorkflow,
} from "@medusajs/core-flows"
import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import {
  IEventBusModuleService,
  IProductModuleService,
  ISalesChannelModuleService,
  ProductDTO,
} from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  Modules,
  PriceListWorkflowEvents,
  ProductVariantWorkflowEvents,
  ProductWorkflowEvents,
} from "@medusajs/utils"

jest.setTimeout(50000)

medusaIntegrationTestRunner({
  testSuite: ({ getContainer }) => {
    describe("Workflows: Events that keep a product index up to date", () => {
      let appContainer
      let productModule: IProductModuleService
      let salesChannelModule: ISalesChannelModuleService
      let eventBusService: IEventBusModuleService
      let emitSpy: jest.SpyInstance
      let product: ProductDTO

      beforeAll(async () => {
        appContainer = getContainer()
        productModule = appContainer.resolve(Modules.PRODUCT)
        salesChannelModule = appContainer.resolve(Modules.SALES_CHANNEL)
        eventBusService = appContainer.resolve(Modules.EVENT_BUS)
      })

      beforeEach(async () => {
        const { result } = await createProductsWorkflow(appContainer).run({
          input: {
            products: [
              {
                title: "Shirt",
                options: [{ title: "Size", values: ["S"] }],
                images: [{ url: "https://example.com/shirt.png" }],
                variants: [
                  {
                    title: "S",
                    options: { Size: "S" },
                    prices: [{ amount: 10, currency_code: "usd" }],
                  },
                ],
              },
            ],
          },
        })

        product = result[0]
        emitSpy = jest.spyOn(eventBusService, "emit")
      })

      afterEach(() => {
        emitSpy.mockRestore()
      })

      const getEmittedEvents = (name: string) =>
        emitSpy.mock.calls
          .flatMap(([events]) => (Array.isArray(events) ? events : [events]))
          .filter((event) => event.name === name)
          .map((event) => event.data)

      const createPriceList = async () => {
        const { result } = await createPriceListsWorkflow(appContainer).run({
          input: {
            price_lists_data: [
              {
                title: "Sale",
                description: "Sale",
                prices: [
                  {
                    amount: 5,
                    currency_code: "usd",
                    variant_id: product.variants[0].id,
                  },
                ],
              },
            ],
          },
        })

        return result[0]
      }

      describe("price lists", () => {
        it("should emit price-list.created, updated and deleted", async () => {
          const priceList = await createPriceList()

          await updatePriceListsWorkflow(appContainer).run({
            input: {
              price_lists_data: [{ id: priceList.id, title: "Big sale" }],
            },
          })

          await deletePriceListsWorkflow(appContainer).run({
            input: { ids: [priceList.id] },
          })

          expect(getEmittedEvents(PriceListWorkflowEvents.CREATED)).toEqual([
            { id: priceList.id },
          ])
          expect(getEmittedEvents(PriceListWorkflowEvents.UPDATED)).toEqual([
            { id: priceList.id },
          ])
          expect(getEmittedEvents(PriceListWorkflowEvents.DELETED)).toEqual([
            { id: priceList.id },
          ])
        })

        it("should emit the price sets whose price list prices were added, updated and removed", async () => {
          const priceList = await createPriceList()
          const variantId = product.variants[0].id

          const { result } = await batchPriceListPricesWorkflow(
            appContainer
          ).run({
            input: {
              data: {
                id: priceList.id,
                create: [
                  { amount: 4, currency_code: "eur", variant_id: variantId },
                ],
                update: [],
                delete: [],
              },
            },
          })

          await batchPriceListPricesWorkflow(appContainer).run({
            input: {
              data: {
                id: priceList.id,
                create: [],
                update: [
                  {
                    id: result.created[0].id,
                    amount: 3,
                    currency_code: "eur",
                    variant_id: variantId,
                  },
                ],
                delete: [],
              },
            },
          })

          await batchPriceListPricesWorkflow(appContainer).run({
            input: {
              data: {
                id: priceList.id,
                create: [],
                update: [],
                delete: [result.created[0].id],
              },
            },
          })

          const {
            data: [variant],
          } = await appContainer
            .resolve(ContainerRegistrationKeys.QUERY)
            .graph({
              entity: "variant",
              fields: ["price_set.id"],
              filters: { id: variantId },
            })

          const expected = [
            { id: priceList.id, price_set_ids: [variant.price_set.id] },
          ]

          expect(
            getEmittedEvents(PriceListWorkflowEvents.PRICES_ADDED)
          ).toEqual(expected)
          expect(
            getEmittedEvents(PriceListWorkflowEvents.PRICES_UPDATED)
          ).toEqual(expected)
          expect(
            getEmittedEvents(PriceListWorkflowEvents.PRICES_REMOVED)
          ).toEqual(expected)
        })
      })

      describe("product links", () => {
        it("should emit product.updated when products are linked to a sales channel", async () => {
          const salesChannel = await salesChannelModule.createSalesChannels({
            name: "Web",
          })

          await linkProductsToSalesChannelWorkflow(appContainer).run({
            input: { id: salesChannel.id, add: [product.id] },
          })

          expect(getEmittedEvents(ProductWorkflowEvents.UPDATED)).toEqual([
            { id: product.id },
          ])
        })

        it("should emit product.updated when products are linked to a category", async () => {
          const category = await productModule.createProductCategories({
            name: "Shirts",
          })

          await batchLinkProductsToCategoryWorkflow(appContainer).run({
            input: { id: category.id, add: [product.id] },
          })

          expect(getEmittedEvents(ProductWorkflowEvents.UPDATED)).toEqual([
            { id: product.id },
          ])
        })

        it("should emit product.updated when products are linked to a collection", async () => {
          const collection = await productModule.createProductCollections({
            title: "Summer",
          })

          await batchLinkProductsToCollectionWorkflow(appContainer).run({
            input: { id: collection.id, add: [product.id] },
          })

          expect(getEmittedEvents(ProductWorkflowEvents.UPDATED)).toEqual([
            { id: product.id },
          ])
        })
      })

      describe("variants", () => {
        it("should emit product-variant.updated when variant prices are upserted", async () => {
          const variantId = product.variants[0].id

          await upsertVariantPricesWorkflow(appContainer).run({
            input: {
              variantPrices: [
                {
                  variant_id: variantId,
                  product_id: product.id,
                  prices: [{ amount: 20, currency_code: "usd" }],
                },
              ],
              previousVariantIds: [variantId],
            },
          })

          expect(
            getEmittedEvents(ProductVariantWorkflowEvents.UPDATED)
          ).toEqual([{ id: variantId }])
        })

        it("should emit product-variant.updated when variant images change", async () => {
          const variantId = product.variants[0].id
          const imageId = product.images[0].id

          await batchImageVariantsWorkflow(appContainer).run({
            input: { image_id: imageId, add: [variantId] },
          })

          await batchVariantImagesWorkflow(appContainer).run({
            input: { variant_id: variantId, remove: [imageId] },
          })

          expect(
            getEmittedEvents(ProductVariantWorkflowEvents.UPDATED)
          ).toEqual([{ id: variantId }, { id: variantId }])
        })
      })
    })
  },
})

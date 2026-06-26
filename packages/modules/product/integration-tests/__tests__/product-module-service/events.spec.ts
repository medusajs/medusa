import {
  InferEntityType,
  IProductModuleService,
} from "@medusajs/framework/types"
import {
  CommonEvents,
  composeMessage,
  Modules,
  ProductEvents,
} from "@medusajs/framework/utils"
import {
  MockEventBusService,
  moduleIntegrationTestRunner,
} from "@medusajs/test-utils"
import { ProductOption } from "../../../src/models"
import { buildProductAndRelationsData } from "../../__fixtures__/product"

jest.setTimeout(300000)

moduleIntegrationTestRunner<IProductModuleService>({
  moduleName: Modules.PRODUCT,
  injectedDependencies: {
    [Modules.EVENT_BUS]: new MockEventBusService(),
  },
  testSuite: ({ MikroOrmWrapper, service }) => {
    let eventBusSpy: jest.SpyInstance

    beforeEach(() => {
      eventBusSpy = jest.spyOn(MockEventBusService.prototype, "emit")
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    describe("ProductModuleService Events", () => {
      describe("Product Creation", () => {
        it("should emit all related events when creating a product with full relations", async () => {
          const productData = buildProductAndRelationsData({
            title: "Test Product",
            images: [{ url: "image-1.jpg" }, { url: "image-2.jpg" }],
            thumbnail: "image-1.jpg",
            options: [
              {
                title: "size",
                values: ["small", "medium", "large"],
              },
              {
                title: "color",
                values: ["red", "blue"],
              },
            ],
            variants: [
              {
                title: "Small Red",
                sku: "small-red",
                options: { size: "small", color: "red" },
              },
              {
                title: "Medium Blue",
                sku: "medium-blue",
                options: { size: "medium", color: "blue" },
              },
            ],
          })

          const products = await service.createProducts([productData])
          const createdProduct = products[0]

          expect(eventBusSpy).toHaveBeenCalledTimes(1)
          const emittedEvents = eventBusSpy.mock.calls[0][0]

          // Should emit events for:
          // 1. Product created
          // 2. Product options created (2 options)
          // 3. Product option values created (5 values total: 3 sizes + 2 colors)
          // 4. Product variants created (2 variants)
          // 5. Product images created (2 images)
          // 6. Product product options created (pivot table) (2 product-productOption links)
          // 7. Product product option values created (pivot table) (5 product-productOptionValue links)

          const expectedEventsCount = 1 + 2 + 5 + 2 + 2 + 2 + 5 // 19 total events
          expect(emittedEvents).toHaveLength(expectedEventsCount)

          // Verify product created event
          expect(emittedEvents).toEqual(
            expect.arrayContaining([
              composeMessage(ProductEvents.PRODUCT_CREATED, {
                data: { id: createdProduct.id },
                object: "product",
                source: Modules.PRODUCT,
                action: CommonEvents.CREATED,
              }),
            ])
          )

          // Verify product option created events
          createdProduct.options.forEach((option) => {
            expect(emittedEvents).toEqual(
              expect.arrayContaining([
                composeMessage(ProductEvents.PRODUCT_OPTION_CREATED, {
                  data: { id: option.id },
                  object: "product_option",
                  source: Modules.PRODUCT,
                  action: CommonEvents.CREATED,
                }),
              ])
            )

            // Verify option value created events for each option
            option.values.forEach((value) => {
              expect(emittedEvents).toEqual(
                expect.arrayContaining([
                  composeMessage(ProductEvents.PRODUCT_OPTION_VALUE_CREATED, {
                    data: { id: value.id },
                    object: "product_option_value",
                    source: Modules.PRODUCT,
                    action: CommonEvents.CREATED,
                  }),
                ])
              )
            })
          })

          // Verify product variant created events
          createdProduct.variants.forEach((variant) => {
            expect(emittedEvents).toEqual(
              expect.arrayContaining([
                composeMessage(ProductEvents.PRODUCT_VARIANT_CREATED, {
                  data: { id: variant.id },
                  object: "product_variant",
                  source: Modules.PRODUCT,
                  action: CommonEvents.CREATED,
                }),
              ])
            )
          })

          // Verify product image created events
          createdProduct.images.forEach((image) => {
            expect(emittedEvents).toEqual(
              expect.arrayContaining([
                composeMessage(ProductEvents.PRODUCT_IMAGE_CREATED, {
                  data: { id: image.id },
                  object: "product_image",
                  source: Modules.PRODUCT,
                  action: CommonEvents.CREATED,
                }),
              ])
            )
          })
        })
      })

      describe("Product Update", () => {
        let existingProduct: any

        beforeEach(async () => {
          const productData = buildProductAndRelationsData({
            title: "Original Product",
            images: [{ url: "original-image.jpg" }],
            options: [
              {
                title: "existing-option",
                values: ["value-1"],
              },
              {
                title: "existing-option-2",
                values: ["value-1"],
              },
            ],
            variants: [
              {
                title: "existing-variant",
                options: {
                  "existing-option": "value-1",
                  "existing-option-2": "value-1",
                },
              },
            ],
          })
          const products = await service.createProducts([productData])
          existingProduct = products[0]
          eventBusSpy.mockClear()
        })

        it("should emit cascade events when updating product with relations", async () => {
          const newOption = (
            await service.createProductOptions([
              {
                title: "new-size-option",
                values: ["small", "large"],
              },
            ])
          )[0]
          eventBusSpy.mockClear()

          const existingOption = existingProduct.options.find(
            (option: any) => option.title === "existing-option"
          )! as InferEntityType<typeof ProductOption>
          const existingVariant = existingProduct.variants[0]
          const expectedDeletedOption = existingProduct.options.find(
            (option: any) => option.title === "existing-option-2"
          )!
          const expectedDeletedImage = existingProduct.images[0]

          const updateData = {
            id: existingProduct.id,
            title: "Updated Product",
            images: [{ url: "new-image-1.jpg" }, { url: "new-image-2.jpg" }],
            option_ids: [newOption.id, existingOption.id],
            variants: [
              {
                id: existingVariant.id,
                title: "updated-existing-variant",
                options: {
                  "new-size-option": "small",
                  "existing-option": "value-1",
                },
              },
              {
                title: "New Variant",
                options: {
                  "new-size-option": "large",
                  "existing-option": "value-1",
                },
              },
            ],
          }

          await service.updateProducts(existingProduct.id, updateData)
          const updatedProduct = await service.retrieveProduct(
            existingProduct.id,
            {
              relations: [
                "options",
                "options.values",
                "variants",
                "images",
                "tags",
              ],
            }
          )

          expect(eventBusSpy).toHaveBeenCalledTimes(1)
          const emittedEvents = eventBusSpy.mock.calls[0][0]

          // Total count should include: 1 product update + 1 option linked + 2 option values linked + 1 option unlinked + 1 option value unlinked + 1 variant created + 1 variant updated + 2 images created + 1 image deleted = 11 events
          expect(emittedEvents).toHaveLength(11)

          // Should emit product update event
          expect(emittedEvents).toEqual(
            expect.arrayContaining([
              composeMessage(ProductEvents.PRODUCT_UPDATED, {
                data: { id: existingProduct.id },
                object: "product",
                source: Modules.PRODUCT,
                action: CommonEvents.UPDATED,
              }),
            ])
          )

          // Should emit option link event for new option
          expect(emittedEvents).toEqual(
            expect.arrayContaining([
              composeMessage(ProductEvents.PRODUCT_PRODUCT_OPTION_CREATED, {
                data: expect.objectContaining({ id: expect.any(String) }),
                object: "product_product_option",
                source: Modules.PRODUCT,
                action: CommonEvents.CREATED,
              }),
            ])
          )

          // Should emit option values link event for new option
          expect(emittedEvents.filter(e => e.name === ProductEvents.PRODUCT_PRODUCT_OPTION_VALUE_CREATED).length).toEqual(2)
          expect(emittedEvents).toEqual(
            expect.arrayContaining([
              composeMessage(
                ProductEvents.PRODUCT_PRODUCT_OPTION_VALUE_CREATED,
                {
                  data: expect.objectContaining({ id: expect.any(String) }),
                  object: "product_product_option_value",
                  source: Modules.PRODUCT,
                  action: CommonEvents.CREATED,
                }
              ),
            ])
          )

          // Should emit option unlink event for new option
          expect(emittedEvents).toEqual(
            expect.arrayContaining([
              composeMessage(ProductEvents.PRODUCT_PRODUCT_OPTION_DELETED, {
                data: expect.objectContaining({ id: expect.any(String) }),
                object: "product_product_option",
                source: Modules.PRODUCT,
                action: CommonEvents.DELETED,
              }),
            ])
          )

          // Should emit option value unlink event for new option
          expect(emittedEvents).toEqual(
            expect.arrayContaining([
              composeMessage(
                ProductEvents.PRODUCT_PRODUCT_OPTION_VALUE_DELETED,
                {
                  data: expect.objectContaining({ id: expect.any(String) }),
                  object: "product_product_option_value",
                  source: Modules.PRODUCT,
                  action: CommonEvents.DELETED,
                }
              ),
            ])
          )

          // Should emit variant created event for new variant
          expect(emittedEvents).toEqual(
            expect.arrayContaining([
              composeMessage(ProductEvents.PRODUCT_VARIANT_CREATED, {
                data: expect.objectContaining({ id: expect.any(String) }),
                object: "product_variant",
                source: Modules.PRODUCT,
                action: CommonEvents.CREATED,
              }),
            ])
          )

          // Should emit variant updated event for updated variant
          expect(emittedEvents).toEqual(
            expect.arrayContaining([
              composeMessage(ProductEvents.PRODUCT_VARIANT_UPDATED, {
                data: expect.objectContaining({ id: existingVariant.id }),
                object: "product_variant",
                source: Modules.PRODUCT,
                action: CommonEvents.UPDATED,
              }),
            ])
          )

          // Should emit image created events for new images
          updatedProduct.images.forEach((image) => {
            expect(emittedEvents).toEqual(
              expect.arrayContaining([
                composeMessage(ProductEvents.PRODUCT_IMAGE_CREATED, {
                  data: expect.objectContaining({ id: expect.any(String) }),
                  object: "product_image",
                  source: Modules.PRODUCT,
                  action: CommonEvents.CREATED,
                }),
              ])
            )
          })

          // Should emit image deleted events for deleted images
          expect(emittedEvents).toEqual(
            expect.arrayContaining([
              composeMessage(ProductEvents.PRODUCT_IMAGE_DELETED, {
                data: expect.objectContaining({ id: expectedDeletedImage.id }),
                object: "product_image",
                source: Modules.PRODUCT,
                action: CommonEvents.DELETED,
              }),
            ])
          )
        })
      })

      describe("Product Deletion", () => {
        it("should emit all cascade delete events when soft deleting a product", async () => {
          const productData = buildProductAndRelationsData({
            title: "Product to Delete",
            images: [
              { url: "delete-image-1.jpg" },
              { url: "delete-image-2.jpg" },
            ],
            options: [
              {
                title: "delete-option",
                values: ["delete-value-1", "delete-value-2"],
              },
            ],
            variants: [
              {
                title: "Delete Variant",
                options: { "delete-option": "delete-value-1" },
              },
            ],
          })

          const products = await service.createProducts([productData])
          const createdProduct = products[0]
          eventBusSpy.mockClear()

          await service.softDeleteProducts([createdProduct.id])

          expect(eventBusSpy).toHaveBeenCalledTimes(1)
          const emittedEvents = eventBusSpy.mock.calls[0][0]

          // Total count should include: 1 product deleted + 1 variant deleted + 2 images deleted = 4 events
          expect(emittedEvents).toHaveLength(4)

          // Should emit delete events for product and all its relations
          expect(emittedEvents).toEqual(
            expect.arrayContaining([
              composeMessage(ProductEvents.PRODUCT_DELETED, {
                data: { id: createdProduct.id },
                object: "product",
                source: Modules.PRODUCT,
                action: CommonEvents.DELETED,
              }),
            ])
          )

          // Should emit delete events for variants
          expect(emittedEvents).toEqual(
            expect.arrayContaining([
              composeMessage(ProductEvents.PRODUCT_VARIANT_DELETED, {
                data: { id: createdProduct.variants[0].id },
                object: "product_variant",
                source: Modules.PRODUCT,
                action: CommonEvents.DELETED,
              }),
            ])
          )

          // Should emit delete events for images
          createdProduct.images.forEach((image) => {
            expect(emittedEvents).toEqual(
              expect.arrayContaining([
                composeMessage(ProductEvents.PRODUCT_IMAGE_DELETED, {
                  data: {
                    id: image.id,
                  },
                  object: "product_image",
                  source: Modules.PRODUCT,
                  action: CommonEvents.DELETED,
                }),
              ])
            )
          })
        })
      })

      describe("Product Variant Operations", () => {
        let productWithOptions: any

        beforeEach(async () => {
          const productData = buildProductAndRelationsData({
            options: [
              {
                title: "size",
                values: ["small", "medium", "large"],
              },
              {
                title: "color",
                values: ["red", "blue", "green"],
              },
            ],
          })
          const products = await service.createProducts([productData])
          productWithOptions = products[0]
          eventBusSpy.mockClear()
        })

        it("should emit PRODUCT_VARIANT_CREATED event only when creating standalone variant", async () => {
          const variantData = {
            title: "New Standalone Variant",
            product_id: productWithOptions.id,
            options: { size: "large", color: "green" },
          }

          const variants = await service.createProductVariants([variantData])

          expect(eventBusSpy).toHaveBeenCalledTimes(1)
          expect(eventBusSpy).toHaveBeenCalledWith(
            [
              composeMessage(ProductEvents.PRODUCT_VARIANT_CREATED, {
                data: { id: variants[0].id },
                object: "product_variant",
                source: Modules.PRODUCT,
                action: CommonEvents.CREATED,
              }),
            ],
            {
              internal: true,
            }
          )
        })

        it("should emit PRODUCT_VARIANT_UPDATED event only when updating variant", async () => {
          const variant = productWithOptions.variants[0]

          await service.updateProductVariants(variant.id, {
            title: "Updated Variant Title",
          })

          expect(eventBusSpy).toHaveBeenCalledTimes(1)
          expect(eventBusSpy).toHaveBeenCalledWith(
            [
              composeMessage(ProductEvents.PRODUCT_VARIANT_UPDATED, {
                data: { id: variant.id },
                object: "product_variant",
                source: Modules.PRODUCT,
                action: CommonEvents.UPDATED,
              }),
            ],
            {
              internal: true,
            }
          )
        })
      })

      describe("Product Tag Operations", () => {
        it("should emit PRODUCT_TAG_CREATED event on createProductTags", async () => {
          const tagData = { value: "New Tag" }

          const tags = await service.createProductTags([tagData])

          expect(eventBusSpy).toHaveBeenCalledTimes(1)
          expect(eventBusSpy).toHaveBeenCalledWith(
            [
              composeMessage(ProductEvents.PRODUCT_TAG_CREATED, {
                data: { id: tags[0].id },
                object: "product_tag",
                source: Modules.PRODUCT,
                action: CommonEvents.CREATED,
              }),
            ],
            {
              internal: true,
            }
          )
        })

        it("should emit PRODUCT_TAG_UPDATED event on updateProductTags", async () => {
          const tags = await service.createProductTags([
            { value: "Original Tag" },
          ])
          eventBusSpy.mockClear()

          await service.updateProductTags(tags[0].id, { value: "Updated Tag" })

          expect(eventBusSpy).toHaveBeenCalledTimes(1)
          expect(eventBusSpy).toHaveBeenCalledWith(
            [
              composeMessage(ProductEvents.PRODUCT_TAG_UPDATED, {
                data: { id: tags[0].id },
                object: "product_tag",
                source: Modules.PRODUCT,
                action: CommonEvents.UPDATED,
              }),
            ],
            {
              internal: true,
            }
          )
        })

        it("should emit appropriate events on upsertProductTags", async () => {
          const existingTag = await service.createProductTags([
            { value: "Existing Tag" },
          ])
          eventBusSpy.mockClear()

          const tags = await service.upsertProductTags([
            { id: existingTag[0].id, value: "Updated Existing Tag" },
            { value: "New Tag" },
          ])

          const updatedTag = tags.find((tag) => tag.id === existingTag[0].id)!
          const createdTag = tags.find((tag) => tag.id !== updatedTag.id)!

          expect(eventBusSpy).toHaveBeenCalledTimes(1)
          const emittedEvents = eventBusSpy.mock.calls[0][0]

          // Total count should include: 1 tag updated + 1 tag created = 2 events
          expect(emittedEvents).toHaveLength(2)

          expect(emittedEvents).toEqual(
            expect.arrayContaining([
              composeMessage(ProductEvents.PRODUCT_TAG_UPDATED, {
                data: { id: updatedTag.id },
                object: "product_tag",
                source: Modules.PRODUCT,
                action: CommonEvents.UPDATED,
              }),
              composeMessage(ProductEvents.PRODUCT_TAG_CREATED, {
                data: { id: createdTag.id },
                object: "product_tag",
                source: Modules.PRODUCT,
                action: CommonEvents.CREATED,
              }),
            ])
          )
        })
      })

      describe("Product Type Operations", () => {
        it("should emit PRODUCT_TYPE_CREATED event on createProductTypes", async () => {
          const typeData = { value: "New Type" }

          const types = await service.createProductTypes([typeData])

          expect(eventBusSpy).toHaveBeenCalledTimes(1)
          expect(eventBusSpy).toHaveBeenCalledWith(
            [
              composeMessage(ProductEvents.PRODUCT_TYPE_CREATED, {
                data: { id: types[0].id },
                object: "product_type",
                source: Modules.PRODUCT,
                action: CommonEvents.CREATED,
              }),
            ],
            {
              internal: true,
            }
          )
        })

        it("should emit PRODUCT_TYPE_UPDATED event on updateProductTypes", async () => {
          const types = await service.createProductTypes([
            { value: "Original Type" },
          ])
          eventBusSpy.mockClear()

          await service.updateProductTypes(types[0].id, {
            value: "Updated Type",
          })

          expect(eventBusSpy).toHaveBeenCalledTimes(1)
          expect(eventBusSpy).toHaveBeenCalledWith(
            [
              composeMessage(ProductEvents.PRODUCT_TYPE_UPDATED, {
                data: { id: types[0].id },
                object: "product_type",
                source: Modules.PRODUCT,
                action: CommonEvents.UPDATED,
              }),
            ],
            {
              internal: true,
            }
          )
        })

        it("should emit appropriate events on upsertProductTypes", async () => {
          const existingType = await service.createProductTypes([
            { value: "Existing Type" },
          ])
          eventBusSpy.mockClear()

          const types = await service.upsertProductTypes([
            { id: existingType[0].id, value: "Updated Existing Type" },
            { value: "New Type" },
          ])

          const updatedType = types.find(
            (type) => type.id === existingType[0].id
          )!
          const createdType = types.find((type) => type.id !== updatedType.id)!

          expect(eventBusSpy).toHaveBeenCalledTimes(1)
          const emittedEvents = eventBusSpy.mock.calls[0][0]

          // Total count should include: 1 type updated + 1 type created = 2 events
          expect(emittedEvents).toHaveLength(2)

          expect(emittedEvents).toEqual(
            expect.arrayContaining([
              composeMessage(ProductEvents.PRODUCT_TYPE_UPDATED, {
                data: { id: updatedType.id },
                object: "product_type",
                source: Modules.PRODUCT,
                action: CommonEvents.UPDATED,
              }),
              composeMessage(ProductEvents.PRODUCT_TYPE_CREATED, {
                data: { id: createdType.id },
                object: "product_type",
                source: Modules.PRODUCT,
                action: CommonEvents.CREATED,
              }),
            ])
          )
        })
      })

      describe("Product Option Operations", () => {
        let productWithOptions: any

        beforeEach(async () => {
          const productData = buildProductAndRelationsData({
            title: "Product with Options",
            options: [
              { title: "Size", values: ["small", "medium", "large"] },
              { title: "Color", values: ["red", "blue", "green"] },
            ],
          })
          const products = await service.createProducts([productData])
          productWithOptions = products[0]
          eventBusSpy.mockClear()
        })

        it("should emit PRODUCT_OPTION_CREATED event on createProductOptions", async () => {
          const optionData = {
            title: "New Option",
            product_id: productWithOptions.id,
            values: ["value1", "value2", "value3"],
          }

          const options = await service.createProductOptions([optionData])

          expect(eventBusSpy).toHaveBeenCalledTimes(1)
          const emittedEvents = eventBusSpy.mock.calls[0][0]

          // Total count should include: 1 option created + 3 option values created = 4 events
          expect(emittedEvents).toHaveLength(4)

          // Should emit 1 option created event
          expect(emittedEvents).toEqual(
            expect.arrayContaining([
              composeMessage(ProductEvents.PRODUCT_OPTION_CREATED, {
                data: { id: options[0].id },
                object: "product_option",
                source: Modules.PRODUCT,
                action: CommonEvents.CREATED,
              }),
            ])
          )

          // Should emit 3 option values created events
          options[0].values.forEach((value) => {
            expect(emittedEvents).toEqual(
              expect.arrayContaining([
                composeMessage(ProductEvents.PRODUCT_OPTION_VALUE_CREATED, {
                  data: { id: value.id },
                  object: "product_option_value",
                  source: Modules.PRODUCT,
                  action: CommonEvents.CREATED,
                }),
              ])
            )
          })
        })

        it("should emit PRODUCT_OPTION_UPDATED event on updateProductOptions", async () => {
          const option = productWithOptions.options[0]

          await service.updateProductOptions(option.id, {
            title: "Updated Option",
          })

          expect(eventBusSpy).toHaveBeenCalledTimes(1)
          expect(eventBusSpy).toHaveBeenCalledWith(
            [
              composeMessage(ProductEvents.PRODUCT_OPTION_UPDATED, {
                data: { id: option.id },
                object: "product_option",
                source: Modules.PRODUCT,
                action: CommonEvents.UPDATED,
              }),
            ],
            {
              internal: true,
            }
          )
        })

        it("should emit appropriate events on upsertProductOptions", async () => {
          const existingOption = productWithOptions.options[0]
          const newOptionData = {
            title: "New Option",
            product_id: productWithOptions.id,
            values: ["new1", "new2"],
          }

          const options = await service.upsertProductOptions([
            { id: existingOption.id, title: "Updated Option" },
            newOptionData,
          ])

          const updatedOption = options.find(
            (option) => option.id === existingOption.id
          )!
          const createdOption = options.find(
            (option) => option.id !== updatedOption.id
          )!

          expect(eventBusSpy).toHaveBeenCalledTimes(1)
          const emittedEvents = eventBusSpy.mock.calls[0][0]

          expect(emittedEvents).toEqual(
            expect.arrayContaining([
              composeMessage(ProductEvents.PRODUCT_OPTION_UPDATED, {
                data: { id: updatedOption.id },
                object: "product_option",
                source: Modules.PRODUCT,
                action: CommonEvents.UPDATED,
              }),
              composeMessage(ProductEvents.PRODUCT_OPTION_CREATED, {
                data: { id: createdOption.id },
                object: "product_option",
                source: Modules.PRODUCT,
                action: CommonEvents.CREATED,
              }),
            ])
          )
        })
      })

      describe("Product Option Value Operations", () => {
        let productWithOptions: any

        beforeEach(async () => {
          const productData = buildProductAndRelationsData({
            options: [
              { title: "Size", values: ["small", "medium", "large"] },
              { title: "Color", values: ["red", "blue", "green"] },
            ],
          })
          const products = await service.createProducts([productData])
          productWithOptions = products[0]
          eventBusSpy.mockClear()
        })

        it("should emit PRODUCT_OPTION_VALUE_UPDATED event on updateProductOptionValues", async () => {
          const optionValue = productWithOptions.options[0].values[0]

          await service.updateProductOptionValues(optionValue.id, {
            value: "Updated Value",
          })

          expect(eventBusSpy).toHaveBeenCalledTimes(1)
          expect(eventBusSpy).toHaveBeenCalledWith(
            [
              composeMessage(ProductEvents.PRODUCT_OPTION_VALUE_UPDATED, {
                data: { id: optionValue.id },
                object: "product_option_value",
                source: Modules.PRODUCT,
                action: CommonEvents.UPDATED,
              }),
            ],
            {
              internal: true,
            }
          )
        })
      })

      describe("Product Collection Operations", () => {
        it("should emit PRODUCT_COLLECTION_CREATED event on createProductCollections", async () => {
          const collectionData = { title: "New Collection" }

          const collections = await service.createProductCollections([
            collectionData,
          ])

          expect(eventBusSpy).toHaveBeenCalledTimes(1)
          expect(eventBusSpy).toHaveBeenCalledWith(
            [
              composeMessage(ProductEvents.PRODUCT_COLLECTION_CREATED, {
                data: { id: collections[0].id },
                object: "product_collection",
                source: Modules.PRODUCT,
                action: CommonEvents.CREATED,
              }),
            ],
            {
              internal: true,
            }
          )
        })

        it("should emit PRODUCT_COLLECTION_UPDATED event on updateProductCollections", async () => {
          const collections = await service.createProductCollections([
            { title: "Original Collection" },
          ])
          eventBusSpy.mockClear()

          await service.updateProductCollections(collections[0].id, {
            title: "Updated Collection",
          })

          expect(eventBusSpy).toHaveBeenCalledTimes(1)
          expect(eventBusSpy).toHaveBeenCalledWith(
            [
              composeMessage(ProductEvents.PRODUCT_COLLECTION_UPDATED, {
                data: { id: collections[0].id },
                object: "product_collection",
                source: Modules.PRODUCT,
                action: CommonEvents.UPDATED,
              }),
            ],
            {
              internal: true,
            }
          )
        })

        it("should emit appropriate events on upsertProductCollections", async () => {
          const existingCollection = await service.createProductCollections([
            { title: "Existing Collection" },
          ])
          eventBusSpy.mockClear()

          const collections = await service.upsertProductCollections([
            {
              id: existingCollection[0].id,
              title: "Updated Existing Collection",
            },
            { title: "New Collection" },
          ])

          const updatedCollection = collections.find(
            (collection) => collection.id === existingCollection[0].id
          )!
          const createdCollection = collections.find(
            (collection) => collection.id !== updatedCollection.id
          )!

          expect(eventBusSpy).toHaveBeenCalledTimes(1)
          const emittedEvents = eventBusSpy.mock.calls[0][0]

          expect(emittedEvents).toEqual(
            expect.arrayContaining([
              composeMessage(ProductEvents.PRODUCT_COLLECTION_UPDATED, {
                data: { id: updatedCollection.id },
                object: "product_collection",
                source: Modules.PRODUCT,
                action: CommonEvents.UPDATED,
              }),
              composeMessage(ProductEvents.PRODUCT_COLLECTION_CREATED, {
                data: { id: createdCollection.id },
                object: "product_collection",
                source: Modules.PRODUCT,
                action: CommonEvents.CREATED,
              }),
            ])
          )
        })
      })

      describe("Product Category Operations", () => {
        it("should emit PRODUCT_CATEGORY_CREATED event on createProductCategories", async () => {
          const categoryData = { name: "New Category" }

          const categories = await service.createProductCategories([
            categoryData,
          ])

          expect(eventBusSpy).toHaveBeenCalledTimes(1)
          expect(eventBusSpy).toHaveBeenCalledWith(
            [
              composeMessage(ProductEvents.PRODUCT_CATEGORY_CREATED, {
                data: { id: categories[0].id },
                object: "product_category",
                source: Modules.PRODUCT,
                action: CommonEvents.CREATED,
              }),
            ],
            {
              internal: true,
            }
          )
        })

        it("should emit PRODUCT_CATEGORY_UPDATED event on updateProductCategories", async () => {
          const categories = await service.createProductCategories([
            { name: "Original Category" },
          ])
          eventBusSpy.mockClear()

          await service.updateProductCategories(categories[0].id, {
            name: "Updated Category",
          })

          expect(eventBusSpy).toHaveBeenCalledTimes(1)
          expect(eventBusSpy).toHaveBeenCalledWith(
            [
              composeMessage(ProductEvents.PRODUCT_CATEGORY_UPDATED, {
                data: { id: categories[0].id },
                object: "product_category",
                source: Modules.PRODUCT,
                action: CommonEvents.UPDATED,
              }),
            ],
            {
              internal: true,
            }
          )
        })

        it("should emit appropriate events on upsertProductCategories", async () => {
          const existingCategory = await service.createProductCategories([
            { name: "Existing Category" },
          ])
          eventBusSpy.mockClear()

          const categories = await service.upsertProductCategories([
            { id: existingCategory[0].id, name: "Updated Existing Category" },
            { name: "New Category" },
          ])

          const updatedCategory = categories.find(
            (category) => category.id === existingCategory[0].id
          )!
          const createdCategory = categories.find(
            (category) => category.id !== updatedCategory.id
          )!

          expect(eventBusSpy).toHaveBeenCalledTimes(1)
          const emittedEvents = eventBusSpy.mock.calls[0][0]

          expect(emittedEvents).toEqual(
            expect.arrayContaining([
              composeMessage(ProductEvents.PRODUCT_CATEGORY_UPDATED, {
                data: { id: updatedCategory.id },
                object: "product_category",
                source: Modules.PRODUCT,
                action: CommonEvents.UPDATED,
              }),
              composeMessage(ProductEvents.PRODUCT_CATEGORY_CREATED, {
                data: { id: createdCategory.id },
                object: "product_category",
                source: Modules.PRODUCT,
                action: CommonEvents.CREATED,
              }),
            ])
          )
        })
      })

      describe("Delete Operations - Base Service Automatic Events", () => {
        it("should emit delete events for all entity types via base service", async () => {
          // Create entities
          const products = await service.createProducts([
            buildProductAndRelationsData({
              options: [
                { title: "Size", values: ["small", "medium", "large"] },
                { title: "Color", values: ["red", "blue", "green"] },
              ],
            }),
          ])
          const tags = await service.createProductTags([{ value: "Test Tag" }])
          const types = await service.createProductTypes([
            { value: "Test Type" },
          ])
          const categories = await service.createProductCategories([
            { name: "Test Category" },
          ])
          const collections = await service.createProductCollections([
            { title: "Test Collection" },
          ])

          eventBusSpy.mockClear()

          // Test delete operations - these are handled automatically by base service
          await service.deleteProducts([products[0].id])
          await service.deleteProductTags([tags[0].id])
          await service.deleteProductTypes([types[0].id])
          await service.deleteProductCategories([categories[0].id])
          await service.deleteProductCollections([collections[0].id])

          // Each delete should emit the appropriate delete event
          expect(eventBusSpy).toHaveBeenCalledTimes(5)

          // Verify each delete event was emitted
          const allCalls = eventBusSpy.mock.calls
          const allEvents = allCalls.flat(2)

          expect(allEvents).toEqual(
            expect.arrayContaining([
              composeMessage(ProductEvents.PRODUCT_DELETED, {
                data: { id: products[0].id },
                object: "product",
                source: Modules.PRODUCT,
                action: CommonEvents.DELETED,
              }),
              composeMessage(ProductEvents.PRODUCT_TAG_DELETED, {
                data: { id: tags[0].id },
                object: "product_tag",
                source: Modules.PRODUCT,
                action: CommonEvents.DELETED,
              }),
              composeMessage(ProductEvents.PRODUCT_TYPE_DELETED, {
                data: { id: types[0].id },
                object: "product_type",
                source: Modules.PRODUCT,
                action: CommonEvents.DELETED,
              }),
              composeMessage(ProductEvents.PRODUCT_CATEGORY_DELETED, {
                data: { id: categories[0].id },
                object: "product_category",
                source: Modules.PRODUCT,
                action: CommonEvents.DELETED,
              }),
              composeMessage(ProductEvents.PRODUCT_COLLECTION_DELETED, {
                data: { id: collections[0].id },
                object: "product_collection",
                source: Modules.PRODUCT,
                action: CommonEvents.DELETED,
              }),
            ])
          )
        })
      })
    })
  },
})

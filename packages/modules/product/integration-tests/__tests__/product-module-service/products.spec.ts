import { Modules } from "@medusajs/modules-sdk"
import { IProductModuleService, ProductCategoryDTO } from "@medusajs/types"
import { kebabCase, ProductStatus } from "@medusajs/utils"
import {
  Product,
  ProductCategory,
  ProductCollection,
  ProductType,
} from "@models"

import { UpdateProductInput } from "@types"
import {
  MockEventBusService,
  moduleIntegrationTestRunner,
} from "medusa-test-utils"
import {
  buildProductAndRelationsData,
  createCollections,
  createTypes,
} from "../../__fixtures__/product"

jest.setTimeout(300000)

moduleIntegrationTestRunner<IProductModuleService>({
  moduleName: Modules.PRODUCT,
  injectedDependencies: {
    eventBusModuleService: new MockEventBusService(),
  },
  testSuite: ({ MikroOrmWrapper, service }) => {
    describe("ProductModuleService products", function () {
      let productCollectionOne: ProductCollection
      let productCollectionTwo: ProductCollection

      const productCollectionsData = [
        {
          id: "test-1",
          title: "col 1",
        },
        {
          id: "test-2",
          title: "col 2",
        },
      ]

      afterEach(() => {
        jest.clearAllMocks()
      })

      describe("update", function () {
        let productOne: Product
        let productTwo: Product
        let productCategoryOne: ProductCategory
        let productCategoryTwo: ProductCategory
        let productTypeOne: ProductType
        let productTypeTwo: ProductType
        let images = [{ url: "image-1" }]

        const productCategoriesData = [
          {
            id: "test-1",
            name: "category 1",
          },
          {
            id: "test-2",
            name: "category 2",
          },
        ]

        const productTypesData = [
          {
            id: "type-1",
            value: "type 1",
          },
          {
            id: "type-2",
            value: "type 2",
          },
        ]

        const tagsData = [
          {
            id: "tag-1",
            value: "tag 1",
          },
        ]

        beforeEach(async () => {
          const testManager = MikroOrmWrapper.forkManager()

          const collections = await createCollections(
            testManager,
            productCollectionsData
          )

          productCollectionOne = collections[0]
          productCollectionTwo = collections[1]

          const types = await createTypes(testManager, productTypesData)

          productTypeOne = types[0]
          productTypeTwo = types[1]

          const categories: ProductCategoryDTO[] = []
          for (const entry of productCategoriesData) {
            categories.push(await service.createProductCategories(entry))
          }

          productCategoryOne = categories[0]
          productCategoryTwo = categories[1]

          productOne = service.createProducts({
            id: "product-1",
            title: "product 1",
            status: ProductStatus.PUBLISHED,
            variants: [
              {
                id: "variant-1",
                title: "variant 1",
              },
            ],
          })

          productTwo = service.createProducts({
            id: "product-2",
            title: "product 2",
            status: ProductStatus.PUBLISHED,
            categories: [{ id: productCategoryOne.id }],
            collection_id: productCollectionOne.id,
            tags: tagsData,
            options: [
              {
                title: "size",
                values: ["large", "small"],
              },
              {
                title: "color",
                values: ["red", "blue"],
              },
            ],
            variants: [
              {
                id: "variant-2",
                title: "variant 2",
              },
              {
                id: "variant-3",
                title: "variant 3",
                options: {
                  size: "small",
                  color: "red",
                },
              },
            ],
          })

          const res = await Promise.all([productOne, productTwo])
          productOne = res[0]
          productTwo = res[1]
        })

        it("should update a product and upsert relations that are not created yet", async () => {
          const data = buildProductAndRelationsData({
            images,
            thumbnail: images[0].url,
          })

          const variantTitle = data.variants[0].title

          const productBefore = (await service.retrieveProduct(productOne.id, {
            relations: [
              "images",
              "variants",
              "options",
              "options.values",
              "variants.options",
              "tags",
              "type",
            ],
          })) as unknown as UpdateProductInput

          productBefore.title = "updated title"
          productBefore.variants = [
            ...productBefore.variants!,
            ...data.variants,
          ]
          productBefore.options = data.options
          productBefore.images = data.images
          productBefore.thumbnail = data.thumbnail
          productBefore.tags = data.tags
          const updatedProducts = await service.upsertProducts([productBefore])
          expect(updatedProducts).toHaveLength(1)

          const product = await service.retrieveProduct(productBefore.id, {
            relations: [
              "images",
              "variants",
              "options",
              "options.values",
              "variants.options",
              "tags",
              "type",
            ],
          })

          const createdVariant = product.variants.find(
            (v) => v.title === variantTitle
          )!

          expect(product.images).toHaveLength(1)
          expect(createdVariant?.options).toHaveLength(1)
          expect(product.tags).toHaveLength(1)
          expect(product.variants).toHaveLength(2)

          expect(product).toEqual(
            expect.objectContaining({
              id: expect.any(String),
              title: "updated title",
              description: productBefore.description,
              subtitle: productBefore.subtitle,
              is_giftcard: productBefore.is_giftcard,
              discountable: productBefore.discountable,
              thumbnail: images[0].url,
              status: productBefore.status,
              images: expect.arrayContaining([
                expect.objectContaining({
                  id: expect.any(String),
                  url: images[0].url,
                }),
              ]),
              options: expect.arrayContaining([
                expect.objectContaining({
                  id: expect.any(String),
                  title: productBefore.options?.[0].title,
                  values: expect.arrayContaining([
                    expect.objectContaining({
                      id: expect.any(String),
                      value: data.options[0].values[0],
                    }),
                  ]),
                }),
              ]),
              tags: expect.arrayContaining([
                expect.objectContaining({
                  id: expect.any(String),
                  value: productBefore.tags?.[0].value,
                }),
              ]),
              variants: expect.arrayContaining([
                expect.objectContaining({
                  id: expect.any(String),
                  title: createdVariant.title,
                  sku: createdVariant.sku,
                  allow_backorder: false,
                  manage_inventory: true,
                  variant_rank: 0,
                  options: expect.arrayContaining([
                    expect.objectContaining({
                      id: expect.any(String),
                      value: data.options[0].values[0],
                    }),
                  ]),
                }),
              ]),
            })
          )
        })

        it("should emit events through event bus", async () => {
          const eventBusSpy = jest.spyOn(MockEventBusService.prototype, "emit")
          const data = buildProductAndRelationsData({
            images,
            thumbnail: images[0].url,
          })

          const updateData = {
            ...data,
            options: data.options,
            id: productOne.id,
            title: "updated title",
          }

          await service.upsertProducts([updateData])

          expect(eventBusSpy).toHaveBeenCalledTimes(1)
          expect(eventBusSpy).toHaveBeenCalledWith([
            {
              eventName: "product.updated",
              data: { id: productOne.id },
            },
          ])
        })

        it("should add relationships to a product", async () => {
          const updateData = {
            id: productOne.id,
            categories: [
              {
                id: productCategoryOne.id,
              },
            ],
            collection_id: productCollectionOne.id,
            type_id: productTypeOne.id,
          }

          await service.upsertProducts([updateData])

          const product = await service.retrieveProduct(updateData.id, {
            relations: ["categories", "collection", "type"],
          })

          expect(product).toEqual(
            expect.objectContaining({
              id: productOne.id,
              categories: [
                expect.objectContaining({
                  id: productCategoryOne.id,
                }),
              ],
              collection: expect.objectContaining({
                id: productCollectionOne.id,
              }),
              type: expect.objectContaining({
                id: productTypeOne.id,
              }),
            })
          )
        })

        it("should upsert a product type when type object is passed", async () => {
          let updateData = {
            id: productTwo.id,
            type_id: productTypeOne.id,
          }

          await service.upsertProducts([updateData])

          let product = await service.retrieveProduct(updateData.id, {
            relations: ["type"],
          })

          expect(product).toEqual(
            expect.objectContaining({
              id: productTwo.id,
              type: expect.objectContaining({
                id: productTypeOne.id,
              }),
            })
          )
        })

        it("should replace relationships of a product", async () => {
          const newTagData = {
            id: "tag-2",
            value: "tag 2",
          }

          const updateData = {
            id: productTwo.id,
            categories: [
              {
                id: productCategoryTwo.id,
              },
            ],
            collection_id: productCollectionTwo.id,
            type_id: productTypeTwo.id,
            tags: [newTagData],
          }

          await service.upsertProducts([updateData])

          const product = await service.retrieveProduct(updateData.id, {
            relations: ["categories", "collection", "tags", "type"],
          })

          expect(product).toEqual(
            expect.objectContaining({
              id: productTwo.id,
              categories: [
                expect.objectContaining({
                  id: productCategoryTwo.id,
                }),
              ],
              collection: expect.objectContaining({
                id: productCollectionTwo.id,
              }),
              tags: [
                expect.objectContaining({
                  id: newTagData.id,
                  value: newTagData.value,
                }),
              ],
              type: expect.objectContaining({
                id: productTypeTwo.id,
              }),
            })
          )
        })

        it("should remove relationships of a product", async () => {
          const updateData = {
            id: productTwo.id,
            categories: [],
            collection_id: null,
            type_id: null,
            tags: [],
          }

          await service.upsertProducts([updateData])

          const product = await service.retrieveProduct(updateData.id, {
            relations: ["categories", "collection", "tags"],
          })

          expect(product).toEqual(
            expect.objectContaining({
              id: productTwo.id,
              categories: [],
              tags: [],
              collection: null,
              type: null,
            })
          )
        })

        it("should throw an error when product ID does not exist", async () => {
          let error
          try {
            await service.updateProducts("does-not-exist", { title: "test" })
          } catch (e) {
            error = e.message
          }

          expect(error).toEqual(`Product with id: does-not-exist was not found`)
        })

        it("should update, create and delete variants", async () => {
          const updateData = {
            id: productTwo.id,
            // Note: VariantThree is already assigned to productTwo, that should be deleted
            variants: [
              {
                id: productTwo.variants[0].id,
                title: "updated-variant",
              },
              {
                title: "created-variant",
              },
            ],
          }

          await service.upsertProducts([updateData])

          const product = await service.retrieveProduct(updateData.id, {
            relations: ["variants"],
          })

          expect(product.variants).toHaveLength(2)
          expect(product).toEqual(
            expect.objectContaining({
              id: expect.any(String),
              variants: expect.arrayContaining([
                expect.objectContaining({
                  id: productTwo.variants[0].id,
                  title: "updated-variant",
                }),
                expect.objectContaining({
                  id: expect.any(String),
                  title: "created-variant",
                }),
              ]),
            })
          )
        })

        it("should do a partial update on the options of a variant successfully", async () => {
          await service.updateProducts(productTwo.id, {
            variants: [
              {
                id: "variant-3",
                options: { size: "small", color: "blue" },
              },
            ],
          })

          const fetchedProduct = await service.retrieveProduct(productTwo.id, {
            relations: ["variants", "variants.options"],
          })

          expect(fetchedProduct.variants[0].options).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                value: "small",
              }),
              expect.objectContaining({
                value: "blue",
              }),
            ])
          )
        })

        it("should createa variant with id that was passed if it does not exist", async () => {
          const updateData = {
            id: productTwo.id,
            // Note: VariantThree is already assigned to productTwo, that should be deleted
            variants: [
              {
                id: "passed-id",
                title: "updated-variant",
              },
              {
                title: "created-variant",
              },
            ],
          }

          await service.upsertProducts([updateData])
          const retrieved = await service.retrieveProduct(updateData.id, {
            relations: ["variants"],
          })

          expect(retrieved.variants).toHaveLength(2)
          expect(retrieved.variants).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                id: "passed-id",
                title: "updated-variant",
              }),
              expect.objectContaining({
                id: expect.any(String),
                title: "created-variant",
              }),
            ])
          )
        })
      })

      describe("create", function () {
        let images = [{ url: "image-1" }]
        it("should create a product", async () => {
          const data = buildProductAndRelationsData({
            images,
            thumbnail: images[0].url,
          })

          const productsCreated = await service.createProducts([data])

          const products = await service.listProducts(
            { id: productsCreated[0].id },
            {
              relations: [
                "images",
                "categories",
                "variants",
                "variants.options",
                "options",
                "options.values",
                "tags",
              ],
            }
          )

          expect(products).toHaveLength(1)
          expect(products[0].images).toHaveLength(1)
          expect(products[0].options).toHaveLength(1)
          expect(products[0].tags).toHaveLength(1)
          expect(products[0].categories).toHaveLength(0)
          expect(products[0].variants).toHaveLength(1)

          expect(products[0]).toEqual(
            expect.objectContaining({
              id: expect.any(String),
              title: data.title,
              handle: kebabCase(data.title),
              description: data.description,
              subtitle: data.subtitle,
              is_giftcard: data.is_giftcard,
              discountable: data.discountable,
              thumbnail: images[0].url,
              status: data.status,
              images: expect.arrayContaining([
                expect.objectContaining({
                  id: expect.any(String),
                  url: images[0].url,
                }),
              ]),
              options: expect.arrayContaining([
                expect.objectContaining({
                  id: expect.any(String),
                  title: data.options[0].title,
                  values: expect.arrayContaining([
                    expect.objectContaining({
                      id: expect.any(String),
                      value: data.options[0].values[0],
                    }),
                  ]),
                }),
              ]),
              tags: expect.arrayContaining([
                expect.objectContaining({
                  id: expect.any(String),
                  value: data.tags[0].value,
                }),
              ]),
              variants: expect.arrayContaining([
                expect.objectContaining({
                  id: expect.any(String),
                  title: data.variants[0].title,
                  sku: data.variants[0].sku,
                  allow_backorder: false,
                  manage_inventory: true,
                  variant_rank: 0,
                  options: expect.arrayContaining([
                    expect.objectContaining({
                      id: expect.any(String),
                      value: data.options[0].values[0],
                    }),
                  ]),
                }),
              ]),
            })
          )
        })

        it("should emit events through eventBus", async () => {
          const eventBusSpy = jest.spyOn(MockEventBusService.prototype, "emit")
          const data = buildProductAndRelationsData({
            images,
            thumbnail: images[0].url,
          })

          const products = await service.createProducts([data])
          expect(eventBusSpy).toHaveBeenCalledTimes(1)
          expect(eventBusSpy).toHaveBeenCalledWith([
            {
              eventName: "product.created",
              data: { id: products[0].id },
            },
          ])
        })
      })

      describe("softDelete", function () {
        let images = [{ url: "image-1" }]
        it("should soft delete a product and its cascaded relations", async () => {
          const data = buildProductAndRelationsData({
            images,
            thumbnail: images[0].url,
          })

          const products = await service.createProducts([data])

          await service.softDeleteProducts([products[0].id])

          const deletedProducts = await service.listProducts(
            { id: products[0].id },
            {
              relations: [
                "variants",
                "variants.options",
                "options",
                "options.values",
              ],
              withDeleted: true,
            }
          )

          expect(deletedProducts).toHaveLength(1)
          expect(deletedProducts[0].deleted_at).not.toBeNull()

          for (const option of deletedProducts[0].options) {
            expect(option.deleted_at).not.toBeNull()
          }

          const productOptionsValues = deletedProducts[0].options
            .map((o) => o.values)
            .flat()

          for (const optionValue of productOptionsValues) {
            expect(optionValue.deleted_at).not.toBeNull()
          }

          for (const variant of deletedProducts[0].variants) {
            expect(variant.deleted_at).not.toBeNull()
          }

          const variantsOptions = deletedProducts[0].options
            .map((o) => o.values)
            .flat()

          for (const option of variantsOptions) {
            expect(option.deleted_at).not.toBeNull()
          }
        })

        it("should retrieve soft-deleted products if filtered on deleted_at", async () => {
          const data = buildProductAndRelationsData({
            images,
            thumbnail: images[0].url,
          })

          const products = await service.createProducts([data])

          await service.softDeleteProducts([products[0].id])

          const softDeleted = await service.listProducts({
            deleted_at: { $gt: "01-01-2022" },
          })

          expect(softDeleted).toHaveLength(1)
        })

        it("should emit events through eventBus", async () => {
          const eventBusSpy = jest.spyOn(MockEventBusService.prototype, "emit")
          const data = buildProductAndRelationsData({
            images,
            thumbnail: images[0].url,
          })

          const products = await service.createProducts([data])

          await service.softDeleteProducts([products[0].id])

          expect(eventBusSpy).toHaveBeenCalledWith([
            {
              eventName: "product.created",
              data: { id: products[0].id },
            },
          ])
        })
      })

      describe("restore", function () {
        let images = [{ url: "image-1" }]

        it("should restore a soft deleted product and its cascaded relations", async () => {
          const data = buildProductAndRelationsData({
            images,
            thumbnail: images[0].url,
          })

          const products = await service.createProducts([data])

          let retrievedProducts = await service.listProducts({
            id: products[0].id,
          })

          expect(retrievedProducts).toHaveLength(1)
          expect(retrievedProducts[0].deleted_at).toBeNull()

          await service.softDeleteProducts([products[0].id])

          retrievedProducts = await service.listProducts(
            { id: products[0].id },
            {
              withDeleted: true,
            }
          )

          expect(retrievedProducts).toHaveLength(1)
          expect(retrievedProducts[0].deleted_at).not.toBeNull()

          await service.restoreProducts([products[0].id])

          const deletedProducts = await service.listProducts(
            { id: products[0].id },
            {
              relations: [
                "variants",
                "variants.options",
                "options",
                "options.values",
              ],
              withDeleted: true,
            }
          )

          expect(deletedProducts).toHaveLength(1)
          expect(deletedProducts[0].deleted_at).toBeNull()

          for (const option of deletedProducts[0].options) {
            expect(option.deleted_at).toBeNull()
          }

          const productOptionsValues = deletedProducts[0].options
            .map((o) => o.values)
            .flat()

          for (const optionValue of productOptionsValues) {
            expect(optionValue.deleted_at).toBeNull()
          }

          for (const variant of deletedProducts[0].variants) {
            expect(variant.deleted_at).toBeNull()
          }

          const variantsOptions = deletedProducts[0].options
            .map((o) => o.values)
            .flat()

          for (const option of variantsOptions) {
            expect(option.deleted_at).toBeNull()
          }
        })
      })

      describe("list", function () {
        beforeEach(async () => {
          const collections = await createCollections(
            MikroOrmWrapper.forkManager(),
            productCollectionsData
          )

          productCollectionOne = collections[0]
          productCollectionTwo = collections[1]

          const productOneData = buildProductAndRelationsData({
            collection_id: productCollectionOne.id,
          })

          const productTwoData = buildProductAndRelationsData({
            collection_id: productCollectionTwo.id,
            tags: [],
          })

          await service.createProducts([productOneData, productTwoData])
        })

        it("should return a list of products scoped by collection id", async () => {
          const productsWithCollectionOne = await service.listProducts(
            { collection_id: productCollectionOne.id },
            {
              relations: ["collection"],
            }
          )

          expect(productsWithCollectionOne).toHaveLength(1)

          expect([
            expect.objectContaining({
              collection: expect.objectContaining({
                id: productCollectionOne.id,
              }),
            }),
          ])
        })

        it("should return empty array when querying for a collection that doesnt exist", async () => {
          const products = await service.listProducts(
            {
              categories: { id: ["collection-doesnt-exist-id"] },
            },
            {
              select: ["title", "collection.title"],
              relations: ["collection"],
            }
          )

          expect(products).toEqual([])
        })
      })
    })
  },
})

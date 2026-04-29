import {
  IProductModuleService,
  ProductCategoryDTO,
  ProductTagDTO,
} from "@medusajs/framework/types"
import { kebabCase, Modules, ProductStatus } from "@medusajs/framework/utils"
import {
  Product,
  ProductCategory,
  ProductCollection,
  ProductImage,
  ProductType,
} from "@models"
import { setTimeout } from "timers/promises"

import { moduleIntegrationTestRunner } from "@medusajs/test-utils"
import { UpdateProductInput } from "@types"
import {
  buildProductAndRelationsData,
  createCollections,
  createTypes,
} from "../../__fixtures__/product"

jest.setTimeout(300000)

moduleIntegrationTestRunner<IProductModuleService>({
  moduleName: Modules.PRODUCT,
  // dbName: "product_update_performance",
  // debug: true,
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

          const tags: ProductTagDTO[] = []
          for (const entry of tagsData) {
            tags.push(await service.createProductTags(entry))
          }

          productCategoryOne = categories[0]
          productCategoryTwo = categories[1]

          productOne = service.createProducts({
            title: "product 1",
            status: ProductStatus.PUBLISHED,
            weight: 100,
            length: 200,
            height: 300,
            width: 400,
            options: [
              {
                title: "opt-title",
                values: ["val-1", "val-2"],
              },
            ],
            variants: [
              {
                title: "variant 1",
                options: { "opt-title": "val-1" },
              },
            ],
          })

          productTwo = service.createProducts({
            title: "product 2",
            status: ProductStatus.PUBLISHED,
            collection_id: productCollectionOne.id,
            category_ids: [productCategoryOne.id],
            tag_ids: [tags[0].id],
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
                title: "variant 2",
                options: {
                  size: "large",
                  color: "blue",
                },
              },
              {
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

        it.skip("test update performance", async () => {
          const PRODUCT_COUNT = 1000
          const VARIANTS_PER_PRODUCT = 100
          const OPTION_VALUES_COUNT = 10 // 10 x 10 = 100 variant combinations

          // Generate option values for 2 options
          const sizeValues = Array.from(
            { length: OPTION_VALUES_COUNT },
            (_, i) => `size-${i + 1}`
          )
          const colorValues = Array.from(
            { length: OPTION_VALUES_COUNT },
            (_, i) => `color-${i + 1}`
          )

          // Generate all variant combinations
          const generateVariants = () => {
            const variants: {
              title: string
              sku: string
              options: { size: string; color: string }
            }[] = []

            for (let s = 0; s < OPTION_VALUES_COUNT; s++) {
              for (let c = 0; c < OPTION_VALUES_COUNT; c++) {
                variants.push({
                  title: `Variant ${sizeValues[s]}-${colorValues[c]}`,
                  sku: `SKU-${sizeValues[s]}-${
                    colorValues[c]
                  }-${Date.now()}-${Math.random()}`,
                  options: {
                    size: sizeValues[s],
                    color: colorValues[c],
                  },
                })
              }
            }

            return variants
          }

          // Generate random number of images (10-50)
          const generateImages = () => {
            const imageCount = Math.floor(Math.random() * 41) + 10 // 10-50 images
            return Array.from({ length: imageCount }, (_, i) => ({
              url: `https://example.com/image-${
                i + 1
              }-${Date.now()}-${Math.random()}.jpg`,
            }))
          }

          // Build product data
          const productsData = Array.from(
            { length: PRODUCT_COUNT },
            (_, i) => ({
              title: `Performance Test Product ${i + 1}`,
              handle: `perf-product-${i + 1}-${Date.now()}`,
              status: ProductStatus.PUBLISHED,
              options: [
                { title: "size", values: sizeValues },
                { title: "color", values: colorValues },
              ],
              variants: generateVariants(),
              images: generateImages(),
            })
          )

          console.log(`Creating ${PRODUCT_COUNT} products...`)
          console.log(`Each product has ${VARIANTS_PER_PRODUCT} variants`)
          console.log(
            `Each product has 2 options with ${OPTION_VALUES_COUNT} values each`
          )
          console.log(
            `Each product has 10-50 images (random), total images: ${productsData.reduce(
              (sum, p) => sum + p.images.length,
              0
            )}`
          )

          const startTime = Date.now()

          // Create products in batches to avoid memory issues
          const BATCH_SIZE = 10
          const createdProducts: any[] = []

          for (let i = 0; i < PRODUCT_COUNT; i += BATCH_SIZE) {
            const batch = productsData.slice(i, i + BATCH_SIZE)
            const batchStart = Date.now()

            const products = await service.createProducts(batch)
            createdProducts.push(...products)

            const batchEnd = Date.now()
            console.log(
              `Batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(
                PRODUCT_COUNT / BATCH_SIZE
              )} created in ${batchEnd - batchStart}ms`
            )
          }

          const createEndTime = Date.now()
          console.log(`\nTotal creation time: ${createEndTime - startTime}ms`)
          console.log(
            `Average per product: ${
              (createEndTime - startTime) / PRODUCT_COUNT
            }ms`
          )

          // Retrieve a sample product to verify structure
          const sampleProduct = await service.retrieveProduct(
            createdProducts[0].id,
            {
              relations: ["variants", "images", "options", "options.values"],
            }
          )

          console.log(`\nSample product verification:`)
          console.log(`  - Variants: ${sampleProduct.variants.length}`)
          console.log(`  - Options: ${sampleProduct.options.length}`)
          console.log(`  - Images: ${sampleProduct.images.length}`)

          /**
           * ----------------------------------------------------------------------------
           * ----------------------------------------------------------------------------
           * ----------------------------------------------------------------------------
           */

          console.log(`IT IS TIME TO CLEAR THE LOGS`)
          await setTimeout(2000)

          const productToUpdateId = createdProducts[0].id
          createdProducts[0].variants[0].title = "updated variant 1"

          function formatVariantOptions(variant) {
            const result = {}
            for (const option of variant.options) {
              result[option.option.title] = option.value
            }
            return result
          }

          createdProducts[0].variants.forEach((variant) => {
            variant.options = formatVariantOptions(variant)
          })

          const now = performance.now()
          await service.updateProducts(productToUpdateId, {
            title: "updated title",
            variants: createdProducts[0].variants,
          })
          const end = performance.now()
          console.log(`Update time: ${end - now}ms`)

          console.log("break")
        }, 1000000)

        it("should update multiple products", async () => {
          await service.upsertProducts([
            { id: productOne.id, title: "updated title 1" },
            { id: productTwo.id, title: "updated title 2" },
          ])

          const products = await service.listProducts(
            { id: [productOne.id, productTwo.id] },
            { relations: ["*"] }
          )

          expect(products).toHaveLength(2)
          expect(products[0].title).toEqual("updated title 1")
          expect(products[1].title).toEqual("updated title 2")
        })

        it("should update a product and upsert relations that are not created yet", async () => {
          const tags = await service.createProductTags([{ value: "tag-1" }])
          const data = buildProductAndRelationsData({
            images,
            thumbnail: images[0].url,
            options: [
              {
                title: "opt-title",
                values: ["val-1", "val-2"],
              },
            ],
            tag_ids: [tags[0].id],
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
            {
              ...productBefore.variants[0]!,
              options: { "opt-title": "val-2" },
            },
            ...data.variants,
          ]
          productBefore.options = data.options
          productBefore.images = data.images
          productBefore.thumbnail = data.thumbnail
          productBefore.tag_ids = data.tag_ids
          // Update the weight/length/height/width to ensure we are compensating the type mismatch with the DB
          productBefore.weight = 101
          productBefore.length = 201
          productBefore.height = 301
          productBefore.width = 401
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
              // TODO: Notice how the weight/length/height/width are strings, not respecting the ProductDTO typings
              weight: "101",
              length: "201",
              height: "301",
              width: "401",
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
                  value: tags[0].value,
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

        it("should upsert variants (update one and create one)", async () => {
          let [product] = await service.createProducts([
            {
              title: "New product",
              description: "New description",
              options: [
                { title: "size", values: ["x", "l"] },
                { title: "color", values: ["red", "green"] },
              ],
              variants: [
                {
                  title: "new variant 1",
                  options: { size: "l", color: "red" },
                },
                {
                  title: "new variant 2",
                  options: { size: "l", color: "green" },
                },
              ],
            },
          ])

          product = await service.retrieveProduct(product.id, {
            relations: [
              "options",
              "options.values",
              "variants",
              "variants.options",
            ],
          })

          expect(product).toEqual(
            expect.objectContaining({
              title: "New product",
              description: "New description",
              options: expect.arrayContaining([
                expect.objectContaining({
                  title: "size",
                  values: expect.arrayContaining([
                    expect.objectContaining({
                      value: "x",
                    }),
                    expect.objectContaining({
                      value: "l",
                    }),
                  ]),
                }),
                expect.objectContaining({
                  title: "color",
                  values: expect.arrayContaining([
                    expect.objectContaining({
                      value: "red",
                    }),
                    expect.objectContaining({
                      value: "green",
                    }),
                  ]),
                }),
              ]),
              variants: expect.arrayContaining([
                expect.objectContaining({
                  title: "new variant 1",
                  options: expect.arrayContaining([
                    expect.objectContaining({
                      value: "l",
                    }),
                    expect.objectContaining({
                      value: "red",
                    }),
                  ]),
                }),
                expect.objectContaining({
                  title: "new variant 2",
                  options: expect.arrayContaining([
                    expect.objectContaining({
                      value: "l",
                    }),
                    expect.objectContaining({
                      value: "green",
                    }),
                  ]),
                }),
              ]),
            })
          )

          const existingVariant1 = product.variants.find(
            (v) => v.title === "new variant 1"
          )!

          const existingVariant2 = product.variants.find(
            (v) => v.title === "new variant 2"
          )!

          await service.upsertProductVariants([
            {
              id: existingVariant1.id,
              product_id: product.id,
              title: "updated variant 1",
              options: { size: "x", color: "red" }, // update options
            },
            {
              id: existingVariant2.id, // just preserve old one
            },
            {
              product_id: product.id,
              title: "created variant 3",
              options: { size: "x", color: "green" }, // create a new variant
            },
          ])

          product = await service.retrieveProduct(product.id, {
            relations: [
              "options",
              "options.values",
              "variants",
              "variants.options",
            ],
          })

          expect(product.variants).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                id: existingVariant1.id,
                title: "updated variant 1",
                options: expect.arrayContaining([
                  expect.objectContaining({
                    value: "x",
                  }),
                  expect.objectContaining({
                    value: "red",
                  }),
                ]),
              }),
              expect.objectContaining({
                id: existingVariant2.id,
                title: "new variant 2",
                options: expect.arrayContaining([
                  expect.objectContaining({
                    value: "l",
                  }),
                  expect.objectContaining({
                    value: "green",
                  }),
                ]),
              }),
              expect.objectContaining({
                title: "created variant 3",
                options: expect.arrayContaining([
                  expect.objectContaining({
                    value: "x",
                  }),
                  expect.objectContaining({
                    value: "green",
                  }),
                ]),
              }),
            ])
          )
        })

        it("should preserve option and value identity on update", async () => {
          const productBefore = await service.retrieveProduct(productTwo.id, {
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

          const updatedProducts = await service.upsertProducts([
            {
              id: productBefore.id,
              title: "updated title",
              options: [
                {
                  title: "size",
                  values: ["large", "small"],
                },
                {
                  title: "color",
                  values: ["red"],
                },
                {
                  title: "material",
                  values: ["cotton"],
                },
              ],
            },
          ])

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

          const beforeOption = productBefore.options.find(
            (opt) => opt.title === "size"
          )!
          expect(product.options).toHaveLength(3)
          expect(product.options).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                id: beforeOption.id,
                title: beforeOption.title,
                values: expect.arrayContaining([
                  expect.objectContaining({
                    id: beforeOption.values[0].id,
                    value: beforeOption.values[0].value,
                  }),
                ]),
              }),
              expect.objectContaining({
                title: "color",
                values: expect.arrayContaining([
                  expect.objectContaining({
                    value: "red",
                  }),
                ]),
              }),
              expect.objectContaining({
                id: expect.any(String),
                title: "material",
                values: expect.arrayContaining([
                  expect.objectContaining({
                    value: "cotton",
                  }),
                ]),
              }),
            ])
          )
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

          await service.createProductTags(newTagData)

          const updateData = {
            id: productTwo.id,
            categories: [
              {
                id: productCategoryTwo.id,
              },
            ],
            collection_id: productCollectionTwo.id,
            type_id: productTypeTwo.id,
            tags: [{ id: newTagData.id }],
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
          const variantToUpdate = productTwo.variants.find(
            (variant) => variant.title === "variant 3"
          )!

          await service.updateProducts(productTwo.id, {
            variants: [
              {
                id: variantToUpdate.id,
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

        it("should create a variant with id that was passed if it does not exist", async () => {
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

        it("should simultaneously update options and variants", async () => {
          const updateData = {
            id: productTwo.id,
            options: [{ title: "material", values: ["cotton", "silk"] }],
            variants: [{ title: "variant 1", options: { material: "cotton" } }],
          }

          await service.upsertProducts([updateData])

          const product = await service.retrieveProduct(productTwo.id, {
            relations: [
              "options",
              "options.values",
              "variants",
              "variants.options",
            ],
          })

          expect(product.options).toHaveLength(1)
          expect(product.options[0].title).toEqual("material")
          expect(product.options[0].values).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                value: "cotton",
              }),
              expect.objectContaining({
                value: "silk",
              }),
            ])
          )

          expect(product.variants).toHaveLength(1)
          expect(product.variants[0].options).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                value: "cotton",
              }),
            ])
          )
        })

        it("should throw an error when some tag id does not exist", async () => {
          const error = await service
            .updateProducts(productOne.id, {
              tag_ids: ["does-not-exist"],
            })
            .catch((e) => e)

          expect(error?.message).toEqual(
            `You tried to set relationship product_tag_id: does-not-exist, but such entity does not exist`
          )
        })

        it("should throw an error when some category id does not exist", async () => {
          const error = await service
            .updateProducts(productOne.id, {
              category_ids: ["does-not-exist"],
            })
            .catch((e) => e)

          expect(error?.message).toEqual(
            `You tried to set relationship product_category_id: does-not-exist, but such entity does not exist`
          )
        })

        it("should throw an error when collection id does not exist", async () => {
          const error = await service
            .updateProducts(productOne.id, {
              collection_id: "does-not-exist",
            })
            .catch((e) => e)

          expect(error?.message).toEqual(
            `You tried to set relationship collection_id: does-not-exist, but such entity does not exist`
          )
        })

        it("should throw an error when type id does not exist", async () => {
          const error = await service
            .updateProducts(productOne.id, {
              type_id: "does-not-exist",
            })
            .catch((e) => e)

          expect(error?.message).toEqual(
            `You tried to set relationship type_id: does-not-exist, but such entity does not exist`
          )
        })

        it("should throw if two variants have the same options combination", async () => {
          const error = await service
            .updateProducts(productTwo.id, {
              variants: [
                {
                  title: "variant 1",
                  options: { size: "small", color: "blue" },
                },
                {
                  title: "variant 2",
                  options: { size: "small", color: "blue" },
                },
              ],
            })
            .catch((e) => e)

          expect(error?.message).toEqual(
            `Variant "variant 1" has same combination of option values as "variant 2".`
          )
        })

        it("should throw if a variant doesn't have all options set", async () => {
          const error = await service
            .updateProducts(productTwo.id, {
              variants: [
                {
                  title: "variant 1",
                  options: { size: "small" },
                },
              ],
            })
            .catch((e) => e)

          expect(error?.message).toEqual(
            `Product has 2 option values but there were 1 provided option values for the variant: variant 1.`
          )
        })

        it("should throw if a variant uses a non-existing option", async () => {
          const error = await service
            .updateProducts(productTwo.id, {
              variants: [
                {
                  title: "variant 1",
                  options: {
                    size: "small",
                    non_existing_option: "non_existing_value",
                  },
                },
              ],
            })
            .catch((e) => e)

          expect(error?.message).toEqual(
            `Option value non_existing_value does not exist for option non_existing_option`
          )
        })
      })

      describe("create", function () {
        let images = [{ url: "image-1" }]
        it("should create a product", async () => {
          const tags = await service.createProductTags([{ value: "tag-1" }])
          const data = buildProductAndRelationsData({
            images,
            thumbnail: images[0].url,
            tag_ids: [tags[0].id],
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
                  value: tags[0].value,
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

        it("should throw because variant doesn't have all options set", async () => {
          const error = await service
            .createProducts([
              {
                title: "Product with variants and options",
                options: [
                  { title: "opt1", values: ["1", "2"] },
                  { title: "opt2", values: ["3", "4"] },
                ],
                variants: [
                  {
                    title: "missing option",
                    options: { opt1: "1" },
                  },
                ],
              },
            ])
            .catch((e) => e)

          expect(error.message).toEqual(
            `Product "Product with variants and options" has variants with missing options: [missing option]`
          )
        })
      })

      describe("softDelete", function () {
        let images = [{ url: "image-1" }]
        it("should soft delete a product and its cascaded relations", async () => {
          const data = buildProductAndRelationsData({
            images,
            thumbnail: images[0].url,
            options: [
              { title: "size", values: ["large", "small"] },
              { title: "color", values: ["red", "blue"] },
              { title: "material", values: ["cotton", "polyester"] },
            ],
            variants: [
              {
                title: "Large Red Cotton",
                sku: "LRG-RED-CTN",
                options: {
                  size: "large",
                  color: "red",
                  material: "cotton",
                },
              },
              {
                title: "Large Red Polyester",
                sku: "LRG-RED-PLY",
                options: {
                  size: "large",
                  color: "red",
                  material: "polyester",
                },
              },
              {
                title: "Large Blue Cotton",
                sku: "LRG-BLU-CTN",
                options: {
                  size: "large",
                  color: "blue",
                  material: "cotton",
                },
              },
              {
                title: "Large Blue Polyester",
                sku: "LRG-BLU-PLY",
                options: {
                  size: "large",
                  color: "blue",
                  material: "polyester",
                },
              },
              {
                title: "Small Red Cotton",
                sku: "SML-RED-CTN",
                options: {
                  size: "small",
                  color: "red",
                  material: "cotton",
                },
              },
              {
                title: "Small Red Polyester",
                sku: "SML-RED-PLY",
                options: {
                  size: "small",
                  color: "red",
                  material: "polyester",
                },
              },
              {
                title: "Small Blue Cotton",
                sku: "SML-BLU-CTN",
                options: {
                  size: "small",
                  color: "blue",
                  material: "cotton",
                },
              },
              {
                title: "Small Blue Polyester",
                sku: "SML-BLU-PLY",
                options: {
                  size: "small",
                  color: "blue",
                  material: "polyester",
                },
              },
            ],
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

          const softDeleted = await service.listProducts(
            {
              deleted_at: { $gt: "01-01-2022" },
            },
            {
              withDeleted: true,
            }
          )

          expect(softDeleted).toHaveLength(1)
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
        let productOneData
        let productTwoData
        beforeEach(async () => {
          const collections = await createCollections(
            MikroOrmWrapper.forkManager(),
            productCollectionsData
          )

          productCollectionOne = collections[0]
          productCollectionTwo = collections[1]

          const tags = await service.createProductTags([{ value: "tag-1" }])

          const resp = await service.createProducts([
            buildProductAndRelationsData({
              collection_id: productCollectionOne.id,
              options: [{ title: "size", values: ["large", "small"] }],
              variants: [{ title: "variant 1", options: { size: "small" } }],
              tag_ids: [tags[0].id],
            }),
            buildProductAndRelationsData({
              collection_id: productCollectionTwo.id,
            }),
          ])

          productOneData = resp[0]
          productTwoData = resp[1]
        })

        it("should return a list of products scoped by collection id", async () => {
          const productsWithCollectionOne = await service.listProducts(
            { collection_id: productCollectionOne.id },
            {
              relations: ["collection"],
            }
          )

          expect(productsWithCollectionOne).toHaveLength(1)

          expect(productsWithCollectionOne).toEqual([
            expect.objectContaining({
              collection: expect.objectContaining({
                id: productCollectionOne.id,
              }),
            }),
          ])
        })

        it("should return a list of products scoped by variant options", async () => {
          const productsWithVariants = await service.listProducts(
            {
              variants: {
                options: {
                  option_id: productOneData.options[0].id,
                  value: "small",
                },
              },
            },
            {
              relations: ["variants", "variants.options"],
            }
          )

          expect(productsWithVariants).toHaveLength(1)
          expect(productsWithVariants).toEqual([
            expect.objectContaining({
              id: productOneData.id,
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

      describe("images", function () {
        it("should create images with correct rank", async () => {
          const images = [
            { url: "image-1" },
            { url: "image-2" },
            { url: "image-3" },
          ]

          const [product] = await service.createProducts([
            buildProductAndRelationsData({ images }),
          ])

          expect(product.images).toHaveLength(3)
          expect(product.images).toEqual([
            expect.objectContaining({
              url: "image-1",
              rank: 0,
            }),
            expect.objectContaining({
              url: "image-2",
              rank: 1,
            }),
            expect.objectContaining({
              url: "image-3",
              rank: 2,
            }),
          ])
        })

        it("should update images with correct rank", async () => {
          const images = [
            { url: "image-1" },
            { url: "image-2" },
            { url: "image-3" },
          ]

          const [product] = await service.createProducts([
            buildProductAndRelationsData({ images }),
          ])

          const reversedImages = [...product.images].reverse()

          const updatedProduct = await service.updateProducts(product.id, {
            images: reversedImages,
          })

          expect(updatedProduct.images).toEqual([
            expect.objectContaining({
              url: "image-3",
              rank: 0,
            }),
            expect.objectContaining({
              url: "image-2",
              rank: 1,
            }),
            expect.objectContaining({
              url: "image-1",
              rank: 2,
            }),
          ])
        })

        it("should delete images if empty array is passed on update", async () => {
          const images = [
            { url: "image-1" },
            { url: "image-2" },
            { url: "image-3" },
          ]

          const [product] = await service.createProducts([
            buildProductAndRelationsData({ images }),
          ])

          await service.updateProducts(product.id, {
            images: [],
          })

          const productAfterUpdate = await service.retrieveProduct(product.id, {
            relations: ["*"],
          })

          expect(productAfterUpdate.images).toHaveLength(0)
        })

        it("should retrieve images in the correct order consistently", async () => {
          const images = Array.from({ length: 1000 }, (_, i) => ({
            url: `image-${i + 1}`,
          }))

          const [product] = await service.createProducts([
            buildProductAndRelationsData({ images }),
          ])

          const retrievedProduct = await service.retrieveProduct(product.id, {
            relations: ["images"],
          })

          const retrievedProductAgain = await service.retrieveProduct(
            product.id,
            {
              relations: ["images"],
            }
          )

          expect(retrievedProduct.images).toEqual(retrievedProductAgain.images)

          expect(retrievedProduct.images).toEqual(
            Array.from({ length: 1000 }, (_, i) =>
              expect.objectContaining({
                url: `image-${i + 1}`,
                rank: i,
              })
            )
          )

          service.listAndCountProducts

          // Explicitly verify sequential order
          retrievedProduct.images.forEach((img, idx) => {
            if (idx > 0) {
              expect(img.rank).toBeGreaterThan(
                retrievedProduct.images[idx - 1].rank
              )
            }
          })
        })

        it("should retrieve images ordered by rank", async () => {
          const [product] = await service.createProducts([
            buildProductAndRelationsData({}),
          ])

          const manager = MikroOrmWrapper.forkManager()

          const images = [
            manager.create(ProductImage, {
              product_id: product.id,
              url: "image-one",
              rank: 1,
            }),
            manager.create(ProductImage, {
              product_id: product.id,
              url: "image-two",
              rank: 0,
            }),
            manager.create(ProductImage, {
              product_id: product.id,
              url: "image-three",
              rank: 2,
            }),
          ]

          await manager.persistAndFlush(images)

          const retrievedProduct = await service.retrieveProduct(product.id, {
            relations: ["images"],
          })

          expect(retrievedProduct.images).toEqual([
            expect.objectContaining({
              url: "image-two",
              rank: 0,
            }),
            expect.objectContaining({
              url: "image-one",
              rank: 1,
            }),
            expect.objectContaining({
              url: "image-three",
              rank: 2,
            }),
          ])
        })

        it("should populate variant.images when variants.images relation is requested", async () => {
          const images = [
            { url: "general-image-1" },
            { url: "general-image-2" },
            { url: "variant-specific-image" },
          ]

          const [product] = await service.createProducts([
            buildProductAndRelationsData({
              images,
              options: [{ title: "size", values: ["small", "large"] }],
              variants: [
                { title: "Small", options: { size: "small" } },
                { title: "Large", options: { size: "large" } },
              ],
            }),
          ])

          const generalImage1 = product.images.find(
            (img) => img.url === "general-image-1"
          )!
          const generalImage2 = product.images.find(
            (img) => img.url === "general-image-2"
          )!
          const variantSpecificImage = product.images.find(
            (img) => img.url === "variant-specific-image"
          )!

          const smallVariant = product.variants.find(
            (v) => v.title === "Small"
          )!
          const largeVariant = product.variants.find(
            (v) => v.title === "Large"
          )!

          // Add variant-specific image assignment
          await service.addImageToVariant([
            {
              image_id: variantSpecificImage.id,
              variant_id: smallVariant.id,
            },
          ])

          // Test retrieveProduct with variants.images relation
          const retrievedProduct = await service.retrieveProduct(product.id, {
            relations: ["variants", "variants.images", "images"],
          })

          expect(retrievedProduct.variants).toHaveLength(2)

          // First variant (Small) should have general images + variant-specific image
          const retrievedSmallVariant = retrievedProduct.variants.find(
            (v) => v.title === "Small"
          )!
          expect(retrievedSmallVariant.images).toHaveLength(3) // 2 general + 1 variant-specific
          expect(retrievedSmallVariant.images).toEqual(
            expect.arrayContaining([
              expect.objectContaining({ id: generalImage1.id }),
              expect.objectContaining({ id: generalImage2.id }),
              expect.objectContaining({ id: variantSpecificImage.id }),
            ])
          )

          // Second variant (Large) should have only general images
          const retrievedLargeVariant = retrievedProduct.variants.find(
            (v) => v.title === "Large"
          )!
          expect(retrievedLargeVariant.images).toHaveLength(2) // 2 general images only
          expect(retrievedLargeVariant.images).toEqual(
            expect.arrayContaining([
              expect.objectContaining({ id: generalImage1.id }),
              expect.objectContaining({ id: generalImage2.id }),
            ])
          )

          // Test listProducts with variants.images relation
          const products = await service.listProducts(
            { id: product.id },
            { relations: ["variants", "variants.images", "images"] }
          )

          expect(products).toHaveLength(1)
          expect(products[0].variants).toHaveLength(2)

          const listSmallVariant = products[0].variants.find(
            (v) => v.title === "Small"
          )!
          expect(listSmallVariant.images).toHaveLength(3)
          expect(listSmallVariant.images).toEqual(
            expect.arrayContaining([
              expect.objectContaining({ id: generalImage1.id }),
              expect.objectContaining({ id: generalImage2.id }),
              expect.objectContaining({ id: variantSpecificImage.id }),
            ])
          )

          const listLargeVariant = products[0].variants.find(
            (v) => v.title === "Large"
          )!
          expect(listLargeVariant.images).toHaveLength(2)
          expect(listLargeVariant.images).toEqual(
            expect.arrayContaining([
              expect.objectContaining({ id: generalImage1.id }),
              expect.objectContaining({ id: generalImage2.id }),
            ])
          )
        })
      })
    })
  },
})

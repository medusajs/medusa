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
  ProductProductOption,
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
  testSuite: ({ MikroOrmWrapper, medusaApp, service }) => {
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

        const runConcurrentValueAdds = async (values: [string, string]) => {
          const option = productOne.options[0]
          const managers = [
            MikroOrmWrapper.forkManager(),
            MikroOrmWrapper.forkManager(),
          ]
          let releaseFirst!: () => void
          let firstUpdated!: () => void
          const holdFirst = new Promise<void>((resolve) => {
            releaseFirst = resolve
          })
          const firstUpdateComplete = new Promise<void>((resolve) => {
            firstUpdated = resolve
          })

          const firstTransaction = managers[0].transactional(
            async (manager) => {
              await service.updateProductOptionValuesOnProduct(
                {
                  product_id: productOne.id,
                  product_option_id: option.id,
                  add: [{ value: values[0] }],
                },
                { manager, transactionManager: manager }
              )
              firstUpdated()
              await holdFirst
            }
          )

          await firstUpdateComplete

          let secondPid!: number
          let secondStarted!: () => void
          const secondTransactionStarted = new Promise<void>((resolve) => {
            secondStarted = resolve
          })
          const secondTransaction = managers[1].transactional(
            async (manager) => {
              const connection = await manager
                .getTransactionContext()!
                .raw("select pg_backend_pid() as pid")
              secondPid = connection.rows[0].pid
              secondStarted()

              await service.updateProductOptionValuesOnProduct(
                {
                  product_id: productOne.id,
                  product_option_id: option.id,
                  add: [{ value: values[1] }],
                },
                { manager, transactionManager: manager }
              )
            }
          )

          await secondTransactionStarted

          const observer = MikroOrmWrapper.forkManager()
          let waitedOnLock = false
          for (let attempt = 0; attempt < 100; attempt++) {
            const [activity] = await observer
              .getConnection()
              .execute<{ wait_event_type: string | null }[]>(
                "select wait_event_type from pg_stat_activity where pid = ?",
                [secondPid]
              )
            if (activity?.wait_event_type === "Lock") {
              waitedOnLock = true
              break
            }
            await setTimeout(20)
          }

          releaseFirst()
          const results = await Promise.allSettled([
            firstTransaction,
            secondTransaction,
          ])

          expect(waitedOnLock).toBe(true)
          expect(results).toEqual([
            expect.objectContaining({ status: "fulfilled" }),
            expect.objectContaining({ status: "fulfilled" }),
          ])

          return service.retrieveProduct(productOne.id, {
            relations: ["options.values"],
          })
        }

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

          expect(products).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                id: productOne.id,
                title: "updated title 1",
              }),
            ])
          )
          expect(products).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                id: productTwo.id,
                title: "updated title 2",
              }),
            ])
          )
        })

        it("should not mutate upsert product update inputs", async () => {
          const updates: UpdateProductInput[] = [
            {
              id: productOne.id,
              option_value_updates: [
                {
                  product_option_id: productOne.options[0].id,
                  add: [{ value: "val-3" }],
                },
              ],
              variants: [
                {
                  id: productOne.variants[0].id,
                  title: productOne.variants[0].title,
                  options: { "opt-title": "val-1" },
                },
              ],
            },
            {
              id: productTwo.id,
              option_ids: productTwo.options.map((option) => option.id),
            },
          ]
          const originalUpdates = structuredClone(updates)

          await service.upsertProducts(updates)

          expect(updates).toEqual(originalUpdates)
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
          productBefore.images = data.images
          productBefore.thumbnail = data.thumbnail
          productBefore.tag_ids = data.tag_ids
          // Update the weight/length/height/width to ensure we are compensating the type mismatch with the DB
          productBefore.weight = 101
          productBefore.length = 201
          productBefore.height = 301
          productBefore.width = 401
          productBefore.option_ids = productOne.options.map((o) => o.id)
          delete productBefore.options
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
              weight: 101,
              length: 201,
              height: 301,
              width: 401,
              images: expect.arrayContaining([
                expect.objectContaining({
                  id: expect.any(String),
                  url: images[0].url,
                }),
              ]),
              options: expect.arrayContaining([
                expect.objectContaining({
                  id: expect.any(String),
                  title: productOne.options[0].title,
                  values: expect.arrayContaining([
                    expect.objectContaining({
                      id: expect.any(String),
                      value: productOne.options[0].values[0].value,
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
              option_ids: productBefore.options.map((o) => o.id),
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

          const beforeOptionOne = productBefore.options.find(
            (opt) => opt.title === "size"
          )!
          const beforeOptionTwo = productBefore.options.find(
            (opt) => opt.title === "color"
          )!
          expect(product.options).toHaveLength(2)
          expect(product.options).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                id: beforeOptionOne.id,
                title: beforeOptionOne.title,
                values: expect.arrayContaining([
                  expect.objectContaining({
                    id: beforeOptionOne.values[0].id,
                    value: beforeOptionOne.values[0].value,
                  }),
                ]),
              }),
              expect.objectContaining({
                id: beforeOptionTwo.id,
                title: beforeOptionTwo.title,
                values: expect.arrayContaining([
                  expect.objectContaining({
                    id: beforeOptionTwo.values[0].id,
                    value: beforeOptionTwo.values[0].value,
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
          const option = (
            await service.createProductOptions([
              { title: "material", values: ["cotton", "silk"] },
            ])
          )[0]

          const updateData = {
            id: productTwo.id,
            option_ids: [option.id],
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

        it("should atomically update option values and variants", async () => {
          const option = productOne.options[0]
          const removedValue = option.values.find(
            (value) => value.value === "val-1"
          )!
          const variant = productOne.variants[0]

          await service.updateProducts(productOne.id, {
            option_value_updates: [
              {
                product_option_id: option.id,
                add: [{ value: "val-3" }],
                remove: [removedValue.id],
              },
            ],
            variants: [
              {
                id: variant.id,
                title: variant.title,
                options: { "opt-title": "val-3" },
              },
            ],
          })

          const product = await service.retrieveProduct(productOne.id, {
            relations: ["options.values", "variants.options"],
          })

          expect(
            product.options[0].values.map((value) => value.value).sort()
          ).toEqual(["val-2", "val-3"])
          expect(product.variants[0].options).toEqual([
            expect.objectContaining({ value: "val-3" }),
          ])
        })

        it("should roll back option value updates when variant update fails", async () => {
          const option = productOne.options[0]
          const removedValue = option.values.find(
            (value) => value.value === "val-1"
          )!

          const error = await service
            .updateProducts(productOne.id, {
              option_value_updates: [
                {
                  product_option_id: option.id,
                  add: [{ value: "val-rollback" }],
                  remove: [removedValue.id],
                },
              ],
              variants: [
                {
                  id: productOne.variants[0].id,
                  title: productOne.variants[0].title,
                  options: { "opt-title": "missing-value" },
                },
              ],
            })
            .catch((cause) => cause)

          expect(error.message).toEqual(
            "Option value missing-value does not exist for option opt-title"
          )

          const product = await service.retrieveProduct(productOne.id, {
            relations: ["options.values", "variants.options"],
          })
          const reloadedOption = await service.retrieveProductOption(
            option.id,
            {
              relations: ["values"],
            }
          )

          expect(
            product.options[0].values.map((value) => value.value).sort()
          ).toEqual(["val-1", "val-2"])
          expect(product.variants[0].options).toEqual([
            expect.objectContaining({ value: "val-1" }),
          ])
          expect(
            reloadedOption.values.map((value) => value.value).sort()
          ).toEqual(["val-1", "val-2"])
        })

        it("should preserve concurrent different-name option value additions", async () => {
          const product = await runConcurrentValueAdds([
            "concurrent-a",
            "concurrent-b",
          ])

          expect(
            product.options[0].values.map((value) => value.value).sort()
          ).toEqual(["concurrent-a", "concurrent-b", "val-1", "val-2"])
        })

        it("should converge concurrent same-name option value additions", async () => {
          const product = await runConcurrentValueAdds([
            "concurrent-same",
            "concurrent-same",
          ])

          expect(
            product.options[0].values.filter(
              (value) => value.value === "concurrent-same"
            )
          ).toHaveLength(1)
        })

        it("should preserve an option value added after a stale transaction preload", async () => {
          const option = await service.createProductOptions({
            title: "Stale option values",
            values: ["linked"],
            is_exclusive: false,
          })
          await service.addProductOptionToProduct({
            product_id: productOne.id,
            product_option_id: option.id,
            product_option_value_ids: [option.values[0].id],
          })

          const staleManager = MikroOrmWrapper.forkManager()
          const writerManager = MikroOrmWrapper.forkManager()
          let stalePreloaded!: () => void
          let releaseStale!: () => void
          const stalePreloadComplete = new Promise<void>((resolve) => {
            stalePreloaded = resolve
          })
          const holdStale = new Promise<void>((resolve) => {
            releaseStale = resolve
          })
          const staleTransaction = staleManager.transactional(
            async (manager) => {
              try {
                await service.listProductOptions(
                  { id: [option.id] },
                  { relations: ["values"] },
                  { manager, transactionManager: manager }
                )
              } finally {
                stalePreloaded()
              }

              await holdStale
              await service.updateProductOptionValuesOnProduct(
                {
                  product_id: productOne.id,
                  product_option_id: option.id,
                  add: [{ value: "requested" }],
                },
                { manager, transactionManager: manager }
              )
            }
          )

          await stalePreloadComplete
          const writerResults = await Promise.allSettled([
            writerManager.transactional(async (manager) => {
              await service.updateProductOptions(
                option.id,
                { values: ["linked", "concurrent"] },
                { manager, transactionManager: manager }
              )
            }),
          ])
          releaseStale()
          const staleResults = await Promise.allSettled([staleTransaction])

          expect([...writerResults, ...staleResults]).toEqual([
            expect.objectContaining({ status: "fulfilled" }),
            expect.objectContaining({ status: "fulfilled" }),
          ])

          const [reloadedProduct] = await service.listProducts(
            { id: [productOne.id] },
            { relations: ["options.values"] }
          )
          const linkedOption = reloadedProduct.options.find(
            (productOption) => productOption.id === option.id
          )!
          expect(
            linkedOption.values.map((value) => value.value).sort()
          ).toEqual(["linked", "requested"])

          const [reloadedOption] = await service.listProductOptions(
            { id: [option.id] },
            { relations: ["values"] }
          )
          expect(
            reloadedOption.values.map((value) => value.value).sort()
          ).toEqual(["concurrent", "linked", "requested"])
        })

        it("should serialize direct value renames with atomic value creation", async () => {
          const option = await service.createProductOptions({
            title: "Concurrent direct rename",
            values: ["linked", "rename-me"],
            is_exclusive: false,
          })
          const linkedValue = option.values.find(
            (value) => value.value === "linked"
          )!
          const renamedValue = option.values.find(
            (value) => value.value === "rename-me"
          )!
          await service.addProductOptionToProduct({
            product_id: productOne.id,
            product_option_id: option.id,
            product_option_value_ids: [linkedValue.id],
          })

          const managers = [
            MikroOrmWrapper.forkManager(),
            MikroOrmWrapper.forkManager(),
          ]
          const observer = MikroOrmWrapper.forkManager()
          const productModuleService = service as any
          const productOptionService =
            productModuleService.productOptionService_
          const upsertWithReplace =
            productOptionService.upsertWithReplace.bind(productOptionService)
          let releaseAtomic!: () => void
          let atomicReadComplete!: () => void
          const holdAtomic = new Promise<void>((resolve) => {
            releaseAtomic = resolve
          })
          const atomicRead = new Promise<void>((resolve) => {
            atomicReadComplete = resolve
          })
          productOptionService.upsertWithReplace = async (...args: any[]) => {
            if (
              args[0]?.some((entry: { id: string }) => entry.id === option.id)
            ) {
              atomicReadComplete()
              await holdAtomic
            }
            return await upsertWithReplace(...args)
          }

          const atomic = managers[0].transactional(async (manager) => {
            await service.updateProductOptionValuesOnProduct(
              {
                product_id: productOne.id,
                product_option_id: option.id,
                add: [{ value: "requested" }],
              },
              { manager, transactionManager: manager }
            )
          })
          let writer: Promise<void> | undefined

          try {
            await atomicRead
            let writerPid!: number
            let writerStarted!: () => void
            const writerStart = new Promise<void>((resolve) => {
              writerStarted = resolve
            })
            writer = managers[1].transactional(async (manager) => {
              const backend = await manager
                .getTransactionContext()!
                .raw("select pg_backend_pid() as pid")
              writerPid = backend.rows[0].pid
              writerStarted()
              await service.updateProductOptionValues(
                renamedValue.id,
                { value: "renamed" },
                { manager, transactionManager: manager }
              )
            })

            await writerStart
            let writerWaitedOnOption = false
            for (let attempt = 0; attempt < 100; attempt++) {
              const [activity] = await observer
                .getConnection()
                .execute<{ wait_event_type: string | null }[]>(
                  "select wait_event_type from pg_stat_activity where pid = ?",
                  [writerPid]
                )
              if (activity?.wait_event_type === "Lock") {
                writerWaitedOnOption = true
                break
              }
              await setTimeout(20)
            }

            releaseAtomic()
            const results = await Promise.allSettled([atomic, writer])
            const [reloadedOption] = await service.listProductOptions(
              { id: [option.id] },
              { relations: ["values"] }
            )

            expect(results).toEqual([
              expect.objectContaining({ status: "fulfilled" }),
              expect.objectContaining({ status: "fulfilled" }),
            ])
            expect(
              reloadedOption.values.map((value) => value.value).sort()
            ).toEqual(["linked", "renamed", "requested"])
            expect(writerWaitedOnOption).toBe(true)
          } finally {
            releaseAtomic()
            productOptionService.upsertWithReplace = upsertWithReplace
            await Promise.allSettled([atomic, writer])
          }
        })

        it("should serialize variant-only updates with option value removals", async () => {
          const option = productOne.options[0]
          const removedValue = option.values.find(
            (value) => value.value === "val-1"
          )!
          const variant = productOne.variants[0]
          const managers = [
            MikroOrmWrapper.forkManager(),
            MikroOrmWrapper.forkManager(),
          ]
          let releaseRemoval!: () => void
          let removalUpdated!: () => void
          const holdRemoval = new Promise<void>((resolve) => {
            releaseRemoval = resolve
          })
          const removalUpdateComplete = new Promise<void>((resolve) => {
            removalUpdated = resolve
          })

          const removalTransaction = managers[0].transactional(
            async (manager) => {
              await service.updateProducts(
                productOne.id,
                {
                  option_value_updates: [
                    {
                      product_option_id: option.id,
                      remove: [removedValue.id],
                    },
                  ],
                  variants: [
                    {
                      id: variant.id,
                      title: variant.title,
                      options: { "opt-title": "val-2" },
                    },
                  ],
                },
                { manager, transactionManager: manager }
              )
              removalUpdated()
              await holdRemoval
            }
          )

          await removalUpdateComplete

          let variantWriterPid!: number
          let variantWriterStarted!: () => void
          const variantWriterStart = new Promise<void>((resolve) => {
            variantWriterStarted = resolve
          })
          const variantTransaction = managers[1].transactional(
            async (manager) => {
              const connection = await manager
                .getTransactionContext()!
                .raw("select pg_backend_pid() as pid")
              variantWriterPid = connection.rows[0].pid
              variantWriterStarted()

              await service.updateProducts(
                productOne.id,
                {
                  variants: [
                    {
                      id: variant.id,
                      title: variant.title,
                      options: { "opt-title": "val-1" },
                    },
                  ],
                },
                { manager, transactionManager: manager }
              )
            }
          )

          await variantWriterStart

          const observer = MikroOrmWrapper.forkManager()
          let waitedOnLock = false
          for (let attempt = 0; attempt < 100; attempt++) {
            const [activity] = await observer
              .getConnection()
              .execute<{ wait_event_type: string | null }[]>(
                "select wait_event_type from pg_stat_activity where pid = ?",
                [variantWriterPid]
              )
            if (activity?.wait_event_type === "Lock") {
              waitedOnLock = true
              break
            }
            await setTimeout(20)
          }

          releaseRemoval()
          const results = await Promise.allSettled([
            removalTransaction,
            variantTransaction,
          ])

          expect(waitedOnLock).toBe(true)
          expect(results[0]).toEqual(
            expect.objectContaining({ status: "fulfilled" })
          )
          expect(results[1]).toEqual(
            expect.objectContaining({
              status: "rejected",
              reason: expect.objectContaining({
                message: expect.stringContaining(
                  "Option value val-1 does not exist for option opt-title"
                ),
              }),
            })
          )

          const product = await service.retrieveProduct(productOne.id, {
            relations: ["options.values", "variants.options"],
          })
          expect(
            product.options[0].values.map((value) => value.value).sort()
          ).toEqual(["val-2"])
          expect(product.variants[0].options).toEqual([
            expect.objectContaining({ value: "val-2" }),
          ])
        })

        it("should lock scalar-only products in mixed structural update batches", async () => {
          const productIds = [productOne.id, productTwo.id].sort()
          const [scalarProduct, structuralProduct] = [productOne, productTwo]
            .sort((left, right) => left.id.localeCompare(right.id))
            .reverse()
          const productModuleService = (medusaApp as any).modules[
            Modules.PRODUCT
          ]
          const productRepository = productModuleService.productRepository_
          const findMethodOwner = (target: any, method: string) => {
            for (
              let owner = target;
              owner;
              owner = Object.getPrototypeOf(owner)
            ) {
              if (Object.prototype.hasOwnProperty.call(owner, method)) {
                return owner
              }
            }
            throw new Error(`Method ${method} not found`)
          }
          const lockProductRowsOwner = findMethodOwner(
            productModuleService,
            "lockProductRows_"
          )
          const deepUpdateOwner = findMethodOwner(
            productRepository,
            "deepUpdate"
          )
          const lockProductRows = lockProductRowsOwner.lockProductRows_
          const deepUpdate = deepUpdateOwner.deepUpdate
          let invocationOrder = 0
          let lockedProductIds: string[] | undefined
          let lockCallOrder: number | undefined
          let deepUpdateCallOrder: number | undefined

          lockProductRowsOwner.lockProductRows_ = async function (
            ...args: any[]
          ) {
            lockedProductIds = args[0]
            lockCallOrder = ++invocationOrder
            return await lockProductRows.apply(this, args)
          }
          deepUpdateOwner.deepUpdate = async function (...args: any[]) {
            deepUpdateCallOrder = ++invocationOrder
            return await deepUpdate.apply(this, args)
          }

          try {
            await service.upsertProducts([
              {
                id: structuralProduct.id,
                option_ids: structuralProduct.options.map(
                  (option) => option.id
                ),
              },
              {
                id: scalarProduct.id,
                title: "scalar-only batch update",
              },
            ])
          } finally {
            lockProductRowsOwner.lockProductRows_ = lockProductRows
            deepUpdateOwner.deepUpdate = deepUpdate
          }

          expect(lockedProductIds).toEqual(productIds)
          expect(lockCallOrder).toBeLessThan(deepUpdateCallOrder!)
        })

        it("should refresh a stale scalar preload after locking the product", async () => {
          const staleManager = MikroOrmWrapper.forkManager()
          const writerManager = MikroOrmWrapper.forkManager()
          const productModuleService = (medusaApp as any).modules[
            Modules.PRODUCT
          ]
          const productService = productModuleService.productService_
          const listProducts = productService.list
          const previousState: any[] = []
          const expectedState: any[] = []
          let stalePreloaded!: () => void
          let releaseStale!: () => void
          const stalePreloadComplete = new Promise<void>((resolve) => {
            stalePreloaded = resolve
          })
          const holdStale = new Promise<void>((resolve) => {
            releaseStale = resolve
          })
          productService.list = async (...args: any[]) => {
            const result = await listProducts.apply(productService, args)
            const config = args[1] ?? {}
            if (config.select?.includes("title") && !config.options?.refresh) {
              return result.map((product: any) =>
                product.id === productOne.id
                  ? { ...product, title: "product 1" }
                  : product
              )
            }
            return result
          }

          const staleUpdate = staleManager.transactional(async (manager) => {
            await service.listProducts(
              { id: [productOne.id] },
              { select: ["id", "title"] },
              { manager, transactionManager: manager }
            )
            stalePreloaded()
            await holdStale
            await service.upsertProducts(
              { id: productOne.id, title: "forward scalar title" },
              {
                __type: "MedusaContext",
                manager,
                transactionManager: manager,
                productUpdateFieldsByProductId: {
                  [productOne.id]: ["title"],
                },
                productUpdatePreviousState: previousState,
                productUpdateExpectedState: expectedState,
              } as any
            )
          })

          try {
            await stalePreloadComplete
            await writerManager.transactional(async (manager) => {
              await service.updateProducts(
                productOne.id,
                { title: "concurrent scalar title" },
                { manager, transactionManager: manager }
              )
            })
            releaseStale()
            await staleUpdate

            expect(previousState).toEqual([
              {
                product_id: productOne.id,
                version: expect.any(String),
                fields: { title: "concurrent scalar title" },
              },
            ])
          } finally {
            releaseStale()
            productService.list = listProducts
            await staleUpdate.catch(() => undefined)
          }
        })

        it("should refresh stale product options after locking the product", async () => {
          const retainedOption = productOne.options[0]
          const concurrentOption = await service.createProductOptions({
            title: "Concurrent stale option",
            values: ["concurrent"],
            is_exclusive: false,
          })
          const staleManager = MikroOrmWrapper.forkManager()
          const writerManager = MikroOrmWrapper.forkManager()
          let stalePreloaded!: () => void
          let releaseStale!: () => void
          const stalePreloadComplete = new Promise<void>((resolve) => {
            stalePreloaded = resolve
          })
          const holdStale = new Promise<void>((resolve) => {
            releaseStale = resolve
          })

          const staleUpdate = staleManager.transactional(async (manager) => {
            await service.listProducts(
              { id: [productOne.id] },
              { relations: ["options.values"] },
              { manager, transactionManager: manager }
            )
            stalePreloaded()
            await holdStale
            await service.updateProducts(
              productOne.id,
              { option_ids: [retainedOption.id] },
              { manager, transactionManager: manager }
            )
          })

          try {
            await stalePreloadComplete
            await writerManager.transactional(async (manager) => {
              await service.addProductOptionToProduct(
                {
                  product_id: productOne.id,
                  product_option_id: concurrentOption.id,
                },
                { manager, transactionManager: manager }
              )
            })
            releaseStale()
            await staleUpdate

            const activeLinks = await (
              service as any
            ).productProductOptionService_.list({
              product_id: productOne.id,
            })
            expect(
              activeLinks.map(
                (link: { product_option_id: string }) => link.product_option_id
              )
            ).toEqual([retainedOption.id])
          } finally {
            releaseStale()
            await staleUpdate.catch(() => undefined)
          }
        })

        it("should serialize reversed option replacements without a crossed deadlock", async () => {
          const [optionA, optionB] = await service.createProductOptions([
            {
              title: "Replacement A",
              values: ["A"],
              is_exclusive: false,
            },
            {
              title: "Replacement B",
              values: ["B"],
              is_exclusive: false,
            },
          ])
          const [productA, productB] = await service.createProducts([
            { title: "Replacement product A" },
            { title: "Replacement product B" },
          ])
          await service.addProductOptionToProduct([
            {
              product_id: productA.id,
              product_option_id: optionA.id,
            },
            {
              product_id: productB.id,
              product_option_id: optionB.id,
            },
          ])

          const productModuleService = (medusaApp as any).modules[
            Modules.PRODUCT
          ]
          const findMethodOwner = (target: any, method: string) => {
            for (
              let owner = target;
              owner;
              owner = Object.getPrototypeOf(owner)
            ) {
              if (Object.prototype.hasOwnProperty.call(owner, method)) {
                return owner
              }
            }
            throw new Error(`Method ${method} not found`)
          }
          const lockOwner = findMethodOwner(
            productModuleService,
            "lockProductOptionRows_"
          )
          const lockProductOptionRows = lockOwner.lockProductOptionRows_
          let initialLockCalls = 0
          let releaseInitialLocks!: () => void
          const bothInitialLocks = new Promise<void>((resolve) => {
            releaseInitialLocks = resolve
          })

          lockOwner.lockProductOptionRows_ = async function (
            optionIds: string[],
            ...args: any[]
          ) {
            initialLockCalls++
            if (initialLockCalls <= 2) {
              if (initialLockCalls === 2) {
                releaseInitialLocks()
              }
              await bothInitialLocks
            }
            return await lockProductOptionRows.call(this, optionIds, ...args)
          }

          try {
            const managers = [
              MikroOrmWrapper.forkManager(),
              MikroOrmWrapper.forkManager(),
            ]
            const results = await Promise.allSettled([
              managers[0].transactional(async (manager) => {
                await service.updateProducts(
                  productA.id,
                  { option_ids: [optionB.id] },
                  { manager, transactionManager: manager }
                )
              }),
              managers[1].transactional(async (manager) => {
                await service.updateProducts(
                  productB.id,
                  { option_ids: [optionA.id] },
                  { manager, transactionManager: manager }
                )
              }),
            ])

            expect(results).toEqual([
              expect.objectContaining({ status: "fulfilled" }),
              expect.objectContaining({ status: "fulfilled" }),
            ])
            const reloaded = await (
              service as any
            ).productProductOptionService_.list({
              product_id: [productA.id, productB.id],
            })
            expect(
              reloaded.find(
                (link: { product_id: string }) =>
                  link.product_id === productA.id
              )!.product_option_id
            ).toBe(optionB.id)
            expect(
              reloaded.find(
                (link: { product_id: string }) =>
                  link.product_id === productB.id
              )!.product_option_id
            ).toBe(optionA.id)
          } finally {
            releaseInitialLocks()
            lockOwner.lockProductOptionRows_ = lockProductOptionRows
          }
        })

        it("should serialize reversed mixed upserts without a crossed deadlock", async () => {
          const [optionA, optionB] = await service.createProductOptions([
            {
              title: "Mixed deadlock A",
              values: ["A"],
              is_exclusive: false,
            },
            {
              title: "Mixed deadlock B",
              values: ["B"],
              is_exclusive: false,
            },
          ])
          const [productA, productB] = await service.createProducts([
            { title: "Mixed deadlock product A" },
            { title: "Mixed deadlock product B" },
          ])
          await service.addProductOptionToProduct([
            {
              product_id: productA.id,
              product_option_id: optionA.id,
            },
            {
              product_id: productB.id,
              product_option_id: optionB.id,
            },
          ])

          const productModuleService = (medusaApp as any).modules[
            Modules.PRODUCT
          ]
          const findMethodOwner = (target: any, method: string) => {
            for (
              let owner = target;
              owner;
              owner = Object.getPrototypeOf(owner)
            ) {
              if (Object.prototype.hasOwnProperty.call(owner, method)) {
                return owner
              }
            }
            throw new Error(`Method ${method} not found`)
          }
          const lockOwner = findMethodOwner(
            productModuleService,
            "lockProductOptionRows_"
          )
          const lockProductOptionRows = lockOwner.lockProductOptionRows_
          let initialLockCalls = 0
          let releaseInitialLocks!: () => void
          const bothInitialLocks = new Promise<void>((resolve) => {
            releaseInitialLocks = resolve
          })

          lockOwner.lockProductOptionRows_ = async function (
            optionIds: string[],
            ...args: any[]
          ) {
            initialLockCalls++
            if (initialLockCalls <= 2) {
              if (initialLockCalls === 2) {
                releaseInitialLocks()
              }
              await bothInitialLocks
            }
            return await lockProductOptionRows.call(this, optionIds, ...args)
          }

          try {
            const managers = [
              MikroOrmWrapper.forkManager(),
              MikroOrmWrapper.forkManager(),
            ]
            const results = await Promise.allSettled([
              managers[0].transactional(async (manager) => {
                await service.upsertProducts(
                  [
                    { id: productA.id, title: "Mixed update A" },
                    {
                      title: "Mixed create B",
                      options: [{ id: optionB.id }],
                    },
                  ],
                  { manager, transactionManager: manager }
                )
              }),
              managers[1].transactional(async (manager) => {
                await service.upsertProducts(
                  [
                    { id: productB.id, title: "Mixed update B" },
                    {
                      title: "Mixed create A",
                      options: [{ id: optionA.id }],
                    },
                  ],
                  { manager, transactionManager: manager }
                )
              }),
            ])

            expect(results).toEqual([
              expect.objectContaining({ status: "fulfilled" }),
              expect.objectContaining({ status: "fulfilled" }),
            ])
          } finally {
            releaseInitialLocks()
            lockOwner.lockProductOptionRows_ = lockProductOptionRows
          }
        })

        it("should reject duplicate product IDs in one upsert batch", async () => {
          await expect(
            service.upsertProducts([
              { id: productOne.id, title: "duplicate title" },
              { id: productOne.id, subtitle: "duplicate subtitle" },
            ])
          ).rejects.toThrow("Duplicate product IDs are not allowed")
        })

        it("should acquire update locks before mixed upsert creates", async () => {
          const sharedOption = await service.createProductOptions({
            title: "Mixed upsert shared option",
            values: ["Shared"],
            is_exclusive: false,
          })
          const productModuleService = (medusaApp as any).modules[
            Modules.PRODUCT
          ]
          const findMethodOwner = (target: any, method: string) => {
            for (
              let owner = target;
              owner;
              owner = Object.getPrototypeOf(owner)
            ) {
              if (Object.prototype.hasOwnProperty.call(owner, method)) {
                return owner
              }
            }
            throw new Error(`Method ${method} not found`)
          }
          const createOwner = findMethodOwner(
            productModuleService,
            "createProducts"
          )
          const updateOwner = findMethodOwner(
            productModuleService,
            "updateProducts_"
          )
          const createProducts = createOwner.createProducts
          const updateProducts = updateOwner.updateProducts_
          const order: string[] = []
          createOwner.createProducts = async function (...args: any[]) {
            order.push("create")
            return await createProducts.apply(this, args)
          }
          updateOwner.updateProducts_ = async function (...args: any[]) {
            order.push("update")
            return await updateProducts.apply(this, args)
          }

          try {
            const result = await service.upsertProducts([
              {
                title: "Mixed upsert created product",
                options: [{ id: sharedOption.id }],
              },
              { id: productOne.id, title: "Mixed upsert updated product" },
            ])

            expect(order.slice(0, 2)).toEqual(["update", "create"])
            expect(result.map((product) => product.title)).toEqual([
              "Mixed upsert created product",
              "Mixed upsert updated product",
            ])
          } finally {
            createOwner.createProducts = createProducts
            updateOwner.updateProducts_ = updateProducts
          }
        })

        it("should preserve an outer transaction lock_timeout", async () => {
          const manager = MikroOrmWrapper.forkManager()
          await manager.transactional(async (transactionManager) => {
            const knex = transactionManager.getTransactionContext()!
            await knex.raw("select set_config('lock_timeout', ?, true)", ["9s"])
            await service.upsertProducts(
              { id: productOne.id, title: "Outer timeout update" },
              {
                manager: transactionManager,
                transactionManager,
              }
            )
            const timeout = await knex.raw("show lock_timeout")
            expect(timeout.rows[0].lock_timeout).toBe("9s")
          })
        })

        it("should reject option_value_updates on create upserts", async () => {
          await expect(
            service.upsertProducts({
              title: "Invalid create option-value update",
              option_value_updates: [],
            } as any)
          ).rejects.toThrow(
            "Product option value updates require an existing product ID"
          )
        })

        it("should lock variant-only products in mixed option value batches", async () => {
          const managers = [
            MikroOrmWrapper.forkManager(),
            MikroOrmWrapper.forkManager(),
          ]
          let releaseMixedUpdate!: () => void
          let mixedUpdateFinished!: () => void
          const holdMixedUpdate = new Promise<void>((resolve) => {
            releaseMixedUpdate = resolve
          })
          const mixedUpdateComplete = new Promise<void>((resolve) => {
            mixedUpdateFinished = resolve
          })

          const mixedUpdate = managers[0].transactional(async (manager) => {
            await service.upsertProducts(
              [
                {
                  id: productOne.id,
                  option_value_updates: [
                    {
                      product_option_id: productOne.options[0].id,
                      add: [{ value: "val-3" }],
                    },
                  ],
                  variants: [
                    {
                      id: productOne.variants[0].id,
                      title: productOne.variants[0].title,
                      options: { "opt-title": "val-3" },
                    },
                  ],
                },
                {
                  id: productTwo.id,
                  variants: [
                    {
                      id: productTwo.variants[0].id,
                      title: productTwo.variants[0].title,
                      options: { size: "large", color: "blue" },
                    },
                  ],
                },
              ],
              { manager, transactionManager: manager }
            )
            mixedUpdateFinished()
            await holdMixedUpdate
          })

          await mixedUpdateComplete

          let productWriterPid!: number
          let productWriterStarted!: () => void
          let releaseProductWriter!: () => void
          const productWriterStart = new Promise<void>((resolve) => {
            productWriterStarted = resolve
          })
          const holdProductWriter = new Promise<void>((resolve) => {
            releaseProductWriter = resolve
          })
          const productWriter = managers[1].transactional(async (manager) => {
            const connection = manager.getTransactionContext()!
            const backend = await connection.raw(
              "select pg_backend_pid() as pid"
            )
            productWriterPid = backend.rows[0].pid
            productWriterStarted()
            await connection.raw(
              "select id from product where id = ? for update",
              [productTwo.id]
            )
            await holdProductWriter
          })

          await productWriterStart

          const observer = MikroOrmWrapper.forkManager()
          let waitedOnLock = false
          for (let attempt = 0; attempt < 100; attempt++) {
            const [activity] = await observer
              .getConnection()
              .execute<{ wait_event_type: string | null }[]>(
                "select wait_event_type from pg_stat_activity where pid = ?",
                [productWriterPid]
              )
            if (activity?.wait_event_type === "Lock") {
              waitedOnLock = true
              break
            }
            await setTimeout(20)
          }

          releaseMixedUpdate()
          releaseProductWriter()
          const results = await Promise.allSettled([mixedUpdate, productWriter])

          expect(waitedOnLock).toBe(true)
          expect(results).toEqual([
            expect.objectContaining({ status: "fulfilled" }),
            expect.objectContaining({ status: "fulfilled" }),
          ])
        })

        it("should lock products for empty and option-omitting variant replacements", async () => {
          const managers = [
            MikroOrmWrapper.forkManager(),
            MikroOrmWrapper.forkManager(),
            MikroOrmWrapper.forkManager(),
          ]
          const observer = MikroOrmWrapper.forkManager()
          await observer.getConnection().execute(`
            create or replace function test_delay_variant_replacement()
            returns trigger as $$
            begin
              perform pg_sleep(3);
              if TG_OP = 'DELETE' then
                return OLD;
              end if;
              return NEW;
            end;
            $$ language plpgsql;
            drop trigger if exists test_delay_variant_replacement on product_variant;
            create trigger test_delay_variant_replacement
              before update or delete on product_variant
              for each row execute function test_delay_variant_replacement();
          `)

          let updatePid!: number
          let updateStarted!: () => void
          const started = new Promise<void>((resolve) => {
            updateStarted = resolve
          })
          const update = managers[0].transactional(async (manager) => {
            const backend = await manager
              .getTransactionContext()!
              .raw("select pg_backend_pid() as pid")
            updatePid = backend.rows[0].pid
            updateStarted()
            await service.upsertProducts(
              [
                { id: productOne.id, variants: [] },
                {
                  id: productTwo.id,
                  variants: [
                    {
                      id: productTwo.variants[0].id,
                      title: "renamed variant",
                    },
                  ],
                },
              ],
              { manager, transactionManager: manager }
            )
          })

          try {
            await started
            let reachedVariantWrite = false
            for (let attempt = 0; attempt < 100; attempt++) {
              const [activity] = await observer
                .getConnection()
                .execute<{ wait_event: string | null }[]>(
                  "select wait_event from pg_stat_activity where pid = ?",
                  [updatePid]
                )
              if (activity?.wait_event === "PgSleep") {
                reachedVariantWrite = true
                break
              }
              await setTimeout(20)
            }

            const lockResults = await Promise.allSettled(
              [productOne.id, productTwo.id].map((productId, index) =>
                managers[index + 1].transactional(async (manager) => {
                  await manager
                    .getTransactionContext()!
                    .raw(
                      "select id from product where id = ? for update nowait",
                      [productId]
                    )
                })
              )
            )

            expect(reachedVariantWrite).toBe(true)
            expect(lockResults).toEqual([
              expect.objectContaining({ status: "rejected" }),
              expect.objectContaining({ status: "rejected" }),
            ])
          } finally {
            await update
            await observer.getConnection().execute(`
              drop trigger if exists test_delay_variant_replacement on product_variant;
              drop function if exists test_delay_variant_replacement();
            `)
          }
        })

        it("should preserve a scalar variant update that commits before compensation", async () => {
          const variant = productOne.variants[0]
          const managers = [
            MikroOrmWrapper.forkManager(),
            MikroOrmWrapper.forkManager(),
            MikroOrmWrapper.forkManager(),
          ]
          const observer = MikroOrmWrapper.forkManager()
          const expectedState = await managers[2].transactional(
            async (manager) =>
              await (service as any).captureVariantUpdateState_(
                [productOne.id],
                { manager, transactionManager: manager }
              )
          )

          let releaseWriter!: () => void
          let writerLocked!: () => void
          const holdWriter = new Promise<void>((resolve) => {
            releaseWriter = resolve
          })
          const writerLockReady = new Promise<void>((resolve) => {
            writerLocked = resolve
          })
          const writer = managers[0].transactional(async (manager) => {
            await manager
              .getTransactionContext()!
              .raw("select id from product_variant where id = ? for update", [
                variant.id,
              ])
            writerLocked()
            await holdWriter
            await service.updateProductVariants(
              variant.id,
              { title: "concurrent variant title" },
              { manager, transactionManager: manager }
            )
          })

          try {
            await writerLockReady
            let compensationPid!: number
            let compensationStarted!: () => void
            const compensationStart = new Promise<void>((resolve) => {
              compensationStarted = resolve
            })
            const compensation = managers[1].transactional(async (manager) => {
              const backend = await manager
                .getTransactionContext()!
                .raw("select pg_backend_pid() as pid")
              compensationPid = backend.rows[0].pid
              compensationStarted()
              await (service as any).updateProducts_(
                [
                  {
                    id: productOne.id,
                    variants: [
                      {
                        id: variant.id,
                        title: "compensated variant title",
                        options: { "opt-title": "val-1" },
                      },
                    ],
                  },
                ],
                {
                  __type: "MedusaContext",
                  manager,
                  transactionManager: manager,
                  variantUpdateCondition: expectedState,
                } as any
              )
            })

            await compensationStart
            let compensationWaitedOnVariant = false
            for (let attempt = 0; attempt < 100; attempt++) {
              const [activity] = await observer
                .getConnection()
                .execute<{ wait_event_type: string | null }[]>(
                  "select wait_event_type from pg_stat_activity where pid = ?",
                  [compensationPid]
                )
              if (activity?.wait_event_type === "Lock") {
                compensationWaitedOnVariant = true
                break
              }
              await setTimeout(20)
            }

            releaseWriter()
            const results = await Promise.allSettled([writer, compensation])
            const reloaded = await service.retrieveProductVariant(variant.id)

            expect(compensationWaitedOnVariant).toBe(true)
            expect(results).toEqual([
              expect.objectContaining({ status: "fulfilled" }),
              expect.objectContaining({ status: "fulfilled" }),
            ])
            expect(reloaded.title).toBe("concurrent variant title")
          } finally {
            releaseWriter()
            await writer.catch(() => undefined)
          }
        })

        it("should capture prior variants after an in-flight scalar update", async () => {
          const variant = productOne.variants[0]
          const managers = [
            MikroOrmWrapper.forkManager(),
            MikroOrmWrapper.forkManager(),
          ]
          const observer = MikroOrmWrapper.forkManager()
          let releaseWriter!: () => void
          let writerLocked!: () => void
          const holdWriter = new Promise<void>((resolve) => {
            releaseWriter = resolve
          })
          const writerLockReady = new Promise<void>((resolve) => {
            writerLocked = resolve
          })
          const writer = managers[0].transactional(async (manager) => {
            await manager
              .getTransactionContext()!
              .raw("select id from product_variant where id = ? for update", [
                variant.id,
              ])
            writerLocked()
            await holdWriter
            await service.updateProductVariants(
              variant.id,
              { title: "concurrent prior title" },
              { manager, transactionManager: manager }
            )
          })

          try {
            await writerLockReady
            const previousProducts: any[] = []
            const expectedState: any[] = []
            let updatePid!: number
            let updateStarted!: () => void
            const updateStart = new Promise<void>((resolve) => {
              updateStarted = resolve
            })
            const update = managers[1].transactional(async (manager) => {
              const backend = await manager
                .getTransactionContext()!
                .raw("select pg_backend_pid() as pid")
              updatePid = backend.rows[0].pid
              updateStarted()
              await service.upsertProducts(
                [
                  {
                    id: productOne.id,
                    variants: [
                      {
                        id: variant.id,
                        title: "forward title",
                        options: { "opt-title": "val-1" },
                      },
                    ],
                  },
                ],
                {
                  __type: "MedusaContext",
                  manager,
                  transactionManager: manager,
                  variantUpdatePreviousProducts: previousProducts,
                  variantUpdateExpectedState: expectedState,
                } as any
              )
            })

            await updateStart
            let updateWaitedOnVariant = false
            for (let attempt = 0; attempt < 100; attempt++) {
              const [activity] = await observer
                .getConnection()
                .execute<{ wait_event_type: string | null }[]>(
                  "select wait_event_type from pg_stat_activity where pid = ?",
                  [updatePid]
                )
              if (activity?.wait_event_type === "Lock") {
                updateWaitedOnVariant = true
                break
              }
              await setTimeout(20)
            }

            releaseWriter()
            const results = await Promise.allSettled([writer, update])
            const reloaded = await service.retrieveProductVariant(variant.id)

            expect(updateWaitedOnVariant).toBe(true)
            expect(results).toEqual([
              expect.objectContaining({ status: "fulfilled" }),
              expect.objectContaining({ status: "fulfilled" }),
            ])
            expect(previousProducts[0].variants[0].title).toBe(
              "concurrent prior title"
            )
            expect(reloaded.title).toBe("forward title")
          } finally {
            releaseWriter()
            await writer.catch(() => undefined)
          }
        })

        it("should skip variant compensation when option names drift", async () => {
          const variant = productOne.variants[0]
          const option = productOne.options[0]
          const value = option.values.find((entry) => entry.value === "val-1")!

          await service.updateProductVariants(variant.id, {
            title: "forward variant title",
          })
          const manager = MikroOrmWrapper.forkManager()
          const expectedState = await manager.transactional(
            async (transactionManager) =>
              await (service as any).captureVariantUpdateState_(
                [productOne.id],
                {
                  manager: transactionManager,
                  transactionManager,
                }
              )
          )

          await service.updateProductOptions(option.id, {
            title: "renamed option",
          })
          await service.updateProductOptionValues(value.id, {
            value: "renamed value",
          })

          await expect(
            service.upsertProducts(
              [
                {
                  id: productOne.id,
                  variants: [
                    {
                      id: variant.id,
                      title: "compensated variant title",
                      options: { "opt-title": "val-1" },
                    },
                  ],
                },
              ],
              {
                __type: "MedusaContext",
                variantUpdateCondition: expectedState,
              } as any
            )
          ).resolves.toBeDefined()

          const reloaded = await service.retrieveProduct(productOne.id, {
            relations: ["options.values", "variants.options"],
          })
          expect(reloaded.variants[0].title).toBe("forward variant title")
          expect(reloaded.variants[0].options).toEqual([
            expect.objectContaining({ value: "renamed value" }),
          ])
        })

        it("should skip atomic compensation when a prior-only value drifts", async () => {
          const variant = productOne.variants[0]
          const option = productOne.options[0]
          const priorValue = option.values.find(
            (entry) => entry.value === "val-1"
          )!
          const linkCompensation: any[] = []
          const previousProducts: any[] = []
          const expectedState: any[] = []
          const createdValueIds: string[] = []
          const createdValues: any[] = []

          await service.upsertProducts(
            [
              {
                id: productOne.id,
                option_value_updates: [
                  {
                    product_option_id: option.id,
                    add: [{ value: "val-3" }],
                    remove: [priorValue.id],
                  },
                ],
                variants: [
                  {
                    id: variant.id,
                    title: "forward variant title",
                    options: { "opt-title": "val-3" },
                  },
                ],
              },
            ],
            {
              __type: "MedusaContext",
              optionValueUpdateCompensation: linkCompensation,
              variantUpdatePreviousProducts: previousProducts,
              variantUpdateExpectedState: expectedState,
              optionValueUpdateCreatedValueIds: createdValueIds,
              optionValueUpdateCreatedValues: createdValues,
            } as any
          )
          await service.updateProductOptionValues(priorValue.id, {
            value: "renamed prior value",
          })

          const restoration = linkCompensation[0].add[0]
          const skippedProductIds: string[] = []
          await expect(
            service.upsertProducts(
              [
                {
                  id: productOne.id,
                  option_value_updates: [
                    {
                      product_option_id: option.id,
                      add: [priorValue.id],
                    },
                  ],
                  variants: [
                    {
                      id: variant.id,
                      title: previousProducts[0].variants[0].title,
                      options: { "opt-title": "val-1" },
                    },
                  ],
                },
              ],
              {
                __type: "MedusaContext",
                variantUpdateCondition: expectedState,
                variantUpdateSkippedProductIds: skippedProductIds,
                optionValueUpdateExpectedRestorations: [
                  {
                    product_id: productOne.id,
                    product_option_id: option.id,
                    ...restoration,
                  },
                ],
              } as any
            )
          ).resolves.toBeDefined()

          const reloaded = await service.retrieveProduct(productOne.id, {
            relations: ["options.values", "variants.options"],
          })
          expect(skippedProductIds).toEqual([productOne.id])
          expect(reloaded.variants[0]).toEqual(
            expect.objectContaining({
              title: "forward variant title",
              options: [expect.objectContaining({ value: "val-3" })],
            })
          )
          expect(
            reloaded.options[0].values.some(
              (value) => value.id === priorValue.id
            )
          ).toBe(false)
        })

        it("should skip variant compensation when restoration link history drifts", async () => {
          const variant = productOne.variants[0]
          const option = productOne.options[0]
          const priorValue = option.values.find(
            (entry) => entry.value === "val-1"
          )!
          const linkCompensation: any[] = []
          const previousProducts: any[] = []

          await service.upsertProducts(
            [
              {
                id: productOne.id,
                option_value_updates: [
                  {
                    product_option_id: option.id,
                    add: [{ value: "val-3" }],
                    remove: [priorValue.id],
                  },
                ],
                variants: [
                  {
                    id: variant.id,
                    title: "forward variant title",
                    options: { "opt-title": "val-3" },
                  },
                ],
              },
            ],
            {
              __type: "MedusaContext",
              optionValueUpdateCompensation: linkCompensation,
              variantUpdatePreviousProducts: previousProducts,
            } as any
          )
          await service.updateProductOptionValuesOnProduct({
            product_id: productOne.id,
            product_option_id: option.id,
            add: [priorValue.id],
          })
          await service.updateProductOptionValuesOnProduct({
            product_id: productOne.id,
            product_option_id: option.id,
            remove: [priorValue.id],
          })

          const manager = MikroOrmWrapper.forkManager()
          const currentState = await manager.transactional(
            async (transactionManager) =>
              await (service as any).captureVariantUpdateState_(
                [productOne.id],
                {
                  manager: transactionManager,
                  transactionManager,
                }
              )
          )
          const restoration = linkCompensation[0].add[0]
          const skippedProductIds: string[] = []

          await expect(
            service.upsertProducts(
              [
                {
                  id: productOne.id,
                  option_value_updates: [
                    {
                      product_option_id: option.id,
                      add: [priorValue.id],
                    },
                  ],
                  variants: [
                    {
                      id: variant.id,
                      title: previousProducts[0].variants[0].title,
                      options: { "opt-title": "val-1" },
                    },
                  ],
                },
              ],
              {
                __type: "MedusaContext",
                variantUpdateCondition: currentState,
                variantUpdateSkippedProductIds: skippedProductIds,
                optionValueUpdateExpectedRestorations: [
                  {
                    product_id: productOne.id,
                    product_option_id: option.id,
                    ...restoration,
                  },
                ],
              } as any
            )
          ).resolves.toBeDefined()

          const reloaded = await service.retrieveProduct(productOne.id, {
            relations: ["options.values", "variants.options"],
          })
          expect(skippedProductIds).toEqual([productOne.id])
          expect(reloaded.variants[0]).toEqual(
            expect.objectContaining({
              title: "forward variant title",
              options: [expect.objectContaining({ value: "val-3" })],
            })
          )
          expect(
            reloaded.options[0].values.some(
              (value) => value.id === priorValue.id
            )
          ).toBe(false)
        })

        it("should lock products before options for option value updates", async () => {
          const option = productOne.options[0]
          const managers = [
            MikroOrmWrapper.forkManager(),
            MikroOrmWrapper.forkManager(),
            MikroOrmWrapper.forkManager(),
          ]
          const observer = MikroOrmWrapper.forkManager()
          let releaseOptionLock!: () => void
          let optionLocked!: () => void
          const holdOptionLock = new Promise<void>((resolve) => {
            releaseOptionLock = resolve
          })
          const optionLockReady = new Promise<void>((resolve) => {
            optionLocked = resolve
          })

          const optionBlocker = managers[0].transactional(async (manager) => {
            await manager
              .getTransactionContext()!
              .raw("select id from product_option where id = ? for update", [
                option.id,
              ])
            optionLocked()
            await holdOptionLock
          })

          await optionLockReady

          let writerPid!: number
          let writerStarted!: () => void
          const writerStart = new Promise<void>((resolve) => {
            writerStarted = resolve
          })
          const writer = managers[1].transactional(async (manager) => {
            const backend = await manager
              .getTransactionContext()!
              .raw("select pg_backend_pid() as pid")
            writerPid = backend.rows[0].pid
            writerStarted()
            await service.updateProductOptionValuesOnProduct(
              {
                product_id: productOne.id,
                product_option_id: option.id,
                add: [{ value: "lock-order-value" }],
              },
              { manager, transactionManager: manager }
            )
          })

          await writerStart

          let waitedOnOption = false
          for (let attempt = 0; attempt < 100; attempt++) {
            const [activity] = await observer
              .getConnection()
              .execute<{ wait_event_type: string | null }[]>(
                "select wait_event_type from pg_stat_activity where pid = ?",
                [writerPid]
              )
            if (activity?.wait_event_type === "Lock") {
              waitedOnOption = true
              break
            }
            await setTimeout(20)
          }

          const productLock = await Promise.allSettled([
            managers[2].transactional(async (manager) => {
              await manager
                .getTransactionContext()!
                .raw("select id from product where id = ? for update nowait", [
                  productOne.id,
                ])
            }),
          ])

          releaseOptionLock()
          const results = await Promise.allSettled([optionBlocker, writer])

          expect(waitedOnOption).toBe(true)
          expect(productLock[0]).toEqual(
            expect.objectContaining({ status: "rejected" })
          )
          expect(results).toEqual([
            expect.objectContaining({ status: "fulfilled" }),
            expect.objectContaining({ status: "fulfilled" }),
          ])
        })

        it("should lock options before deleting option value links", async () => {
          const option = productOne.options[0]
          const managers = [
            MikroOrmWrapper.forkManager(),
            MikroOrmWrapper.forkManager(),
            MikroOrmWrapper.forkManager(),
          ]
          const observer = MikroOrmWrapper.forkManager()
          const [valueLink] = await observer
            .getConnection()
            .execute<{ id: string }[]>(
              `select ppov.id
             from product_product_option_value ppov
             join product_product_option ppo
               on ppo.id = ppov.product_product_option_id
             where ppo.product_id = ?
               and ppo.product_option_id = ?
               and ppov.deleted_at is null
             limit 1`,
              [productOne.id, option.id]
            )
          let releaseOptionLock!: () => void
          let optionLocked!: () => void
          const holdOptionLock = new Promise<void>((resolve) => {
            releaseOptionLock = resolve
          })
          const optionLockReady = new Promise<void>((resolve) => {
            optionLocked = resolve
          })

          const optionBlocker = managers[0].transactional(async (manager) => {
            await manager
              .getTransactionContext()!
              .raw("select id from product_option where id = ? for update", [
                option.id,
              ])
            optionLocked()
            await holdOptionLock
          })

          await optionLockReady

          let unlinkPid!: number
          let unlinkStarted!: () => void
          const unlinkStart = new Promise<void>((resolve) => {
            unlinkStarted = resolve
          })
          const unlink = managers[1].transactional(async (manager) => {
            const backend = await manager
              .getTransactionContext()!
              .raw("select pg_backend_pid() as pid")
            unlinkPid = backend.rows[0].pid
            unlinkStarted()
            await service.updateProducts(
              productOne.id,
              { option_ids: [], variants: [] },
              { manager, transactionManager: manager }
            )
          })

          await unlinkStart

          let waitedOnOption = false
          for (let attempt = 0; attempt < 100; attempt++) {
            const [activity] = await observer
              .getConnection()
              .execute<{ wait_event_type: string | null }[]>(
                "select wait_event_type from pg_stat_activity where pid = ?",
                [unlinkPid]
              )
            if (activity?.wait_event_type === "Lock") {
              waitedOnOption = true
              break
            }
            await setTimeout(20)
          }

          const pivotLock = await Promise.allSettled([
            managers[2].transactional(async (manager) => {
              await manager
                .getTransactionContext()!
                .raw(
                  "select id from product_product_option_value where id = ? for update nowait",
                  [valueLink.id]
                )
            }),
          ])

          releaseOptionLock()
          const results = await Promise.allSettled([optionBlocker, unlink])

          expect(waitedOnOption).toBe(true)
          expect(pivotLock[0]).toEqual(
            expect.objectContaining({ status: "fulfilled" })
          )
          expect(results).toEqual([
            expect.objectContaining({ status: "fulfilled" }),
            expect.objectContaining({ status: "fulfilled" }),
          ])
        })

        it("should lock every product and option in a mixed update batch upfront", async () => {
          const firstProduct = await service.createProducts({
            title: "mixed lock first",
            options: [{ title: "mixed-first", values: ["one"] }],
            variants: [],
          })
          const secondProduct = await service.createProducts({
            title: "mixed lock second",
            options: [{ title: "mixed-second", values: ["two"] }],
            variants: [],
          })
          const [unlinkProduct, valueUpdateProduct] = [
            firstProduct,
            secondProduct,
          ].sort((left, right) =>
            left.options[0].id.localeCompare(right.options[0].id)
          )
          const unlinkOption = unlinkProduct.options[0]
          const valueUpdateOption = valueUpdateProduct.options[0]
          const managers = [
            MikroOrmWrapper.forkManager(),
            MikroOrmWrapper.forkManager(),
            MikroOrmWrapper.forkManager(),
            MikroOrmWrapper.forkManager(),
          ]
          const observer = MikroOrmWrapper.forkManager()
          let releaseOptionLock!: () => void
          let optionLocked!: () => void
          const holdOptionLock = new Promise<void>((resolve) => {
            releaseOptionLock = resolve
          })
          const optionLockReady = new Promise<void>((resolve) => {
            optionLocked = resolve
          })

          const optionBlocker = managers[0].transactional(async (manager) => {
            await manager
              .getTransactionContext()!
              .raw("select id from product_option where id = ? for update", [
                valueUpdateOption.id,
              ])
            optionLocked()
            await holdOptionLock
          })

          await optionLockReady

          let batchPid!: number
          let batchStarted!: () => void
          const batchStart = new Promise<void>((resolve) => {
            batchStarted = resolve
          })
          const batch = managers[1].transactional(async (manager) => {
            const backend = await manager
              .getTransactionContext()!
              .raw("select pg_backend_pid() as pid")
            batchPid = backend.rows[0].pid
            batchStarted()
            await service.upsertProducts(
              [
                {
                  id: valueUpdateProduct.id,
                  option_value_updates: [
                    {
                      product_option_id: valueUpdateOption.id,
                      add: [{ value: "three" }],
                    },
                  ],
                  variants: [],
                },
                { id: unlinkProduct.id, option_ids: [] },
              ],
              { manager, transactionManager: manager }
            )
          })

          await batchStart

          let waitedOnOption = false
          for (let attempt = 0; attempt < 100; attempt++) {
            const [activity] = await observer
              .getConnection()
              .execute<{ wait_event_type: string | null }[]>(
                "select wait_event_type from pg_stat_activity where pid = ?",
                [batchPid]
              )
            if (activity?.wait_event_type === "Lock") {
              waitedOnOption = true
              break
            }
            await setTimeout(20)
          }

          const omittedLocks = await Promise.allSettled([
            managers[2].transactional(async (manager) => {
              await manager
                .getTransactionContext()!
                .raw("select id from product where id = ? for update nowait", [
                  unlinkProduct.id,
                ])
            }),
            managers[3].transactional(async (manager) => {
              await manager
                .getTransactionContext()!
                .raw(
                  "select id from product_option where id = ? for update nowait",
                  [unlinkOption.id]
                )
            }),
          ])

          releaseOptionLock()
          const results = await Promise.allSettled([optionBlocker, batch])

          expect(waitedOnOption).toBe(true)
          expect(omittedLocks).toEqual([
            expect.objectContaining({ status: "rejected" }),
            expect.objectContaining({ status: "rejected" }),
          ])
          expect(results).toEqual([
            expect.objectContaining({ status: "fulfilled" }),
            expect.objectContaining({ status: "fulfilled" }),
          ])
        })

        it("should lock crossed upsert variant batches in one sorted set", async () => {
          await service.updateProductOptionValuesOnProduct({
            product_id: productOne.id,
            product_option_id: productOne.options[0].id,
            add: [{ value: "val-3" }],
          })

          const managers = [
            MikroOrmWrapper.forkManager(),
            MikroOrmWrapper.forkManager(),
          ]
          const connection = MikroOrmWrapper.forkManager().getConnection()
          await connection.execute(`
            create or replace function test_delay_crossed_variant_insert()
            returns trigger as $$
            begin
              if new.title like 'crossed-lock-%' then
                perform pg_sleep(0.5);
              end if;
              return new;
            end;
            $$ language plpgsql;
            drop trigger if exists test_delay_crossed_variant_insert on product_variant;
            create trigger test_delay_crossed_variant_insert
              before insert on product_variant
              for each row execute function test_delay_crossed_variant_insert();
          `)

          let ready = 0
          let releaseBatches!: () => void
          const batchGate = new Promise<void>((resolve) => {
            releaseBatches = resolve
          })
          const waitForBothBatches = async () => {
            ready++
            if (ready === 2) {
              releaseBatches()
            }
            await batchGate
          }

          const firstBatch = managers[0].transactional(async (manager) => {
            await waitForBothBatches()
            await service.upsertProductVariants(
              [
                {
                  product_id: productOne.id,
                  title: "crossed-lock-val-3",
                  options: { "opt-title": "val-3" },
                },
                {
                  id: productTwo.variants[0].id,
                  title: productTwo.variants[0].title,
                  options: { size: "small", color: "blue" },
                },
              ],
              { manager, transactionManager: manager }
            )
          })

          const secondBatch = managers[1].transactional(async (manager) => {
            await waitForBothBatches()
            await service.upsertProductVariants(
              [
                {
                  product_id: productTwo.id,
                  title: "crossed-lock-large-red",
                  options: { size: "large", color: "red" },
                },
                {
                  id: productOne.variants[0].id,
                  title: productOne.variants[0].title,
                  options: { "opt-title": "val-2" },
                },
              ],
              { manager, transactionManager: manager }
            )
          })

          const results = await Promise.allSettled([
            firstBatch,
            secondBatch,
          ]).finally(async () => {
            await connection.execute(`
              drop trigger if exists test_delay_crossed_variant_insert on product_variant;
              drop function if exists test_delay_crossed_variant_insert();
            `)
          })

          expect(results).toEqual([
            expect.objectContaining({ status: "fulfilled" }),
            expect.objectContaining({ status: "fulfilled" }),
          ])
        })

        it("should skip validating a replacement pivot it does not own", async () => {
          const option = productOne.options[0]
          await service.updateProductOptionValuesOnProduct({
            product_id: productOne.id,
            product_option_id: option.id,
            add: [{ value: "val-3" }],
          })

          const product = await service.retrieveProduct(productOne.id, {
            relations: ["options.values"],
          })
          const value = product.options[0].values.find(
            (entry) => entry.value === "val-3"
          )!
          const manager = MikroOrmWrapper.forkManager()
          const [originalLink] = await manager
            .getConnection()
            .execute<{ id: string }[]>(
              `select ppov.id
             from product_product_option_value ppov
             join product_product_option ppo
               on ppo.id = ppov.product_product_option_id
             where ppo.product_id = ?
               and ppo.product_option_id = ?
               and ppov.product_option_value_id = ?
               and ppov.deleted_at is null`,
              [productOne.id, option.id, value.id]
            )

          await service.updateProductOptionValuesOnProduct({
            product_id: productOne.id,
            product_option_id: option.id,
            remove: [value.id],
          })
          await service.updateProductOptionValuesOnProduct({
            product_id: productOne.id,
            product_option_id: option.id,
            add: [value.id],
          })
          await service.updateProductVariants(productOne.variants[0].id, {
            title: productOne.variants[0].title,
            options: { "opt-title": "val-3" },
          })

          await expect(
            service.updateProductOptionValuesOnProduct(
              {
                product_id: productOne.id,
                product_option_id: option.id,
                remove: [value.id],
              },
              {
                optionValueUpdateExpectedRemovals: [
                  {
                    product_id: productOne.id,
                    product_option_id: option.id,
                    value_id: value.id,
                    link_id: originalLink.id,
                  },
                ],
              } as any
            )
          ).resolves.toBeUndefined()

          const reloaded = await service.retrieveProduct(productOne.id, {
            relations: ["options.values", "variants.options"],
          })
          expect(reloaded.options[0].values).toEqual(
            expect.arrayContaining([
              expect.objectContaining({ value: "val-3" }),
            ])
          )
          expect(reloaded.variants[0].options).toEqual([
            expect.objectContaining({ value: "val-3" }),
          ])
        })

        it("should restore the exact removed option value link during compensation", async () => {
          const option = productOne.options[0]
          const value = option.values.find((entry) => entry.value === "val-2")!
          const manager = MikroOrmWrapper.forkManager()
          const [originalLink] = await manager
            .getConnection()
            .execute<{ id: string }[]>(
              `select ppov.id
               from product_product_option_value ppov
               join product_product_option ppo
                 on ppo.id = ppov.product_product_option_id
               where ppo.product_id = ?
                 and ppo.product_option_id = ?
                 and ppov.product_option_value_id = ?
                 and ppov.deleted_at is null`,
              [productOne.id, option.id, value.id]
            )
          const compensation: any[] = []

          await service.updateProductOptionValuesOnProduct(
            {
              product_id: productOne.id,
              product_option_id: option.id,
              remove: [value.id],
            },
            { optionValueUpdateCompensation: compensation } as any
          )

          const removedLinks = await manager
            .getConnection()
            .execute<{ id: string; is_deleted: boolean }[]>(
              `select ppov.id, ppov.deleted_at is not null as is_deleted
               from product_product_option_value ppov
               join product_product_option ppo
                 on ppo.id = ppov.product_product_option_id
               where ppo.product_id = ?
                 and ppo.product_option_id = ?
                 and ppov.product_option_value_id = ?`,
              [productOne.id, option.id, value.id]
            )

          expect(removedLinks).toEqual([
            { id: originalLink.id, is_deleted: true },
          ])
          expect(compensation).toEqual([
            {
              product_id: productOne.id,
              product_option_id: option.id,
              add: [
                {
                  value_id: value.id,
                  link_id: originalLink.id,
                  known_link_ids: [originalLink.id],
                },
              ],
            },
          ])

          await service.updateProductOptionValuesOnProduct(
            {
              product_id: productOne.id,
              product_option_id: option.id,
              add: [value.id],
            },
            {
              optionValueUpdateExpectedRestorations: [
                {
                  product_id: productOne.id,
                  product_option_id: option.id,
                  ...compensation[0].add[0],
                },
              ],
            } as any
          )

          const activeLinks = await manager
            .getConnection()
            .execute<{ id: string }[]>(
              `select ppov.id
               from product_product_option_value ppov
               join product_product_option ppo
                 on ppo.id = ppov.product_product_option_id
               where ppo.product_id = ?
                 and ppo.product_option_id = ?
                 and ppov.product_option_value_id = ?
                 and ppov.deleted_at is null`,
              [productOne.id, option.id, value.id]
            )

          expect(activeLinks).toEqual([{ id: originalLink.id }])
        })

        it("should remove every duplicate active option value link", async () => {
          const option = productOne.options[0]
          const value = option.values.find((entry) => entry.value === "val-2")!
          const manager = MikroOrmWrapper.forkManager()
          const connection = manager.getConnection()
          const [productOption] = await connection.execute<{ id: string }[]>(
            `select id
             from product_product_option
             where product_id = ?
               and product_option_id = ?
               and deleted_at is null`,
            [productOne.id, option.id]
          )
          const duplicateId = `prodoptval_duplicate_${Date.now()}`
          let activeCount: string | undefined

          try {
            await connection.execute(
              `insert into product_product_option_value
                 (id, product_product_option_id, product_option_value_id)
               values (?, ?, ?)`,
              [duplicateId, productOption.id, value.id]
            )
            await service.updateProductOptionValuesOnProduct({
              product_id: productOne.id,
              product_option_id: option.id,
              remove: [value.id],
            })
            const [result] = await connection.execute<{ count: string }[]>(
              `select count(*)::text as count
               from product_product_option_value
               where product_product_option_id = ?
                 and product_option_value_id = ?
                 and deleted_at is null`,
              [productOption.id, value.id]
            )
            activeCount = result.count
          } finally {
            await connection.execute(
              `delete from product_product_option_value
               where product_product_option_id = ?
                 and product_option_value_id = ?`,
              [productOption.id, value.id]
            )
          }

          expect(activeCount).toBe("0")
        })

        it("should reject linking an option after its concurrent soft deletion", async () => {
          const option = await service.createProductOptions({
            title: "Concurrent option deletion",
            values: ["value"],
            is_exclusive: false,
          })
          const managers = [
            MikroOrmWrapper.forkManager(),
            MikroOrmWrapper.forkManager(),
          ]
          const observer = MikroOrmWrapper.forkManager()
          await observer.getConnection().execute(`
            create or replace function test_delay_option_soft_delete()
            returns trigger as $$
            begin
              perform pg_sleep(2);
              return new;
            end;
            $$ language plpgsql;
            drop trigger if exists test_delay_option_soft_delete on product_option;
            create trigger test_delay_option_soft_delete
              before update of deleted_at on product_option
              for each row
              when (new.deleted_at is not null and old.deleted_at is null)
              execute function test_delay_option_soft_delete();
          `)

          let deletionPid!: number
          let deletionStarted!: () => void
          const deletionStart = new Promise<void>((resolve) => {
            deletionStarted = resolve
          })
          const deletion = managers[0].transactional(async (manager) => {
            const backend = await manager
              .getTransactionContext()!
              .raw("select pg_backend_pid() as pid")
            deletionPid = backend.rows[0].pid
            deletionStarted()
            await (service as any).softDeleteProductOptions(
              option.id,
              undefined,
              { manager, transactionManager: manager }
            )
          })

          try {
            await deletionStart
            let reachedDelete = false
            for (let attempt = 0; attempt < 100; attempt++) {
              const [activity] = await observer
                .getConnection()
                .execute<{ wait_event: string | null }[]>(
                  "select wait_event from pg_stat_activity where pid = ?",
                  [deletionPid]
                )
              if (activity?.wait_event === "PgSleep") {
                reachedDelete = true
                break
              }
              await setTimeout(20)
            }

            const link = managers[1].transactional(async (manager) => {
              await service.addProductOptionToProduct(
                {
                  product_id: productOne.id,
                  product_option_id: option.id,
                },
                { manager, transactionManager: manager }
              )
            })
            const results = await Promise.allSettled([deletion, link])
            const [activeLink] = await observer
              .getConnection()
              .execute<{ count: string }[]>(
                `select count(*)::text as count
               from product_product_option
               where product_id = ?
                 and product_option_id = ?
                 and deleted_at is null`,
                [productOne.id, option.id]
              )

            expect(reachedDelete).toBe(true)
            expect(results).toEqual([
              expect.objectContaining({ status: "fulfilled" }),
              expect.objectContaining({ status: "rejected" }),
            ])
            expect(activeLink.count).toBe("0")
          } finally {
            await observer.getConnection().execute(`
              drop trigger if exists test_delay_option_soft_delete on product_option;
              drop function if exists test_delay_option_soft_delete();
            `)
          }
        })

        it("should reject linking an option value after its concurrent soft deletion", async () => {
          const option = await service.createProductOptions({
            title: "Concurrent option value deletion",
            values: ["linked", "unlinked"],
            is_exclusive: false,
          })
          const linkedValue = option.values.find(
            (value) => value.value === "linked"
          )!
          const deletedValue = option.values.find(
            (value) => value.value === "unlinked"
          )!
          await service.addProductOptionToProduct({
            product_id: productOne.id,
            product_option_id: option.id,
            product_option_value_ids: [linkedValue.id],
          })

          const managers = [
            MikroOrmWrapper.forkManager(),
            MikroOrmWrapper.forkManager(),
          ]
          const observer = MikroOrmWrapper.forkManager()
          await observer.getConnection().execute(`
            create or replace function test_delay_option_value_soft_delete()
            returns trigger as $$
            begin
              perform pg_sleep(2);
              return new;
            end;
            $$ language plpgsql;
            drop trigger if exists test_delay_option_value_soft_delete on product_option_value;
            create trigger test_delay_option_value_soft_delete
              before update of deleted_at on product_option_value
              for each row
              when (new.deleted_at is not null and old.deleted_at is null)
              execute function test_delay_option_value_soft_delete();
          `)

          let deletionPid!: number
          let deletionStarted!: () => void
          const deletionStart = new Promise<void>((resolve) => {
            deletionStarted = resolve
          })
          const deletion = managers[0].transactional(async (manager) => {
            const backend = await manager
              .getTransactionContext()!
              .raw("select pg_backend_pid() as pid")
            deletionPid = backend.rows[0].pid
            deletionStarted()
            await (service as any).softDeleteProductOptionValues(
              deletedValue.id,
              undefined,
              { manager, transactionManager: manager }
            )
          })

          try {
            await deletionStart
            let reachedDelete = false
            for (let attempt = 0; attempt < 100; attempt++) {
              const [activity] = await observer
                .getConnection()
                .execute<{ wait_event: string | null }[]>(
                  "select wait_event from pg_stat_activity where pid = ?",
                  [deletionPid]
                )
              if (activity?.wait_event === "PgSleep") {
                reachedDelete = true
                break
              }
              await setTimeout(20)
            }

            const link = managers[1].transactional(async (manager) => {
              await service.updateProductOptionValuesOnProduct(
                {
                  product_id: productOne.id,
                  product_option_id: option.id,
                  add: [deletedValue.id],
                },
                { manager, transactionManager: manager }
              )
            })
            const results = await Promise.allSettled([deletion, link])
            const [activeLink] = await observer
              .getConnection()
              .execute<{ count: string }[]>(
                `select count(*)::text as count
               from product_product_option_value ppov
               join product_product_option ppo
                 on ppo.id = ppov.product_product_option_id
               where ppo.product_id = ?
                 and ppo.product_option_id = ?
                 and ppov.product_option_value_id = ?
                 and ppov.deleted_at is null`,
                [productOne.id, option.id, deletedValue.id]
              )

            expect(reachedDelete).toBe(true)
            expect(results).toEqual([
              expect.objectContaining({ status: "fulfilled" }),
              expect.objectContaining({ status: "rejected" }),
            ])
            expect(activeLink.count).toBe("0")
          } finally {
            await observer.getConnection().execute(`
              drop trigger if exists test_delay_option_value_soft_delete on product_option_value;
              drop function if exists test_delay_option_value_soft_delete();
            `)
          }
        })

        it("should preserve a concurrently changed value during guarded rollback deletion", async () => {
          const option = await service.createProductOptions({
            title: "Guarded rollback value",
            values: ["created"],
            is_exclusive: false,
          })
          const value = option.values[0]

          await service.updateProductOptionValues(value.id, {
            value: "concurrent edit",
          })
          await service.softDeleteProductOptionValues([value.id], undefined, {
            optionValueUpdateExpectedDeletions: [
              {
                id: value.id,
                option_id: option.id,
                updated_at: new Date(value.updated_at).toISOString(),
              },
            ],
          } as any)

          expect(await service.retrieveProductOptionValue(value.id)).toEqual(
            expect.objectContaining({ value: "concurrent edit" })
          )
        })

        it("should preserve an option value edit racing guarded rollback deletion", async () => {
          const option = await service.createProductOptions({
            title: "Racing guarded rollback value",
            values: ["created"],
            is_exclusive: false,
          })
          const value = option.values[0]
          const managers = [
            MikroOrmWrapper.forkManager(),
            MikroOrmWrapper.forkManager(),
          ]
          const observer = MikroOrmWrapper.forkManager()

          await observer.getConnection().execute(`
            create or replace function test_delay_guarded_value_edit()
            returns trigger as $$
            begin
              if new.value = 'concurrent guarded edit' then
                perform pg_sleep(2);
              end if;
              return new;
            end;
            $$ language plpgsql;
            drop trigger if exists test_delay_guarded_value_edit on product_option_value;
            create trigger test_delay_guarded_value_edit
              before update of value on product_option_value
              for each row execute function test_delay_guarded_value_edit();
          `)

          let writerPid!: number
          let writerStarted!: () => void
          const writerStart = new Promise<void>((resolve) => {
            writerStarted = resolve
          })
          const writer = managers[0].transactional(async (manager) => {
            const backend = await manager
              .getTransactionContext()!
              .raw("select pg_backend_pid() as pid")
            writerPid = backend.rows[0].pid
            writerStarted()
            await service.updateProductOptionValues(
              value.id,
              { value: "concurrent guarded edit" },
              { manager, transactionManager: manager }
            )
          })

          try {
            await writerStart
            let reachedValueWrite = false
            for (let attempt = 0; attempt < 100; attempt++) {
              const [activity] = await observer
                .getConnection()
                .execute<{ wait_event: string | null }[]>(
                  "select wait_event from pg_stat_activity where pid = ?",
                  [writerPid]
                )
              if (activity?.wait_event === "PgSleep") {
                reachedValueWrite = true
                break
              }
              await setTimeout(20)
            }

            const deletion = managers[1].transactional(async (manager) => {
              await service.softDeleteProductOptionValues(
                [value.id],
                undefined,
                {
                  manager,
                  transactionManager: manager,
                  optionValueUpdateExpectedDeletions: [
                    {
                      id: value.id,
                      option_id: option.id,
                      updated_at: new Date(value.updated_at).toISOString(),
                    },
                  ],
                } as any
              )
            })

            const results = await Promise.allSettled([writer, deletion])
            const reloaded = await service.retrieveProductOptionValue(value.id)

            expect(reachedValueWrite).toBe(true)
            expect(results).toEqual([
              expect.objectContaining({ status: "fulfilled" }),
              expect.objectContaining({ status: "fulfilled" }),
            ])
            expect(reloaded.value).toBe("concurrent guarded edit")
          } finally {
            await writer.catch(() => undefined)
            await observer.getConnection().execute(`
              drop trigger if exists test_delay_guarded_value_edit on product_option_value;
              drop function if exists test_delay_guarded_value_edit();
            `)
          }
        })

        it("should reject removing an option value still used after the variant update", async () => {
          const option = productOne.options[0]
          const value = option.values.find((entry) => entry.value === "val-1")!

          const error = await service
            .updateProducts(productOne.id, {
              option_value_updates: [
                {
                  product_option_id: option.id,
                  remove: [value.id],
                },
              ],
              variants: [
                {
                  id: productOne.variants[0].id,
                  title: productOne.variants[0].title,
                  options: { "opt-title": "val-1" },
                },
              ],
            })
            .catch((cause) => cause)

          expect(error.message).toContain(
            "Cannot unassign option values from product"
          )
        })

        it("should reject an option value ID from another option", async () => {
          const option = productOne.options[0]
          const otherOption = await service.createProductOptions({
            title: "other-option",
            values: ["foreign-value"],
          })

          const error = await service
            .updateProducts(productOne.id, {
              option_value_updates: [
                {
                  product_option_id: option.id,
                  add: [otherOption.values[0].id],
                },
              ],
              variants: [
                {
                  id: productOne.variants[0].id,
                  title: productOne.variants[0].title,
                  options: { "opt-title": "val-1" },
                },
              ],
            })
            .catch((cause) => cause)

          expect(error.message).toEqual(
            `Product option value ${otherOption.values[0].id} does not belong to option ${option.id}.`
          )
        })

        it("should reject duplicate option value update pairs", async () => {
          const option = productOne.options[0]

          const error = await service
            .updateProducts(productOne.id, {
              option_value_updates: [
                {
                  product_option_id: option.id,
                  add: [{ value: "duplicate-a" }],
                },
                {
                  product_option_id: option.id,
                  add: [{ value: "duplicate-b" }],
                },
              ],
              variants: [
                {
                  id: productOne.variants[0].id,
                  title: productOne.variants[0].title,
                  options: { "opt-title": "val-1" },
                },
              ],
            })
            .catch((cause) => cause)

          expect(error.message).toEqual(
            `Duplicate product option value update: ${productOne.id}:${option.id}`
          )
        })

        it("should reject one option value ID targeting different options", async () => {
          const option = productOne.options[0]
          const value = option.values.find((entry) => entry.value === "val-1")!
          const otherOption = await service.createProductOptions({
            title: "other-option",
            values: ["foreign-value"],
          })

          await service.updateProducts(productOne.id, {
            option_ids: [option.id, otherOption.id],
            variants: [
              {
                id: productOne.variants[0].id,
                title: productOne.variants[0].title,
                options: {
                  "opt-title": "val-1",
                  "other-option": "foreign-value",
                },
              },
            ],
          })

          const error = await service
            .updateProducts(productOne.id, {
              option_value_updates: [
                {
                  product_option_id: otherOption.id,
                  add: [value.id],
                },
                {
                  product_option_id: option.id,
                  add: [value.id],
                },
              ],
              variants: [
                {
                  id: productOne.variants[0].id,
                  title: productOne.variants[0].title,
                  options: {
                    "opt-title": "val-1",
                    "other-option": "foreign-value",
                  },
                },
              ],
            })
            .catch((cause) => cause)

          expect(error.message).toEqual(
            `Product option value ${value.id} cannot target multiple options.`
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

        it("should throw when a variant references an option value outside the product's value_ids subset on create", async () => {
          // Set up a shared global option with three values, then create the
          // product linking only two of them. A variant referencing the third
          // value (still on the option, but not on this product) must be
          // rejected — the per-product `value_ids` subset is enforcing.
          const sharedOption = await service.createProductOptions({
            title: "Subset",
            values: ["sub-a", "sub-b", "sub-c"],
          })
          const allowed = sharedOption.values
            .filter((v) => v.value !== "sub-c")
            .map((v) => v.id)

          const error = await service
            .createProducts([
              {
                title: "Subset violation on create",
                options: [{ id: sharedOption.id, value_ids: allowed }],
                variants: [
                  {
                    title: "out-of-subset variant",
                    options: { Subset: "sub-c" },
                  },
                ],
              },
            ])
            .catch((e) => e)

          expect(error?.message).toEqual(
            "Option value sub-c does not exist for option Subset"
          )
        })

        it("should throw when updating a variant to reference a value outside the product's value_ids subset", async () => {
          // Same fixture as above, but exercising the update path: link the
          // option with a restricted subset, then attempt to flip a variant
          // onto a value the product is not configured for.
          const sharedOption = await service.createProductOptions({
            title: "UpdateSubset",
            values: ["u-a", "u-b", "u-c"],
          })
          const allowed = sharedOption.values
            .filter((v) => v.value !== "u-c")
            .map((v) => v.id)

          const [created] = await service.createProducts([
            {
              title: "Subset violation on update",
              options: [{ id: sharedOption.id, value_ids: allowed }],
              variants: [
                {
                  title: "v1",
                  options: { UpdateSubset: "u-a" },
                },
              ],
            },
          ])

          const error = await service
            .updateProducts(created.id, {
              variants: [
                {
                  title: "v1",
                  options: { UpdateSubset: "u-c" },
                },
              ],
            })
            .catch((e) => e)

          expect(error?.message).toEqual(
            "Option value u-c does not exist for option UpdateSubset"
          )
        })

        it("should accept a variant value after that value is added to the product's value_ids subset", async () => {
          // Set up: option has 3 values, product is linked to only 2 of them.
          // A variant referencing the third value is initially rejected. After
          // expanding the per-product subset to include the third value, the
          // same variant payload must now succeed.
          const sharedOption = await service.createProductOptions({
            title: "ExpandSubset",
            values: ["e-a", "e-b", "e-c"],
          })
          const valueA = sharedOption.values.find((v) => v.value === "e-a")!
          const valueB = sharedOption.values.find((v) => v.value === "e-b")!
          const valueC = sharedOption.values.find((v) => v.value === "e-c")!

          const [created] = await service.createProducts([
            {
              title: "Expandable subset product",
              options: [
                { id: sharedOption.id, value_ids: [valueA.id, valueB.id] },
              ],
              variants: [{ title: "vA", options: { ExpandSubset: "e-a" } }],
            },
          ])

          // Sanity: variant with the not-yet-allowed value is rejected.
          const initialError = await service
            .updateProducts(created.id, {
              variants: [
                {
                  id: created.variants[0].id,
                  title: "vA",
                  options: { ExpandSubset: "e-c" },
                },
              ],
            })
            .catch((e) => e)
          expect(initialError?.message).toEqual(
            "Option value e-c does not exist for option ExpandSubset"
          )

          // Expand the product's allowed value subset to include the third value.
          await service.updateProductOptionValuesOnProduct({
            product_id: created.id,
            product_option_id: sharedOption.id,
            add: [valueC.id],
          })

          // Same variant update payload that just failed should now succeed.
          await service.updateProducts(created.id, {
            variants: [
              {
                id: created.variants[0].id,
                title: "vA",
                options: { ExpandSubset: "e-c" },
              },
            ],
          })

          const reloaded = await service.retrieveProduct(created.id, {
            relations: ["variants.options", "options.values"],
          })
          const variantValues = reloaded.variants[0].options.map((o) => o.value)
          expect(variantValues).toEqual(["e-c"])
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
              relations: ["variants"],
              withDeleted: true,
            }
          )

          expect(deletedProducts).toHaveLength(1)
          expect(deletedProducts[0].deleted_at).not.toBeNull()

          for (const variant of deletedProducts[0].variants) {
            expect(variant.deleted_at).not.toBeNull()
          }
        })

        it("should not soft delete a product's options and option values", async () => {
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

          for (const option of deletedProducts[0].options) {
            expect(option.deleted_at).toBeNull()
          }

          const productOptionsValues = deletedProducts[0].options
            .map((o) => o.values)
            .flat()

          for (const optionValue of productOptionsValues) {
            expect(optionValue.deleted_at).toBeNull()
          }

          const variantsOptions = deletedProducts[0].options
            .map((o) => o.values)
            .flat()

          for (const option of variantsOptions) {
            expect(option.deleted_at).toBeNull()
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

        it("should return variant.images as plain serialized objects, not ORM entities", async () => {
          // variant.images is attached dynamically by buildVariantImagesFromProduct
          // before serialization. If serialization misses it, live MikroORM
          // entities leak out of the module and their toJSON re-serializes the
          // entire loaded entity graph downstream (res.json, cache writes),
          // blocking the event loop.
          const images = [
            { url: "general-image-1" },
            { url: "variant-specific-image" },
          ]

          const [product] = await service.createProducts([
            buildProductAndRelationsData({
              images,
              options: [{ title: "size", values: ["small"] }],
              variants: [{ title: "Small", options: { size: "small" } }],
            }),
          ])

          const variantSpecificImage = product.images.find(
            (img) => img.url === "variant-specific-image"
          )!

          await service.addImageToVariant([
            {
              image_id: variantSpecificImage.id,
              variant_id: product.variants[0].id,
            },
          ])

          const assertPlainObjects = (variants: any[]) => {
            for (const variant of variants) {
              expect(variant.images.length).toBeGreaterThan(0)
              for (const image of variant.images) {
                expect(image.constructor).toBe(Object)
                expect(image.__meta).toBeUndefined()
                expect(image.__helper).toBeUndefined()
              }
            }
          }

          const retrievedProduct = await service.retrieveProduct(product.id, {
            relations: ["variants", "variants.images", "images"],
          })
          assertPlainObjects(retrievedProduct.variants)

          const listedProducts = await service.listProducts(
            { id: product.id },
            { relations: ["variants", "variants.images", "images"] }
          )
          assertPlainObjects(listedProducts[0].variants)

          const [listedAndCountedProducts] = await service.listAndCountProducts(
            { id: product.id },
            { relations: ["variants", "variants.images", "images"] }
          )
          assertPlainObjects(listedAndCountedProducts[0].variants)
        })
      })
    })
  },
})

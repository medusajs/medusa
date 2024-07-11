import { IProductModuleService } from "@medusajs/types"
import { Modules, ProductStatus } from "@medusajs/utils"
import { Product, ProductCollection } from "@models"
import {
  MockEventBusService,
  moduleIntegrationTestRunner,
} from "medusa-test-utils"
import { createCollections } from "../../__fixtures__/product"

jest.setTimeout(30000)

moduleIntegrationTestRunner<IProductModuleService>({
  moduleName: Modules.PRODUCT,
  injectedDependencies: {
    eventBusModuleService: new MockEventBusService(),
  },
  testSuite: ({ MikroOrmWrapper, service }) => {
    describe("ProductModuleService product collections", () => {
      let productOne: Product
      let productTwo: Product
      let productCollectionOne: ProductCollection
      let productCollectionTwo: ProductCollection
      let productCollections: ProductCollection[]

      beforeEach(async () => {
        const testManager = await MikroOrmWrapper.forkManager()

        productOne = testManager.create(Product, {
          id: "product-1",
          title: "product 1",
          status: ProductStatus.PUBLISHED,
        })

        productTwo = testManager.create(Product, {
          id: "product-2",
          title: "product 2",
          status: ProductStatus.PUBLISHED,
        })

        const productCollectionsData = [
          {
            id: "test-1",
            title: "collection 1",
            products: [productOne],
          },
          {
            id: "test-2",
            title: "collection",
            products: [productTwo],
          },
        ]

        productCollections = await createCollections(
          testManager,
          productCollectionsData
        )

        productCollectionOne = productCollections[0]
        productCollectionTwo = productCollections[1]
      })

      afterEach(async () => {
        jest.clearAllMocks()
      })

      describe("listCollections", () => {
        it("should return collections queried by ID", async () => {
          const results = await service.listProductCollections({
            id: productCollectionOne.id,
          })

          expect(results).toEqual([
            expect.objectContaining({
              id: productCollectionOne.id,
            }),
          ])
        })

        it("should return collections based on the options and filter parameter", async () => {
          let results = await service.listProductCollections(
            {
              id: productCollectionOne.id,
            },
            {
              take: 1,
            }
          )

          expect(results).toEqual([
            expect.objectContaining({
              id: productCollectionOne.id,
            }),
          ])

          results = await service.listProductCollections(
            {},
            { take: 1, skip: 1 }
          )

          expect(results).toEqual([
            expect.objectContaining({
              id: productCollectionTwo.id,
            }),
          ])
        })

        it("should return only requested fields and relations for collections", async () => {
          const results = await service.listProductCollections(
            {
              id: productCollectionOne.id,
            },
            {
              select: ["id", "title", "products.title"],
              relations: ["products"],
            }
          )

          expect(results).toEqual([
            expect.objectContaining({
              id: "test-1",
              title: "collection 1",
              products: [
                expect.objectContaining({
                  id: "product-1",
                  title: "product 1",
                }),
              ],
            }),
          ])
        })
      })

      describe("listAndCountCollections", () => {
        it("should return collections and count queried by ID", async () => {
          const results = await service.listAndCountProductCollections({
            id: productCollectionOne.id,
          })

          expect(results[1]).toEqual(1)
          expect(results[0]).toEqual([
            expect.objectContaining({
              id: productCollectionOne.id,
            }),
          ])
        })

        it("should return collections and count based on the options and filter parameter", async () => {
          let results = await service.listAndCountProductCollections(
            {
              id: productCollectionOne.id,
            },
            {
              take: 1,
            }
          )

          expect(results[1]).toEqual(1)
          expect(results[0]).toEqual([
            expect.objectContaining({
              id: productCollectionOne.id,
            }),
          ])

          results = await service.listAndCountProductCollections(
            {},
            { take: 1 }
          )

          expect(results[1]).toEqual(2)

          results = await service.listAndCountProductCollections(
            {},
            { take: 1, skip: 1 }
          )

          expect(results[1]).toEqual(2)
          expect(results[0]).toEqual([
            expect.objectContaining({
              id: productCollectionTwo.id,
            }),
          ])
        })

        it("should return only requested fields and relations for collections", async () => {
          const results = await service.listAndCountProductCollections(
            {
              id: productCollectionOne.id,
            },
            {
              select: ["id", "title", "products.title"],
              relations: ["products"],
            }
          )

          expect(results[1]).toEqual(1)
          expect(results[0]).toEqual([
            expect.objectContaining({
              id: "test-1",
              title: "collection 1",
              products: [
                expect.objectContaining({
                  id: "product-1",
                  title: "product 1",
                }),
              ],
            }),
          ])
        })
      })

      describe("retrieveCollection", () => {
        it("should return the requested collection", async () => {
          const result = await service.retrieveProductCollection(
            productCollectionOne.id
          )

          expect(result).toEqual(
            expect.objectContaining({
              id: "test-1",
              title: "collection 1",
            })
          )
        })

        it("should return requested attributes when requested through config", async () => {
          const result = await service.retrieveProductCollection(
            productCollectionOne.id,
            {
              select: ["id", "title", "products.title"],
              relations: ["products"],
            }
          )

          expect(result).toEqual(
            expect.objectContaining({
              id: "test-1",
              title: "collection 1",
              products: [
                expect.objectContaining({
                  id: "product-1",
                  title: "product 1",
                }),
              ],
            })
          )
        })

        it("should throw an error when a collection with ID does not exist", async () => {
          let error

          try {
            await service.retrieveProductCollection("does-not-exist")
          } catch (e) {
            error = e
          }

          expect(error.message).toEqual(
            "ProductCollection with id: does-not-exist was not found"
          )
        })
      })

      describe("deleteCollections", () => {
        const collectionId = "test-1"

        it("should delete the product collection given an ID successfully", async () => {
          await service.deleteProductCollections([collectionId])

          const collections = await service.listProductCollections({
            id: collectionId,
          })

          expect(collections).toHaveLength(0)
        })

        it("should emit events through event bus", async () => {
          const eventBusSpy = jest.spyOn(MockEventBusService.prototype, "emit")
          await service.deleteProductCollections([collectionId])

          expect(eventBusSpy).toHaveBeenCalledTimes(1)
          expect(eventBusSpy).toHaveBeenCalledWith([
            {
              eventName: "product-collection.deleted",
              data: { id: collectionId },
              metadata: {
                action: "",
                object: "",
                source: "",
              },
            },
          ])
        })
      })

      describe("updateCollections", () => {
        const collectionId = "test-1"

        it("should emit events through event bus", async () => {
          const eventBusSpy = jest.spyOn(MockEventBusService.prototype, "emit")

          await service.upsertProductCollections([
            {
              id: collectionId,
              title: "New Collection",
            },
          ])

          expect(eventBusSpy).toHaveBeenCalledTimes(1)
          expect(eventBusSpy).toHaveBeenCalledWith([
            {
              data: { id: collectionId },
              eventName: "product-collection.updated",
            },
          ])
        })

        it("should update the value of the collection successfully", async () => {
          await service.upsertProductCollections([
            {
              id: collectionId,
              title: "New Collection",
            },
          ])

          const productCollection = await service.retrieveProductCollection(
            collectionId
          )

          expect(productCollection.title).toEqual("New Collection")
        })

        it("should add products to a collection successfully", async () => {
          await service.upsertProductCollections([
            {
              id: collectionId,
              product_ids: [productOne.id, productTwo.id],
            },
          ])

          const productCollection = await service.retrieveProductCollection(
            collectionId,
            {
              select: ["products.id"],
              relations: ["products"],
            }
          )

          expect(productCollection.products).toHaveLength(2)
          expect(productCollection).toEqual(
            expect.objectContaining({
              products: expect.arrayContaining([
                expect.objectContaining({
                  id: productOne.id,
                }),
                expect.objectContaining({
                  id: productTwo.id,
                }),
              ]),
            })
          )
        })

        it("should throw an error when an id does not exist", async () => {
          let error

          try {
            await service.updateProductCollections("does-not-exist", {
              title: "New Collection",
            })
          } catch (e) {
            error = e
          }

          expect(error.message).toEqual(
            "ProductCollection with id: does-not-exist was not found"
          )
        })

        it("should dissociate existing products when new products are synced", async () => {
          await service.upsertProductCollections([
            {
              id: collectionId,
              product_ids: [productOne.id, productTwo.id],
            },
          ])

          /**
           * Another upsert should remove the first productOne
           */
          await service.upsertProductCollections([
            {
              id: collectionId,
              product_ids: [productTwo.id],
            },
          ])

          const productCollection = await service.retrieveProductCollection(
            collectionId,
            {
              select: ["products.id"],
              relations: ["products"],
            }
          )

          expect(productCollection.products).toHaveLength(1)
          expect(productCollection).toEqual(
            expect.objectContaining({
              products: expect.arrayContaining([
                expect.objectContaining({
                  id: productTwo.id,
                }),
              ]),
            })
          )
        })

        it("should dissociate all existing products", async () => {
          await service.upsertProductCollections([
            {
              id: collectionId,
              product_ids: [productOne.id, productTwo.id],
            },
          ])

          /**
           * Another upsert should remove the first productOne
           */
          await service.upsertProductCollections([
            {
              id: collectionId,
              product_ids: [],
            },
          ])

          const productCollection = await service.retrieveProductCollection(
            collectionId,
            {
              select: ["products.id"],
              relations: ["products"],
            }
          )

          expect(productCollection.products).toHaveLength(0)
        })
      })

      describe("createCollections", () => {
        it("should create a collection successfully", async () => {
          const res = await service.createProductCollections([
            {
              title: "New Collection",
            },
          ])

          const [productCollection] = await service.listProductCollections({
            title: "New Collection",
          })

          expect(productCollection.title).toEqual("New Collection")
        })

        it("should create collection with products successfully", async () => {
          await service.createProductCollections([
            {
              title: "New Collection with products",
              handle: "new-collection-with-products",
              product_ids: [productOne.id, productTwo.id],
            },
          ])

          const [productCollection] = await service.listProductCollections(
            {
              handle: "new-collection-with-products",
            },
            {
              select: ["title", "handle", "products.id"],
              relations: ["products"],
            }
          )

          expect(productCollection).toEqual(
            expect.objectContaining({
              title: "New Collection with products",
              handle: "new-collection-with-products",
              products: [
                expect.objectContaining({
                  id: productOne.id,
                }),
                expect.objectContaining({
                  id: productTwo.id,
                }),
              ],
            })
          )
        })

        it("should emit events through event bus", async () => {
          const eventBusSpy = jest.spyOn(MockEventBusService.prototype, "emit")

          const collections = await service.createProductCollections([
            { title: "New Collection" },
          ])

          expect(eventBusSpy).toHaveBeenCalledTimes(1)
          expect(eventBusSpy).toHaveBeenCalledWith([
            {
              data: { id: collections[0].id },
              eventName: "product-collection.created",
            },
          ])
        })
      })
    })
  },
})

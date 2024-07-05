import { ProductCollectionService } from "@services"

import { createCollections } from "../../../__fixtures__/product"
import { Modules } from "@medusajs/modules-sdk"
import { moduleIntegrationTestRunner, SuiteOptions } from "medusa-test-utils"
import { IProductModuleService } from "@medusajs/types"

jest.setTimeout(30000)

moduleIntegrationTestRunner({
  moduleName: Modules.PRODUCT,
  testSuite: ({
    MikroOrmWrapper,
    medusaApp,
  }: SuiteOptions<IProductModuleService>) => {
    describe("Product collection Service", () => {
      let service: ProductCollectionService

      beforeEach(() => {
        service = medusaApp.modules["productService"].productCollectionService_
      })

      describe("list", () => {
        const data = [
          {
            id: "test-1",
            title: "col 1",
          },
          {
            id: "test-2",
            title: "col 2",
          },
          {
            id: "test-3",
            title: "col 3 extra",
          },
          {
            id: "test-4",
            title: "col 4 extra",
          },
        ]

        beforeEach(async () => {
          await createCollections(MikroOrmWrapper.forkManager(), data)
        })

        it("list product collections", async () => {
          const productCollectionResults = await service.list()

          expect(productCollectionResults).toEqual([
            expect.objectContaining({
              id: "test-1",
              title: "col 1",
            }),
            expect.objectContaining({
              id: "test-2",
              title: "col 2",
            }),
            expect.objectContaining({
              id: "test-3",
              title: "col 3 extra",
            }),
            expect.objectContaining({
              id: "test-4",
              title: "col 4 extra",
            }),
          ])
        })

        it("list product collections by id", async () => {
          const productCollectionResults = await service.list({
            id: data![0].id,
          })

          expect(productCollectionResults).toEqual([
            expect.objectContaining({
              id: "test-1",
              title: "col 1",
            }),
          ])
        })

        it("list product collections by title matching string", async () => {
          const productCollectionResults = await service.list({
            title: "col 3 extra",
          })

          expect(productCollectionResults).toEqual([
            expect.objectContaining({
              id: "test-3",
              title: "col 3 extra",
            }),
          ])
        })
      })

      describe("listAndCount", () => {
        const data = [
          {
            id: "test-1",
            title: "col 1",
          },
          {
            id: "test-2",
            title: "col 2",
          },
          {
            id: "test-3",
            title: "col 3 extra",
          },
          {
            id: "test-4",
            title: "col 4 extra",
          },
        ]

        beforeEach(async () => {
          await createCollections(MikroOrmWrapper.forkManager(), data)
        })

        it("should return all collections and count", async () => {
          const [productCollectionResults, count] = await service.listAndCount()
          const serialized = JSON.parse(
            JSON.stringify(productCollectionResults)
          )

          expect(serialized).toEqual([
            expect.objectContaining({
              id: "test-1",
              title: "col 1",
            }),
            expect.objectContaining({
              id: "test-2",
              title: "col 2",
            }),
            expect.objectContaining({
              id: "test-3",
              title: "col 3 extra",
            }),
            expect.objectContaining({
              id: "test-4",
              title: "col 4 extra",
            }),
          ])
        })

        it("should return count and collections based on filter data", async () => {
          const [productCollectionResults, count] = await service.listAndCount({
            id: data![0].id,
          })
          const serialized = JSON.parse(
            JSON.stringify(productCollectionResults)
          )

          expect(count).toEqual(1)
          expect(serialized).toEqual([
            expect.objectContaining({
              id: "test-1",
              title: "col 1",
            }),
          ])
        })

        it("should return count and collections based on config data", async () => {
          const [productCollectionResults, count] = await service.listAndCount(
            {},
            {
              relations: ["products"],
              select: ["title"],
              take: 1,
              skip: 1,
            }
          )
          const serialized = JSON.parse(
            JSON.stringify(productCollectionResults)
          )

          expect(count).toEqual(4)
          expect(serialized).toEqual([
            {
              id: "test-2",
              title: "col 2",
              handle: "col-2",
              products: [],
            },
          ])
        })
      })

      describe("retrieve", () => {
        const collectionData = {
          id: "collection-1",
          title: "collection 1",
        }

        beforeEach(async () => {
          await createCollections(MikroOrmWrapper.forkManager(), [
            collectionData,
          ])
        })

        it("should return collection for the given id", async () => {
          const productCollectionResults = await service.retrieve(
            collectionData.id
          )

          expect(productCollectionResults).toEqual(
            expect.objectContaining({
              id: collectionData.id,
            })
          )
        })

        it("should throw an error when collection with id does not exist", async () => {
          let error

          try {
            await service.retrieve("does-not-exist")
          } catch (e) {
            error = e
          }

          expect(error.message).toEqual(
            "ProductCollection with id: does-not-exist was not found"
          )
        })

        it("should throw an error when an id is not provided", async () => {
          let error

          try {
            await service.retrieve(undefined as unknown as string)
          } catch (e) {
            error = e
          }

          expect(error.message).toEqual(
            "productCollection - id must be defined"
          )
        })

        it("should return collection based on config select param", async () => {
          const productCollectionResults = await service.retrieve(
            collectionData.id,
            {
              select: ["id", "title"],
            }
          )

          const serialized = JSON.parse(
            JSON.stringify(productCollectionResults)
          )

          expect(serialized).toEqual({
            id: collectionData.id,
            title: collectionData.title,
            handle: "collection-1",
          })
        })

        it("should return collection based on config relation param", async () => {
          const productCollectionResults = await service.retrieve(
            collectionData.id,
            {
              select: ["id", "title"],
              relations: ["products"],
            }
          )

          const serialized = JSON.parse(
            JSON.stringify(productCollectionResults)
          )

          expect(serialized).toEqual({
            id: collectionData.id,
            title: collectionData.title,
            handle: "collection-1",
            products: [],
          })
        })
      })

      describe("delete", () => {
        const collectionId = "collection-1"
        const collectionData = {
          id: collectionId,
          title: "collection 1",
        }

        beforeEach(async () => {
          await createCollections(MikroOrmWrapper.forkManager(), [
            collectionData,
          ])
        })

        it("should delete the product collection given an ID successfully", async () => {
          await service.delete([collectionId])

          const collections = await service.list({
            id: collectionId,
          })

          expect(collections).toHaveLength(0)
        })
      })

      describe("update", () => {
        const collectionId = "collection-1"
        const collectionData = {
          id: collectionId,
          title: "collection 1",
        }

        beforeEach(async () => {
          await createCollections(MikroOrmWrapper.forkManager(), [
            collectionData,
          ])
        })

        it("should update the value of the collection successfully", async () => {
          await service.update([
            {
              id: collectionId,
              title: "New Collection",
            },
          ])

          const productCollection = await service.retrieve(collectionId)

          expect(productCollection.title).toEqual("New Collection")
        })

        it("should throw an error when an id does not exist", async () => {
          let error

          try {
            await service.update([
              {
                id: "does-not-exist",
                title: "New Collection",
              },
            ])
          } catch (e) {
            error = e
          }

          expect(error.message).toEqual(
            'ProductCollection with id "does-not-exist" not found'
          )
        })
      })

      describe("create", () => {
        it("should create a collection successfully", async () => {
          await service.create([
            {
              title: "New Collection",
            },
          ])

          const [productCollection] = await service.list({
            title: "New Collection",
          })

          expect(productCollection.title).toEqual("New Collection")
        })
      })
    })
  },
})

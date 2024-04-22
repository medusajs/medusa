import { Product } from "@models"
import { ProductTagService } from "@services"

import { ProductTypes } from "@medusajs/types"
import { createProductAndTags } from "../../../__fixtures__/product"
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
    describe("ProductTag Service", () => {
      let data!: Product[]
      let service: ProductTagService

      beforeEach(() => {
        service = medusaApp.modules["productService"].productTagService_
      })

      const productsData = [
        {
          id: "test-1",
          title: "product 1",
          status: ProductTypes.ProductStatus.PUBLISHED,
          tags: [
            {
              id: "tag-1",
              value: "France",
            },
          ],
        },
        {
          id: "test-2",
          title: "product",
          status: ProductTypes.ProductStatus.PUBLISHED,
          tags: [
            {
              id: "tag-2",
              value: "Germany",
            },
            {
              id: "tag-3",
              value: "United States",
            },
            {
              id: "tag-4",
              value: "United Kingdom",
            },
          ],
        },
      ]

      beforeEach(async () => {
        data = await createProductAndTags(
          MikroOrmWrapper.forkManager(),
          productsData
        )
      })

      describe("list", () => {
        it("list product tags", async () => {
          const tagsResults = await service.list()

          expect(tagsResults).toEqual([
            expect.objectContaining({
              id: "tag-1",
              value: "France",
            }),
            expect.objectContaining({
              id: "tag-2",
              value: "Germany",
            }),
            expect.objectContaining({
              id: "tag-3",
              value: "United States",
            }),
            expect.objectContaining({
              id: "tag-4",
              value: "United Kingdom",
            }),
          ])
        })

        it("list product tags by id", async () => {
          const tagsResults = await service.list({ id: data[0].tags![0].id })

          expect(tagsResults).toEqual([
            expect.objectContaining({
              id: "tag-1",
              value: "France",
            }),
          ])
        })

        it("list product tags by value matching string", async () => {
          const tagsResults = await service.list({ q: "united kingdom" })

          expect(tagsResults).toEqual([
            expect.objectContaining({
              id: "tag-4",
              value: "United Kingdom",
            }),
          ])
        })
      })

      describe("listAndCount", () => {
        it("should return product tags and count", async () => {
          const [tagsResults, count] = await service.listAndCount()

          expect(count).toEqual(4)
          expect(tagsResults).toEqual([
            expect.objectContaining({
              id: "tag-1",
              value: "France",
            }),
            expect.objectContaining({
              id: "tag-2",
              value: "Germany",
            }),
            expect.objectContaining({
              id: "tag-3",
              value: "United States",
            }),
            expect.objectContaining({
              id: "tag-4",
              value: "United Kingdom",
            }),
          ])
        })

        it("should return product tags and count when filtered", async () => {
          const [tagsResults, count] = await service.listAndCount({
            id: data[0].tags![0].id,
          })

          expect(count).toEqual(1)
          expect(tagsResults).toEqual([
            expect.objectContaining({
              id: "tag-1",
            }),
          ])
        })

        it("should return product tags and count when using skip and take", async () => {
          const [tagsResults, count] = await service.listAndCount(
            {},
            { skip: 1, take: 2 }
          )

          expect(count).toEqual(4)
          expect(tagsResults).toEqual([
            expect.objectContaining({
              id: "tag-2",
            }),
            expect.objectContaining({
              id: "tag-3",
            }),
          ])
        })

        it("should return requested fields and relations", async () => {
          const [tagsResults, count] = await service.listAndCount(
            {},
            {
              take: 1,
              select: ["value", "products.id"],
              relations: ["products"],
            }
          )

          const serialized = JSON.parse(JSON.stringify(tagsResults))

          expect(count).toEqual(4)
          expect(serialized).toEqual([
            expect.objectContaining({
              id: "tag-1",
              products: [
                {
                  id: "test-1",
                  collection_id: null,
                  type_id: null,
                },
              ],
              value: "France",
            }),
          ])
        })
      })

      describe("retrieve", () => {
        const tagId = "tag-1"
        const tagValue = "France"
        const productId = "test-1"

        it("should return tag for the given id", async () => {
          const tag = await service.retrieve(tagId)

          expect(tag).toEqual(
            expect.objectContaining({
              id: tagId,
            })
          )
        })

        it("should throw an error when tag with id does not exist", async () => {
          let error

          try {
            await service.retrieve("does-not-exist")
          } catch (e) {
            error = e
          }

          expect(error.message).toEqual(
            "ProductTag with id: does-not-exist was not found"
          )
        })

        it("should throw an error when an id is not provided", async () => {
          let error

          try {
            await service.retrieve(undefined as unknown as string)
          } catch (e) {
            error = e
          }

          expect(error.message).toEqual("productTag - id must be defined")
        })

        it("should return tag based on config select param", async () => {
          const tag = await service.retrieve(tagId, {
            select: ["id", "value"],
          })

          const serialized = JSON.parse(JSON.stringify(tag))

          expect(serialized).toEqual({
            id: tagId,
            value: tagValue,
          })
        })

        it("should return tag based on config relation param", async () => {
          const tag = await service.retrieve(tagId, {
            select: ["id", "value", "products.id"],
            relations: ["products"],
          })

          const serialized = JSON.parse(JSON.stringify(tag))

          expect(serialized).toEqual({
            id: tagId,
            value: tagValue,
            products: [
              expect.objectContaining({
                id: productId,
              }),
            ],
          })
        })
      })

      describe("delete", () => {
        const tagId = "tag-1"

        it("should delete the product tag given an ID successfully", async () => {
          await service.delete([tagId])

          const tags = await service.list({
            id: tagId,
          })

          expect(tags).toHaveLength(0)
        })
      })

      describe("update", () => {
        const tagId = "tag-1"

        it("should update the value of the tag successfully", async () => {
          await service.update([
            {
              id: tagId,
              value: "UK",
            },
          ])

          const productTag = await service.retrieve(tagId)

          expect(productTag.value).toEqual("UK")
        })

        it("should throw an error when an id does not exist", async () => {
          let error

          try {
            await service.update([
              {
                id: "does-not-exist",
                value: "UK",
              },
            ])
          } catch (e) {
            error = e
          }

          expect(error.message).toEqual(
            'ProductTag with id "does-not-exist" not found'
          )
        })
      })

      describe("create", () => {
        it("should create a tag successfully", async () => {
          await service.create([
            {
              value: "UK",
            },
          ])

          const [productTag] = await service.list({
            value: "UK",
          })

          expect(productTag.value).toEqual("UK")
        })
      })
    })
  },
})

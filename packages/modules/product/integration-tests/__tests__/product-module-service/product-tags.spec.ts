import { IProductModuleService } from "@zjedene-medusa/framework/types"
import {
  Modules,
  ProductStatus,
  toMikroORMEntity,
} from "@zjedene-medusa/framework/utils"
import { Product, ProductTag } from "@models"
import {
  moduleIntegrationTestRunner,
} from "@zjedene-medusa/test-utils"

jest.setTimeout(30000)

moduleIntegrationTestRunner<IProductModuleService>({
  moduleName: Modules.PRODUCT,
  testSuite: ({ MikroOrmWrapper, service }) => {

    describe("ProductModuleService product tags", () => {
      let tagOne: ProductTag
      let tagTwo: ProductTag
      let productOne: Product
      let productTwo: Product

      beforeEach(async () => {
        const testManager = await MikroOrmWrapper.forkManager()
        productOne = testManager.create(toMikroORMEntity(Product), {
          id: "product-1",
          title: "product 1",
          handle: "product-1",
          status: ProductStatus.PUBLISHED,
        })

        productTwo = testManager.create(toMikroORMEntity(Product), {
          id: "product-2",
          title: "product 2",
          handle: "product-2",
          status: ProductStatus.PUBLISHED,
        })

        tagOne = testManager.create(toMikroORMEntity(ProductTag), {
          id: "tag-1",
          value: "tag 1",
          products: [productOne],
        })

        tagTwo = testManager.create(toMikroORMEntity(ProductTag), {
          id: "tag-2",
          value: "tag",
          products: [productTwo],
        })

        await testManager.persistAndFlush([tagOne, tagTwo])
      })

      describe("listTags", () => {
        it("should return tags and count queried by ID", async () => {
          const tags = await service.listProductTags({
            id: tagOne.id,
          })

          expect(tags).toEqual([
            expect.objectContaining({
              id: tagOne.id,
            }),
          ])
        })

        it("should return tags and count based on the options and filter parameter", async () => {
          let tags = await service.listProductTags(
            {
              id: tagOne.id,
            },
            {
              take: 1,
            }
          )

          expect(tags).toEqual([
            expect.objectContaining({
              id: tagOne.id,
            }),
          ])

          tags = await service.listProductTags({}, { take: 1, skip: 1 })

          expect(tags).toEqual([
            expect.objectContaining({
              id: tagTwo.id,
            }),
          ])
        })

        it("should return only requested fields and relations for tags", async () => {
          const tags = await service.listProductTags(
            {
              id: tagOne.id,
            },
            {
              select: ["value", "products.id"],
              relations: ["products"],
              take: 1,
            }
          )

          expect(tags).toEqual([
            {
              id: tagOne.id,
              value: tagOne.value,
              products: [
                {
                  id: productOne.id,
                },
              ],
            },
          ])
        })

        it("should set foreign key to null when relation is select and is null", async () => {
          const tags = await service.listProductTags(
            {
              id: tagOne.id,
            },
            {
              select: ["value", "products.id"],
              relations: ["products.collection"],
              take: 1,
            }
          )

          expect(tags).toEqual([
            {
              id: tagOne.id,
              value: tagOne.value,
              products: [
                {
                  collection: null,
                  collection_id: null,
                  id: productOne.id,
                },
              ],
            },
          ])
        })
      })

      describe("listAndCountTags", () => {
        it("should return tags and count queried by ID", async () => {
          const [tags, count] = await service.listAndCountProductTags({
            id: tagOne.id,
          })

          expect(count).toEqual(1)
          expect(tags).toEqual([
            expect.objectContaining({
              id: tagOne.id,
            }),
          ])
        })

        it("should return tags and count based on the options and filter parameter", async () => {
          let [tags, count] = await service.listAndCountProductTags(
            {
              id: tagOne.id,
            },
            {
              take: 1,
            }
          )

          expect(count).toEqual(1)
          expect(tags).toEqual([
            expect.objectContaining({
              id: tagOne.id,
            }),
          ])
          ;[tags, count] = await service.listAndCountProductTags(
            {},
            { take: 1 }
          )

          expect(count).toEqual(2)
          ;[tags, count] = await service.listAndCountProductTags(
            {},
            { take: 1, skip: 1 }
          )

          expect(count).toEqual(2)
          expect(tags).toEqual([
            expect.objectContaining({
              id: tagTwo.id,
            }),
          ])
        })

        it("should return only requested fields and relations for tags", async () => {
          const [tags, count] = await service.listAndCountProductTags(
            {
              id: tagOne.id,
            },
            {
              select: ["value", "products.id"],
              relations: ["products"],
              take: 1,
            }
          )

          expect(count).toEqual(1)
          expect(tags).toEqual([
            {
              id: tagOne.id,
              value: tagOne.value,
              products: [
                {
                  id: productOne.id,
                },
              ],
            },
          ])
        })
      })

      describe("retrieveTag", () => {
        it("should return the requested tag", async () => {
          const tag = await service.retrieveProductTag(tagOne.id)

          expect(tag).toEqual(
            expect.objectContaining({
              id: tagOne.id,
            })
          )
        })

        it("should return requested attributes when requested through config", async () => {
          const tag = await service.retrieveProductTag(tagOne.id, {
            select: ["id", "value", "products.title"],
            relations: ["products"],
          })

          expect(tag).toEqual(
            expect.objectContaining({
              id: tagOne.id,
              value: tagOne.value,
              products: [
                expect.objectContaining({
                  title: "product 1",
                }),
              ],
            })
          )
        })

        it("should throw an error when a tag with ID does not exist", async () => {
          let error

          try {
            await service.retrieveProductTag("does-not-exist")
          } catch (e) {
            error = e
          }

          expect(error.message).toEqual(
            "ProductTag with id: does-not-exist was not found"
          )
        })
      })

      describe("deleteTags", () => {
        const tagId = "tag-1"

        it("should delete the product tag given an ID successfully", async () => {
          await service.deleteProductTags([tagId])

          const tags = await service.listProductTags({
            id: tagId,
          })

          expect(tags).toHaveLength(0)
        })
      })

      describe("updateTags", () => {
        const tagId = "tag-1"

        it("should update the value of the tag successfully", async () => {
          await service.updateProductTags(tagId, {
            value: "UK",
          })

          const productTag = await service.retrieveProductTag(tagId)

          expect(productTag.value).toEqual("UK")

        })

        it("should throw an error when an id does not exist", async () => {
          let error

          try {
            await service.updateProductTags("does-not-exist", {
              value: "UK",
            })
          } catch (e) {
            error = e
          }

          expect(error.message).toEqual(
            "ProductTag with id: does-not-exist was not found"
          )
        })
      })

      describe("createTags", () => {
        it("should create a tag successfully", async () => {
          await service.createProductTags([
            {
              value: "UK",
            },
          ])

          const productTag = await service.listProductTags({
            value: "UK",
          })

          expect(productTag[0]?.value).toEqual("UK")

        })
      })

      describe("upsertTags", () => {
        it("should upsert tags successfully", async () => {
          await service.createProductTags([
            {
              value: "UK",
            },
          ])

          let productTags = await service.listProductTags({
            value: "UK",
          })

          const tagsData = [
            {
              ...productTags[0],
              value: "updated",
            },
            {
              value: "new",
            },
          ]

          jest.clearAllMocks()

          await service.upsertProductTags(tagsData)

          productTags = await service.listProductTags()

          expect(productTags).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                value: "updated",
              }),
              expect.objectContaining({
                value: "new",
              }),
            ])
          )

          const newTag = productTags.find((t) => t.value === "new")!
          const updatedTag = productTags.find((t) => t.value === "updated")!

        })
      })
    })
  },
})

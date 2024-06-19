import { Modules } from "@medusajs/modules-sdk"
import { IProductModuleService } from "@medusajs/types"
import {
  CommonEvents,
  composeMessage,
  ProductEvents,
  ProductStatus,
} from "@medusajs/utils"
import { Product, ProductTag } from "@models"
import {
  MockEventBusService,
  moduleIntegrationTestRunner,
} from "medusa-test-utils"

jest.setTimeout(30000)

moduleIntegrationTestRunner<IProductModuleService>({
  moduleName: Modules.PRODUCT,
  testSuite: ({ MikroOrmWrapper, service }) => {
    let eventBusEmitSpy

    beforeEach(() => {
      eventBusEmitSpy = jest.spyOn(MockEventBusService.prototype, "emit")
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    describe("ProductModuleService product tags", () => {
      let tagOne: ProductTag
      let tagTwo: ProductTag
      let productOne: Product
      let productTwo: Product

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

        tagOne = testManager.create(ProductTag, {
          id: "tag-1",
          value: "tag 1",
          products: [productOne],
        })

        tagTwo = testManager.create(ProductTag, {
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
                  collection_id: null,
                  type_id: null,
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
                  collection_id: null,
                  type_id: null,
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

          expect(eventBusEmitSpy.mock.calls[0][0]).toHaveLength(1)
          expect(eventBusEmitSpy).toHaveBeenCalledWith([
            composeMessage(ProductEvents.product_tag_updated, {
              data: { id: productTag.id },
              object: "product_tag",
              source: Modules.PRODUCT,
              action: CommonEvents.UPDATED,
            }),
          ])
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

          expect(eventBusEmitSpy.mock.calls[0][0]).toHaveLength(1)
          expect(eventBusEmitSpy).toHaveBeenCalledWith([
            composeMessage(ProductEvents.product_tag_created, {
              data: { id: productTag[0].id },
              object: "product_tag",
              source: Modules.PRODUCT,
              action: CommonEvents.CREATED,
            }),
          ])
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

          expect(eventBusEmitSpy.mock.calls[0][0]).toHaveLength(2)
          expect(eventBusEmitSpy).toHaveBeenCalledWith([
            composeMessage(ProductEvents.product_tag_created, {
              data: { id: newTag.id },
              object: "product_tag",
              source: Modules.PRODUCT,
              action: CommonEvents.CREATED,
            }),
            composeMessage(ProductEvents.product_tag_updated, {
              data: { id: updatedTag.id },
              object: "product_tag",
              source: Modules.PRODUCT,
              action: CommonEvents.UPDATED,
            }),
          ])
        })
      })
    })
  },
})

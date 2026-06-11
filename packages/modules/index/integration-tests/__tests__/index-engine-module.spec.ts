import { EventBusTypes, InferEntityType } from "@medusajs/framework/types"
import { toMikroORMEntity } from "@medusajs/framework/utils"
import { IndexData, IndexRelation } from "@models"
import {
  createIndexTestBed,
  IndexModuleTestBed,
  schema,
} from "../__fixtures__"

jest.setTimeout(300000)

const productId = "prod_1"
const productId2 = "prod_2"
const variantId = "var_1"
const variantId2 = "var_2"
const priceSetId = "price_set_1"
const priceId = "money_amount_1"
const linkId = "link_id_1"

const seedQueryData = (testBed: IndexModuleTestBed) => {
  testBed.query
    .seed("product", [
      { id: productId, title: "Test Product 1" },
      { id: productId2, title: "Test Product 2" },
    ])
    .seed("product_variant", [
      {
        id: variantId,
        sku: "aaa test aaa",
        product: { id: productId },
      },
      {
        id: variantId2,
        sku: "sku 123",
        product: { id: productId2 },
      },
    ])
    .seed("price_set", [{ id: priceSetId }])
    .seed("price", [
      {
        id: priceId,
        amount: 100,
        price_set: [{ id: priceSetId }],
      },
    ])
    .seed("product_variant_price_set", [
      {
        id: linkId,
        variant_id: variantId,
        price_set_id: priceSetId,
        variant: [{ id: variantId }],
      },
    ])
}

const findIndexEntries = async (testBed: IndexModuleTestBed) => {
  const manager = testBed.forkManager()

  const indexEntries: InferEntityType<typeof IndexData>[] = await manager.find(
    toMikroORMEntity(IndexData),
    {}
  )
  const indexRelationEntries: InferEntityType<typeof IndexRelation>[] =
    await manager.find(toMikroORMEntity(IndexRelation), {})

  return { indexEntries, indexRelationEntries }
}

describe("IndexModuleService", function () {
  let testBed: IndexModuleTestBed

  beforeAll(async () => {
    testBed = await createIndexTestBed({ schema })
  })

  afterAll(async () => {
    await testBed.teardown()
  })

  beforeEach(async () => {
    await testBed.truncateTables()
    testBed.query.reset()
    seedQueryData(testBed)
  })

  describe("on created or attached events", function () {
    const eventDataToEmit: EventBusTypes.Event[] = [
      {
        name: "product.created",
        data: {
          id: productId,
        },
      },
      {
        name: "product.created",
        data: {
          id: productId2,
        },
      },
      {
        name: "variant.created",
        data: {
          id: variantId,
          product: {
            id: productId,
          },
        },
      },
      {
        name: "pricing.price-set.created",
        data: {
          id: priceSetId,
        },
      },
      {
        name: "price.created",
        data: {
          id: priceId,
          price_set: {
            id: priceSetId,
          },
        },
      },
      {
        name: "LinkProductVariantPriceSet.attached",
        data: {
          id: linkId,
          variant_id: variantId,
          price_set_id: priceSetId,
        },
      },
    ]

    it("should create the corresponding index entries and index relation entries", async function () {
      await testBed.eventBus.emit(eventDataToEmit)

      const { indexEntries, indexRelationEntries } = await findIndexEntries(
        testBed
      )

      const productIndexEntries = indexEntries.filter((entry) => {
        return entry.name === "Product"
      })

      expect(productIndexEntries).toHaveLength(2)

      const variantIndexEntries = indexEntries.filter((entry) => {
        return entry.name === "ProductVariant"
      })

      expect(variantIndexEntries).toHaveLength(1)

      const priceSetIndexEntries = indexEntries.filter((entry) => {
        return entry.name === "PriceSet"
      })

      expect(priceSetIndexEntries).toHaveLength(1)

      const priceIndexEntries = indexEntries.filter((entry) => {
        return entry.name === "Price"
      })

      expect(priceIndexEntries).toHaveLength(1)

      const linkIndexEntries = indexEntries.filter((entry) => {
        return entry.name === "LinkProductVariantPriceSet"
      })

      expect(linkIndexEntries).toHaveLength(1)

      expect(indexRelationEntries).toHaveLength(4)

      const productVariantIndexRelationEntries = indexRelationEntries.filter(
        (entry) => {
          return (
            entry.parent_id === productId &&
            entry.parent_name === "Product" &&
            entry.child_id === variantId &&
            entry.child_name === "ProductVariant"
          )
        }
      )

      expect(productVariantIndexRelationEntries).toHaveLength(1)

      const variantLinkIndexRelationEntries = indexRelationEntries.filter(
        (entry) => {
          return (
            entry.parent_id === variantId &&
            entry.parent_name === "ProductVariant" &&
            entry.child_id === linkId &&
            entry.child_name === "LinkProductVariantPriceSet"
          )
        }
      )

      expect(variantLinkIndexRelationEntries).toHaveLength(1)

      const linkPriceSetIndexRelationEntries = indexRelationEntries.filter(
        (entry) => {
          return (
            entry.parent_id === linkId &&
            entry.parent_name === "LinkProductVariantPriceSet" &&
            entry.child_id === priceSetId &&
            entry.child_name === "PriceSet"
          )
        }
      )

      expect(linkPriceSetIndexRelationEntries).toHaveLength(1)

      const priceSetPriceIndexRelationEntries = indexRelationEntries.filter(
        (entry) => {
          return (
            entry.parent_id === priceSetId &&
            entry.parent_name === "PriceSet" &&
            entry.child_id === priceId &&
            entry.child_name === "Price"
          )
        }
      )

      expect(priceSetPriceIndexRelationEntries).toHaveLength(1)
    })

    it("should not create index entries for events whose data cannot be resolved from the query", async function () {
      await testBed.eventBus.emit([
        {
          name: "product.created",
          data: {
            id: "prod_does_not_exist",
          },
        },
      ])

      const { indexEntries, indexRelationEntries } = await findIndexEntries(
        testBed
      )

      expect(indexEntries).toHaveLength(0)
      expect(indexRelationEntries).toHaveLength(0)
    })
  })

  describe("on unordered created or attached events", function () {
    const eventDataToEmit: EventBusTypes.Event[] = [
      {
        name: "variant.created",
        data: {
          id: variantId,
          product: {
            id: productId,
          },
        },
      },
      {
        name: "product.created",
        data: {
          id: productId,
        },
      },
      {
        name: "product.created",
        data: {
          id: productId2,
        },
      },
      {
        name: "variant.created",
        data: {
          id: variantId2,
          product: {
            id: productId2,
          },
        },
      },
      {
        name: "pricing.price-set.created",
        data: {
          id: priceSetId,
        },
      },
      {
        name: "price.created",
        data: {
          id: priceId,
          price_set: {
            id: priceSetId,
          },
        },
      },
      {
        name: "LinkProductVariantPriceSet.attached",
        data: {
          id: linkId,
          variant_id: variantId,
          price_set_id: priceSetId,
        },
      },
    ]

    it("should create the corresponding index entries and index relation entries", async function () {
      await testBed.eventBus.emit(eventDataToEmit)

      const { indexEntries, indexRelationEntries } = await findIndexEntries(
        testBed
      )

      const productIndexEntries = indexEntries.filter((entry) => {
        return entry.name === "Product"
      })

      expect(productIndexEntries).toHaveLength(2)
      expect(productIndexEntries).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: productId,
            data: expect.objectContaining({
              id: productId,
              title: expect.stringContaining("Test Product"),
            }),
          }),
          expect.objectContaining({
            id: productId2,
            data: expect.objectContaining({
              id: productId2,
              title: expect.stringContaining("Test Product"),
            }),
          }),
        ])
      )

      const variantIndexEntries = indexEntries.filter((entry) => {
        return entry.name === "ProductVariant"
      })

      expect(variantIndexEntries).toHaveLength(2)
      expect(variantIndexEntries).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: variantId,
            data: expect.objectContaining({
              id: variantId,
            }),
          }),
          expect.objectContaining({
            id: variantId2,
            data: expect.objectContaining({
              id: variantId2,
            }),
          }),
        ])
      )

      const priceSetIndexEntries = indexEntries.filter((entry) => {
        return entry.name === "PriceSet"
      })

      expect(priceSetIndexEntries).toHaveLength(1)
      expect(priceSetIndexEntries[0].id).toEqual(priceSetId)

      const priceIndexEntries = indexEntries.filter((entry) => {
        return entry.name === "Price"
      })

      expect(priceIndexEntries).toHaveLength(1)
      expect(priceIndexEntries[0].id).toEqual(priceId)

      const linkIndexEntries = indexEntries.filter((entry) => {
        return entry.name === "LinkProductVariantPriceSet"
      })

      expect(linkIndexEntries).toHaveLength(1)
      expect(linkIndexEntries[0].id).toEqual(linkId)

      expect(indexRelationEntries).toHaveLength(5)

      const productVariantIndexRelationEntries = indexRelationEntries.filter(
        (entry) => {
          return (
            entry.parent_id === productId &&
            entry.parent_name === "Product" &&
            entry.child_id === variantId &&
            entry.child_name === "ProductVariant"
          )
        }
      )

      expect(productVariantIndexRelationEntries).toHaveLength(1)

      const productVariant2IndexRelationEntries = indexRelationEntries.filter(
        (entry) => {
          return (
            entry.parent_id === productId2 &&
            entry.parent_name === "Product" &&
            entry.child_id === variantId2 &&
            entry.child_name === "ProductVariant"
          )
        }
      )

      expect(productVariant2IndexRelationEntries).toHaveLength(1)

      const variantLinkIndexRelationEntries = indexRelationEntries.filter(
        (entry) => {
          return (
            entry.parent_id === variantId &&
            entry.parent_name === "ProductVariant" &&
            entry.child_id === linkId &&
            entry.child_name === "LinkProductVariantPriceSet"
          )
        }
      )

      expect(variantLinkIndexRelationEntries).toHaveLength(1)

      const linkPriceSetIndexRelationEntries = indexRelationEntries.filter(
        (entry) => {
          return (
            entry.parent_id === linkId &&
            entry.parent_name === "LinkProductVariantPriceSet" &&
            entry.child_id === priceSetId &&
            entry.child_name === "PriceSet"
          )
        }
      )

      expect(linkPriceSetIndexRelationEntries).toHaveLength(1)

      const priceSetPriceIndexRelationEntries = indexRelationEntries.filter(
        (entry) => {
          return (
            entry.parent_id === priceSetId &&
            entry.parent_name === "PriceSet" &&
            entry.child_id === priceId &&
            entry.child_name === "Price"
          )
        }
      )

      expect(priceSetPriceIndexRelationEntries).toHaveLength(1)
    })
  })

  describe("on updated events", function () {
    beforeEach(async () => {
      const manager = testBed.forkManager()
      const indexRepository = manager.getRepository(toMikroORMEntity(IndexData))

      await indexRepository.upsertMany([
        {
          id: productId,
          name: "Product",
          data: {
            id: productId,
          },
        },
        {
          id: variantId,
          name: "ProductVariant",
          data: {
            id: variantId,
            sku: "aaa test aaa",
            product: {
              id: productId,
            },
          },
        },
      ])

      testBed.query
        .seed("product", [{ id: productId, title: "updated Title" }])
        .seed("product_variant", [
          {
            id: variantId,
            sku: "updated sku",
            product: [{ id: productId }],
          },
        ])

      await testBed.eventBus.emit([
        {
          name: "product.updated",
          data: {
            id: productId,
          },
        },
        {
          name: "variant.updated",
          data: {
            id: variantId,
            product: {
              id: productId,
            },
          },
        },
      ])
    })

    it("should update the corresponding index entries", async () => {
      const { indexEntries: updatedIndexEntries } = await findIndexEntries(
        testBed
      )

      expect(updatedIndexEntries).toHaveLength(2)

      const productEntry = updatedIndexEntries.find((entry) => {
        return entry.name === "Product" && entry.id === productId
      })

      expect((productEntry?.data as any)?.title).toEqual("updated Title")

      const variantEntry = updatedIndexEntries.find((entry) => {
        return entry.name === "ProductVariant" && entry.id === variantId
      })

      expect((variantEntry?.data as any)?.sku).toEqual("updated sku")
    })
  })

  describe("on deleted events", function () {
    const eventDataToEmit: EventBusTypes.Event[] = [
      {
        name: "product.created",
        data: {
          id: productId,
        },
      },
      {
        name: "variant.created",
        data: {
          id: variantId,
          product: {
            id: productId,
          },
        },
      },
      {
        name: "pricing.price-set.created",
        data: {
          id: priceSetId,
        },
      },
      {
        name: "price.created",
        data: {
          id: priceId,
          price_set: {
            id: priceSetId,
          },
        },
      },
      {
        name: "LinkProductVariantPriceSet.attached",
        data: {
          id: linkId,
          variant_id: variantId,
          price_set_id: priceSetId,
        },
      },
    ]

    const deleteEventDataToEmit: EventBusTypes.Event[] = [
      {
        name: "product.deleted",
        data: {
          id: productId,
        },
      },
      {
        name: "variant.deleted",
        data: {
          id: variantId,
        },
      },
    ]

    beforeEach(async () => {
      await testBed.eventBus.emit(eventDataToEmit)
      await testBed.eventBus.emit(deleteEventDataToEmit)
    })

    it("should consume all deleted events and delete the index entries", async () => {
      const { indexEntries, indexRelationEntries } = await findIndexEntries(
        testBed
      )

      expect(indexEntries).toHaveLength(3)
      expect(indexRelationEntries).toHaveLength(2)
    })
  })
})

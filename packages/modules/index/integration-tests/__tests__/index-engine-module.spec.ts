import { EventBusTypes } from "@medusajs/types"
import { Catalog, CatalogRelation } from "@models"
import { EventBusService } from "../__fixtures__"
import {
  ContainerRegistrationKeys,
  ModuleRegistrationName,
} from "@medusajs/utils"
import {
  configLoader,
  container,
  logger,
  MedusaAppLoader,
  pgConnectionLoader,
} from "@medusajs/framework"
import * as path from "path"
import { asValue } from "awilix"
import { MedusaAppOutput } from "@medusajs/modules-sdk"
import { EntityManager } from "@mikro-orm/postgresql"

const eventBus = new EventBusService()
const remoteQueryMock = jest.fn()

jest.setTimeout(300000)

const productId = "prod_1"
const variantId = "var_1"
const priceSetId = "price_set_1"
const moneyAmountId = "money_amount_1"
const linkId = "link_id_1"

const sendEvents = async (eventDataToEmit) => {
  let a = 0
  remoteQueryMock.mockImplementation((query) => {
    if (query.product) {
      return {
        id: a++ > 0 ? "aaaa" : productId,
      }
    } else if (query.variant) {
      return {
        id: variantId,
        sku: "aaa test aaa",
        product: {
          id: productId,
        },
      }
    } else if (query.price_set) {
      return {
        id: priceSetId,
      }
    } else if (query.money_amount) {
      return {
        id: moneyAmountId,
        amount: 100,
        price_set: [
          {
            id: priceSetId,
          },
        ],
      }
    } else if (query.product_variant_price_set) {
      return {
        id: linkId,
        variant_id: variantId,
        price_set_id: priceSetId,
        variant: [
          {
            id: variantId,
          },
        ],
      }
    }

    return {}
  })

  await eventBus.emit(eventDataToEmit)
}

const beforeEach_ = async (eventDataToEmit) => {
  configLoader(path.join(__dirname, "./../__fixtures__"), "medusa-config.js")
  pgConnectionLoader()

  container.register({
    [ContainerRegistrationKeys.LOGGER]: asValue(logger),
    [ContainerRegistrationKeys.REMOTE_QUERY]: asValue(null),
  })

  const globalApp = await new MedusaAppLoader(container as any).load()

  await sendEvents(eventDataToEmit)

  return globalApp
}

describe("IndexModuleService", function () {
  describe("SearchEngineModuleService", function () {
    describe.only("on created or attached events", function () {
      let medusaApp: MedusaAppOutput
      let manager

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
            id: "PRODUCTASDASDAS",
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
          name: "PriceSet.created",
          data: {
            id: priceSetId,
          },
        },
        {
          name: "price.created",
          data: {
            id: moneyAmountId,
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

      beforeEach(async () => {
        medusaApp = await beforeEach_(eventDataToEmit)

        manager = (
          medusaApp.sharedContainer!.resolve(
            ModuleRegistrationName.INDEX
          ) as any
        ).container_.manager as EntityManager
      })

      afterEach(async () => {
        await medusaApp.onApplicationShutdown()
      })

      it.only("should create the corresponding catalog entries and catalog relation entries", async function () {
        expect(remoteQueryMock).toHaveBeenCalledTimes(6)

        /**
         * Validate all catalog entries and catalog relation entries
         */

        const catalogEntries: Catalog[] = await manager.find(Catalog, {})

        const productCatalogEntries = catalogEntries.filter((entry) => {
          return entry.name === "Product"
        })

        expect(productCatalogEntries).toHaveLength(2)

        const variantCatalogEntries = catalogEntries.filter((entry) => {
          return entry.name === "ProductVariant"
        })

        expect(variantCatalogEntries).toHaveLength(1)

        const priceSetCatalogEntries = catalogEntries.filter((entry) => {
          return entry.name === "PriceSet"
        })

        expect(priceSetCatalogEntries).toHaveLength(1)

        const moneyAmountCatalogEntries = catalogEntries.filter((entry) => {
          return entry.name === "MoneyAmount"
        })

        expect(moneyAmountCatalogEntries).toHaveLength(1)

        const linkCatalogEntries = catalogEntries.filter((entry) => {
          return entry.name === "LinkProductVariantPriceSet"
        })

        expect(linkCatalogEntries).toHaveLength(1)

        const catalogRelationEntries: CatalogRelation[] = await manager.find(
          CatalogRelation,
          {}
        )

        expect(catalogRelationEntries).toHaveLength(4)

        const productVariantCatalogRelationEntries =
          catalogRelationEntries.filter((entry) => {
            return (
              entry.parent_id === productId &&
              entry.parent_name === "Product" &&
              entry.child_id === variantId &&
              entry.child_name === "ProductVariant"
            )
          })

        expect(productVariantCatalogRelationEntries).toHaveLength(1)

        const variantLinkCatalogRelationEntries = catalogRelationEntries.filter(
          (entry) => {
            return (
              entry.parent_id === variantId &&
              entry.parent_name === "ProductVariant" &&
              entry.child_id === linkId &&
              entry.child_name === "LinkProductVariantPriceSet"
            )
          }
        )

        expect(variantLinkCatalogRelationEntries).toHaveLength(1)

        const linkPriceSetCatalogRelationEntries =
          catalogRelationEntries.filter((entry) => {
            return (
              entry.parent_id === linkId &&
              entry.parent_name === "LinkProductVariantPriceSet" &&
              entry.child_id === priceSetId &&
              entry.child_name === "PriceSet"
            )
          })

        expect(linkPriceSetCatalogRelationEntries).toHaveLength(1)

        const priceSetMoneyAmountCatalogRelationEntries =
          catalogRelationEntries.filter((entry) => {
            return (
              entry.parent_id === priceSetId &&
              entry.parent_name === "PriceSet" &&
              entry.child_id === moneyAmountId &&
              entry.child_name === "MoneyAmount"
            )
          })

        expect(priceSetMoneyAmountCatalogRelationEntries).toHaveLength(1)
      })
    })

    describe("on unordered created or attached events", function () {
      let manager
      let medusaApp: MedusaAppOutput

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
            id: "PRODUCTASDASDAS",
          },
        },
        {
          name: "PriceSet.created",
          data: {
            id: priceSetId,
          },
        },
        {
          name: "price.created",
          data: {
            id: moneyAmountId,
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

      beforeEach(async () => {
        medusaApp = await beforeEach_(eventDataToEmit)

        manager = (
          medusaApp.sharedContainer!.resolve(
            ModuleRegistrationName.INDEX
          ) as any
        ).container_.manager as EntityManager
      })

      afterEach(async () => {
        await medusaApp.onApplicationShutdown()
      })

      it("should create the corresponding catalog entries and catalog relation entries", async function () {
        expect(remoteQueryMock).toHaveBeenCalledTimes(6)

        /**
         * Validate all catalog entries and catalog relation entries
         */

        const catalogEntries: Catalog[] = await manager.find(Catalog, {})

        const productCatalogEntries = catalogEntries.filter((entry) => {
          return entry.name === "Product"
        })

        expect(productCatalogEntries).toHaveLength(2)
        expect(productCatalogEntries[0].id).toEqual(productId)

        const variantCatalogEntries = catalogEntries.filter((entry) => {
          return entry.name === "ProductVariant"
        })

        expect(variantCatalogEntries).toHaveLength(1)
        expect(variantCatalogEntries[0].id).toEqual(variantId)

        const priceSetCatalogEntries = catalogEntries.filter((entry) => {
          return entry.name === "PriceSet"
        })

        expect(priceSetCatalogEntries).toHaveLength(1)
        expect(priceSetCatalogEntries[0].id).toEqual(priceSetId)

        const moneyAmountCatalogEntries = catalogEntries.filter((entry) => {
          return entry.name === "MoneyAmount"
        })

        expect(moneyAmountCatalogEntries).toHaveLength(1)
        expect(moneyAmountCatalogEntries[0].id).toEqual(moneyAmountId)

        const linkCatalogEntries = catalogEntries.filter((entry) => {
          return entry.name === "LinkProductVariantPriceSet"
        })

        expect(linkCatalogEntries).toHaveLength(1)
        expect(linkCatalogEntries[0].id).toEqual(linkId)

        const catalogRelationEntries: CatalogRelation[] = await manager.find(
          CatalogRelation,
          {}
        )

        expect(catalogRelationEntries).toHaveLength(4)

        const productVariantCatalogRelationEntries =
          catalogRelationEntries.filter((entry) => {
            return (
              entry.parent_id === productId &&
              entry.parent_name === "Product" &&
              entry.child_id === variantId &&
              entry.child_name === "ProductVariant"
            )
          })

        expect(productVariantCatalogRelationEntries).toHaveLength(1)

        const variantLinkCatalogRelationEntries = catalogRelationEntries.filter(
          (entry) => {
            return (
              entry.parent_id === variantId &&
              entry.parent_name === "ProductVariant" &&
              entry.child_id === linkId &&
              entry.child_name === "LinkProductVariantPriceSet"
            )
          }
        )

        expect(variantLinkCatalogRelationEntries).toHaveLength(1)

        const linkPriceSetCatalogRelationEntries =
          catalogRelationEntries.filter((entry) => {
            return (
              entry.parent_id === linkId &&
              entry.parent_name === "LinkProductVariantPriceSet" &&
              entry.child_id === priceSetId &&
              entry.child_name === "PriceSet"
            )
          })

        expect(linkPriceSetCatalogRelationEntries).toHaveLength(1)

        const priceSetMoneyAmountCatalogRelationEntries =
          catalogRelationEntries.filter((entry) => {
            return (
              entry.parent_id === priceSetId &&
              entry.parent_name === "PriceSet" &&
              entry.child_id === moneyAmountId &&
              entry.child_name === "MoneyAmount"
            )
          })

        expect(priceSetMoneyAmountCatalogRelationEntries).toHaveLength(1)
      })
    })

    describe("on updated events", function () {
      let manager
      let medusaApp: MedusaAppOutput

      const updateData = async (manager) => {
        const catalogRepository = manager.getRepository(Catalog)
        await catalogRepository.upsertMany([
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
      }

      const eventDataToEmit: EventBusTypes.Event[] = [
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
      ]

      beforeEach(async () => {
        medusaApp = await beforeEach_(eventDataToEmit)

        manager = (
          medusaApp.sharedContainer!.resolve(
            ModuleRegistrationName.INDEX
          ) as any
        ).container_.manager as EntityManager

        await updateData(manager)

        remoteQueryMock.mockImplementation((query) => {
          if (query.product) {
            return {
              id: productId,
              title: "updated Title",
            }
          } else if (query.variant) {
            return {
              id: variantId,
              sku: "updated sku",
              product: [
                {
                  id: productId,
                },
              ],
            }
          }

          return {}
        })
        await eventBus.emit(eventDataToEmit)
      })

      afterEach(async () => {
        await medusaApp.onApplicationShutdown()
      })

      it("should update the corresponding catalog entries", async () => {
        expect(remoteQueryMock).toHaveBeenCalledTimes(4)

        const updatedCatalogEntries = await manager.find(Catalog, {})

        expect(updatedCatalogEntries).toHaveLength(2)

        const productEntry = updatedCatalogEntries.find((entry) => {
          return entry.name === "Product" && entry.id === productId
        })

        expect(productEntry?.data?.title).toEqual("updated Title")

        const variantEntry = updatedCatalogEntries.find((entry) => {
          return entry.name === "ProductVariant" && entry.id === variantId
        })

        expect(variantEntry?.data?.sku).toEqual("updated sku")
      })
    })

    describe("on deleted events", function () {
      let manager
      let medusaApp: MedusaAppOutput

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
          name: "PriceSet.created",
          data: {
            id: priceSetId,
          },
        },
        {
          name: "price.created",
          data: {
            id: moneyAmountId,
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
        medusaApp = await beforeEach_(eventDataToEmit)

        manager = (
          medusaApp.sharedContainer!.resolve(
            ModuleRegistrationName.INDEX
          ) as any
        ).container_.manager as EntityManager

        remoteQueryMock.mockImplementation((query) => {
          if (query.product) {
            return {
              id: productId,
            }
          } else if (query.variant) {
            return {
              id: variantId,
              product: [
                {
                  id: productId,
                },
              ],
            }
          }

          return {}
        })

        await eventBus.emit(deleteEventDataToEmit)
      })

      afterEach(async () => {
        await medusaApp.onApplicationShutdown()
      })

      it("should consume all deleted events and delete the catalog entries", async () => {
        expect(remoteQueryMock).toHaveBeenCalledTimes(7)

        const catalogEntries = await manager.find(Catalog, {})
        const catalogRelationEntries = await manager.find(CatalogRelation, {})

        expect(catalogEntries).toHaveLength(3)
        expect(catalogRelationEntries).toHaveLength(2)

        const linkCatalogEntry = catalogEntries.find((entry) => {
          return (
            entry.name === "LinkProductVariantPriceSet" && entry.id === linkId
          )
        })!

        const priceSetCatalogEntry = catalogEntries.find((entry) => {
          return entry.name === "PriceSet" && entry.id === priceSetId
        })!

        const moneyAmountCatalogEntry = catalogEntries.find((entry) => {
          return entry.name === "MoneyAmount" && entry.id === moneyAmountId
        })!

        const linkPriceSetCatalogRelationEntry = catalogRelationEntries.find(
          (entry) => {
            return (
              entry.parent_id === linkId &&
              entry.parent_name === "LinkProductVariantPriceSet" &&
              entry.child_id === priceSetId &&
              entry.child_name === "PriceSet"
            )
          }
        )!

        expect(linkPriceSetCatalogRelationEntry.parent).toEqual(
          linkCatalogEntry
        )
        expect(linkPriceSetCatalogRelationEntry.child).toEqual(
          priceSetCatalogEntry
        )

        const priceSetMoneyAmountCatalogRelationEntry =
          catalogRelationEntries.find((entry) => {
            return (
              entry.parent_id === priceSetId &&
              entry.parent_name === "PriceSet" &&
              entry.child_id === moneyAmountId &&
              entry.child_name === "MoneyAmount"
            )
          })!

        expect(priceSetMoneyAmountCatalogRelationEntry.parent).toEqual(
          priceSetCatalogEntry
        )
        expect(priceSetMoneyAmountCatalogRelationEntry.child).toEqual(
          moneyAmountCatalogEntry
        )
      })
    })
  })
})

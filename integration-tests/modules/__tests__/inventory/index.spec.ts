import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IInventoryServiceNext, IStockLocationService } from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  ProductStatus,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import { medusaIntegrationTestRunner } from "medusa-test-utils"
import { createAdminUser } from "../../../helpers/create-admin-user"

jest.setTimeout(30000)

const { simpleProductFactory } = require("../../../factories")
const adminHeaders = { headers: { "x-medusa-access-token": "test_token" } }

medusaIntegrationTestRunner({
  env: {
    MEDUSA_FF_MEDUSA_V2: true,
  },
  testSuite: ({ dbConnection, getContainer, api }) => {
    let appContainer
    let service: IInventoryServiceNext
    let inventoryItems
    let inventoryItem
    let location
    let locationId
    let location2
    let location2Id
    let location3Id
    let product
    let variant

    beforeEach(async () => {
      appContainer = getContainer()

      await createAdminUser(dbConnection, adminHeaders, appContainer)

      service = appContainer.resolve(ModuleRegistrationName.INVENTORY)

      const location = (
        await api.post(
          `/admin/stock-locations`,
          { name: "test location" },
          adminHeaders
        )
      ).data.stock_location

      locationId = location.id

      const location2 = (
        await api.post(
          `/admin/stock-locations`,
          { name: "test location 2" },
          adminHeaders
        )
      ).data.stock_location

      location2Id = location2.id

      product = (
        await api.post(
          "/admin/products?fields=*variants",
          {
            title: "test product 1",
            status: ProductStatus.PUBLISHED,
            variants: [
              {
                title: "test variant 1",
                sku: "test-sku",
                prices: [{ amount: 3000, currency_code: "usd" }],
              },
            ],
          },
          adminHeaders
        )
      ).data.product

      variant = product.variants[0]

      inventoryItem = (
        await api.post(
          `/admin/inventory-items`,
          { sku: variant.sku, variant_id: variant.id },
          adminHeaders
        )
      ).data.inventory_item
    })

    describe("Inventory Items", () => {
      it("should create, update and delete the inventory location levels", async () => {
        const inventoryItemId = inventoryItem.id
        await api.post(
          `/admin/inventory-items/${inventoryItemId}/location-levels`,
          {
            location_id: locationId,
            stocked_quantity: 17,
            incoming_quantity: 2,
          },
          adminHeaders
        )

        const stockLevel =
          await service.retrieveInventoryLevelByItemAndLocation(
            inventoryItemId,
            locationId
          )

        expect(stockLevel.location_id).toEqual(locationId)
        expect(stockLevel.inventory_item_id).toEqual(inventoryItemId)
        expect(stockLevel.stocked_quantity).toEqual(17)
        expect(stockLevel.incoming_quantity).toEqual(2)

        await api.post(
          `/admin/inventory-items/${inventoryItemId}/location-levels/${locationId}`,
          {
            stocked_quantity: 21,
            incoming_quantity: 0,
          },
          adminHeaders
        )

        const newStockLevel =
          await service.retrieveInventoryLevelByItemAndLocation(
            inventoryItemId,
            locationId
          )
        console.log("newStockLevel --- ", newStockLevel)
        expect(newStockLevel.stocked_quantity).toEqual(21)
        expect(newStockLevel.incoming_quantity).toEqual(0)

        await api.delete(
          `/admin/inventory-items/${inventoryItemId}/location-levels/${locationId}`,
          adminHeaders
        )
        console.log("wut")
        const invLevel = await service
          .retrieveInventoryLevelByItemAndLocation(inventoryItemId, locationId)
          .catch((e) => e)

        expect(invLevel.message).toEqual(
          `Inventory level for item ${inventoryItemId} and location ${locationId} not found`
        )
      })

      it("should fail to update the location level to negative quantity", async () => {
        const inventoryItemId = inventoryItem.id

        await api.post(
          `/admin/inventory-items/${inventoryItemId}/location-levels`,
          {
            location_id: locationId,
            stocked_quantity: 17,
            incoming_quantity: 2,
          },
          adminHeaders
        )

        const res = await api
          .post(
            `/admin/inventory-items/${inventoryItemId}/location-levels/${locationId}`,
            {
              incoming_quantity: -1,
              stocked_quantity: -1,
            },
            adminHeaders
          )
          .catch((error) => error)

        expect(res.response.status).toEqual(400)
        expect(res.response.data).toEqual({
          type: "invalid_data",
          message:
            'Invalid request body: [{"code":"too_small","minimum":0,"type":"number","inclusive":true,"exact":false,"message":"Number must be greater than or equal to 0","path":["stocked_quantity"]},{"code":"too_small","minimum":0,"type":"number","inclusive":true,"exact":false,"message":"Number must be greater than or equal to 0","path":["incoming_quantity"]}]',
        })
      })

      it.skip("should create the inventory item using the api", async () => {
        // TODO: This API no longer seems to be available. Remove
        let variantInventoryRes = await api.get(
          `/admin/variants/${variant.id}/inventory`,
          adminHeaders
        )

        expect(variantInventoryRes.data).toEqual({
          variant: {
            id: variant.id,
            inventory: [],
            sales_channel_availability: [],
          },
        })
        expect(variantInventoryRes.status).toEqual(200)

        const inventoryItemCreateRes = await api.post(
          `/admin/inventory-items`,
          { variant_id: variant.id, sku: variant.sku },
          adminHeaders
        )

        variantInventoryRes = await api.get(
          `/admin/variants/${variant.id}/inventory`,
          adminHeaders
        )

        expect(variantInventoryRes.data).toEqual({
          variant: expect.objectContaining({
            id: variant.id,
            inventory: [
              expect.objectContaining({
                ...inventoryItemCreateRes.data.inventory_item,
              }),
            ],
          }),
        })
        expect(variantInventoryRes.status).toEqual(200)
      })

      it("should list the location levels based on id param constraint", async () => {
        const inventoryItemId = inventoryItem.id

        await api.post(
          `/admin/inventory-items/${inventoryItemId}/location-levels`,
          {
            location_id: locationId,
            stocked_quantity: 10,
          },
          adminHeaders
        )

        await api.post(
          `/admin/inventory-items/${inventoryItemId}/location-levels`,
          {
            location_id: location2Id,
            stocked_quantity: 5,
          },
          adminHeaders
        )

        const result = await api.get(
          `/admin/inventory-items/${inventoryItemId}/location-levels?location_id[]=${locationId}`,
          adminHeaders
        )

        expect(result.status).toEqual(200)
        expect(result.data.inventory_levels).toHaveLength(1)
        expect(result.data.inventory_levels[0]).toEqual(
          expect.objectContaining({
            stocked_quantity: 10,
          })
        )
      })

      describe("List inventory levels", () => {
        let inventoryItemId
        let stockLocation1Id
        let stockLocation2Id

        beforeEach(async () => {
          const inventoryItem = await api.post(
            `/admin/inventory-items`,
            { sku: "test-sku" },
            adminHeaders
          )
          inventoryItemId = inventoryItem.data.inventory_item.id

          const locationService = appContainer.resolve(
            ModuleRegistrationName.STOCK_LOCATION
          )
          const stockLocation1 = await locationService.create({
            name: "loc-1",
          })
          stockLocation1Id = stockLocation1.id

          const stockLocation2 = await locationService.create({
            name: "loc-2",
          })
          stockLocation2Id = stockLocation2.id

          await api.post(
            `/admin/inventory-items/${inventoryItemId}/location-levels`,
            {
              location_id: stockLocation1Id,
              stocked_quantity: 10,
            },
            adminHeaders
          )
          await api.post(
            `/admin/inventory-items/${inventoryItemId}/location-levels`,
            {
              location_id: stockLocation2Id,
              stocked_quantity: 15,
            },
            adminHeaders
          )
        })

        it("should list the inventory levels", async () => {
          const response = await api.get(
            `/admin/inventory-items/${inventoryItemId}/location-levels`,
            adminHeaders
          )

          expect(response.data).toEqual(
            expect.objectContaining({
              count: 2,
              offset: 0,
              limit: 50,
            })
          )

          expect(response.data.inventory_levels).toHaveLength(2)
          expect(response.data.inventory_levels).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                location_id: stockLocation1Id,
                stocked_quantity: 10,
              }),
              expect.objectContaining({
                location_id: stockLocation2Id,
                stocked_quantity: 15,
              }),
            ])
          )
        })
      })

      describe("Update inventory item", () => {
        let inventoryItemId
        beforeEach(async () => {
          const inventoryItemResponse = await api.post(
            `/admin/inventory-items`,
            {
              sku: "test-sku",
            },
            adminHeaders
          )

          inventoryItemId = inventoryItemResponse.data.inventory_item.id
        })

        it("should update the inventory item", async () => {
          const response = await api.post(
            `/admin/inventory-items/${inventoryItemId}`,
            {
              mid_code: "updated mid_code",
              weight: 120,
            },
            adminHeaders
          )

          expect(response.data.inventory_item).toEqual(
            expect.objectContaining({
              sku: "test-sku",
              mid_code: "updated mid_code",
              weight: 120,
            })
          )
        })
      })

      describe("Bulk create/delete inventory levels", () => {
        const locationId = "loc_1"
        let inventoryItem

        beforeEach(async () => {
          inventoryItem = await service.create({
            sku: "MY_SKU",
          })

          await service.createInventoryLevels([
            {
              inventory_item_id: inventoryItem.id,
              location_id: locationId,
              stocked_quantity: 10,
            },
          ])
        })

        it("should delete an inventory location level and create a new one", async () => {
          const result = await api.post(
            `/admin/inventory-items/${inventoryItem.id}/location-levels/batch`,
            {
              create: [
                {
                  location_id: "location_2",
                },
              ],
              delete: [locationId],
            },
            adminHeaders
          )

          expect(result.status).toEqual(200)

          const levelsListResult = await api.get(
            `/admin/inventory-items/${inventoryItem.id}/location-levels`,
            adminHeaders
          )
          expect(levelsListResult.status).toEqual(200)
          expect(levelsListResult.data.inventory_levels).toHaveLength(1)
        })
      })

      describe("Delete inventory levels", () => {
        const locationId = "loc_1"
        let inventoryItem

        beforeEach(async () => {
          inventoryItem = await service.create({
            sku: "MY_SKU",
          })

          await service.createInventoryLevels([
            {
              inventory_item_id: inventoryItem.id,
              location_id: locationId,
              stocked_quantity: 10,
            },
          ])
        })

        it("should delete an inventory location level without reservations", async () => {
          const result = await api.delete(
            `/admin/inventory-items/${inventoryItem.id}/location-levels/${locationId}`,
            adminHeaders
          )

          expect(result.status).toEqual(200)
          expect(result.data).toEqual({
            id: expect.any(String),
            object: "inventory-level",
            deleted: true,
            parent: expect.any(Object),
          })
        })

        it("should fail delete an inventory location level with reservations", async () => {
          await service.createReservationItems({
            inventory_item_id: inventoryItem.id,
            location_id: locationId,
            quantity: 5,
          })

          let error

          await api
            .delete(
              `/admin/inventory-items/${inventoryItem.id}/location-levels/${locationId}`,
              adminHeaders
            )
            .catch((e) => (error = e))
          expect(error.response.status).toEqual(400)
          expect(error.response.data).toEqual({
            type: "not_allowed",
            message: `Cannot remove Inventory Level ${inventoryItem.id} at Location ${locationId} because there are reservations at location`,
          })
        })
      })

      describe("Update inventory levels", () => {
        let locationId
        let inventoryItemId
        beforeEach(async () => {
          const invItemReps = await api.post(
            `/admin/inventory-items`,
            { sku: "test-sku" },
            adminHeaders
          )

          inventoryItemId = invItemReps.data.inventory_item.id

          const stockLocation = await appContainer
            .resolve(ModuleRegistrationName.STOCK_LOCATION)
            .create({ name: "test-location" })

          locationId = stockLocation.id

          await api.post(
            `/admin/inventory-items/${inventoryItemId}/location-levels`,
            {
              location_id: locationId,
              stocked_quantity: 10,
            },
            adminHeaders
          )
        })

        it("should update the stocked and incoming quantity for an inventory level", async () => {
          const result = await api.post(
            `/admin/inventory-items/${inventoryItemId}/location-levels/${locationId}`,
            {
              stocked_quantity: 15,
              incoming_quantity: 5,
            },
            adminHeaders
          )

          expect(result.status).toEqual(200)
          expect(result.data.inventory_item).toEqual(
            expect.objectContaining({
              id: inventoryItemId,
              location_levels: expect.arrayContaining([
                expect.objectContaining({
                  id: expect.any(String),
                  inventory_item_id: inventoryItemId,
                  location_id: locationId,
                  stocked_quantity: 15,
                  reserved_quantity: 0,
                  incoming_quantity: 5,
                  metadata: null,
                }),
              ]),
            })
          )
        })

        it("should fail to update a non-existing location level", async () => {
          const error = await api
            .post(
              `/admin/inventory-items/${inventoryItemId}/location-levels/does-not-exist`,
              {
                stocked_quantity: 15,
                incoming_quantity: 5,
              },
              adminHeaders
            )
            .catch((e) => e)

          expect(error.response.status).toEqual(404)
          expect(error.response.data).toEqual({
            type: "not_found",
            message: `Item ${inventoryItemId} is not stocked at location does-not-exist`,
          })
        })

        it("should fail to update a non-existing inventory_item_id level", async () => {
          const error = await api
            .post(
              `/admin/inventory-items/does-not-exist/location-levels/${locationId}`,
              {
                stocked_quantity: 15,
                incoming_quantity: 5,
              },
              adminHeaders
            )
            .catch((e) => e)

          expect(error.response.status).toEqual(404)
          expect(error.response.data).toEqual({
            type: "not_found",
            message: `Item does-not-exist is not stocked at location ${locationId}`,
          })
        })
      })

      describe("Retrieve inventory item", () => {
        let location1 = "loc_1"
        let location2 = "loc_2"
        beforeEach(async () => {
          await service.create([
            {
              sku: "MY_SKU",
              origin_country: "UK",
              hs_code: "hs001",
              mid_code: "mids",
              material: "material",
              weight: 300,
              length: 100,
              height: 200,
              width: 150,
            },
          ])
        })

        it("should retrieve the inventory item", async () => {
          const [{ id: inventoryItemId }] = await service.list({})

          await service.createInventoryLevels([
            {
              inventory_item_id: inventoryItemId,
              location_id: location1,
              stocked_quantity: 15,
              incoming_quantity: 5,
            },
            {
              inventory_item_id: inventoryItemId,
              location_id: location2,
              stocked_quantity: 7,
              incoming_quantity: 0,
              reserved_quantity: 1,
            },
          ])

          const response = await api.get(
            `/admin/inventory-items/${inventoryItemId}`,
            adminHeaders
          )

          expect(response.data.inventory_item).toEqual(
            expect.objectContaining({
              id: inventoryItemId,
              sku: "MY_SKU",
              origin_country: "UK",
              hs_code: "hs001",
              material: "material",
              mid_code: "mids",
              requires_shipping: true,
              weight: 300,
              length: 100,
              height: 200,
              width: 150,
              stocked_quantity: 22,
              reserved_quantity: 1,
              location_levels: [
                expect.objectContaining({
                  id: expect.any(String),
                  inventory_item_id: inventoryItemId,
                  location_id: location1,
                  stocked_quantity: 15,
                  reserved_quantity: 0,
                  incoming_quantity: 5,
                  available_quantity: 15,
                  metadata: null,
                }),
                expect.objectContaining({
                  id: expect.any(String),
                  inventory_item_id: inventoryItemId,
                  location_id: location2,
                  stocked_quantity: 7,
                  reserved_quantity: 1,
                  incoming_quantity: 0,
                  available_quantity: 6,
                  metadata: null,
                }),
              ],
            })
          )
        })

        it("should throw if inventory item doesn't exist", async () => {
          const error = await api
            .get(`/admin/inventory-items/does-not-exist`, adminHeaders)
            .catch((e) => e)

          expect(error.response.status).toEqual(404)
          expect(error.response.data).toEqual({
            type: "not_found",
            message: "Inventory item with id: does-not-exist was not found",
          })
        })
      })

      describe("Create inventory item level", () => {
        let location1
        let location2

        beforeEach(async () => {
          await service.create([
            {
              sku: "MY_SKU",
              origin_country: "UK",
              hs_code: "hs001",
              mid_code: "mids",
              material: "material",
              weight: 300,
              length: 100,
              height: 200,
              width: 150,
            },
          ])

          const stockLocationService: IStockLocationService =
            appContainer.resolve(ModuleRegistrationName.STOCK_LOCATION)

          location1 = await stockLocationService.create({
            name: "location-1",
          })

          location2 = await stockLocationService.create({
            name: "location-2",
          })
        })

        it("should create location levels for an inventory item", async () => {
          const [{ id: inventoryItemId }] = await service.list({})

          await api.post(
            `/admin/inventory-items/${inventoryItemId}/location-levels`,
            {
              location_id: location1.id,
              stocked_quantity: 10,
            },
            adminHeaders
          )

          await api.post(
            `/admin/inventory-items/${inventoryItemId}/location-levels`,
            {
              location_id: location2.id,
              stocked_quantity: 5,
            },
            adminHeaders
          )

          const levels = await service.listInventoryLevels({
            inventory_item_id: inventoryItemId,
          })

          expect(levels).toHaveLength(2)
          expect(levels).toEqual([
            expect.objectContaining({
              location_id: location1.id,
              stocked_quantity: 10,
            }),
            expect.objectContaining({
              location_id: location2.id,
              stocked_quantity: 5,
            }),
          ])
        })

        it("should fail to create a location level for an inventory item", async () => {
          const [{ id: inventoryItemId }] = await service.list({})

          const error = await api
            .post(
              `/admin/inventory-items/${inventoryItemId}/location-levels`,
              {
                location_id: "{location1.id}",
                stocked_quantity: 10,
              },
              adminHeaders
            )
            .catch((error) => error)

          expect(error.response.status).toEqual(404)
          expect(error.response.data).toEqual({
            type: "not_found",
            message: "Stock locations with ids: {location1.id} was not found",
          })
        })
      })

      describe("Create inventory items", () => {
        it("should create inventory items", async () => {
          const response = await api.post(
            `/admin/inventory-items`,
            {
              sku: "test-sku",
            },
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.inventory_item).toEqual(
            expect.objectContaining({
              sku: "test-sku",
            })
          )
        })
      })

      describe("List inventory items", () => {
        let location1 = "loc_1"
        let location2 = "loc_2"
        beforeEach(async () => {
          await service.create([
            {
              sku: "MY_SKU",
              origin_country: "UK",
              hs_code: "hs001",
              mid_code: "mids",
              material: "material",
              weight: 300,
              length: 100,
              height: 200,
              width: 150,
            },
          ])
        })

        it("should list the inventory items", async () => {
          const [{ id: inventoryItemId }] = await service.list({})

          await service.createInventoryLevels([
            {
              inventory_item_id: inventoryItemId,
              location_id: location1,
              stocked_quantity: 10,
            },
            {
              inventory_item_id: inventoryItemId,
              location_id: location2,
              stocked_quantity: 5,
            },
          ])

          const response = await api.get(`/admin/inventory-items`, adminHeaders)

          expect(response.data.inventory_items).toHaveLength(1)
          expect(response.data.inventory_items[0]).toEqual(
            expect.objectContaining({
              id: inventoryItemId,
              sku: "MY_SKU",
              origin_country: "UK",
              hs_code: "hs001",
              mid_code: "mids",
              material: "material",
              weight: 300,
              length: 100,
              height: 200,
              width: 150,
              requires_shipping: true,
              metadata: null,
              location_levels: expect.arrayContaining([
                expect.objectContaining({
                  id: expect.any(String),
                  inventory_item_id: inventoryItemId,
                  location_id: location1,
                  stocked_quantity: 10,
                  reserved_quantity: 0,
                  incoming_quantity: 0,
                  metadata: null,
                  available_quantity: 10,
                }),
                expect.objectContaining({
                  id: expect.any(String),
                  inventory_item_id: inventoryItemId,
                  location_id: location2,
                  stocked_quantity: 5,
                  reserved_quantity: 0,
                  incoming_quantity: 0,
                  metadata: null,
                  available_quantity: 5,
                }),
              ]),
              reserved_quantity: 0,
              stocked_quantity: 15,
            })
          )
        })

        it("should list the inventory items searching by title, description and sku", async () => {
          const inventoryService = appContainer.resolve("inventoryService")

          await inventoryService.create([
            {
              title: "Test Item",
            },
            {
              description: "Test Desc",
            },
            {
              sku: "Test Sku",
            },
          ])

          const response = await api.get(
            `/admin/inventory-items?q=test`,
            adminHeaders
          )

          expect(response.data.inventory_items).not.toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                sku: "MY_SKU",
              }),
            ])
          )
          expect(response.data.inventory_items).toHaveLength(3)
          expect(response.data.inventory_items).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                sku: "Test Sku",
              }),
              expect.objectContaining({
                description: "Test Desc",
              }),
              expect.objectContaining({
                title: "Test Item",
              }),
            ])
          )
        })
      })

      describe("delete inventory item", () => {
        let invItem
        beforeEach(async () => {
          invItem = await service.create({
            sku: "MY_SKU",
            origin_country: "UK",
            hs_code: "hs001",
            mid_code: "mids",
            material: "material",
            weight: 300,
            length: 100,
            height: 200,
            width: 150,
          })
        })

        it("should remove associated levels and reservations when deleting an inventory item", async () => {
          const inventoryService = appContainer.resolve(
            ModuleRegistrationName.INVENTORY
          )

          locationId = "location1"

          await inventoryService.createInventoryLevels({
            inventory_item_id: invItem.id,
            location_id: locationId,
            stocked_quantity: 10,
          })

          await inventoryService.createReservationItems({
            inventory_item_id: invItem.id,
            location_id: locationId,
            quantity: 5,
          })

          const [, reservationCount] =
            await inventoryService.listAndCountReservationItems({
              location_id: locationId,
            })

          expect(reservationCount).toEqual(1)

          const [, inventoryLevelCount] =
            await inventoryService.listAndCountInventoryLevels({
              location_id: locationId,
            })

          expect(inventoryLevelCount).toEqual(1)

          const res = await api.delete(
            `/admin/inventory-items/${invItem.id}`,
            adminHeaders
          )

          expect(res.status).toEqual(200)

          const [, reservationCountPostDelete] =
            await inventoryService.listAndCountReservationItems({
              location_id: locationId,
            })

          expect(reservationCountPostDelete).toEqual(0)

          const [, inventoryLevelCountPostDelete] =
            await inventoryService.listAndCountInventoryLevels({
              location_id: locationId,
            })

          expect(inventoryLevelCountPostDelete).toEqual(0)
        })

        it("should remove the product variant associations when deleting an inventory item", async () => {
          const secondVariantId = "test-2"
          const variantId = "test"

          const remoteLinks = appContainer.resolve(
            ContainerRegistrationKeys.REMOTE_LINK
          )
          const remoteQuery = appContainer.resolve(
            ContainerRegistrationKeys.REMOTE_QUERY
          )

          await remoteLinks.create([
            {
              productService: {
                variant_id: variantId,
              },
              inventoryService: {
                inventory_item_id: invItem.id,
              },
            },
            {
              productService: {
                variant_id: secondVariantId,
              },
              inventoryService: {
                inventory_item_id: invItem.id,
              },
            },
          ])

          let links = await remoteQuery(
            remoteQueryObjectFromString({
              entryPoint: "product_variant_inventory_item",
              variables: {
                filter: { variant_id: [variantId, secondVariantId] },
              },
              fields: ["variant_id", "inventory_item_id"],
            })
          )

          expect(links).toHaveLength(2)
          expect(links).toEqual(
            expect.arrayContaining([
              {
                variant_id: "test",
                inventory_item_id: invItem.id,
              },
              {
                variant_id: "test-2",
                inventory_item_id: invItem.id,
              },
            ])
          )

          await api.delete(`/admin/inventory-items/${invItem.id}`, adminHeaders)

          links = await remoteQuery(
            remoteQueryObjectFromString({
              entryPoint: "product_variant_inventory_item",
              variables: {
                filter: { variant_id: [variantId, secondVariantId] },
              },
              fields: ["variant_id", "inventory_item_id"],
            })
          )

          expect(links).toHaveLength(0)
          expect(links).toEqual([])
        })
      })
    })
  },
})

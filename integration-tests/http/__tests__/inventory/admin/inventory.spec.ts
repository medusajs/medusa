import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { Modules } from "@medusajs/utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"
import { updateInventoryItemsWorkflow } from "@medusajs/core-flows"

jest.setTimeout(30000)

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api }) => {
    let inventoryItem1
    let inventoryItem2
    let stockLocation1
    let stockLocation2
    let stockLocation3

    let shippingProfile
    let container
    beforeEach(async () => {
      await createAdminUser(dbConnection, adminHeaders, getContainer())

      container = getContainer()

      shippingProfile = (
        await api.post(
          `/admin/shipping-profiles`,
          { name: "Test", type: "default" },
          adminHeaders
        )
      ).data.shipping_profile

      stockLocation1 = (
        await api.post(`/admin/stock-locations`, { name: "loc1" }, adminHeaders)
      ).data.stock_location

      stockLocation2 = (
        await api.post(`/admin/stock-locations`, { name: "loc2" }, adminHeaders)
      ).data.stock_location

      stockLocation3 = (
        await api.post(`/admin/stock-locations`, { name: "loc3" }, adminHeaders)
      ).data.stock_location

      inventoryItem1 = (
        await api.post(
          `/admin/inventory-items`,
          {
            sku: "12345",
            origin_country: "UK",
            hs_code: "hs001",
            mid_code: "mids",
            material: "material",
            weight: 300,
            length: 100,
            height: 200,
            width: 150,
          },
          adminHeaders
        )
      ).data.inventory_item

      inventoryItem2 = (
        await api.post(
          `/admin/inventory-items`,
          { sku: "second", origin_country: "UK", hs_code: "hs001" },
          adminHeaders
        )
      ).data.inventory_item
    })

    describe("Inventory Items", () => {
      describe("GET /admin/inventory-items/:id/location-levels", () => {
        beforeEach(async () => {
          await api.post(
            `/admin/inventory-items/${inventoryItem1.id}/location-levels`,
            {
              location_id: stockLocation1.id,
              stocked_quantity: 10,
            },
            adminHeaders
          )

          await api.post(
            `/admin/inventory-items/${inventoryItem1.id}/location-levels`,
            {
              location_id: stockLocation2.id,
              stocked_quantity: 15,
            },
            adminHeaders
          )
        })

        it("should list the inventory levels", async () => {
          const response = await api.get(
            `/admin/inventory-items/${inventoryItem1.id}/location-levels`,
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
                location_id: stockLocation1.id,
                stocked_quantity: 10,
              }),
              expect.objectContaining({
                location_id: stockLocation2.id,
                stocked_quantity: 15,
              }),
            ])
          )
        })

        it("should list the location levels based on id param constraint", async () => {
          const inventoryItemId = inventoryItem1.id

          const result = await api.get(
            `/admin/inventory-items/${inventoryItemId}/location-levels?location_id[]=${stockLocation1.id}`,
            adminHeaders
          )

          expect(result.status).toEqual(200)
          expect(result.data.inventory_levels).toHaveLength(1)
          expect(result.data.inventory_levels).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                stocked_quantity: 10,
              }),
            ])
          )
        })
      })

      describe("POST /admin/inventory-items/location-levels/batch", () => {
        let locationLevel1
        let locationLevel2

        beforeEach(async () => {
          const seed = await api.post(
            `/admin/inventory-items/${inventoryItem1.id}/location-levels/batch`,
            {
              create: [
                {
                  location_id: stockLocation1.id,
                  stocked_quantity: 0,
                },
                {
                  location_id: stockLocation2.id,
                  stocked_quantity: 10,
                },
              ],
            },
            adminHeaders
          )

          locationLevel1 = seed.data.created[0]
          locationLevel2 = seed.data.created[1]
        })

        it("should batch update the inventory levels", async () => {
          const result = await api.post(
            `/admin/inventory-items/location-levels/batch`,
            {
              update: [
                {
                  location_id: stockLocation1.id,
                  inventory_item_id: inventoryItem1.id,
                  stocked_quantity: 10,
                },
                {
                  location_id: stockLocation2.id,
                  inventory_item_id: inventoryItem1.id,
                  stocked_quantity: 20,
                },
              ],
            },
            adminHeaders
          )

          expect(result.status).toEqual(200)
          expect(result.data).toEqual(
            expect.objectContaining({
              updated: expect.arrayContaining([
                expect.objectContaining({
                  location_id: stockLocation1.id,
                  inventory_item_id: inventoryItem1.id,
                  stocked_quantity: 10,
                }),
                expect.objectContaining({
                  location_id: stockLocation2.id,
                  inventory_item_id: inventoryItem1.id,
                  stocked_quantity: 20,
                }),
              ]),
            })
          )
        })

        it("should batch create the inventory levels", async () => {
          const result = await api.post(
            `/admin/inventory-items/location-levels/batch`,
            {
              create: [
                {
                  location_id: stockLocation3.id,
                  inventory_item_id: inventoryItem1.id,
                  stocked_quantity: 10,
                },
              ],
            },
            adminHeaders
          )

          expect(result.status).toEqual(200)
          expect(result.data).toEqual(
            expect.objectContaining({
              created: expect.arrayContaining([
                expect.objectContaining({
                  location_id: stockLocation3.id,
                  inventory_item_id: inventoryItem1.id,
                  stocked_quantity: 10,
                }),
              ]),
            })
          )
        })

        it("should batch delete the inventory levels when stocked quantity is 0 and force is false", async () => {
          const result = await api.post(
            `/admin/inventory-items/location-levels/batch`,
            { delete: [locationLevel1.id] },
            adminHeaders
          )

          expect(result.status).toEqual(200)
          expect(result.data).toEqual(
            expect.objectContaining({
              deleted: [locationLevel1.id],
            })
          )
        })

        it("should not delete the inventory levels when stocked quantity is greater than 0 and force is false", async () => {
          const error = await api
            .post(
              `/admin/inventory-items/location-levels/batch`,
              { delete: [locationLevel2.id] },
              adminHeaders
            )
            .catch((e) => e)

          expect(error.response.status).toEqual(400)
          expect(error.response.data).toEqual({
            type: "not_allowed",
            message: `Cannot remove Inventory Levels for ${stockLocation2.id} because there are stocked items at the locations. Use force flag to delete anyway.`,
          })
        })

        it("should delete the inventory levels when stocked quantity is greater than 0 and force is true", async () => {
          const result = await api.post(
            `/admin/inventory-items/location-levels/batch`,
            { delete: [locationLevel2.id], force: true },
            adminHeaders
          )

          expect(result.status).toEqual(200)
          expect(result.data).toEqual(
            expect.objectContaining({
              deleted: [locationLevel2.id],
            })
          )
        })

        it("should not call listInventoryLevels when update array is empty", async () => {
          const container = getContainer()
          const inventoryService = container.resolve(Modules.INVENTORY)

          const listInventoryLevelsSpy = jest.spyOn(
            inventoryService,
            "listInventoryLevels"
          )

          const result = await api.post(
            `/admin/inventory-items/location-levels/batch`,
            {
              update: [],
              create: [],
              delete: [],
            },
            adminHeaders
          )

          expect(result.status).toEqual(200)
          expect(result.data).toEqual(
            expect.objectContaining({
              created: [],
              updated: [],
              deleted: [],
            })
          )

          expect(listInventoryLevelsSpy).not.toHaveBeenCalled()

          listInventoryLevelsSpy.mockRestore()
        })
      })

      describe("POST /admin/inventory-items/:id/location-levels/batch", () => {
        let locationLevel1

        beforeEach(async () => {
          const seed = await api.post(
            `/admin/inventory-items/${inventoryItem1.id}/location-levels`,
            {
              location_id: stockLocation1.id,
              stocked_quantity: 0,
            },
            adminHeaders
          )

          locationLevel1 = seed.data.inventory_item.location_levels[0]
        })

        it("should delete an inventory location level and create a new one", async () => {
          const result = await api.post(
            `/admin/inventory-items/${inventoryItem1.id}/location-levels/batch`,
            {
              create: [{ location_id: "location_2" }],
              delete: [locationLevel1.id],
              force: true,
            },
            adminHeaders
          )

          expect(result.status).toEqual(200)

          const levelsListResult = await api.get(
            `/admin/inventory-items/${inventoryItem1.id}/location-levels`,
            adminHeaders
          )
          expect(levelsListResult.status).toEqual(200)
          expect(levelsListResult.data.inventory_levels).toHaveLength(1)
        })

        it("should not delete an inventory location level when there is stocked items without force", async () => {
          await api.post(
            `/admin/inventory-items/${inventoryItem1.id}/location-levels/${stockLocation1.id}`,
            { stocked_quantity: 10 },
            adminHeaders
          )

          const { response } = await api
            .post(
              `/admin/inventory-items/${inventoryItem1.id}/location-levels/batch`,
              { delete: [locationLevel1.id] },
              adminHeaders
            )
            .catch((e) => e)

          expect(response.status).toEqual(400)
          expect(response.data).toEqual({
            type: "not_allowed",
            message: `Cannot remove Inventory Levels for ${stockLocation1.id} because there are stocked items at the locations. Use force flag to delete anyway.`,
          })
        })

        it("should successfully add an inventory location", async () => {
          await api.post(
            `/admin/inventory-items/${inventoryItem1.id}/location-levels/${stockLocation1.id}`,
            { stocked_quantity: 10 },
            adminHeaders
          )

          await api.post(
            `/admin/inventory-items/${inventoryItem1.id}/location-levels/batch`,
            { create: [{ location_id: stockLocation2.id }] },
            adminHeaders
          )

          const {
            data: { inventory_levels: inventoryLevels },
          } = await api.get(
            `/admin/inventory-items/${inventoryItem1.id}/location-levels`,
            adminHeaders
          )

          expect(inventoryLevels).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                location_id: stockLocation1.id,
              }),
              expect.objectContaining({
                location_id: stockLocation2.id,
              }),
            ])
          )
        })
      })

      describe("DELETE /admin/inventory-items/:id/location-levels/:id", () => {
        beforeEach(async () => {
          await api.post(
            `/admin/inventory-items/${inventoryItem1.id}/location-levels`,
            {
              location_id: stockLocation1.id,
              stocked_quantity: 0,
            },
            adminHeaders
          )
        })

        it("should delete an inventory location level without reservations", async () => {
          const result = await api.delete(
            `/admin/inventory-items/${inventoryItem1.id}/location-levels/${stockLocation1.id}`,
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
          await api.post(
            `/admin/inventory-items/${inventoryItem1.id}/location-levels/${stockLocation1.id}`,
            { stocked_quantity: 10 },
            adminHeaders
          )

          await api.post(
            `/admin/reservations`,
            {
              inventory_item_id: inventoryItem1.id,
              location_id: stockLocation1.id,
              quantity: 5,
            },
            adminHeaders
          )

          let error
          await api
            .delete(
              `/admin/inventory-items/${inventoryItem1.id}/location-levels/${stockLocation1.id}`,
              adminHeaders
            )
            .catch((e) => (error = e))
          expect(error.response.status).toEqual(400)
          expect(error.response.data).toEqual({
            type: "not_allowed",
            message: `Cannot remove Inventory Level ${inventoryItem1.id} at Location ${stockLocation1.id} because there are reservations at location`,
          })
        })
      })

      describe("POST /admin/inventory-items/:id/location-levels/:id", () => {
        beforeEach(async () => {
          await api.post(
            `/admin/inventory-items/${inventoryItem1.id}/location-levels`,
            {
              location_id: stockLocation1.id,
              stocked_quantity: 10,
            },
            adminHeaders
          )
        })

        it("should update the stocked and incoming quantity for an inventory level", async () => {
          const result = await api.post(
            `/admin/inventory-items/${inventoryItem1.id}/location-levels/${stockLocation1.id}`,
            {
              stocked_quantity: 15,
              incoming_quantity: 5,
            },
            adminHeaders
          )

          expect(result.status).toEqual(200)
          expect(result.data.inventory_item).toEqual(
            expect.objectContaining({
              id: inventoryItem1.id,
              location_levels: expect.arrayContaining([
                expect.objectContaining({
                  id: expect.any(String),
                  inventory_item_id: inventoryItem1.id,
                  location_id: stockLocation1.id,
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
              `/admin/inventory-items/${inventoryItem1.id}/location-levels/does-not-exist`,
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
            message: `Item ${inventoryItem1.id} is not stocked at location does-not-exist`,
          })
        })

        it("should fail to update a non-existing inventory_item_id level", async () => {
          const error = await api
            .post(
              `/admin/inventory-items/does-not-exist/location-levels/${stockLocation1.id}`,
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
            message: `Item does-not-exist is not stocked at location ${stockLocation1.id}`,
          })
        })

        it("should fail to update the location level to negative quantity", async () => {
          const res = await api
            .post(
              `/admin/inventory-items/${inventoryItem1.id}/location-levels/${stockLocation1.id}`,
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
              "Invalid request: Value for field 'stocked_quantity' too small, expected at least: '0'; Value for field 'incoming_quantity' too small, expected at least: '0'",
          })
        })
      })

      describe("POST /admin/inventory-items/:id/location-levels", () => {
        it("should create location levels for an inventory item", async () => {
          await api.post(
            `/admin/inventory-items/${inventoryItem1.id}/location-levels`,
            {
              location_id: stockLocation1.id,
              stocked_quantity: 10,
            },
            adminHeaders
          )

          await api.post(
            `/admin/inventory-items/${inventoryItem1.id}/location-levels`,
            {
              location_id: stockLocation2.id,
              stocked_quantity: 5,
            },
            adminHeaders
          )

          const levels = (
            await api.get(
              `/admin/inventory-items/${inventoryItem1.id}/location-levels`,
              adminHeaders
            )
          ).data.inventory_levels

          expect(levels).toHaveLength(2)
          expect(levels).toEqual([
            expect.objectContaining({
              location_id: stockLocation1.id,
              stocked_quantity: 10,
            }),
            expect.objectContaining({
              location_id: stockLocation2.id,
              stocked_quantity: 5,
            }),
          ])
        })

        it("should fail to create a location level for an inventory item", async () => {
          const error = await api
            .post(
              `/admin/inventory-items/${inventoryItem1.id}/location-levels`,
              {
                location_id: "does-not-exist",
                stocked_quantity: 10,
              },
              adminHeaders
            )
            .catch((error) => error)

          expect(error.response.status).toEqual(404)
          expect(error.response.data).toEqual({
            type: "not_found",
            message: `Stock locations with ids: does-not-exist was not found`,
          })
        })
      })

      describe("GET /admin/inventory-items", () => {
        it("should list the inventory items", async () => {
          await api.post(
            `/admin/inventory-items/${inventoryItem1.id}/location-levels`,
            {
              location_id: stockLocation1.id,
              stocked_quantity: 10,
            },
            adminHeaders
          )

          await api.post(
            `/admin/inventory-items/${inventoryItem1.id}/location-levels`,
            {
              location_id: stockLocation2.id,
              stocked_quantity: 5,
            },
            adminHeaders
          )

          const response = await api.get(
            `/admin/inventory-items?location_levels[location_id]=${stockLocation1.id}`,
            adminHeaders
          )

          expect(response.data.inventory_items).toHaveLength(1)
          expect(response.data.inventory_items[0]).toEqual(
            expect.objectContaining({
              id: inventoryItem1.id,
              sku: "12345",
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
                  inventory_item_id: inventoryItem1.id,
                  location_id: stockLocation1.id,
                  stocked_quantity: 10,
                  reserved_quantity: 0,
                  incoming_quantity: 0,
                  metadata: null,
                  available_quantity: 10,
                }),
                expect.objectContaining({
                  id: expect.any(String),
                  inventory_item_id: inventoryItem1.id,
                  location_id: stockLocation2.id,
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
          await api.post(
            `/admin/inventory-items`,
            {
              title: "Test Item",
            },
            adminHeaders
          )
          await api.post(
            `/admin/inventory-items`,
            {
              description: "Test Desc",
            },
            adminHeaders
          )
          await api.post(
            `/admin/inventory-items`,
            {
              sku: "Test Sku",
            },
            adminHeaders
          )

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

      describe("GET /admin/inventory-items/:id", () => {
        it("should retrieve the inventory item", async () => {
          await api.post(
            `/admin/inventory-items/${inventoryItem1.id}/location-levels`,
            {
              location_id: stockLocation1.id,
              stocked_quantity: 15,
              incoming_quantity: 5,
            },
            adminHeaders
          )

          await api.post(
            `/admin/inventory-items/${inventoryItem1.id}/location-levels`,
            {
              location_id: stockLocation2.id,
              stocked_quantity: 7,
              incoming_quantity: 0,
            },
            adminHeaders
          )

          await api.post(
            `/admin/reservations`,
            {
              line_item_id: "line-item-id-1",
              inventory_item_id: inventoryItem1.id,
              location_id: stockLocation2.id,
              description: "test description",
              quantity: 1,
            },
            adminHeaders
          )

          const response = await api.get(
            `/admin/inventory-items/${inventoryItem1.id}`,
            adminHeaders
          )

          expect(response.data.inventory_item).toEqual(
            expect.objectContaining({
              id: inventoryItem1.id,
              sku: "12345",
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
                  inventory_item_id: inventoryItem1.id,
                  location_id: stockLocation1.id,
                  stocked_quantity: 15,
                  reserved_quantity: 0,
                  incoming_quantity: 5,
                  available_quantity: 15,
                  metadata: null,
                }),
                expect.objectContaining({
                  id: expect.any(String),
                  inventory_item_id: inventoryItem1.id,
                  location_id: stockLocation2.id,
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

        it("should retrieve the inventory item with correct stocked quantity given location levels have been deleted", async () => {
          await api.post(
            `/admin/inventory-items/${inventoryItem1.id}/location-levels`,
            {
              location_id: stockLocation1.id,
              stocked_quantity: 10,
              incoming_quantity: 0,
            },
            adminHeaders
          )

          const item = (
            await api.post(
              `/admin/inventory-items/${inventoryItem1.id}/location-levels`,
              {
                location_id: stockLocation2.id,
                stocked_quantity: 10,
                incoming_quantity: 0,
              },
              adminHeaders
            )
          ).data.inventory_item

          await api.post(
            `/admin/reservations`,
            {
              line_item_id: "line-item-id-1",
              inventory_item_id: inventoryItem1.id,
              location_id: stockLocation2.id,
              description: "test description",
              quantity: 1,
            },
            adminHeaders
          )

          const reservation = (
            await api.post(
              `/admin/reservations`,
              {
                line_item_id: "line-item-id-2",
                inventory_item_id: inventoryItem1.id,
                location_id: stockLocation2.id,
                description: "test description 2",
                quantity: 1,
              },
              adminHeaders
            )
          ).data.reservation

          await api.delete(
            `/admin/reservations/${reservation.id}`,
            adminHeaders
          )

          const response = await api.get(
            `/admin/inventory-items/${inventoryItem1.id}`,
            adminHeaders
          )

          expect(response.data.inventory_item).toEqual(
            expect.objectContaining({
              id: inventoryItem1.id,
              stocked_quantity: 20,
              reserved_quantity: 1,
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

      describe("POST /admin/inventory-items", () => {
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

        it("should create inventory items along with location levels", async () => {
          const response = await api.post(
            `/admin/inventory-items?fields=*location_levels`,
            {
              sku: "test-sku",
              location_levels: [
                {
                  location_id: stockLocation1.id,
                  stocked_quantity: 20,
                  incoming_quantity: 40,
                },
              ],
            },
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.inventory_item).toEqual(
            expect.objectContaining({
              sku: "test-sku",
              location_levels: [
                expect.objectContaining({
                  id: expect.any(String),
                  inventory_item_id: expect.any(String),
                  stocked_quantity: 20,
                  incoming_quantity: 40,
                }),
              ],
            })
          )
        })
      })

      describe("POST /admin/inventory-items/:id", () => {
        it("should update the inventory item", async () => {
          const response = await api.post(
            `/admin/inventory-items/${inventoryItem1.id}`,
            {
              mid_code: "updated mid_code",
              weight: 120,
            },
            adminHeaders
          )

          expect(response.data.inventory_item).toEqual(
            expect.objectContaining({
              sku: "12345",
              mid_code: "updated mid_code",
              weight: 120,
            })
          )
        })
      })

      describe("DELETE /admin/inventory-items/:id", () => {
        it("should throw if inventory item with reservations is being removed", async () => {
          await api.post(
            `/admin/inventory-items/${inventoryItem1.id}/location-levels`,
            {
              location_id: stockLocation1.id,
              stocked_quantity: 10,
            },
            adminHeaders
          )

          await api.post(
            `/admin/reservations`,
            {
              line_item_id: "line-item-id-1",
              inventory_item_id: inventoryItem1.id,
              location_id: stockLocation1.id,
              description: "test description",
              quantity: 5,
            },
            adminHeaders
          )

          const reservationsResponse = (
            await api.get(
              `/admin/reservations?location_id[]=${stockLocation1.id}`,
              adminHeaders
            )
          ).data

          expect(reservationsResponse.count).toEqual(1)

          const levelsResponse = (
            await api.get(
              `/admin/inventory-items/${inventoryItem1.id}/location-levels?location_id[]=${stockLocation1.id}`,
              adminHeaders
            )
          ).data
          expect(levelsResponse.count).toEqual(1)

          const res = await api
            .delete(`/admin/inventory-items/${inventoryItem1.id}`, adminHeaders)
            .catch((err) => {
              return err.response
            })

          expect(res.status).toEqual(400)
          expect(res.data.message).toEqual(
            `Cannot remove following inventory item(s) since they have reservations: [${inventoryItem1.id}].`
          )
        })

        it("should remove the product variant associations when deleting an inventory item", async () => {
          const product = (
            await api.post(
              "/admin/products",
              {
                title: "product 1",
                options: [{ title: "size", values: ["large"] }],
                shipping_profile_id: shippingProfile.id,
                variants: [
                  {
                    title: "variant 1",
                    options: { size: "large" },
                    prices: [{ currency_code: "usd", amount: 100 }],
                    inventory_items: [
                      {
                        inventory_item_id: inventoryItem1.id,
                        required_quantity: 10,
                      },
                    ],
                  },
                  {
                    title: "variant 2",
                    prices: [{ currency_code: "usd", amount: 100 }],
                    inventory_items: [
                      {
                        inventory_item_id: inventoryItem1.id,
                        required_quantity: 5,
                      },
                    ],
                  },
                ],
              },
              adminHeaders
            )
          ).data.product

          const variant1 = product.variants[0]
          const variant2 = product.variants[1]

          await api.delete(
            `/admin/inventory-items/${inventoryItem1.id}`,
            adminHeaders
          )

          const updatedVariant1 = (
            await api.get(
              `/admin/products/${product.id}/variants/${variant1.id}?fields=inventory_items.inventory.*,inventory_items.*`,
              adminHeaders
            )
          ).data.variant

          expect(updatedVariant1.inventory_items).toHaveLength(0)

          const updatedVariant2 = (
            await api.get(
              `/admin/products/${product.id}/variants/${variant2.id}?fields=inventory_items.inventory.*,inventory_items.*`,
              adminHeaders
            )
          ).data.variant

          expect(updatedVariant2.inventory_items).toHaveLength(0)
        })
      })

      describe("workflows", () => {
        describe("updateInventoryItemsWorkflow", () => {
          it("should not call listInventoryItems when updates is empty", async () => {
            const inventoryService = container.resolve(Modules.INVENTORY)
            const listInventoryItemsSpy = jest.spyOn(
              inventoryService,
              "listInventoryItems"
            )

            const { result } = await updateInventoryItemsWorkflow(
              container
            ).run({
              input: { updates: [] },
            })

            expect(result).toEqual([])
            expect(listInventoryItemsSpy).not.toHaveBeenCalled()

            listInventoryItemsSpy.mockRestore()
          })
        })
      })
    })
  },
})

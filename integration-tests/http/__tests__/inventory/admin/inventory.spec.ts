import { medusaIntegrationTestRunner } from "medusa-test-utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"

jest.setTimeout(30000)

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api }) => {
    let inventoryItem1
    let inventoryItem2
    let stockLocation1
    let stockLocation2

    beforeEach(async () => {
      await createAdminUser(dbConnection, adminHeaders, getContainer())

      stockLocation1 = (
        await api.post(`/admin/stock-locations`, { name: "loc1" }, adminHeaders)
      ).data.stock_location

      stockLocation2 = (
        await api.post(`/admin/stock-locations`, { name: "loc2" }, adminHeaders)
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

      describe("POST /admin/inventory-items/:id/location-levels/batch", () => {
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

        it("should delete an inventory location level and create a new one", async () => {
          const result = await api.post(
            `/admin/inventory-items/${inventoryItem1.id}/location-levels/batch`,
            {
              create: [
                {
                  location_id: "location_2",
                },
              ],
              delete: [stockLocation1.id],
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
      })

      describe("DELETE /admin/inventory-items/:id/location-levels/:id", () => {
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
          await api.post(
            `/admin/inventory-items/${inventoryItem1.id}/location-levels`,
            {
              location_id: stockLocation1.id,
              stocked_quantity: 17,
              incoming_quantity: 2,
            },
            adminHeaders
          )

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
            `/admin/inventory-items?%2blocation_levels.*`,
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
        it("should remove associated levels and reservations when deleting an inventory item", async () => {
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
            { location_id: stockLocation1.id },
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
          expect(levelsResponse.count).toEqual(2)

          const res = await api.delete(
            `/admin/inventory-items/${inventoryItem1.id}`,
            adminHeaders
          )

          expect(res.status).toEqual(200)

          const reservationsResponseAfterDelete = (
            await api.get(
              `/admin/reservations?location_id[]=${stockLocation1.id}`,
              adminHeaders
            )
          ).data

          expect(reservationsResponseAfterDelete.count).toEqual(0)

          const levelsResponseAfterDelete = (
            await api.get(
              `/admin/inventory-items/${inventoryItem1.id}/location-levels?location_id[]=${stockLocation1.id}`,
              adminHeaders
            )
          ).data

          expect(levelsResponseAfterDelete.count).toEqual(0)
        })

        it("should remove the product variant associations when deleting an inventory item", async () => {
          const product = (
            await api.post(
              "/admin/products",
              {
                title: "product 1",
                variants: [
                  {
                    title: "variant 1",
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
    })
  },
})

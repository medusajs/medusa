import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"
import { medusaIntegrationTestRunner } from "medusa-test-utils"
import { getProductFixture } from "../../../../helpers/fixtures"

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api }) => {
    let inventoryItem1
    let inventoryItem2
    let stockLocation1
    let stockLocation2

    beforeEach(async () => {
      await createAdminUser(dbConnection, adminHeaders, getContainer())
      stockLocation1 = (
        await api.post(
          `/admin/stock-locations`,
          {
            name: "loc1",
          },
          adminHeaders
        )
      ).data.stock_location

      stockLocation2 = (
        await api.post(
          `/admin/stock-locations`,
          {
            name: "loc2",
          },
          adminHeaders
        )
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
          {
            sku: "second",
            origin_country: "UK",
            hs_code: "hs001",
          },
          adminHeaders
        )
      ).data.inventory_item
    })

    describe("Inventory Items", () => {
      it.skip("should create, update and delete the inventory location levels", async () => {
        await api.post(
          `/admin/inventory-items/${inventoryItem1.id}/location-levels`,
          {
            location_id: stockLocation1.id,
            stocked_quantity: 17,
            incoming_quantity: 2,
          },
          adminHeaders
        )

        const stockLevel = (
          await api.get(
            `/admin/inventory-items/${inventoryItem1.id}/location-levels?location_id[]=${stockLocation1.id}`,
            adminHeaders
          )
        ).data.inventory_levels[0]

        expect(stockLevel.location_id).toEqual(stockLocation1.id)
        expect(stockLevel.inventory_item_id).toEqual(inventoryItem1.id)
        expect(stockLevel.stocked_quantity).toEqual(17)
        expect(stockLevel.incoming_quantity).toEqual(2)

        await api.post(
          `/admin/inventory-items/${inventoryItem1.id}/location-levels/${stockLocation1.id}`,
          {
            stocked_quantity: 21,
            incoming_quantity: 0,
          },
          adminHeaders
        )

        const newStockLevel = (
          await api.get(
            `/admin/inventory-items/${inventoryItem1.id}/location-levels?location_id[]=${stockLocation1.id}`,
            adminHeaders
          )
        ).data.inventory_levels[0]

        expect(newStockLevel.stocked_quantity).toEqual(21)
        expect(newStockLevel.incoming_quantity).toEqual(0)

        await api.delete(
          `/admin/inventory-items/${inventoryItem1.id}/location-levels/${stockLocation1.id}`,
          adminHeaders
        )
        const deletedStockLevel = (
          await api.get(
            `/admin/inventory-items/${inventoryItem1.id}/location-levels?location_id[]=${stockLocation1.id}`,
            adminHeaders
          )
        ).data.inventory_levels[0]

        expect(deletedStockLevel.message).toEqual(
          `Inventory level for item ${inventoryItem1.id} and location ${stockLocation1.id} not found`
        )
      })

      it.skip("should fail to update the location level to negative quantity", async () => {
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
            "incoming_quantity must not be less than 0, stocked_quantity must not be less than 0",
        })
      })

      it.skip("should create the inventory item", async () => {
        const product = (
          await api.post(
            "/admin/products",
            getProductFixture({ title: "test1" }),
            adminHeaders
          )
        ).data.product

        const variantId = product.variants[0].id

        let variantInventoryRes = await api.get(
          `/admin/variants/${variantId}/inventory`,
          adminHeaders
        )

        expect(variantInventoryRes.data).toEqual({
          variant: {
            id: variantId,
            inventory: [],
            sales_channel_availability: [],
          },
        })
        expect(variantInventoryRes.status).toEqual(200)

        const inventoryItemCreateRes = await api.post(
          `/admin/inventory-items`,
          { variant_id: variantId, sku: "attach_this_to_variant" },
          adminHeaders
        )

        variantInventoryRes = await api.get(
          `/admin/variants/${variantId}/inventory`,
          adminHeaders
        )

        expect(variantInventoryRes.data).toEqual({
          variant: expect.objectContaining({
            id: variantId,
            inventory: [
              expect.objectContaining({
                ...inventoryItemCreateRes.data.inventory_item,
              }),
            ],
          }),
        })
        expect(variantInventoryRes.status).toEqual(200)
      })

      it.skip("should list the location levels based on id param constraint", async () => {
        const inventoryItemId = inventoryItem1.id

        await api.post(
          `/admin/inventory-items/${inventoryItemId}/location-levels`,
          {
            location_id: stockLocation1.id,
            stocked_quantity: 10,
          },
          adminHeaders
        )

        await api.post(
          `/admin/inventory-items/${inventoryItemId}/location-levels`,
          {
            location_id: stockLocation2.id,
            stocked_quantity: 5,
          },
          adminHeaders
        )

        const result = await api.get(
          `/admin/inventory-items/${inventoryItemId}/location-levels?location_id[]=${stockLocation1.id}`,
          adminHeaders
        )

        expect(result.status).toEqual(200)
        expect(result.data.inventory_item.inventory_levels).toHaveLength(1)
        expect(result.data.inventory_item.inventory_levels[0]).toEqual(
          expect.objectContaining({
            stocked_quantity: 10,
          })
        )
      })

      describe("List inventory levels", () => {
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
      })

      describe("Update inventory item", () => {
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

      describe("Bulk create/delete inventory levels", () => {
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

      describe("Delete inventory levels", () => {
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

      describe("Update inventory levels", () => {
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
      })

      describe("Retrieve inventory item", () => {
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
              reserved_quantity: 1,
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

      describe("Create inventory item level", () => {
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

      describe("delete inventory item", () => {
        it.skip("should remove associated levels and reservations when deleting an inventory item", async () => {
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
              location_id: stockLocation1.id,
              reserved_quantity: 5,
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

        it.skip("should remove the product variant associations when deleting an inventory item", async () => {
          //   const secondVariantId = "test-2"
          //   const variantId = "test"
          //   const remoteLinks = appContainer.resolve(
          //     ContainerRegistrationKeys.REMOTE_LINK
          //   )
          //   const remoteQuery = appContainer.resolve(
          //     ContainerRegistrationKeys.REMOTE_QUERY
          //   )
          //   await remoteLinks.create([
          //     {
          //       productService: {
          //         variant_id: variantId,
          //       },
          //       inventoryService: {
          //         inventory_item_id: invItem.id,
          //       },
          //     },
          //     {
          //       productService: {
          //         variant_id: secondVariantId,
          //       },
          //       inventoryService: {
          //         inventory_item_id: invItem.id,
          //       },
          //     },
          //   ])
          //   let links = await remoteQuery(
          //     remoteQueryObjectFromString({
          //       entryPoint: "product_variant_inventory_item",
          //       variables: {
          //         filter: { variant_id: [variantId, secondVariantId] },
          //       },
          //       fields: ["variant_id", "inventory_item_id"],
          //     })
          //   )
          //   expect(links).toHaveLength(2)
          //   expect(links).toEqual(
          //     expect.arrayContaining([
          //       {
          //         variant_id: "test",
          //         inventory_item_id: invItem.id,
          //       },
          //       {
          //         variant_id: "test-2",
          //         inventory_item_id: invItem.id,
          //       },
          //     ])
          //   )
          //   await api.delete(`/admin/inventory-items/${invItem.id}`, adminHeaders)
          //   links = await remoteQuery(
          //     remoteQueryObjectFromString({
          //       entryPoint: "product_variant_inventory_item",
          //       variables: {
          //         filter: { variant_id: [variantId, secondVariantId] },
          //       },
          //       fields: ["variant_id", "inventory_item_id"],
          //     })
          //   )
          //   expect(links).toHaveLength(0)
          //   expect(links).toEqual([])
        })
      })
    })

    describe("Reservation items", () => {
      it.skip("Create reservation item throws if available item quantity is less than reservation quantity", async () => {
        // const orderRes = await api.get(
        //   `/admin/orders/${order.id}`,
        //   adminHeaders
        // )
        // expect(orderRes.data.order.items[0].quantity).toBe(2)
        // expect(orderRes.data.order.items[0].fulfilled_quantity).toBeFalsy()
        // const payload = {
        //   quantity: 1,
        //   inventory_item_id: inventoryItem.id,
        //   line_item_id: lineItemId,
        //   location_id: locationId,
        // }
        // const res = await api
        //   .post(`/admin/reservations`, payload, adminHeaders)
        //   .catch((err) => err)
        // expect(res.response.status).toBe(400)
        // expect(res.response.data).toEqual({
        //   type: "invalid_data",
        //   message:
        //     "The reservation quantity cannot be greater than the unfulfilled line item quantity",
        // })
      })

      it.skip("Update reservation item throws if available item quantity is less than reservation quantity", async () => {
        // const orderRes = await api.get(
        //   `/admin/orders/${order.id}`,
        //   adminHeaders
        // )
        // expect(orderRes.data.order.items[0].quantity).toBe(2)
        // expect(orderRes.data.order.items[0].fulfilled_quantity).toBeFalsy()
        // const payload = {
        //   quantity: 3,
        // }
        // const res = await api
        //   .post(
        //     `/admin/reservations/${reservationItem.id}`,
        //     payload,
        //     adminHeaders
        //   )
        //   .catch((err) => err)
        // expect(res.response.status).toBe(400)
        // expect(res.response.data).toEqual({
        //   type: "invalid_data",
        //   message:
        //     "The reservation quantity cannot be greater than the unfulfilled line item quantity",
        // })
      })

      describe("Create reservation item", () => {
        beforeEach(async () => {
          await api.post(
            `/admin/inventory-items/${inventoryItem1.id}/location-levels`,
            {
              location_id: stockLocation1.id,
              stocked_quantity: 100,
            },
            adminHeaders
          )
        })

        it("should create a reservation item", async () => {
          const reservationResponse = await api.post(
            `/admin/reservations`,
            {
              line_item_id: "line-item-id-1",
              inventory_item_id: inventoryItem1.id,
              location_id: stockLocation1.id,
              description: "test description",
              quantity: 1,
            },
            adminHeaders
          )

          expect(reservationResponse.status).toEqual(200)
          expect(reservationResponse.data.reservation).toEqual(
            expect.objectContaining({
              line_item_id: "line-item-id-1",
              inventory_item_id: inventoryItem1.id,
              location_id: stockLocation1.id,
              description: "test description",
              quantity: 1,
            })
          )
        })
      })

      describe("Update reservation item", () => {
        let reservationId

        beforeEach(async () => {
          await api.post(
            `/admin/inventory-items/${inventoryItem1.id}/location-levels`,
            {
              location_id: stockLocation1.id,
              stocked_quantity: 100,
            },
            adminHeaders
          )

          const reservationResponse = await api.post(
            `/admin/reservations`,
            {
              line_item_id: "line-item-id-1",
              inventory_item_id: inventoryItem1.id,
              location_id: stockLocation1.id,
              description: "test description",
              quantity: 1,
            },
            adminHeaders
          )
          reservationId = reservationResponse.data.reservation.id
        })

        it("should update a reservation item description", async () => {
          const reservationResponse = await api.post(
            `/admin/reservations/${reservationId}`,
            {
              description: "test description 1",
            },
            adminHeaders
          )

          expect(reservationResponse.status).toEqual(200)
          expect(reservationResponse.data.reservation).toEqual(
            expect.objectContaining({
              description: "test description 1",
            })
          )
        })

        it("should update a reservation item", async () => {
          const reservationResponse = await api.post(
            `/admin/reservations/${reservationId}`,
            {
              quantity: 3,
            },
            adminHeaders
          )

          expect(reservationResponse.status).toEqual(200)
          expect(reservationResponse.data.reservation).toEqual(
            expect.objectContaining({
              quantity: 3,
            })
          )
        })
      })

      describe("Delete reservation item", () => {
        let reservationId

        beforeEach(async () => {
          await api.post(
            `/admin/inventory-items/${inventoryItem1.id}/location-levels`,
            {
              location_id: stockLocation1.id,
              stocked_quantity: 100,
            },
            adminHeaders
          )

          const reservationResponse = await api.post(
            `/admin/reservations`,
            {
              line_item_id: "line-item-id-1",
              inventory_item_id: inventoryItem1.id,
              location_id: stockLocation1.id,
              description: "test description",
              quantity: 1,
            },
            adminHeaders
          )
          reservationId = reservationResponse.data.reservation.id
        })

        it("should update a reservation item", async () => {
          const reservationResponse = await api.delete(
            `/admin/reservations/${reservationId}`,
            adminHeaders
          )

          expect(reservationResponse.status).toEqual(200)
          expect(reservationResponse.data).toEqual(
            expect.objectContaining({
              id: reservationId,
              object: "reservation",
              deleted: true,
            })
          )

          let error
          await api
            .get(`/admin/reservations/${reservationId}`, adminHeaders)
            .catch((err) => {
              error = err
            })

          expect(error.response.status).toBe(404)
        })
      })

      describe("List reservation items", () => {
        let reservation
        let reservation2
        let scId

        beforeEach(async () => {
          const scResponse = await api.post(
            `/admin/sales-channels`,
            { name: "test" },
            adminHeaders
          )
          scId = scResponse.data.sales_channel.id

          await api.post(
            `/admin/stock-locations/${stockLocation1.id}/sales-channels`,
            {
              add: [scId],
            },
            adminHeaders
          )
          await api.post(
            `/admin/inventory-items/${inventoryItem1.id}/location-levels`,
            {
              location_id: stockLocation1.id,
              stocked_quantity: 100,
            },
            adminHeaders
          )

          await api.post(
            `/admin/inventory-items/${inventoryItem2.id}/location-levels`,
            {
              location_id: stockLocation1.id,
              stocked_quantity: 100,
            },
            adminHeaders
          )

          const reservationResponse = await api.post(
            `/admin/reservations`,
            {
              line_item_id: "line-item-id-1",
              inventory_item_id: inventoryItem1.id,
              location_id: stockLocation1.id,
              quantity: 2,
            },
            adminHeaders
          )

          reservation = reservationResponse.data.reservation

          const reservationResponse2 = await api.post(
            `/admin/reservations`,
            {
              line_item_id: "line-item-id-2",
              inventory_item_id: inventoryItem2.id,
              location_id: stockLocation1.id,
              description: "test description",
              quantity: 1,
            },
            adminHeaders
          )

          reservation2 = reservationResponse2.data.reservation
        })

        it("lists reservation items", async () => {
          const reservationsRes = await api
            .get(`/admin/reservations`, adminHeaders)
            .catch(console.warn)
          expect(reservationsRes.data.reservations.length).toBe(2)
          expect(reservationsRes.data.reservations).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                id: reservation.id,
              }),
              expect.objectContaining({
                id: reservation2.id,
              }),
            ])
          )
        })

        describe("Filters reservation items", () => {
          it("filters by location", async () => {
            const reservationsRes = await api.get(
              `/admin/reservations?location_id[]=${stockLocation1.id}`,
              adminHeaders
            )
            expect(reservationsRes.data.reservations.length).toBe(2)
            expect(reservationsRes.data.reservations[0].location_id).toBe(
              stockLocation1.id
            )
          })

          it("filters by itemID", async () => {
            const reservationsRes = await api.get(
              `/admin/reservations?inventory_item_id[]=${inventoryItem1.id}`,
              adminHeaders
            )
            expect(reservationsRes.data.reservations.length).toBe(1)
            expect(reservationsRes.data.reservations[0].inventory_item_id).toBe(
              inventoryItem1.id
            )
          })

          it("filters by quantity", async () => {
            const reservationsRes = await api.get(
              `/admin/reservations?quantity[$gt]=1`,
              adminHeaders
            )

            expect(reservationsRes.data.reservations.length).toBe(1)
            expect(reservationsRes.data.reservations[0].id).toBe(reservation.id)
          })

          it("filters by date", async () => {
            const reservationsRes = await api.get(
              `/admin/reservations?created_at[$gte]=${new Date(
                reservation2.created_at
              ).toISOString()}`,
              adminHeaders
            )

            expect(reservationsRes.data.reservations.length).toBe(1)
            expect(reservationsRes.data.reservations[0].id).toBe(
              reservation2.id
            )
          })

          it("filters by description using equals", async () => {
            const reservationsRes = await api
              .get(
                `/admin/reservations?description=test%20description`,
                adminHeaders
              )
              .catch(console.warn)

            expect(reservationsRes.data.reservations.length).toBe(1)
            expect(reservationsRes.data.reservations[0].id).toBe(
              reservation2.id
            )
          })

          it("filters by description using equals removes results", async () => {
            const reservationsRes = await api.get(
              `/admin/reservations?description=description`,
              adminHeaders
            )

            expect(reservationsRes.data.reservations.length).toBe(0)
          })

          it("filters by description using contains", async () => {
            const reservationsRes = await api.get(
              `/admin/reservations?description[$ilike]=%descri%`,
              adminHeaders
            )

            expect(reservationsRes.data.reservations.length).toBe(1)
            expect(reservationsRes.data.reservations[0].id).toBe(
              reservation2.id
            )
          })

          it("filters by description using starts_with", async () => {
            const reservationsRes = await api
              .get(
                `/admin/reservations?description[$ilike]=test%`,
                adminHeaders
              )
              .catch(console.log)

            expect(reservationsRes.data.reservations.length).toBe(1)
            expect(reservationsRes.data.reservations[0].id).toBe(
              reservation2.id
            )
          })

          it("filters by description using starts_with removes results", async () => {
            const reservationsRes = await api.get(
              `/admin/reservations?description[$ilike]=description%`,
              adminHeaders
            )

            expect(reservationsRes.data.reservations.length).toBe(0)
          })

          it("filters by description using ends_with", async () => {
            const reservationsRes = await api.get(
              `/admin/reservations?description[$ilike]=%test`,
              adminHeaders
            )

            expect(reservationsRes.data.reservations.length).toBe(0)
          })

          it("filters by description using ends_with removes results", async () => {
            const reservationsRes = await api.get(
              `/admin/reservations?description[$ilike]=%description`,
              adminHeaders
            )

            expect(reservationsRes.data.reservations.length).toBe(1)
            expect(reservationsRes.data.reservations[0].id).toBe(
              reservation2.id
            )
          })
        })
      })

      it.skip("lists reservations with inventory_items and line items", async () => {
        const res = await api.get(
          `/admin/reservations?expand=line_item,inventory_item`,
          adminHeaders
        )

        expect(res.status).toEqual(200)
        expect(res.data.reservations.length).toEqual(1)
        expect(res.data.reservations).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              inventory_item: expect.objectContaining({}),
              line_item: expect.objectContaining({
                order: expect.objectContaining({}),
              }),
            }),
          ])
        )
      })
    })
  },
})

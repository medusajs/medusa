import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"

import { IInventoryServiceNext } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { breaking } from "../../../../helpers/breaking"
import { medusaIntegrationTestRunner } from "medusa-test-utils"

medusaIntegrationTestRunner({
  env: {
    MEDUSA_FF_MEDUSA_V2: true,
  },
  testSuite: ({ dbConnection, getContainer, api }) => {
    let appContainer
    let service: IInventoryServiceNext

    beforeEach(async () => {
      appContainer = getContainer()

      await createAdminUser(dbConnection, adminHeaders, appContainer)

      service = appContainer.resolve(ModuleRegistrationName.INVENTORY)
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
        let invItemId
        let location

        beforeEach(async () => {
          await breaking(null, async () => {
            const stockRes = await api.post(
              `/admin/stock-locations`,
              {
                name: "Fake Warehouse 1",
              },
              adminHeaders
            )

            location = stockRes.data.stock_location.id

            const inventoryItemResponse = await api.post(
              `/admin/inventory-items`,
              {
                sku: "12345",
              },
              adminHeaders
            )

            invItemId = inventoryItemResponse.data.inventory_item.id

            await api.post(
              `/admin/inventory-items/${invItemId}/location-levels`,
              {
                location_id: location,
                stocked_quantity: 100,
              },
              adminHeaders
            )
          })
        })

        it("should create a reservation item", async () => {
          await breaking(null, async () => {
            const reservationResponse = await api.post(
              `/admin/reservations`,
              {
                line_item_id: "line-item-id-1",
                inventory_item_id: invItemId,
                location_id: location,
                description: "test description",
                quantity: 1,
              },
              adminHeaders
            )

            expect(reservationResponse.status).toEqual(200)
            expect(reservationResponse.data.reservation).toEqual(
              expect.objectContaining({
                line_item_id: "line-item-id-1",
                inventory_item_id: invItemId,
                location_id: location,
                description: "test description",
                quantity: 1,
              })
            )
          })
        })
      })

      describe("Update reservation item", () => {
        let invItemId
        let location
        let reservationId

        beforeEach(async () => {
          await breaking(null, async () => {
            const stockRes = await api.post(
              `/admin/stock-locations`,
              {
                name: "Fake Warehouse 1",
              },
              adminHeaders
            )

            location = stockRes.data.stock_location.id

            const inventoryItemResponse = await api.post(
              `/admin/inventory-items`,
              {
                sku: "12345",
              },
              adminHeaders
            )

            invItemId = inventoryItemResponse.data.inventory_item.id

            await api.post(
              `/admin/inventory-items/${invItemId}/location-levels`,
              {
                location_id: location,
                stocked_quantity: 100,
              },
              adminHeaders
            )

            const reservationResponse = await api.post(
              `/admin/reservations`,
              {
                line_item_id: "line-item-id-1",
                inventory_item_id: invItemId,
                location_id: location,
                description: "test description",
                quantity: 1,
              },
              adminHeaders
            )
            reservationId = reservationResponse.data.reservation.id
          })
        })

        it("should update a reservation item description", async () => {
          await breaking(null, async () => {
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
        })

        it("should update a reservation item", async () => {
          await breaking(null, async () => {
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
      })

      describe("Delete reservation item", () => {
        let invItemId
        let location
        let reservationId

        beforeEach(async () => {
          await breaking(null, async () => {
            const stockRes = await api.post(
              `/admin/stock-locations`,
              {
                name: "Fake Warehouse 1",
              },
              adminHeaders
            )

            location = stockRes.data.stock_location.id

            const inventoryItemResponse = await api.post(
              `/admin/inventory-items`,
              {
                sku: "12345",
              },
              adminHeaders
            )

            invItemId = inventoryItemResponse.data.inventory_item.id

            await api.post(
              `/admin/inventory-items/${invItemId}/location-levels`,
              {
                location_id: location,
                stocked_quantity: 100,
              },
              adminHeaders
            )

            const reservationResponse = await api.post(
              `/admin/reservations`,
              {
                line_item_id: "line-item-id-1",
                inventory_item_id: invItemId,
                location_id: location,
                description: "test description",
                quantity: 1,
              },
              adminHeaders
            )
            reservationId = reservationResponse.data.reservation.id
          })
        })

        it("should update a reservation item", async () => {
          await breaking(null, async () => {
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
      })

      describe("List reservation items", () => {
        let invItemId
        let invItemId2
        let location
        let reservation
        let reservation2
        let scId

        beforeEach(async () => {
          await breaking(null, async () => {
            const stockRes = await api.post(
              `/admin/stock-locations`,
              {
                name: "Fake Warehouse 2",
              },
              adminHeaders
            )

            location = stockRes.data.stock_location.id

            const scResponse = await api.post(
              `/admin/sales-channels`,
              { name: "test" },
              adminHeaders
            )

            scId = scResponse.data.sales_channel.id

            await api.post(
              `/admin/stock-locations/${location}/sales-channels`,
              {
                add: [scId],
              },
              adminHeaders
            )

            const inventoryItemResponse = await api.post(
              `/admin/inventory-items`,
              {
                sku: "12345",
              },
              adminHeaders
            )

            invItemId = inventoryItemResponse.data.inventory_item.id

            const inventoryItemResponse2 = await api.post(
              `/admin/inventory-items`,
              {
                sku: "67890",
              },
              adminHeaders
            )

            invItemId2 = inventoryItemResponse2.data.inventory_item.id

            await api.post(
              `/admin/inventory-items/${invItemId}/location-levels`,
              {
                location_id: location,
                stocked_quantity: 100,
              },
              adminHeaders
            )

            await api.post(
              `/admin/inventory-items/${invItemId2}/location-levels`,
              {
                location_id: location,
                stocked_quantity: 100,
              },
              adminHeaders
            )

            const reservationResponse = await api.post(
              `/admin/reservations`,
              {
                line_item_id: "line-item-id-1",
                inventory_item_id: invItemId,
                location_id: location,
                quantity: 2,
              },
              adminHeaders
            )

            reservation = reservationResponse.data.reservation

            const reservationResponse2 = await api.post(
              `/admin/reservations`,
              {
                line_item_id: "line-item-id-2",
                inventory_item_id: invItemId2,
                location_id: location,
                description: "test description",
                quantity: 1,
              },
              adminHeaders
            )

            reservation2 = reservationResponse2.data.reservation
          })
        })

        it("lists reservation items", async () => {
          await breaking(null, async () => {
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
        })

        describe("Filters reservation items", () => {
          it("filters by location", async () => {
            await breaking(null, async () => {
              const reservationsRes = await api.get(
                `/admin/reservations?location_id[]=${location}`,
                adminHeaders
              )
              expect(reservationsRes.data.reservations.length).toBe(2)
              expect(reservationsRes.data.reservations[0].location_id).toBe(
                location
              )
            })
          })

          it("filters by itemID", async () => {
            await breaking(null, async () => {
              const reservationsRes = await api.get(
                `/admin/reservations?inventory_item_id[]=${invItemId}`,
                adminHeaders
              )
              expect(reservationsRes.data.reservations.length).toBe(1)
              expect(
                reservationsRes.data.reservations[0].inventory_item_id
              ).toBe(invItemId)
            })
          })

          it("filters by quantity", async () => {
            await breaking(null, async () => {
              const reservationsRes = await api.get(
                `/admin/reservations?quantity[$gt]=1`,
                adminHeaders
              )

              expect(reservationsRes.data.reservations.length).toBe(1)
              expect(reservationsRes.data.reservations[0].id).toBe(
                reservation.id
              )
            })
          })

          it("filters by date", async () => {
            await breaking(null, async () => {
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
          })

          it("filters by description using equals", async () => {
            await breaking(null, async () => {
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
          })

          it("filters by description using equals removes results", async () => {
            await breaking(null, async () => {
              const reservationsRes = await api.get(
                `/admin/reservations?description=description`,
                adminHeaders
              )

              expect(reservationsRes.data.reservations.length).toBe(0)
            })
          })

          it("filters by description using contains", async () => {
            await breaking(null, async () => {
              const reservationsRes = await api.get(
                `/admin/reservations?description[$ilike]=%descri%`,
                adminHeaders
              )

              expect(reservationsRes.data.reservations.length).toBe(1)
              expect(reservationsRes.data.reservations[0].id).toBe(
                reservation2.id
              )
            })
          })

          it("filters by description using starts_with", async () => {
            await breaking(null, async () => {
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
          })

          it("filters by description using starts_with removes results", async () => {
            await breaking(null, async () => {
              const reservationsRes = await api.get(
                `/admin/reservations?description[$ilike]=description%`,
                adminHeaders
              )

              expect(reservationsRes.data.reservations.length).toBe(0)
            })
          })

          it("filters by description using ends_with", async () => {
            await breaking(null, async () => {
              const reservationsRes = await api.get(
                `/admin/reservations?description[$ilike]=%test`,
                adminHeaders
              )

              expect(reservationsRes.data.reservations.length).toBe(0)
            })
          })

          it("filters by description using ends_with removes results", async () => {
            await breaking(null, async () => {
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
      })

      it.skip("lists reservations with inventory_items and line items", async () => {
        await breaking(null, async () => {
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
    })
  },
})

import { medusaIntegrationTestRunner } from "medusa-test-utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"

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

    describe("POST /admin/reservations", () => {
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

      it("should throw if available quantity is less than reservation quantity", async () => {
        const payload = {
          quantity: 10000,
          inventory_item_id: inventoryItem1.id,
          line_item_id: "line-item-id",
          location_id: stockLocation1.id,
        }

        const res = await api
          .post(
            `/admin/reservations?field=inventory_item.location_levels.*`,
            payload,
            adminHeaders
          )
          .catch((err) => err)

        const res1 = await api.get(
          `/admin/inventory-items/${inventoryItem1.id}`,
          adminHeaders
        )

        expect(res.response.status).toBe(400)
        expect(res.response.data).toEqual({
          type: "not_allowed",
          message: `Not enough stock available for item ${inventoryItem1.id} at location ${stockLocation1.id}`,
        })
      })
    })

    describe("POST /admin/reservations/:id", () => {
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

      it("should throw if available quantity is less than reservation quantity", async () => {
        const payload = { quantity: 100000 }
        const res = await api
          .post(`/admin/reservations/${reservationId}`, payload, adminHeaders)
          .catch((err) => err)

        expect(res.response.status).toBe(400)
        expect(res.response.data).toEqual({
          type: "not_allowed",
          message: `Not enough stock available for item ${inventoryItem1.id} at location ${stockLocation1.id}`,
        })
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

    describe("DELETE /admin/reservations/:id", () => {
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

    describe("GET /admin/reservations", () => {
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

      it("lists reservations with inventory_items", async () => {
        const res = await api.get(
          `/admin/reservations?fields=%2binventory_item.*`,
          adminHeaders
        )

        expect(res.status).toEqual(200)
        expect(res.data.reservations.length).toEqual(2)
        expect(res.data.reservations).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              inventory_item: expect.objectContaining({
                id: inventoryItem1.id,
              }),
            }),
            expect.objectContaining({
              inventory_item: expect.objectContaining({
                id: inventoryItem2.id,
              }),
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
          expect(reservationsRes.data.reservations[0].id).toBe(reservation2.id)
        })

        it("filters by description using equals", async () => {
          const reservationsRes = await api
            .get(
              `/admin/reservations?description=test%20description`,
              adminHeaders
            )
            .catch(console.warn)

          expect(reservationsRes.data.reservations.length).toBe(1)
          expect(reservationsRes.data.reservations[0].id).toBe(reservation2.id)
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
          expect(reservationsRes.data.reservations[0].id).toBe(reservation2.id)
        })

        it("filters by description using starts_with", async () => {
          const reservationsRes = await api
            .get(`/admin/reservations?description[$ilike]=test%`, adminHeaders)
            .catch(console.log)

          expect(reservationsRes.data.reservations.length).toBe(1)
          expect(reservationsRes.data.reservations[0].id).toBe(reservation2.id)
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
          expect(reservationsRes.data.reservations[0].id).toBe(reservation2.id)
        })
      })
    })
  },
})

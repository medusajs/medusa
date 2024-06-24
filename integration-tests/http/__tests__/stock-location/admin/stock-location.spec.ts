import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"

const { medusaIntegrationTestRunner } = require("medusa-test-utils")

jest.setTimeout(30000)

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api }) => {
    let location1
    let location2
    let salesChannel1
    let salesChannel2

    beforeEach(async () => {
      await createAdminUser(dbConnection, adminHeaders, getContainer())

      location1 = (
        await api.post(
          `/admin/stock-locations`,
          {
            name: "Test Location 1",
            address: {
              address_1: "Test Address",
              country_code: "US",
            },
          },
          adminHeaders
        )
      ).data.stock_location

      location2 = (
        await api.post(
          `/admin/stock-locations`,
          {
            name: "Test Location 2",
            address: {
              address_1: "Test Address",
              country_code: "US",
            },
          },
          adminHeaders
        )
      ).data.stock_location

      salesChannel1 = (
        await api.post(
          `/admin/sales-channels`,
          {
            name: "Test SC",
          },
          adminHeaders
        )
      ).data.sales_channel

      salesChannel2 = (
        await api.post(
          `/admin/sales-channels`,
          {
            name: "Test SC 2",
          },
          adminHeaders
        )
      ).data.sales_channel
    })

    describe("create stock location", () => {
      it("should create a stock location with a name and address", async () => {
        const response = await api.post(
          "/admin/stock-locations",
          {
            name: "Test Location",
            address: {
              address_1: "Test Address",
              country_code: "US",
            },
          },
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.stock_location).toEqual(
          expect.objectContaining({
            name: "Test Location",
            address: expect.objectContaining({
              address_1: "Test Address",
              country_code: "US",
            }),
          })
        )
      })
    })

    describe("list stock locations", () => {
      it("should list stock locations", async () => {
        const listLocationsResponse = await api.get(
          "/admin/stock-locations",
          adminHeaders
        )

        expect(listLocationsResponse.status).toEqual(200)
        expect(listLocationsResponse.data.stock_locations).toEqual([
          expect.objectContaining(location1),
          expect.objectContaining(location2),
        ])
      })

      it("should filter stock locations by name", async () => {
        const listLocationsResponse = await api.get(
          "/admin/stock-locations?name=Test%20Location%201",
          adminHeaders
        )

        expect(listLocationsResponse.status).toEqual(200)
        expect(listLocationsResponse.data.stock_locations).toEqual([
          expect.objectContaining(location1),
        ])
      })

      it("should filter stock locations by partial name with q parameter", async () => {
        const listLocationsResponse = await api.get(
          "/admin/stock-locations?q=ation%201",
          adminHeaders
        )

        expect(listLocationsResponse.status).toEqual(200)
        expect(listLocationsResponse.data.stock_locations).toEqual([
          expect.objectContaining(location1),
        ])
      })

      it("should filter stock locations on sales_channel_id", async () => {
        await api.post(
          `/admin/stock-locations/${location1.id}/sales-channels`,
          {
            add: [salesChannel1.id],
          },
          adminHeaders
        )

        const listLocationsResponse = await api.get(
          `/admin/stock-locations?sales_channel_id=${salesChannel1.id}`,
          adminHeaders
        )

        expect(listLocationsResponse.status).toEqual(200)
        expect(listLocationsResponse.data.stock_locations).toEqual([
          expect.objectContaining(location1),
        ])
      })
    })

    describe("Update stock locations", () => {
      it("should update stock location name", async () => {
        const response = await api.post(
          `/admin/stock-locations/${location1.id}`,
          {
            name: "new name",
          },
          adminHeaders
        )
        expect(response.status).toEqual(200)
        expect(response.data.stock_location.name).toEqual("new name")
      })
    })

    describe("Get stock location", () => {
      it("should get a stock location", async () => {
        const response = await api.get(
          `/admin/stock-locations/${location1.id}`,
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.stock_location).toEqual(
          expect.objectContaining({ id: location1.id, name: "Test Location 1" })
        )
      })

      it("should throw an error when a stock location does not exist", async () => {
        let error
        await api
          .get(`/admin/stock-locations/does-not-exist`, adminHeaders)
          .catch((e) => (error = e))

        expect(error.response.status).toEqual(404)
        expect(error.response.data.message).toEqual(
          `Stock location with id: does-not-exist was not found`
        )
      })
    })

    describe("Delete stock location", () => {
      it("should successfully delete stock location", async () => {
        const stockLocationDeleteResponse = await api.delete(
          `/admin/stock-locations/${location1.id}`,
          adminHeaders
        )

        expect(stockLocationDeleteResponse.status).toEqual(200)
        expect(stockLocationDeleteResponse.data).toEqual({
          id: location1.id,
          object: "stock_location",
          deleted: true,
        })

        const stockLocations = await api.get(
          `/admin/stock-locations`,
          adminHeaders
        )

        expect(stockLocations.status).toEqual(200)
        expect(stockLocations.data.stock_locations).toEqual([
          expect.objectContaining(location2),
        ])
      })

      it("should successfully delete stock location associations", async () => {
        await api.post(
          `/admin/stock-locations/${location1.id}/sales-channels`,
          {
            add: [salesChannel1.id],
          },
          adminHeaders
        )

        await api.delete(`/admin/stock-locations/${location1.id}`, adminHeaders)

        const scWithAssociation = (
          await api.get(
            `/admin/sales-channels/${salesChannel1.id}?fields=*stock_locations`,
            adminHeaders
          )
        ).data.sales_channel

        expect(scWithAssociation.stock_locations).toEqual([])
      })
    })

    describe("Add sales channels", () => {
      it("should add sales channels to a location", async () => {
        const salesChannelResponse = await api.post(
          `/admin/stock-locations/${location1.id}/sales-channels?fields=*sales_channels`,
          { add: [salesChannel1.id] },
          adminHeaders
        )

        expect(
          salesChannelResponse.data.stock_location.sales_channels
        ).toHaveLength(1)
      })
    })

    describe("Remove sales channels", () => {
      beforeEach(async () => {
        await api.post(
          `/admin/stock-locations/${location1.id}/sales-channels?fields=*sales_channels`,
          { add: [salesChannel1.id, salesChannel2.id] },
          adminHeaders
        )
      })

      it("should remove sales channels from a location", async () => {
        const salesChannelResponse = await api.post(
          `/admin/stock-locations/${location1.id}/sales-channels?fields=*sales_channels`,
          { remove: [salesChannel1.id] },
          adminHeaders
        )

        expect(
          salesChannelResponse.data.stock_location.sales_channels
        ).toHaveLength(1)
      })
    })

    describe("Location fulfillment sets", () => {
      it("should create a fulfillment set for the location and then delete it and its associations", async () => {
        const response = await api.post(
          `/admin/stock-locations/${location1.id}/fulfillment-sets?fields=id,*fulfillment_sets`,
          {
            name: "Fulfillment Set",
            type: "shipping",
          },
          adminHeaders
        )

        expect(response.status).toEqual(200)

        expect(response.data.stock_location.fulfillment_sets).toEqual([
          expect.objectContaining({
            id: expect.any(String),
          }),
        ])

        await api.delete(`/admin/stock-locations/${location1.id}`, adminHeaders)

        // TODO: Ideally we use HTTP here, maybe we should have a get endpoint for fulfillment sets?
        const fulfillmentModule = getContainer().resolve(
          ModuleRegistrationName.FULFILLMENT
        )
        const sets = await fulfillmentModule.listFulfillmentSets()
        expect(sets).toHaveLength(0)
      })

      // This is really just to test the new Zod middleware. We don't need more of these.
      it("should throw a validation error on wrong input", async () => {
        const errorResponse = await api
          .post(
            `/admin/stock-locations/${location1.id}/fulfillment-sets?fields=id,*fulfillment_sets`,
            {
              name: "Fulfillment Set",
              type: "shipping",
              foo: "bar",
            },
            adminHeaders
          )
          .catch((e) => e.response)

        expect(errorResponse.status).toEqual(400)

        expect(errorResponse.data.message).toEqual(
          "Invalid request: Unrecognized fields: 'foo'"
        )
      })
    })
  },
})

import { ModuleRegistrationName, Modules } from "@medusajs/modules-sdk"
import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"

import { IStockLocationServiceNext } from "@medusajs/types"
import { ContainerRegistrationKeys } from "@medusajs/utils"

const { medusaIntegrationTestRunner } = require("medusa-test-utils")

jest.setTimeout(30000)

medusaIntegrationTestRunner({
  env: {
    MEDUSA_FF_MEDUSA_V2: true,
  },
  testSuite: ({ dbConnection, getContainer, api }) => {
    let appContainer
    let service: IStockLocationServiceNext

    beforeEach(async () => {
      appContainer = getContainer()

      await createAdminUser(dbConnection, adminHeaders, appContainer)

      service = appContainer.resolve(ModuleRegistrationName.STOCK_LOCATION)
    })

    describe("create stock location", () => {
      it("should create a stock location with a name and address", async () => {
        const address = {
          address_1: "Test Address",
          country_code: "US",
        }
        const location = {
          name: "Test Location",
        }

        const response = await api.post(
          "/admin/stock-locations",
          {
            ...location,
            address,
          },
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.stock_location).toEqual(
          expect.objectContaining({
            ...location,
            address: expect.objectContaining(address),
          })
        )
      })
    })

    describe("list stock locations", () => {
      let location1
      let location2
      beforeEach(async () => {
        const location1CreateResponse = await api.post(
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
        location1 = location1CreateResponse.data.stock_location
        const location2CreateResponse = await api.post(
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
        location2 = location2CreateResponse.data.stock_location
      })

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
        const remoteLinkService = appContainer.resolve(
          ContainerRegistrationKeys.REMOTE_LINK
        )

        await remoteLinkService.create([
          {
            [Modules.SALES_CHANNEL]: {
              sales_channel_id: "default",
            },
            [Modules.STOCK_LOCATION]: {
              stock_location_id: location1.id,
            },
          },
        ])

        const listLocationsResponse = await api.get(
          "/admin/stock-locations?sales_channel_id=default",
          adminHeaders
        )

        expect(listLocationsResponse.status).toEqual(200)
        expect(listLocationsResponse.data.stock_locations).toEqual([
          expect.objectContaining(location1),
        ])
      })
    })

    describe("Update stock locations", () => {
      let stockLocationId

      beforeEach(async () => {
        const createResponse = await api.post(
          `/admin/stock-locations`,
          {
            name: "test location",
          },
          adminHeaders
        )

        stockLocationId = createResponse.data.stock_location.id
      })

      it("should update stock location name", async () => {
        const response = await api.post(
          `/admin/stock-locations/${stockLocationId}`,
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
      let locationId
      const location = {
        name: "Test Location",
      }
      beforeEach(async () => {
        const createLocationRespones = await api.post(
          "/admin/stock-locations",
          {
            ...location,
          },
          adminHeaders
        )
        locationId = createLocationRespones.data.stock_location.id
      })

      it("should get a stock location", async () => {
        const response = await api.get(
          `/admin/stock-locations/${locationId}`,
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.stock_location).toEqual(
          expect.objectContaining({ id: locationId, ...location })
        )
      })

      it("should get a stock location", async () => {
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
      let stockLocationId
      beforeEach(async () => {
        const stockLocationCreateResponse = await api.post(
          `/admin/stock-locations`,
          { name: "test location" },
          adminHeaders
        )

        stockLocationId = stockLocationCreateResponse.data.stock_location.id
      })

      it("should successfully delete stock location", async () => {
        const stockLocationDeleteResponse = await api.delete(
          `/admin/stock-locations/${stockLocationId}`,
          adminHeaders
        )

        expect(stockLocationDeleteResponse.status).toEqual(200)
        expect(stockLocationDeleteResponse.data).toEqual({
          id: stockLocationId,
          object: "stock_location",
          deleted: true,
        })
      })

      it("should successfully delete stock location associations", async () => {
        const remoteLink = appContainer.resolve(
          ContainerRegistrationKeys.REMOTE_LINK
        )

        await remoteLink.create([
          {
            [Modules.SALES_CHANNEL]: {
              sales_channel_id: "default",
            },
            [Modules.STOCK_LOCATION]: {
              stock_location_id: stockLocationId,
            },
          },
        ])

        await api.delete(
          `/admin/stock-locations/${stockLocationId}`,
          adminHeaders
        )

        const linkService = remoteLink.getLinkModule(
          Modules.SALES_CHANNEL,
          "sales_channel_id",
          Modules.STOCK_LOCATION,
          "stock_location_id"
        )

        const stockLocationLinks = await linkService.list()
        expect(stockLocationLinks).toHaveLength(0)
      })
    })

    describe("Add sales channels", () => {
      let salesChannel
      let location

      beforeEach(async () => {
        const salesChannelResponse = await api.post(
          "/admin/sales-channels",
          {
            name: "test name",
            description: "test description",
          },
          adminHeaders
        )
        salesChannel = salesChannelResponse.data.sales_channel

        const locationResponse = await api.post(
          "/admin/stock-locations",
          {
            name: "test location",
          },
          adminHeaders
        )

        location = locationResponse.data.stock_location
      })

      it("should add sales channels to a location", async () => {
        const salesChannelResponse = await api.post(
          `/admin/stock-locations/${location.id}/sales-channels?fields=*sales_channels`,
          { add: [salesChannel.id] },
          adminHeaders
        )

        expect(
          salesChannelResponse.data.stock_location.sales_channels
        ).toHaveLength(1)
      })
    })

    describe("Remove sales channels", () => {
      let salesChannel1
      let salesChannel2
      let location

      beforeEach(async () => {
        const salesChannelResponse1 = await api.post(
          "/admin/sales-channels",
          {
            name: "test name",
            description: "test description",
          },
          adminHeaders
        )
        salesChannel1 = salesChannelResponse1.data.sales_channel

        const salesChannelResponse2 = await api.post(
          "/admin/sales-channels",
          {
            name: "test name",
            description: "test description",
          },
          adminHeaders
        )
        salesChannel2 = salesChannelResponse2.data.sales_channel

        const locationResponse = await api.post(
          "/admin/stock-locations",
          {
            name: "test location",
          },
          adminHeaders
        )

        location = locationResponse.data.stock_location

        await api.post(
          `/admin/stock-locations/${location.id}/sales-channels?fields=*sales_channels`,
          { add: [salesChannel1.id, salesChannel2.id] },
          adminHeaders
        )
      })

      it("should remove sales channels from a location", async () => {
        const salesChannelResponse = await api.post(
          `/admin/stock-locations/${location.id}/sales-channels?fields=*sales_channels`,
          { remove: [salesChannel1.id] },
          adminHeaders
        )

        expect(
          salesChannelResponse.data.stock_location.sales_channels
        ).toHaveLength(1)
      })
    })

    describe("Location fulfillment sets", () => {
      let stockLocationId

      beforeEach(async () => {
        const createResponse = await api.post(
          `/admin/stock-locations`,
          {
            name: "test location",
          },
          adminHeaders
        )

        stockLocationId = createResponse.data.stock_location.id
      })

      it("should create a fulfillment set for the location", async () => {
        const response = await api.post(
          `/admin/stock-locations/${stockLocationId}/fulfillment-sets?fields=id,*fulfillment_sets`,
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
      })

      // This is really just to test the new Zod middleware. We don't need more of these.
      it("should throw a validation error on wrong input", async () => {
        const errorResponse = await api
          .post(
            `/admin/stock-locations/${stockLocationId}/fulfillment-sets?fields=id,*fulfillment_sets`,
            {
              name: "Fulfillment Set",
              type: "shipping",
              foo: "bar",
            },
            adminHeaders
          )
          .catch((e) => e.response)

        expect(errorResponse.status).toEqual(400)

        expect(errorResponse.data.message).toContain("Invalid request body: ")
      })
    })
  },
})

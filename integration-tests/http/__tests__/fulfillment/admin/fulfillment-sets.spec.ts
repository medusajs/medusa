import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IFulfillmentModuleService } from "@medusajs/types"
import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"

const { medusaIntegrationTestRunner } = require("medusa-test-utils")

jest.setTimeout(30000)

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api }) => {
    let fulfillmentSet1

    beforeEach(async () => {
      await createAdminUser(dbConnection, adminHeaders, getContainer())

      // fulfillmentSet1 = (
      //   await api.post(
      //     "/admin/fulfillment-sets",
      //     {
      //       name: "Test fulfillment set",
      //       type: "pickup",
      //     },
      //     adminHeaders
      //   )
      // ).data.fulfillment_set

      // TODO: Add support for creating fulfillment sets through HTTP
      const fulfillmentModule: IFulfillmentModuleService =
        getContainer().resolve(ModuleRegistrationName.FULFILLMENT)

      fulfillmentSet1 = await fulfillmentModule.create({
        name: "Test fulfillment set",
        type: "pickup",
      })
    })

    describe("POST /admin/fulfillment-sets/:id", () => {
      it("should delete a fulfillment set", async () => {
        const deleteResponse = await api.delete(
          `/admin/fulfillment-sets/${fulfillmentSet1.id}`,
          adminHeaders
        )

        expect(deleteResponse.data).toEqual({
          id: fulfillmentSet1.id,
          object: "fulfillment_set",
          deleted: true,
        })
      })
    })

    describe("POST /admin/fulfillment-sets/:id/service-zones", () => {
      it("should create, update, and delete a service zone for a fulfillment set", async () => {
        const stockLocationResponse = await api.post(
          `/admin/stock-locations`,
          {
            name: "test location",
          },
          adminHeaders
        )

        const stockLocationId = stockLocationResponse.data.stock_location.id

        const locationWithFSetResponse = await api.post(
          `/admin/stock-locations/${stockLocationId}/fulfillment-sets?fields=id,*fulfillment_sets`,
          {
            name: "Fulfillment Set",
            type: "shipping",
          },
          adminHeaders
        )

        const fulfillmentSetId =
          locationWithFSetResponse.data.stock_location.fulfillment_sets[0].id

        const response = await api.post(
          `/admin/fulfillment-sets/${fulfillmentSetId}/service-zones`,
          {
            name: "Test Zone",
            geo_zones: [
              {
                country_code: "dk",
                type: "country",
              },
              {
                country_code: "fr",
                type: "province",
                province_code: "fr-idf",
              },
              {
                country_code: "it",
                type: "city",
                city: "some city",
                province_code: "some-province",
              },
              {
                country_code: "it",
                type: "zip",
                city: "some city",
                province_code: "some-province",
                postal_expression: { type: "regex", exp: "00*" },
              },
            ],
          },
          adminHeaders
        )

        const fset = response.data.fulfillment_set

        expect(response.status).toEqual(200)
        expect(fset).toEqual(
          expect.objectContaining({
            name: "Fulfillment Set",
            type: "shipping",
            service_zones: expect.arrayContaining([
              expect.objectContaining({
                name: "Test Zone",
                fulfillment_set_id: fulfillmentSetId,
                geo_zones: expect.arrayContaining([
                  expect.objectContaining({
                    country_code: "dk",
                    type: "country",
                  }),
                  expect.objectContaining({
                    country_code: "fr",
                    type: "province",
                    province_code: "fr-idf",
                  }),
                  expect.objectContaining({
                    country_code: "it",
                    type: "city",
                    city: "some city",
                    province_code: "some-province",
                  }),
                  expect.objectContaining({
                    country_code: "it",
                    type: "zip",
                    city: "some city",
                    province_code: "some-province",
                    postal_expression: { type: "regex", exp: "00*" },
                  }),
                ]),
              }),
            ]),
          })
        )

        const serviceZoneId = fset.service_zones[0].id

        const countryGeoZone = fset.service_zones[0].geo_zones.find(
          (z) => z.type === "country"
        )

        // Updates an existing and creates a new one
        const updateResponse = await api.post(
          `/admin/fulfillment-sets/${fulfillmentSetId}/service-zones/${serviceZoneId}`,
          {
            name: "Test Zone Updated",
            geo_zones: [
              {
                id: countryGeoZone.id,
                country_code: "us",
                type: "country",
              },
              {
                country_code: "ca",
                type: "country",
              },
            ],
          },
          adminHeaders
        )

        const updatedFset = updateResponse.data.fulfillment_set

        expect(updateResponse.status).toEqual(200)
        expect(updatedFset).toEqual(
          expect.objectContaining({
            name: "Fulfillment Set",
            type: "shipping",
            service_zones: expect.arrayContaining([
              expect.objectContaining({
                id: serviceZoneId,
                name: "Test Zone Updated",
                fulfillment_set_id: updatedFset.id,
                geo_zones: expect.arrayContaining([
                  expect.objectContaining({
                    id: countryGeoZone.id,
                    country_code: "us",
                    type: "country",
                  }),
                  expect.objectContaining({
                    country_code: "ca",
                    type: "country",
                  }),
                ]),
              }),
            ]),
          })
        )

        const deleteResponse = await api.delete(
          `/admin/fulfillment-sets/${fulfillmentSetId}/service-zones/${serviceZoneId}`,
          adminHeaders
        )

        expect(deleteResponse.status).toEqual(200)
        expect(deleteResponse.data).toEqual(
          expect.objectContaining({
            id: serviceZoneId,
            object: "service_zone",
            deleted: true,
            parent: expect.objectContaining({
              id: fulfillmentSetId,
            }),
          })
        )

        const serviceZoneResponse = await api
          .get(
            `/admin/fulfillment-sets/${fulfillmentSetId}/service-zones/${serviceZoneId}`,
            adminHeaders
          )
          .catch((err) => err.response)

        expect(serviceZoneResponse.status).toEqual(404)
        expect(serviceZoneResponse.data.message).toEqual(
          `Service zone with id: ${serviceZoneId} not found`
        )
      })

      it("should throw if invalid type is passed", async () => {
        const stockLocationResponse = await api.post(
          `/admin/stock-locations`,
          {
            name: "test location",
          },
          adminHeaders
        )

        const stockLocationId = stockLocationResponse.data.stock_location.id

        const locationWithFSetResponse = await api.post(
          `/admin/stock-locations/${stockLocationId}/fulfillment-sets?fields=id,*fulfillment_sets`,
          {
            name: "Fulfillment Set",
            type: "shipping",
          },
          adminHeaders
        )

        const fulfillmentSetId =
          locationWithFSetResponse.data.stock_location.fulfillment_sets[0].id

        const errorResponse = await api
          .post(
            `/admin/fulfillment-sets/${fulfillmentSetId}/service-zones`,
            {
              name: "Test Zone",
              geo_zones: [
                {
                  country_code: "dk",
                  type: "country",
                },
                {
                  country_code: "fr",
                  type: "province",
                  province_code: "fr-idf",
                },
                {
                  country_code: "it",
                  type: "region",
                  city: "some region",
                  province_code: "some-province",
                },
                {
                  country_code: "it",
                  type: "zip",
                  city: "some city",
                  province_code: "some-province",
                  postal_expression: {},
                },
              ],
            },
            adminHeaders
          )
          .catch((err) => err.response)

        expect(errorResponse.status).toEqual(400)
        expect(errorResponse.data.message).toContain(
          `Invalid request: Field 'geo_zones, 2, type' is required`
        )
      })

      describe("POST /admin/fulfillment-sets/:id/service-zones", () => {
        it("should throw when fulfillment set doesn't exist", async () => {
          const deleteResponse = await api
            .delete(
              `/admin/fulfillment-sets/foo/service-zones/bar`,
              adminHeaders
            )
            .catch((e) => e.response)

          expect(deleteResponse.status).toEqual(404)
          expect(deleteResponse.data.message).toEqual(
            "FulfillmentSet with id: foo was not found"
          )
        })

        it("should throw when fulfillment set doesn't have service zone", async () => {
          const stockLocationResponse = await api.post(
            `/admin/stock-locations`,
            {
              name: "test location",
            },
            adminHeaders
          )

          const stockLocationId = stockLocationResponse.data.stock_location.id

          const locationWithFSetResponse = await api.post(
            `/admin/stock-locations/${stockLocationId}/fulfillment-sets?fields=id,*fulfillment_sets`,
            {
              name: "Fulfillment Set",
              type: "shipping",
            },
            adminHeaders
          )

          const fulfillmentSetId =
            locationWithFSetResponse.data.stock_location.fulfillment_sets[0].id

          const deleteResponse = await api
            .delete(
              `/admin/fulfillment-sets/${fulfillmentSetId}/service-zones/foo`,
              adminHeaders
            )
            .catch((e) => e.response)

          expect(deleteResponse.status).toEqual(404)
          expect(deleteResponse.data.message).toEqual(
            "Service zone with id: foo not found on fulfillment set"
          )
        })
      })
    })
  },
})

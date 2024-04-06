import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IFulfillmentModuleService } from "@medusajs/types"
import {
  adminHeaders,
  createAdminUser,
} from "../../../helpers/create-admin-user"

const { medusaIntegrationTestRunner } = require("medusa-test-utils")

jest.setTimeout(30000)

medusaIntegrationTestRunner({
  env: {
    MEDUSA_FF_MEDUSA_V2: true,
  },
  testSuite: ({ dbConnection, getContainer, api }) => {
    let appContainer
    let service: IFulfillmentModuleService

    beforeEach(async () => {
      appContainer = getContainer()

      await createAdminUser(dbConnection, adminHeaders, appContainer)

      service = appContainer.resolve(ModuleRegistrationName.STOCK_LOCATION)
    })

    describe("POST /admin/fulfillment-sets/:id/service-zones", () => {
      it("should create a service zone for a fulfillment set", async () => {
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

        const expectedErrors = [
          {
            code: "invalid_union",
            unionErrors: [
              {
                issues: [
                  {
                    received: "region",
                    code: "invalid_literal",
                    expected: "country",
                    path: ["geo_zones", 2, "type"],
                    message: 'Invalid literal value, expected "country"',
                  },
                ],
                name: "ZodError",
              },
              {
                issues: [
                  {
                    received: "region",
                    code: "invalid_literal",
                    expected: "province",
                    path: ["geo_zones", 2, "type"],
                    message: 'Invalid literal value, expected "province"',
                  },
                ],
                name: "ZodError",
              },
              {
                issues: [
                  {
                    received: "region",
                    code: "invalid_literal",
                    expected: "city",
                    path: ["geo_zones", 2, "type"],
                    message: 'Invalid literal value, expected "city"',
                  },
                ],
                name: "ZodError",
              },
              {
                issues: [
                  {
                    received: "region",
                    code: "invalid_literal",
                    expected: "zip",
                    path: ["geo_zones", 2, "type"],
                    message: 'Invalid literal value, expected "zip"',
                  },
                  {
                    code: "invalid_type",
                    expected: "object",
                    received: "undefined",
                    path: ["geo_zones", 2, "postal_expression"],
                    message: "Required",
                  },
                ],
                name: "ZodError",
              },
            ],
            path: ["geo_zones", 2],
            message: "Invalid input",
          },
        ]

        expect(errorResponse.status).toEqual(400)
        expect(errorResponse.data.message).toContain(
          `Invalid request body: ${JSON.stringify(expectedErrors)}`
        )
      })
    })
  },
})

import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import {
  IFulfillmentModuleService,
  IRegionModuleService,
} from "@medusajs/types"
import { RuleOperator } from "@medusajs/utils"
import { medusaIntegrationTestRunner } from "medusa-test-utils"
import { createAdminUser } from "../../../../helpers/create-admin-user"

jest.setTimeout(50000)

const env = { MEDUSA_FF_MEDUSA_V2: true }
const adminHeaders = { headers: { "x-medusa-access-token": "test_token" } }

medusaIntegrationTestRunner({
  env,
  testSuite: ({ dbConnection, getContainer, api }) => {
    describe("Admin: Shipping Option API", () => {
      let appContainer
      let fulfillmentModule: IFulfillmentModuleService
      let regionService: IRegionModuleService

      let shippingProfile
      let fulfillmentSet
      let region

      const shippingOptionRule = {
        operator: RuleOperator.EQ,
        attribute: "old_attr",
        value: "old value",
      }

      beforeAll(async () => {
        appContainer = getContainer()
        fulfillmentModule = appContainer.resolve(
          ModuleRegistrationName.FULFILLMENT
        )
        regionService = appContainer.resolve(ModuleRegistrationName.REGION)
      })

      beforeEach(async () => {
        await createAdminUser(dbConnection, adminHeaders, appContainer)

        shippingProfile = await fulfillmentModule.createShippingProfiles({
          name: "Test",
          type: "default",
        })

        fulfillmentSet = await fulfillmentModule.create({
          name: "Test",
          type: "test-type",
          service_zones: [
            {
              name: "Test",
              geo_zones: [{ type: "country", country_code: "us" }],
            },
          ],
        })

        region = await regionService.create({
          name: "Test region",
          countries: ["FR"],
          currency_code: "eur",
        })
      })

      describe("POST /admin/shipping-options", () => {
        it("should throw error when required params are missing", async () => {
          const shippingOptionPayload = {
            name: "Test shipping option",
          }

          let err = await api
            .post(
              `/admin/shipping-options`,
              shippingOptionPayload,
              adminHeaders
            )
            .catch((e) => e.response)

          const errorsFields = [
            {
              code: "invalid_type",
              expected: "string",
              received: "undefined",
              path: ["service_zone_id"],
              message: "Required",
            },
            {
              code: "invalid_type",
              expected: "string",
              received: "undefined",
              path: ["shipping_profile_id"],
              message: "Required",
            },
            {
              expected: "'calculated' | 'flat'",
              received: "undefined",
              code: "invalid_type",
              path: ["price_type"],
              message: "Required",
            },
            {
              code: "invalid_type",
              expected: "string",
              received: "undefined",
              path: ["provider_id"],
              message: "Required",
            },
            {
              code: "invalid_type",
              expected: "object",
              received: "undefined",
              path: ["type"],
              message: "Required",
            },
            {
              code: "invalid_type",
              expected: "array",
              received: "undefined",
              path: ["prices"],
              message: "Required",
            },
          ]

          expect(err.status).toEqual(400)
          expect(err.data).toEqual({
            type: "invalid_data",
            message: `Invalid request body: ${JSON.stringify(errorsFields)}`,
          })
        })

        it("should create a shipping option successfully", async () => {
          const shippingOptionPayload = {
            name: "Test shipping option",
            service_zone_id: fulfillmentSet.service_zones[0].id,
            shipping_profile_id: shippingProfile.id,
            provider_id: "manual_test-provider",
            price_type: "flat",
            type: {
              label: "Test type",
              description: "Test description",
              code: "test-code",
            },
            prices: [
              {
                currency_code: "usd",
                amount: 1000,
              },
              {
                region_id: region.id,
                amount: 1000,
              },
            ],
            rules: [shippingOptionRule],
          }

          const response = await api.post(
            `/admin/shipping-options`,
            shippingOptionPayload,
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.shipping_option).toEqual(
            expect.objectContaining({
              id: expect.any(String),
              name: shippingOptionPayload.name,
              provider: expect.objectContaining({
                id: shippingOptionPayload.provider_id,
              }),
              price_type: shippingOptionPayload.price_type,
              type: expect.objectContaining({
                id: expect.any(String),
                label: shippingOptionPayload.type.label,
                description: shippingOptionPayload.type.description,
                code: shippingOptionPayload.type.code,
              }),
              service_zone_id: fulfillmentSet.service_zones[0].id,
              shipping_profile_id: shippingProfile.id,
              prices: expect.arrayContaining([
                expect.objectContaining({
                  id: expect.any(String),
                  currency_code: "usd",
                  amount: 1000,
                }),
                expect.objectContaining({
                  id: expect.any(String),
                  currency_code: "eur",
                  amount: 1000,
                }),
              ]),
              rules: expect.arrayContaining([
                expect.objectContaining({
                  id: expect.any(String),
                  operator: "eq",
                  attribute: "old_attr",
                  value: "old value",
                }),
              ]),
            })
          )
        })
      })

      describe("POST /admin/shipping-options/:id", () => {
        it("should update a shipping option successfully", async () => {
          const shippingOptionPayload = {
            name: "Test shipping option",
            service_zone_id: fulfillmentSet.service_zones[0].id,
            shipping_profile_id: shippingProfile.id,
            provider_id: "manual_test-provider",
            price_type: "flat",
            type: {
              label: "Test type",
              description: "Test description",
              code: "test-code",
            },
            prices: [
              {
                currency_code: "usd",
                amount: 1000,
              },
              {
                region_id: region.id,
                amount: 1000,
              },
            ],
            rules: [shippingOptionRule],
          }

          const response = await api.post(
            `/admin/shipping-options`,
            shippingOptionPayload,
            adminHeaders
          )

          const shippingOptionId = response.data.shipping_option.id

          const eurPrice = response.data.shipping_option.prices.find(
            (p) => p.currency_code === "eur"
          )
          const updateShippingOptionPayload = {
            name: "Updated shipping option",
            provider_id: "manual_test-provider",
            price_type: "flat",
            prices: [
              {
                currency_code: "dkk",
                amount: 10,
              },
              {
                id: eurPrice.id,
                amount: 10000,
              },
            ],
            rules: [
              shippingOptionRule,
              {
                operator: RuleOperator.EQ,
                attribute: "new_attr",
                value: "true",
              },
            ],
          }

          const updateResponse = await api.post(
            `/admin/shipping-options/${shippingOptionId}`,
            updateShippingOptionPayload,
            adminHeaders
          )

          expect(updateResponse.status).toEqual(200)
          expect(updateResponse.data.shipping_option.prices).toHaveLength(2)
          expect(updateResponse.data.shipping_option.rules).toHaveLength(2)
          expect(updateResponse.data.shipping_option).toEqual(
            expect.objectContaining({
              id: expect.any(String),
              name: updateShippingOptionPayload.name,
              provider: expect.objectContaining({
                id: shippingOptionPayload.provider_id,
              }),
              price_type: updateShippingOptionPayload.price_type,
              type: expect.objectContaining({
                id: expect.any(String),
                label: shippingOptionPayload.type.label,
                description: shippingOptionPayload.type.description,
                code: shippingOptionPayload.type.code,
              }),
              service_zone_id: fulfillmentSet.service_zones[0].id,
              shipping_profile_id: shippingProfile.id,
              prices: expect.arrayContaining([
                expect.objectContaining({
                  id: expect.any(String),
                  currency_code: "dkk",
                  rules_count: 0,
                  amount: 10,
                }),
                expect.objectContaining({
                  id: expect.any(String),
                  currency_code: "eur",
                  rules_count: 1,
                  amount: 10000,
                }),
              ]),
              rules: expect.arrayContaining([
                expect.objectContaining({
                  id: expect.any(String),
                  operator: "eq",
                  attribute: "old_attr",
                  value: "old value",
                }),
                expect.objectContaining({
                  id: expect.any(String),
                  operator: "eq",
                  attribute: "new_attr",
                  value: "true",
                }),
              ]),
            })
          )
        })
      })

      describe("DELETE /admin/shipping-options/:id", () => {
        it("should delete a shipping option successfully", async () => {
          const shippingOptionPayload = {
            name: "Test shipping option",
            service_zone_id: fulfillmentSet.service_zones[0].id,
            shipping_profile_id: shippingProfile.id,
            provider_id: "manual_test-provider",
            price_type: "flat",
            type: {
              label: "Test type",
              description: "Test description",
              code: "test-code",
            },
            prices: [
              {
                currency_code: "usd",
                amount: 1000,
              },
              {
                region_id: region.id,
                amount: 1000,
              },
            ],
            rules: [shippingOptionRule],
          }

          const response = await api.post(
            `/admin/shipping-options`,
            shippingOptionPayload,
            adminHeaders
          )

          const shippingOptionId = response.data.shipping_option.id

          await api.delete(
            `/admin/shipping-options/${shippingOptionId}`,
            adminHeaders
          )

          const shippingOptions = await api.get(
            `/admin/shipping-options`,
            adminHeaders
          )

          expect(shippingOptions.data.shipping_options).toHaveLength(0)
        })
      })
    })
  },
})

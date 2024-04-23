import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IFulfillmentModuleService } from "@medusajs/types"
import { RuleOperator } from "@medusajs/utils"
import { medusaIntegrationTestRunner } from "medusa-test-utils"
import { createAdminUser } from "../../../../helpers/create-admin-user"

jest.setTimeout(50000)

const env = { MEDUSA_FF_MEDUSA_V2: true }
const adminHeaders = { headers: { "x-medusa-access-token": "test_token" } }

medusaIntegrationTestRunner({
  env,
  testSuite: ({ dbConnection, getContainer, api }) => {
    describe("Admin: Shipping Option Rules API", () => {
      let appContainer
      let shippingOption
      let fulfillmentModule: IFulfillmentModuleService
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
      })

      beforeEach(async () => {
        await createAdminUser(dbConnection, adminHeaders, appContainer)

        const shippingProfile = await fulfillmentModule.createShippingProfiles({
          name: "Test",
          type: "default",
        })

        const fulfillmentSet = await fulfillmentModule.create({
          name: "Test",
          type: "test-type",
          service_zones: [
            {
              name: "Test",
              geo_zones: [{ type: "country", country_code: "us" }],
            },
          ],
        })

        shippingOption = await fulfillmentModule.createShippingOptions({
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
          rules: [shippingOptionRule],
        })
      })

      describe("POST /admin/shipping-options/:id/rules/batch", () => {
        it("should throw error when required params are missing", async () => {
          const { response } = await api
            .post(
              `/admin/shipping-options/${shippingOption.id}/rules/batch`,
              {
                create: [{ operator: RuleOperator.EQ, value: "new_value" }],
              },
              adminHeaders
            )
            .catch((e) => e)

          expect(response.status).toEqual(400)
          expect(response.data).toEqual({
            type: "invalid_data",
            message:
              "attribute must be a string, attribute should not be empty",
          })
        })

        it.only("should throw error when shipping option does not exist", async () => {
          const { response } = await api
            .post(
              `/admin/shipping-options/does-not-exist/rules/batch`,
              {
                create: [
                  { attribute: "new_attr", operator: "eq", value: "new value" },
                ],
              },
              adminHeaders
            )
            .catch((e) => e)

          expect(response.status).toEqual(404)
          expect(response.data).toEqual({
            type: "not_found",
            message:
              "You tried to set relationship shipping_option_id: does-not-exist, but such entity does not exist",
          })
        })

        it("should add rules to a shipping option successfully", async () => {
          const response = await api.post(
            `/admin/shipping-options/${shippingOption.id}/rules/batch`,
            {
              create: [
                { operator: "eq", attribute: "new_attr", value: "new value" },
              ],
            },
            adminHeaders
          )

          expect(response.status).toEqual(200)

          const updatedShippingOption = (
            await api.get(
              `/admin/shipping-options/${shippingOption.id}`,
              adminHeaders
            )
          ).data.shipping_option
          expect(updatedShippingOption).toEqual(
            expect.objectContaining({
              id: shippingOption.id,
              rules: expect.arrayContaining([
                expect.objectContaining({
                  id: expect.any(String),
                  operator: "eq",
                  attribute: "old_attr",
                  value: "old value",
                  shipping_option_id: shippingOption.id,
                }),
                expect.objectContaining({
                  id: expect.any(String),
                  operator: "eq",
                  attribute: "new_attr",
                  value: "new value",
                  shipping_option_id: shippingOption.id,
                }),
              ]),
            })
          )
        })
      })

      describe("POST /admin/shipping-options/:id/rules/batch", () => {
        it("should throw error when required params are missing", async () => {
          const { response } = await api
            .post(
              `/admin/shipping-options/${shippingOption.id}/rules/batch`,
              {},
              adminHeaders
            )
            .catch((e) => e)

          expect(response.status).toEqual(400)
          expect(response.data).toEqual({
            type: "invalid_data",
            message:
              "each value in rule_ids must be a string, rule_ids should not be empty",
          })
        })

        it("should throw error when shipping option does not exist", async () => {
          const { response } = await api
            .post(
              `/admin/shipping-options/does-not-exist/rules/batch`,
              { delete: ["test"] },
              adminHeaders
            )
            .catch((e) => e)

          expect(response.status).toEqual(404)
          expect(response.data).toEqual({
            type: "not_found",
            message: "ShippingOption with id: does-not-exist was not found",
          })
        })

        it("should add rules to a shipping option successfully", async () => {
          const response = await api.post(
            `/admin/shipping-options/${shippingOption.id}/rules/batch`,
            {
              delete: [shippingOption.rules[0].id],
            },
            adminHeaders
          )

          expect(response.status).toEqual(200)

          const updatedShippingOption = (
            await api.get(
              `/admin/shipping-options/${shippingOption.id}`,
              adminHeaders
            )
          ).data.shipping_option
          expect(updatedShippingOption).toEqual(
            expect.objectContaining({
              id: shippingOption.id,
              rules: [],
            })
          )
        })
      })
    })
  },
})

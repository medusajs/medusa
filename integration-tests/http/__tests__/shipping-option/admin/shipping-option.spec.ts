import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { RuleOperator } from "@medusajs/utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"

jest.setTimeout(50000)

// BREAKING: Shipping setup has significantly changed from v1, exact migration needs more investigation
medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api }) => {
    describe("Admin: Shipping Option API", () => {
      let shippingProfile
      let fulfillmentSet
      let region
      let appContainer
      let location
      let location2
      let type

      const shippingOptionRule = {
        operator: RuleOperator.EQ,
        attribute: "old_attr",
        value: "old value",
      }

      beforeEach(async () => {
        appContainer = getContainer()

        await createAdminUser(dbConnection, adminHeaders, appContainer)

        shippingProfile = (
          await api.post(
            `/admin/shipping-profiles`,
            {
              name: "Test",
              type: "default",
            },
            adminHeaders
          )
        ).data.shipping_profile

        location = (
          await api.post(
            `/admin/stock-locations`,
            { name: "Test location" },
            adminHeaders
          )
        ).data.stock_location

        location = (
          await api.post(
            `/admin/stock-locations/${location.id}/fulfillment-sets?fields=*fulfillment_sets`,
            { name: "Test", type: "test-type" },
            adminHeaders
          )
        ).data.stock_location

        location2 = (
          await api.post(
            `/admin/stock-locations`,
            { name: "Test location 2" },
            adminHeaders
          )
        ).data.stock_location

        await api.post(
          `/admin/stock-locations/${location.id}/fulfillment-providers`,
          { add: ["manual_test-provider"] },
          adminHeaders
        )

        fulfillmentSet = (
          await api.post(
            `/admin/fulfillment-sets/${location.fulfillment_sets[0].id}/service-zones`,
            {
              name: "Test",
              geo_zones: [{ type: "country", country_code: "us" }],
            },
            adminHeaders
          )
        ).data.fulfillment_set

        region = (
          await api.post(
            `/admin/regions`,
            {
              name: "Test region",
              countries: ["FR"],
              currency_code: "eur",
            },
            adminHeaders
          )
        ).data.region

        type = (
          await api.post(
            `/admin/shipping-option-types`,
            {
              label: "Test",
              code: "test",
            },
            adminHeaders
          )
        ).data.shipping_option_type
      })

      describe("GET /admin/shipping-options", () => {
        it("should filters options by stock_location_id", async () => {
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
            prices: [{ currency_code: "usd", amount: 1000 }],
          }

          await api.post(
            `/admin/shipping-options`,
            shippingOptionPayload,
            adminHeaders
          )

          const shippingOptions = await api.get(
            `/admin/shipping-options?stock_location_id=${location.id}`,
            adminHeaders
          )

          expect(shippingOptions.data.shipping_options).toHaveLength(1)

          const shippingOptions2 = await api.get(
            `/admin/shipping-options?stock_location_id=${location2.id}`,
            adminHeaders
          )

          expect(shippingOptions2.data.shipping_options).toHaveLength(0)
        })
      })

      describe("GET /admin/shipping-options/:id", () => {
        it("should filters options by stock_location_id", async () => {
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
              { currency_code: "usd", amount: 1000 },
              {
                currency_code: "usd",
                amount: 500,
                rules: [
                  {
                    attribute: "item_total",
                    operator: "gte",
                    value: 100,
                  },
                  {
                    attribute: "item_total",
                    operator: "lte",
                    value: 200,
                  },
                ],
              },
            ],
          }

          const {
            data: { shipping_option: shippingOption },
          } = await api.post(
            `/admin/shipping-options`,
            shippingOptionPayload,
            adminHeaders
          )

          const shippingOptionRes = await api.get(
            `/admin/shipping-options/${shippingOption.id}`,
            adminHeaders
          )

          expect(shippingOptionRes.data.shipping_option).toEqual({
            id: expect.any(String),
            name: "Test shipping option",
            price_type: "flat",
            prices: expect.arrayContaining([
              expect.objectContaining({
                id: expect.any(String),
                amount: 1000,
                currency_code: "usd",
                max_quantity: null,
                min_quantity: null,
                price_list: null,
                price_list_id: null,
                price_set_id: expect.any(String),
                raw_amount: {
                  precision: 20,
                  value: "1000",
                },
                rules_count: 0,
                title: null,
                created_at: expect.any(String),
                updated_at: expect.any(String),
                deleted_at: null,
                price_rules: [],
              }),
              expect.objectContaining({
                id: expect.any(String),
                amount: 500,
                currency_code: "usd",
                max_quantity: null,
                min_quantity: null,
                price_list: null,
                price_list_id: null,
                price_set_id: expect.any(String),
                raw_amount: {
                  precision: 20,
                  value: "500",
                },
                rules_count: 2,
                price_rules: expect.arrayContaining([
                  expect.objectContaining({
                    attribute: "item_total",
                    operator: "gte",
                    value: "100",
                  }),
                  expect.objectContaining({
                    attribute: "item_total",
                    operator: "lte",
                    value: "200",
                  }),
                ]),
                title: null,
                created_at: expect.any(String),
                updated_at: expect.any(String),
                deleted_at: null,
              }),
            ]),
            provider_id: "manual_test-provider",
            provider: expect.objectContaining({
              id: "manual_test-provider",
              is_enabled: true,
            }),
            rules: [],
            service_zone_id: expect.any(String),
            service_zone: {
              id: expect.any(String),
              name: "Test",
              fulfillment_set: {
                id: expect.any(String),
              },
              fulfillment_set_id: expect.any(String),
              metadata: null,
              created_at: expect.any(String),
              updated_at: expect.any(String),
              deleted_at: null,
            },
            shipping_profile_id: expect.any(String),
            shipping_profile: {
              id: expect.any(String),
              metadata: null,
              name: "Test",
              type: "default",
              created_at: expect.any(String),
              updated_at: expect.any(String),
              deleted_at: null,
            },
            type: {
              code: "test-code",
              description: "Test description",
              id: expect.any(String),
              label: "Test type",
              created_at: expect.any(String),
              updated_at: expect.any(String),
              deleted_at: null,
            },
            created_at: expect.any(String),
            updated_at: expect.any(String),
            data: null,
            metadata: null,
          })
        })

        it("should retrieve a shipping option with metadata successfully", async () => {
          const shippingOptionPayload = {
            name: "Test shipping option with metadata",
            service_zone_id: fulfillmentSet.service_zones[0].id,
            shipping_profile_id: shippingProfile.id,
            provider_id: "manual_test-provider",
            price_type: "flat",
            type: {
              label: "Test type",
              description: "Test description",
              code: "test-code",
            },
            prices: [{ currency_code: "usd", amount: 1000 }],
            metadata: {
              priority: "high",
              tracking: "enabled",
              carrier: "express",
              specialHandling: true,
            },
          }

          const {
            data: { shipping_option: shippingOption },
          } = await api.post(
            `/admin/shipping-options`,
            shippingOptionPayload,
            adminHeaders
          )

          const shippingOptionRes = await api.get(
            `/admin/shipping-options/${shippingOption.id}`,
            adminHeaders
          )

          expect(shippingOptionRes.data.shipping_option).toEqual(
            expect.objectContaining({
              id: expect.any(String),
              name: "Test shipping option with metadata",
              metadata: {
                priority: "high",
                tracking: "enabled",
                carrier: "express",
                specialHandling: true,
              },
            })
          )
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

          expect(err.status).toEqual(400)
          expect(err.data).toEqual({
            type: "invalid_data",
            message: `Invalid request: Field 'service_zone_id' is required; Field 'shipping_profile_id' is required; Field 'price_type' is required`,
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
              {
                region_id: region.id,
                amount: 500,
                rules: [
                  {
                    attribute: "item_total",
                    operator: "gt",
                    value: 200,
                  },
                ],
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
                expect.objectContaining({
                  id: expect.any(String),
                  currency_code: "eur",
                  amount: 500,
                  rules_count: 2,
                  price_rules: expect.arrayContaining([
                    expect.objectContaining({
                      attribute: "item_total",
                      operator: "gt",
                      value: "200",
                    }),
                    expect.objectContaining({
                      attribute: "region_id",
                      operator: "eq",
                      value: region.id,
                    }),
                  ]),
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

        it("should create a shipping option successfully with the provided shipping option type", async () => {
          const shippingOptionPayload = {
            name: "Test shipping option",
            service_zone_id: fulfillmentSet.service_zones[0].id,
            shipping_profile_id: shippingProfile.id,
            provider_id: "manual_test-provider",
            price_type: "flat",
            type_id: type.id,
            prices: [
              {
                currency_code: "usd",
                amount: 1000,
              },
              {
                region_id: region.id,
                amount: 1000,
              },
              {
                region_id: region.id,
                amount: 500,
                rules: [
                  {
                    attribute: "item_total",
                    operator: "gt",
                    value: 200,
                  },
                ],
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
                id: type.id,
                label: type.label,
                description: type.description,
                code: type.code,
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
                expect.objectContaining({
                  id: expect.any(String),
                  currency_code: "eur",
                  amount: 500,
                  rules_count: 2,
                  price_rules: expect.arrayContaining([
                    expect.objectContaining({
                      attribute: "item_total",
                      operator: "gt",
                      value: "200",
                    }),
                    expect.objectContaining({
                      attribute: "region_id",
                      operator: "eq",
                      value: region.id,
                    }),
                  ]),
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

        it("should throw error when creating a price rule with a non white listed attribute", async () => {
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
                amount: 500,
                rules: [
                  {
                    attribute: "not_whitelisted",
                    operator: "gte",
                    value: 100,
                  },
                ],
              },
            ],
          }

          const error = await api
            .post(
              `/admin/shipping-options`,
              shippingOptionPayload,
              adminHeaders
            )
            .catch((e) => e)

          expect(error.response.status).toEqual(400)
        })

        it("should throw error when creating a price rule with a non white listed operator", async () => {
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
                amount: 500,
                rules: [
                  {
                    attribute: "item_total",
                    operator: "not_whitelisted",
                    value: 100,
                  },
                ],
              },
            ],
          }

          const error = await api
            .post(
              `/admin/shipping-options`,
              shippingOptionPayload,
              adminHeaders
            )
            .catch((e) => e)

          expect(error.response.status).toEqual(400)
        })

        it("should throw error when creating a price rule with a string value", async () => {
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
                amount: 500,
                rules: [
                  {
                    attribute: "item_total",
                    operator: "gt",
                    value: "string",
                  },
                ],
              },
            ],
          }

          const error = await api
            .post(
              `/admin/shipping-options`,
              shippingOptionPayload,
              adminHeaders
            )
            .catch((e) => e)

          expect(error.response.status).toEqual(400)
        })

        it("should throw error when provider does not exist on a location", async () => {
          const shippingOptionPayload = {
            name: "Test shipping option",
            service_zone_id: fulfillmentSet.service_zones[0].id,
            shipping_profile_id: shippingProfile.id,
            provider_id: "does-not-exist",
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
            ],
            rules: [shippingOptionRule],
          }

          const error = await api
            .post(
              `/admin/shipping-options`,
              shippingOptionPayload,
              adminHeaders
            )
            .catch((e) => e)

          expect(error.response.status).toEqual(400)
          expect(error.response.data.message).toEqual(
            "Providers (does-not-exist) are not enabled for the service location"
          )
        })

        it("should throw error if both type and type_id are missing", async () => {
          const shippingOptionPayload = {
            name: "Test shipping option",
            service_zone_id: fulfillmentSet.service_zones[0].id,
            shipping_profile_id: shippingProfile.id,
            provider_id: "manual_test-provider",
            price_type: "flat",
            prices: [
              {
                currency_code: "usd",
                amount: 1000,
              },
            ],
            rules: [shippingOptionRule],
          }

          const error = await api
            .post(
              `/admin/shipping-options`,
              shippingOptionPayload,
              adminHeaders
            )
            .catch((e) => e)

          expect(error.response.status).toEqual(400)
          expect(error.response.data.message).toEqual(
            "Invalid request: Exactly one of 'type' or 'type_id' must be provided, but not both"
          )
        })

        it("should throw error if both type and type_id are defined", async () => {
          const shippingOptionPayload = {
            name: "Test shipping option",
            service_zone_id: fulfillmentSet.service_zones[0].id,
            shipping_profile_id: shippingProfile.id,
            provider_id: "manual_test-provider",
            type: {
              label: "Test type",
              description: "Test description",
              code: "test-code",
            },
            type_id: "test_type_id",
            price_type: "flat",
            prices: [
              {
                currency_code: "usd",
                amount: 1000,
              },
            ],
            rules: [shippingOptionRule],
          }

          const error = await api
            .post(
              `/admin/shipping-options`,
              shippingOptionPayload,
              adminHeaders
            )
            .catch((e) => e)

          expect(error.response.status).toEqual(400)
          expect(error.response.data.message).toEqual(
            "Invalid request: Exactly one of 'type' or 'type_id' must be provided, but not both"
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
            rules: [
              {
                operator: RuleOperator.EQ,
                attribute: "old_attr",
                value: "old value",
              },
              {
                operator: RuleOperator.EQ,
                attribute: "old_attr_2",
                value: "true",
              },
            ],
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

          const oldAttrRule = response.data.shipping_option.rules.find(
            (r) => r.attribute === "old_attr"
          )
          const oldAttr2Rule = response.data.shipping_option.rules.find(
            (r) => r.attribute === "old_attr_2"
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
              {
                currency_code: "dkk",
                amount: 5,
                rules: [
                  {
                    attribute: "item_total",
                    operator: "gt",
                    value: 200,
                  },
                ],
              },
            ],
            rules: [
              {
                // Untouched
                id: oldAttrRule.id,
                operator: RuleOperator.EQ,
                attribute: "old_attr",
                value: "old value",
              },
              {
                // Updated
                id: oldAttr2Rule.id,
                operator: RuleOperator.EQ,
                attribute: "old_attr_2",
                value: "false",
              },
              {
                // Created
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
          expect(updateResponse.data.shipping_option.prices).toHaveLength(3)
          expect(updateResponse.data.shipping_option.rules).toHaveLength(3)
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
                expect.objectContaining({
                  id: expect.any(String),
                  currency_code: "dkk",
                  rules_count: 1,
                  amount: 5,
                  price_rules: [
                    expect.objectContaining({
                      attribute: "item_total",
                      operator: "gt",
                      value: "200",
                    }),
                  ],
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
                  attribute: "old_attr_2",
                  value: "false",
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

        it("should update a shipping option with a provided shipping option type successfully", async () => {
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
            rules: [
              {
                operator: RuleOperator.EQ,
                attribute: "old_attr",
                value: "old value",
              },
              {
                operator: RuleOperator.EQ,
                attribute: "old_attr_2",
                value: "true",
              },
            ],
          }

          const response = await api.post(
            `/admin/shipping-options`,
            shippingOptionPayload,
            adminHeaders
          )

          const shippingOptionId = response.data.shipping_option.id

          const updateResponse = await api.post(
            `/admin/shipping-options/${shippingOptionId}`,
            {
              name: "Updated shipping option",
              type_id: type.id,
            },
            adminHeaders
          )

          expect(updateResponse.status).toEqual(200)
          expect(updateResponse.data.shipping_option).toEqual(
            expect.objectContaining({
              id: expect.any(String),
              name: "Updated shipping option",
              type: expect.objectContaining({
                id: type.id,
                label: type.label,
                description: type.description,
                code: type.code,
              }),
            })
          )
        })

        it("should update a shipping option without providing shipping option type successfully", async () => {
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
            rules: [
              {
                operator: RuleOperator.EQ,
                attribute: "old_attr",
                value: "old value",
              },
              {
                operator: RuleOperator.EQ,
                attribute: "old_attr_2",
                value: "true",
              },
            ],
          }

          const response = await api.post(
            `/admin/shipping-options`,
            shippingOptionPayload,
            adminHeaders
          )

          const shippingOptionId = response.data.shipping_option.id

          const updateResponse = await api.post(
            `/admin/shipping-options/${shippingOptionId}`,
            {
              name: "Updated shipping option",
            },
            adminHeaders
          )

          expect(updateResponse.status).toEqual(200)
          expect(updateResponse.data.shipping_option).toEqual(
            expect.objectContaining({
              id: expect.any(String),
              name: "Updated shipping option",
            })
          )
        })

        it("should throw an error when provider does not belong to service location", async () => {
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

          const updateShippingOptionPayload = {
            provider_id: "another_test-provider",
          }

          const error = await api
            .post(
              `/admin/shipping-options/${shippingOptionId}`,
              updateShippingOptionPayload,
              adminHeaders
            )
            .catch((e) => e)

          expect(error.response.status).toEqual(400)
          expect(error.response.data.message).toEqual(
            "Providers (another_test-provider) are not enabled for the service location"
          )
        })

        it("should throw an error when type and type_id are both defined", async () => {
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

          const updateShippingOptionPayload = {
            type: {
              label: "Test type",
              description: "Test description",
              code: "test-code",
            },
            type_id: "test_type_id",
          }

          const error = await api
            .post(
              `/admin/shipping-options/${shippingOptionId}`,
              updateShippingOptionPayload,
              adminHeaders
            )
            .catch((e) => e)

          expect(error.response.status).toEqual(400)
          expect(error.response.data.message).toEqual(
            "Invalid request: Only one of 'type' or 'type_id' can be provided"
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

      describe("POST /admin/shipping-options/:id/rules/batch", () => {
        it.skip("should throw error when required params are missing", async () => {
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

          const shippingOption = (
            await api.post(
              `/admin/shipping-options`,
              shippingOptionPayload,
              adminHeaders
            )
          ).data.shipping_option

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

        it("should throw error when shipping option does not exist", async () => {
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

        it.skip("should add rules to a shipping option successfully", async () => {
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

          const shippingOption = (
            await api.post(
              `/admin/shipping-options`,
              shippingOptionPayload,
              adminHeaders
            )
          ).data.shipping_option

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
    })
  },
})

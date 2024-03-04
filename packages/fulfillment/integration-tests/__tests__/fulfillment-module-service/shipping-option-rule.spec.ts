import { Modules } from "@medusajs/modules-sdk"
import { IFulfillmentModuleService } from "@medusajs/types"
import { moduleIntegrationTestRunner, SuiteOptions } from "medusa-test-utils"
import { generateCreateShippingOptionsData } from "../../__fixtures__"

jest.setTimeout(100000)

// TODO: Temporary until the providers are sorted out
const createProvider = async (MikroOrmWrapper, providerId: string) => {
  const [{ id }] = await MikroOrmWrapper.forkManager().execute(
    `insert into service_provider (id) values ('${providerId}') returning id`
  )

  return id
}

moduleIntegrationTestRunner({
  moduleName: Modules.FULFILLMENT,
  testSuite: ({
    MikroOrmWrapper,
    service,
  }: SuiteOptions<IFulfillmentModuleService>) => {
    describe("Fulfillment Module Service", () => {
      describe("mutations", () => {
        describe("on create", () => {
          it("should create a new rule", async () => {
            const shippingProfile = await service.createShippingProfiles({
              name: "test",
              type: "default",
            })
            const fulfillmentSet = await service.create({
              name: "test",
              type: "test-type",
            })
            const serviceZone = await service.createServiceZones({
              name: "test",
              fulfillment_set_id: fulfillmentSet.id,
            })

            // service provider
            const [{ id: providerId }] =
              await MikroOrmWrapper.forkManager().execute(
                "insert into service_provider (id) values ('sp_jdafwfleiwuonl') returning id"
              )

            const shippingOption = await service.createShippingOptions(
              generateCreateShippingOptionsData({
                service_zone_id: serviceZone.id,
                shipping_profile_id: shippingProfile.id,
                service_provider_id: providerId,
              })
            )

            const ruleData = {
              attribute: "test-attribute",
              operator: "eq",
              value: "test-value",
              shipping_option_id: shippingOption.id,
            }

            const rule = await service.createShippingOptionRules(ruleData)

            expect(rule).toEqual(
              expect.objectContaining({
                id: expect.any(String),
                attribute: ruleData.attribute,
                operator: ruleData.operator,
                value: ruleData.value,
                shipping_option_id: ruleData.shipping_option_id,
              })
            )

            const rules = await service.listShippingOptionRules()
            expect(rules).toHaveLength(2)
            expect(rules).toEqual(
              expect.arrayContaining([
                expect.objectContaining({
                  id: rule.id,
                  attribute: ruleData.attribute,
                  operator: ruleData.operator,
                  value: ruleData.value,
                  shipping_option_id: shippingOption.id,
                }),
                expect.objectContaining({
                  id: shippingOption.rules[0].id,
                  attribute: shippingOption.rules[0].attribute,
                  operator: shippingOption.rules[0].operator,
                  value: shippingOption.rules[0].value,
                  shipping_option_id: shippingOption.id,
                }),
              ])
            )
          })
        })
        describe("on update", () => {
          it("should update a shipping option rule", async () => {
            const shippingProfile = await service.createShippingProfiles({
              name: "test",
              type: "default",
            })
            const fulfillmentSet = await service.create({
              name: "test",
              type: "test-type",
            })
            const serviceZone = await service.createServiceZones({
              name: "test",
              fulfillment_set_id: fulfillmentSet.id,
            })
            const providerId = await createProvider(
              MikroOrmWrapper,
              "sp_jdafwfleiwuonl"
            )

            const shippingOption = await service.createShippingOptions(
              generateCreateShippingOptionsData({
                service_zone_id: serviceZone.id,
                shipping_profile_id: shippingProfile.id,
                service_provider_id: providerId,
              })
            )

            const updateData = {
              id: shippingOption.rules[0].id,
              attribute: "updated-test",
              operator: "eq",
              value: "updated-test",
            }

            const updatedRule = await service.updateShippingOptionRules(
              updateData
            )

            expect(updatedRule).toEqual(
              expect.objectContaining({
                id: updateData.id,
                attribute: updateData.attribute,
                operator: updateData.operator,
                value: updateData.value,
              })
            )
          })

          it("should fail to update a non-existent shipping option rule", async () => {
            const updateData = {
              id: "sp_jdafwfleiwuonl",
              attribute: "updated-test",
              operator: "eq",
              value: "updated-test",
            }

            const err = await service
              .updateShippingOptionRules(updateData)
              .catch((e) => e)

            expect(err).toBeDefined()
            expect(err.message).toBe(
              `ShippingOptionRule with id "${updateData.id}" not found`
            )
          })
        })
      })
    })
  },
})

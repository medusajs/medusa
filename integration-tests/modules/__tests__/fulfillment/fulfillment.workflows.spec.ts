import {
  createFulfillmentWorkflow,
  createFulfillmentWorkflowId,
} from "@medusajs/core-flows"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IFulfillmentModuleService } from "@medusajs/types"
import { medusaIntegrationTestRunner } from "medusa-test-utils/dist"
import {
  generateCreateFulfillmentData,
  generateCreateShippingOptionsData,
} from "../fixtures"

jest.setTimeout(50000)

const providerId = "manual_test-provider"

medusaIntegrationTestRunner({
  env: { MEDUSA_FF_MEDUSA_V2: true },
  testSuite: ({ getContainer }) => {
    describe("Workflows: Fulfillment", () => {
      let appContainer
      let service: IFulfillmentModuleService

      beforeAll(async () => {
        appContainer = getContainer()
        service = appContainer.resolve(ModuleRegistrationName.FULFILLMENT)
      })

      describe("createFulfillmentWorkflow", () => {
        describe("compensation", () => {
          it("should cancel created fulfillment if step following step throws error", async () => {
            const workflow = createFulfillmentWorkflow(appContainer)

            workflow.appendAction("throw", createFulfillmentWorkflowId, {
              invoke: async function failStep() {
                throw new Error(
                  `Failed to do something after creating fulfillment`
                )
              },
            })

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

            const shippingOption = await service.createShippingOptions(
              generateCreateShippingOptionsData({
                provider_id: providerId,
                service_zone_id: serviceZone.id,
                shipping_profile_id: shippingProfile.id,
              })
            )

            const data = generateCreateFulfillmentData({
              provider_id: providerId,
              shipping_option_id: shippingOption.id,
            })
            const { errors } = await workflow.run({
              input: data,
              throwOnError: false,
            })

            expect(errors).toEqual([
              {
                action: "throw",
                handlerType: "invoke",
                error: expect.objectContaining({
                  message: `Failed to do something after creating fulfillment`,
                }),
              },
            ])

            const fulfillments = await service.listFulfillments()

            expect(fulfillments.filter((f) => !!f.canceled_at)).toHaveLength(1)
          })
        })
      })
    })
  },
})

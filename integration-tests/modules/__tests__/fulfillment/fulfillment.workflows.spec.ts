import {
  createFulfillmentWorkflow,
  createFulfillmentWorkflowId,
  createShipmentWorkflow,
  createShipmentWorkflowId,
  updateFulfillmentWorkflow,
  updateFulfillmentWorkflowId,
} from "@medusajs/core-flows"
import {
  IFulfillmentModuleService,
  MedusaContainer,
  StockLocationDTO,
} from "@medusajs/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/utils"
import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
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
      let location: StockLocationDTO
      let appContainer: MedusaContainer
      let service: IFulfillmentModuleService

      beforeAll(async () => {
        appContainer = getContainer()
        service = appContainer.resolve(Modules.FULFILLMENT)
      })

      beforeEach(async () => {
        const stockLocationService = appContainer.resolve(
          Modules.STOCK_LOCATION
        )

        location = await stockLocationService.createStockLocations({
          name: "Test Location",
          address: {
            address_1: "Test Address",
            address_2: "tttest",
            city: "Test City",
            country_code: "us",
            postal_code: "12345",
            metadata: { email: "test@mail.com" },
          },
          metadata: { custom_location: "yes" },
        })
      })

      describe("createFulfillmentWorkflow", () => {
        describe("invoke", () => {
          it("should get stock location", async () => {
            const workflow = createFulfillmentWorkflow(appContainer)

            const link = appContainer.resolve(
              ContainerRegistrationKeys.REMOTE_LINK
            )

            const shippingProfile = await service.createShippingProfiles({
              name: "test",
              type: "default",
            })

            const fulfillmentSet = await service.createFulfillmentSets({
              name: "test",
              type: "test-type",
            })

            await link.create({
              [Modules.STOCK_LOCATION]: {
                stock_location_id: location.id,
              },
              [Modules.FULFILLMENT]: {
                fulfillment_set_id: fulfillmentSet.id,
              },
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
              order_id: "fake-order",
              location_id: location.id,
            })

            const { transaction } = await workflow.run({
              input: data,
              throwOnError: true,
            })

            expect(
              transaction.context.invoke["get-location"].output.output
            ).toEqual({
              id: expect.any(String),
              created_at: expect.any(Date),
              updated_at: expect.any(Date),
              name: "Test Location",
              address: {
                id: expect.any(String),
                address_1: "Test Address",
                address_2: "tttest",
                city: "Test City",
                country_code: "us",
                postal_code: "12345",
                metadata: { email: "test@mail.com" },
                phone: null,
                province: null,
              },
              metadata: { custom_location: "yes" },
            })
          })
        })

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

            const fulfillmentSet = await service.createFulfillmentSets({
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
              order_id: "fake-order",
              location_id: location.id,
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

      describe("updateFulfillmentWorkflow", () => {
        describe("compensation", () => {
          it("should rollback updated fulfillment if step following step throws error", async () => {
            const workflow = updateFulfillmentWorkflow(appContainer)

            workflow.appendAction("throw", updateFulfillmentWorkflowId, {
              invoke: async function failStep() {
                throw new Error(
                  `Failed to do something after updating fulfillment`
                )
              },
            })

            const shippingProfile = await service.createShippingProfiles({
              name: "test",
              type: "default",
            })

            const fulfillmentSet = await service.createFulfillmentSets({
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
              order_id: "fake-order",
              provider_id: providerId,
              shipping_option_id: shippingOption.id,
              location_id: location.id,
            })

            const fulfillment = await service.createFulfillment({
              ...data,
              location,
            })

            const date = new Date()
            const { errors } = await workflow.run({
              input: {
                id: fulfillment.id,
                shipped_at: date,
                packed_at: date,
                location_id: location.id,
              },
              throwOnError: false,
            })

            expect(errors).toEqual([
              {
                action: "throw",
                handlerType: "invoke",
                error: expect.objectContaining({
                  message: `Failed to do something after updating fulfillment`,
                }),
              },
            ])

            const fulfillmentAfterRollback = await service.retrieveFulfillment(
              fulfillment.id
            )

            expect(fulfillmentAfterRollback).toEqual(
              expect.objectContaining({
                location_id: data.location_id,
                shipped_at: data.shipped_at,
                packed_at: data.packed_at,
              })
            )
          })
        })
      })

      describe("createShipmentWorkflow", () => {
        describe("compensation", () => {
          it("should rollback shipment workflow if following step throws error", async () => {
            const workflow = createShipmentWorkflow(appContainer)

            workflow.appendAction("throw", createShipmentWorkflowId, {
              invoke: async function failStep() {
                throw new Error(
                  `Failed to do something after creating shipment`
                )
              },
            })

            const shippingProfile = await service.createShippingProfiles({
              name: "test",
              type: "default",
            })

            const fulfillmentSet = await service.createFulfillmentSets({
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
              order_id: "fake-order",
              provider_id: providerId,
              shipping_option_id: shippingOption.id,
              location_id: location.id,
            })

            const fulfillment = await service.createFulfillment({
              ...data,
              location,
              labels: [],
            })

            const { errors } = await workflow.run({
              input: {
                id: fulfillment.id,
                labels: [
                  {
                    tracking_number: "test-tracking-number",
                    tracking_url: "test-tracking-url",
                    label_url: "test-label-url",
                  },
                ],
              },
              throwOnError: false,
            })

            expect(errors).toEqual([
              {
                action: "throw",
                handlerType: "invoke",
                error: expect.objectContaining({
                  message: `Failed to do something after creating shipment`,
                }),
              },
            ])

            const fulfillmentAfterRollback = await service.retrieveFulfillment(
              fulfillment.id,
              { select: ["shipped_at"], relations: ["labels"] }
            )

            expect(fulfillmentAfterRollback).toEqual(
              expect.objectContaining({
                shipped_at: null,
                // TODO: the revert isn't handling deleting the labels. This needs to be handled uniformly across.
                // labels: [],
              })
            )
          })
        })
      })
    })
  },
})

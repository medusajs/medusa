import { resolve } from "path"
import { Modules } from "@medusajs/modules-sdk"
import {
  IFulfillmentModuleService,
  UpdateFulfillmentDTO,
} from "@medusajs/types"
import {
  MockEventBusService,
  moduleIntegrationTestRunner,
} from "medusa-test-utils"
import {
  buildExpectedEventMessageShape,
  generateCreateFulfillmentData,
  generateCreateShippingOptionsData,
} from "../../__fixtures__"
import { FulfillmentEvents } from "@medusajs/utils"

jest.setTimeout(100000)

const moduleOptions = {
  providers: [
    {
      resolve: resolve(
        process.cwd() +
          "/integration-tests/__fixtures__/providers/default-provider"
      ),
      options: {
        config: {
          "test-provider": {},
        },
      },
    },
  ],
}

const providerId = "fixtures-fulfillment-provider_test-provider"

moduleIntegrationTestRunner<IFulfillmentModuleService>({
  moduleName: Modules.FULFILLMENT,
  moduleOptions: moduleOptions,
  testSuite: ({ service }) => {
    let eventBusEmitSpy

    beforeEach(() => {
      eventBusEmitSpy = jest.spyOn(MockEventBusService.prototype, "emit")
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    describe("Fulfillment Module Service", () => {
      describe("read", () => {
        it("should list fulfillment", async () => {
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

          const fulfillment = await service.createFulfillment(
            generateCreateFulfillmentData({
              provider_id: providerId,
              shipping_option_id: shippingOption.id,
            })
          )

          const result = await service.listFulfillments({
            shipping_option_id: shippingOption.id,
          })

          expect(result.length).toEqual(1)
          expect(result[0].id).toEqual(fulfillment.id)
        })

        it("should retrieve the fulfillment options", async () => {
          const fulfillmentOptions = await service.retrieveFulfillmentOptions(
            providerId
          )

          expect(fulfillmentOptions).toEqual({})
        })
      })

      describe("mutations", () => {
        describe("on create", () => {
          it("should create a fulfillment", async () => {
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

            jest.clearAllMocks()

            const fulfillment = await service.createFulfillment(
              generateCreateFulfillmentData({
                provider_id: providerId,
                shipping_option_id: shippingOption.id,
              })
            )

            expect(fulfillment).toEqual(
              expect.objectContaining({
                id: expect.any(String),
                packed_at: null,
                shipped_at: null,
                delivered_at: null,
                canceled_at: null,
                data: null,
                provider_id: providerId,
                shipping_option_id: shippingOption.id,
                metadata: null,
                delivery_address: expect.objectContaining({
                  id: expect.any(String),
                }),
                items: [
                  expect.objectContaining({
                    id: expect.any(String),
                  }),
                ],
                labels: [
                  expect.objectContaining({
                    id: expect.any(String),
                  }),
                ],
              })
            )

            expect(eventBusEmitSpy.mock.calls[0][0]).toHaveLength(4)
            expect(eventBusEmitSpy).toHaveBeenCalledWith([
              buildExpectedEventMessageShape({
                eventName: FulfillmentEvents.fulfillment_created,
                action: "created",
                object: "fulfillment",
                data: { id: fulfillment.id },
              }),
              buildExpectedEventMessageShape({
                eventName: FulfillmentEvents.fulfillment_address_created,
                action: "created",
                object: "fulfillment_address",
                data: { id: fulfillment.delivery_address.id },
              }),
              buildExpectedEventMessageShape({
                eventName: FulfillmentEvents.fulfillment_item_created,
                action: "created",
                object: "fulfillment_item",
                data: { id: fulfillment.items[0].id },
              }),
              buildExpectedEventMessageShape({
                eventName: FulfillmentEvents.fulfillment_label_created,
                action: "created",
                object: "fulfillment_label",
                data: { id: fulfillment.labels[0].id },
              }),
            ])
          })

          it("should create a return fulfillment", async () => {
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

            jest.clearAllMocks()

            const fulfillment = await service.createReturnFulfillment(
              generateCreateFulfillmentData({
                provider_id: providerId,
                shipping_option_id: shippingOption.id,
              })
            )

            expect(fulfillment).toEqual(
              expect.objectContaining({
                id: expect.any(String),
                packed_at: null,
                shipped_at: null,
                delivered_at: null,
                canceled_at: null,
                data: null,
                provider_id: providerId,
                shipping_option_id: shippingOption.id,
                metadata: null,
                delivery_address: expect.objectContaining({
                  id: expect.any(String),
                }),
                items: [
                  expect.objectContaining({
                    id: expect.any(String),
                  }),
                ],
                labels: [
                  expect.objectContaining({
                    id: expect.any(String),
                  }),
                ],
              })
            )

            expect(eventBusEmitSpy.mock.calls[0][0]).toHaveLength(4)
            expect(eventBusEmitSpy).toHaveBeenCalledWith([
              buildExpectedEventMessageShape({
                eventName: FulfillmentEvents.fulfillment_created,
                action: "created",
                object: "fulfillment",
                data: { id: fulfillment.id },
              }),
              buildExpectedEventMessageShape({
                eventName: FulfillmentEvents.fulfillment_address_created,
                action: "created",
                object: "fulfillment_address",
                data: { id: fulfillment.delivery_address.id },
              }),
              buildExpectedEventMessageShape({
                eventName: FulfillmentEvents.fulfillment_item_created,
                action: "created",
                object: "fulfillment_item",
                data: { id: fulfillment.items[0].id },
              }),
              buildExpectedEventMessageShape({
                eventName: FulfillmentEvents.fulfillment_label_created,
                action: "created",
                object: "fulfillment_label",
                data: { id: fulfillment.labels[0].id },
              }),
            ])
          })
        })

        describe("on update", () => {
          it("should update a fulfillment", async () => {
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

            const fulfillment = await service.createFulfillment(
              generateCreateFulfillmentData({
                provider_id: providerId,
                shipping_option_id: shippingOption.id,
                labels: [
                  {
                    tracking_number: "test-tracking-number-1",
                    tracking_url: "test-tracking-url-1",
                    label_url: "test-label-url-1",
                  },
                  {
                    tracking_number: "test-tracking-number-2",
                    tracking_url: "test-tracking-url-2",
                    label_url: "test-label-url-2",
                  },
                  {
                    tracking_number: "test-tracking-number-3",
                    tracking_url: "test-tracking-url-3",
                    label_url: "test-label-url-3",
                  },
                ],
              })
            )

            const label1 = fulfillment.labels.find(
              (l) => l.tracking_number === "test-tracking-number-1"
            )!
            const label2 = fulfillment.labels.find(
              (l) => l.tracking_number === "test-tracking-number-2"
            )!
            const label3 = fulfillment.labels.find(
              (l) => l.tracking_number === "test-tracking-number-3"
            )!

            const updateData: UpdateFulfillmentDTO = {
              id: fulfillment.id,
              labels: [
                { id: label1.id },
                { ...label2, label_url: "updated-test-label-url-2" },
                {
                  tracking_number: "test-tracking-number-4",
                  tracking_url: "test-tracking-url-4",
                  label_url: "test-label-url-4",
                },
              ],
            }

            jest.clearAllMocks()

            const updatedFulfillment = await service.updateFulfillment(
              fulfillment.id,
              updateData
            )

            const label4 = updatedFulfillment.labels.find(
              (l) => l.tracking_number === "test-tracking-number-4"
            )!

            expect(updatedFulfillment.labels).toHaveLength(3)
            expect(updatedFulfillment).toEqual(
              expect.objectContaining({
                id: expect.any(String),
                labels: expect.arrayContaining([
                  expect.objectContaining({
                    tracking_number: "test-tracking-number-1",
                    tracking_url: "test-tracking-url-1",
                    label_url: "test-label-url-1",
                  }),
                  expect.objectContaining({
                    tracking_number: "test-tracking-number-2",
                    tracking_url: "test-tracking-url-2",
                    label_url: "updated-test-label-url-2",
                  }),
                  expect.objectContaining({
                    tracking_number: "test-tracking-number-4",
                    tracking_url: "test-tracking-url-4",
                    label_url: "test-label-url-4",
                  }),
                ]),
              })
            )

            expect(eventBusEmitSpy.mock.calls[0][0]).toHaveLength(4)
            expect(eventBusEmitSpy).toHaveBeenCalledWith([
              buildExpectedEventMessageShape({
                eventName: FulfillmentEvents.fulfillment_updated,
                action: "updated",
                object: "fulfillment",
                data: { id: updatedFulfillment.id },
              }),
              buildExpectedEventMessageShape({
                eventName: FulfillmentEvents.fulfillment_label_deleted,
                action: "deleted",
                object: "fulfillment_label",
                data: { id: label3.id },
              }),
              buildExpectedEventMessageShape({
                eventName: FulfillmentEvents.fulfillment_label_updated,
                action: "updated",
                object: "fulfillment_label",
                data: { id: label2.id },
              }),
              buildExpectedEventMessageShape({
                eventName: FulfillmentEvents.fulfillment_label_created,
                action: "created",
                object: "fulfillment_label",
                data: { id: label4.id },
              }),
            ])
          })
        })

        describe("on cancel", () => {
          let fulfillment

          beforeEach(async () => {
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

            fulfillment = await service.createFulfillment(
              generateCreateFulfillmentData({
                provider_id: providerId,
                shipping_option_id: shippingOption.id,
              })
            )

            jest.clearAllMocks()
          })

          it("should cancel a fulfillment successfully", async () => {
            const result = await service.cancelFulfillment(fulfillment.id)
            // should be idempotent
            const idempotentResult = await service.cancelFulfillment(
              fulfillment.id
            )

            expect(result.canceled_at).not.toBeNull()
            expect(idempotentResult.canceled_at).not.toBeNull()
            expect(idempotentResult.canceled_at).toEqual(result.canceled_at)

            expect(eventBusEmitSpy.mock.calls[0][0]).toHaveLength(1)
            expect(eventBusEmitSpy).toHaveBeenNthCalledWith(1, [
              buildExpectedEventMessageShape({
                eventName: FulfillmentEvents.fulfillment_updated,
                action: "updated",
                object: "fulfillment",
                data: { id: fulfillment.id },
              }),
            ])
          })

          it("should fail to cancel a fulfillment that is already shipped", async () => {
            await service.updateFulfillment(fulfillment.id, {
              shipped_at: new Date(),
            })

            const err = await service
              .cancelFulfillment(fulfillment.id)
              .catch((e) => e)

            expect(err.message).toEqual(
              `Fulfillment with id ${fulfillment.id} already shipped`
            )
          })

          it("should fail to cancel a fulfillment that is already delivered", async () => {
            await service.updateFulfillment(fulfillment.id, {
              delivered_at: new Date(),
            })

            const err = await service
              .cancelFulfillment(fulfillment.id)
              .catch((e) => e)

            expect(err.message).toEqual(
              `Fulfillment with id ${fulfillment.id} already delivered`
            )
          })
        })
      })
    })
  },
})

import {
  CreateShippingProfileDTO,
  IFulfillmentModuleService,
} from "@medusajs/types"
import {
  MockEventBusService,
  moduleIntegrationTestRunner,
} from "medusa-test-utils"
import { buildExpectedEventMessageShape } from "../../__fixtures__"
import { FulfillmentEvents, Modules } from "@medusajs/utils"

jest.setTimeout(100000)

moduleIntegrationTestRunner<IFulfillmentModuleService>({
  moduleName: Modules.FULFILLMENT,
  testSuite: ({ service }) => {
    let eventBusEmitSpy

    beforeEach(() => {
      eventBusEmitSpy = jest.spyOn(MockEventBusService.prototype, "emit")
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    describe("Fulfillment Module Service", () => {
      describe("mutations", () => {
        describe("on create", () => {
          it("should create a new shipping profile", async function () {
            const createData: CreateShippingProfileDTO = {
              name: "test-default-profile",
              type: "default",
            }

            const createdShippingProfile = await service.createShippingProfiles(
              createData
            )

            expect(createdShippingProfile).toEqual(
              expect.objectContaining({
                name: createData.name,
                type: createData.type,
              })
            )

            expect(eventBusEmitSpy.mock.calls[0][0]).toHaveLength(1)
            expect(eventBusEmitSpy).toHaveBeenCalledWith([
              buildExpectedEventMessageShape({
                eventName: FulfillmentEvents.shipping_profile_created,
                action: "created",
                object: "shipping_profile",
                data: { id: createdShippingProfile.id },
              }),
            ])
          })

          it("should create multiple new shipping profiles", async function () {
            const createData: CreateShippingProfileDTO[] = [
              {
                name: "test-profile-1",
                type: "default",
              },
              {
                name: "test-profile-2",
                type: "custom",
              },
            ]

            const createdShippingProfiles =
              await service.createShippingProfiles(createData)

            expect(createdShippingProfiles).toHaveLength(2)
            expect(eventBusEmitSpy.mock.calls[0][0]).toHaveLength(2)

            let i = 0
            for (const data_ of createData) {
              expect(createdShippingProfiles[i]).toEqual(
                expect.objectContaining({
                  name: data_.name,
                  type: data_.type,
                })
              )

              expect(eventBusEmitSpy).toHaveBeenCalledWith(
                expect.arrayContaining([
                  buildExpectedEventMessageShape({
                    eventName: FulfillmentEvents.shipping_profile_created,
                    action: "created",
                    object: "shipping_profile",
                    data: { id: createdShippingProfiles[i].id },
                  }),
                ])
              )

              ++i
            }
          })

          it("should fail on duplicated shipping profile name", async function () {
            const createData: CreateShippingProfileDTO = {
              name: "test-default-profile",
              type: "default",
            }

            await service.createShippingProfiles(createData)

            const err = await service
              .createShippingProfiles(createData)
              .catch((e) => e)

            expect(err).toBeDefined()
            expect(err.message).toContain("exists")
          })
        })
      })
    })
  },
})

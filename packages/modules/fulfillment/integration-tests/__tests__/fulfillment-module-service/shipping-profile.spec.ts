import {
  CreateShippingProfileDTO,
  IFulfillmentModuleService,
} from "@medusajs/framework/types"
import {
  MockEventBusService,
  moduleIntegrationTestRunner,
} from "@medusajs/test-utils"
import {
  buildExpectedEventMessageShape,
  generateCreateShippingOptionsData,
} from "../../__fixtures__"
import { FulfillmentEvents, Modules } from "@medusajs/framework/utils"
import { resolve } from "path"
import { FulfillmentProviderService } from "@services"
import { FulfillmentProviderServiceFixtures } from "../../__fixtures__/providers"

jest.setTimeout(100000)

const moduleOptions = {
  providers: [
    {
      resolve: resolve(
        process.cwd() +
          "/integration-tests/__fixtures__/providers/default-provider"
      ),
      id: "test-provider",
    },
  ],
}

const providerId = FulfillmentProviderService.getRegistrationIdentifier(
  FulfillmentProviderServiceFixtures,
  "test-provider"
)

moduleIntegrationTestRunner<IFulfillmentModuleService>({
  moduleName: Modules.FULFILLMENT,
  moduleOptions,
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
            expect(eventBusEmitSpy).toHaveBeenCalledWith(
              [
                buildExpectedEventMessageShape({
                  eventName: FulfillmentEvents.SHIPPING_PROFILE_CREATED,
                  action: "created",
                  object: "shipping_profile",
                  data: { id: createdShippingProfile.id },
                }),
              ],
              {
                internal: true,
              }
            )
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
                    eventName: FulfillmentEvents.SHIPPING_PROFILE_CREATED,
                    action: "created",
                    object: "shipping_profile",
                    data: { id: createdShippingProfiles[i].id },
                  }),
                ]),
                {
                  internal: true,
                }
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

        describe("on delete", () => {
          it("should delete a shipping profile", async function () {
            const createData: CreateShippingProfileDTO = {
              name: "test-default-profile",
              type: "default",
            }

            const createdShippingProfile = await service.createShippingProfiles(
              createData
            )

            await service.deleteShippingProfiles(createdShippingProfile.id)

            const [shippingProfile] = await service.listShippingProfiles({
              id: createdShippingProfile.id,
            })

            expect(shippingProfile).toBeUndefined()
          })

          it("should not allow to delete a shipping profile that is associated to any shipping options", async function () {
            const createData: CreateShippingProfileDTO = {
              name: "test-default-profile",
              type: "default",
            }

            const createdShippingProfile = await service.createShippingProfiles(
              createData
            )

            const fulfillmentSet = await service.createFulfillmentSets({
              name: "test",
              type: "test-type",
              service_zones: [
                {
                  name: "test",
                },
              ],
            })

            await service.createShippingOptions([
              generateCreateShippingOptionsData({
                service_zone_id: fulfillmentSet.service_zones[0].id,
                shipping_profile_id: createdShippingProfile.id,
                provider_id: providerId,
                rules: [
                  {
                    attribute: "test-attribute",
                    operator: "in",
                    value: ["test"],
                  },
                ],
              }),
            ])

            const err = await service
              .deleteShippingProfiles(createdShippingProfile.id)
              .catch((e) => e)

            expect(err).toBeTruthy()
            expect(err.message).toContain(
              `Cannot delete Shipping Profiles ${createdShippingProfile.id} with associated Shipping Options. Delete Shipping Options first and try again.`
            )
          })
        })
      })
    })
  },
})

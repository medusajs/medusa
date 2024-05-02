import { Modules } from "@medusajs/modules-sdk"
import {
  CreateShippingProfileDTO,
  IFulfillmentModuleService,
} from "@medusajs/types"
import { moduleIntegrationTestRunner, SuiteOptions } from "medusa-test-utils"

jest.setTimeout(100000)

moduleIntegrationTestRunner({
  moduleName: Modules.FULFILLMENT,
  testSuite: ({ service }: SuiteOptions<IFulfillmentModuleService>) => {
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

            let i = 0
            for (const data_ of createData) {
              expect(createdShippingProfiles[i]).toEqual(
                expect.objectContaining({
                  name: data_.name,
                  type: data_.type,
                })
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

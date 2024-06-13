import { ModuleRegistrationName, Modules } from "@medusajs/modules-sdk"
import { IPaymentModuleService, IRegionModuleService } from "@medusajs/types"
import { medusaIntegrationTestRunner } from "medusa-test-utils"
import { ContainerRegistrationKeys } from "@medusajs/utils"

jest.setTimeout(50000)

const env = { MEDUSA_FF_MEDUSA_V2: true }

medusaIntegrationTestRunner({
  env,
  testSuite: ({ dbConnection, getContainer, api }) => {
    describe("Region and Payment Providers", () => {
      let appContainer
      let regionModule: IRegionModuleService
      let paymentModule: IPaymentModuleService
      let remoteQuery
      let remoteLink

      beforeAll(async () => {
        appContainer = getContainer()
        regionModule = appContainer.resolve(ModuleRegistrationName.REGION)
        paymentModule = appContainer.resolve(ModuleRegistrationName.PAYMENT)
        remoteQuery = appContainer.resolve(
          ContainerRegistrationKeys.REMOTE_QUERY
        )
        remoteLink = appContainer.resolve(ContainerRegistrationKeys.REMOTE_LINK)
      })

      it("should query region and payment provider link with remote query", async () => {
        const region = await regionModule.createRegions({
          name: "North America",
          currency_code: "usd",
        })

        await remoteLink.create([
          {
            [Modules.REGION]: {
              region_id: region.id,
            },
            [Modules.PAYMENT]: {
              payment_provider_id: "pp_system_default",
            },
          },
        ])

        const links = await remoteQuery({
          region: {
            fields: ["id"],
            payment_providers: {
              fields: ["id"],
            },
          },
        })

        const otherLink = await remoteQuery({
          payment_providers: {
            fields: ["id"],
            regions: {
              fields: ["id"],
            },
          },
        })

        expect(links).toHaveLength(1)
        expect(links).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: region.id,
              payment_providers: expect.arrayContaining([
                expect.objectContaining({
                  id: "pp_system_default",
                }),
              ]),
            }),
          ])
        )

        expect(otherLink).toHaveLength(2)
        expect(otherLink).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: "pp_system_default",
              regions: expect.arrayContaining([
                expect.objectContaining({
                  id: region.id,
                }),
              ]),
            }),
            expect.objectContaining({
              id: "pp_system_default_2",
              regions: [],
            }),
          ])
        )
      })
    })
  },
})

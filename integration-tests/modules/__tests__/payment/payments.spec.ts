import { ModuleRegistrationName, Modules } from "@medusajs/modules-sdk"
import { IRegionModuleService } from "@medusajs/types"
import { medusaIntegrationTestRunner } from "medusa-test-utils/dist"

jest.setTimeout(50000)

const env = { MEDUSA_FF_MEDUSA_V2: true }

medusaIntegrationTestRunner({
  env,
  testSuite: ({ dbConnection, getContainer, api }) => {
    describe("Payments", () => {
      let appContainer
      let regionService: IRegionModuleService
      let remoteLink

      beforeAll(async () => {
        appContainer = getContainer()
        regionService = appContainer.resolve(ModuleRegistrationName.REGION)
        remoteLink = appContainer.resolve("remoteLink")
      })

      it("should list payment providers", async () => {
        const region = await regionService.create({
          name: "Test Region",
          currency_code: "usd",
        })

        let response = await api.get(
          `/store/regions/${region.id}/payment-providers`
        )

        expect(response.status).toEqual(200)
        expect(response.data.payment_providers).toEqual([])

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

        response = await api.get(
          `/store/regions/${region.id}/payment-providers`
        )

        expect(response.status).toEqual(200)
        expect(response.data.payment_providers).toEqual([
          expect.objectContaining({
            id: "pp_system_default",
          }),
        ])
      })
    })
  },
})

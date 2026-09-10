import { ContainerRegistrationKeys, Modules } from "@medusajs/utils"
import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import {
  adminHeaders,
  createAdminUser,
  generatePublishableKey,
  generateStoreHeaders,
} from "../../../../helpers/create-admin-user"

jest.setTimeout(30000)

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api, dbUtils }) => {
    let region
    let container
    let storeHeaders

    beforeAll(async () => {
      container = getContainer()
      await createAdminUser(dbConnection, adminHeaders, container)
      const publishableKey = await generatePublishableKey(container)
      storeHeaders = generateStoreHeaders({ publishableKey })

      region = (
        await api.post(
          "/admin/regions",
          {
            name: "United Kingdom",
            currency_code: "gbp",
          },
          adminHeaders
        )
      ).data.region

      await dbUtils.snapshot()
    })

    describe("GET /store/regions/:id", () => {
      it("should list payment providers", async () => {
        const remoteLink = container.resolve(
          ContainerRegistrationKeys.REMOTE_LINK
        )

        let response = await api.get(
          `/store/regions/${region.id}?fields=*payment_providers`,
          storeHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.region.payment_providers).toEqual([])

        await remoteLink.create([
          {
            [Modules.REGION]: { region_id: region.id },
            [Modules.PAYMENT]: { payment_provider_id: "pp_system_default" },
          },
        ])

        response = await api.get(
          `/store/regions/${region.id}?fields=*payment_providers`,
          storeHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.region.payment_providers).toEqual([
          expect.objectContaining({
            id: "pp_system_default",
          }),
        ])
      })
    })
  },
})

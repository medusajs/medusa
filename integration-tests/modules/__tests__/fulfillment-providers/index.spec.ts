import { medusaIntegrationTestRunner } from "@zjedene-medusa/test-utils"
import { IFulfillmentModuleService } from "@zjedene-medusa/types"
import { Modules } from "@zjedene-medusa/utils"
import { createAdminUser } from "../../../helpers/create-admin-user"

jest.setTimeout(100000)

const env = {}
const adminHeaders = {
  headers: { "x-medusa-access-token": "test_token" },
}

medusaIntegrationTestRunner({
  env,
  testSuite: ({ getContainer, api, dbConnection }) => {
    let service: IFulfillmentModuleService
    let container

    beforeAll(() => {
      container = getContainer()
      service = container.resolve(Modules.FULFILLMENT)
    })

    beforeEach(async () => {
      await createAdminUser(dbConnection, adminHeaders, container)
    })

    describe("GET /admin/fulfillment-providers", () => {
      it("should list all fulfillment providers", async () => {
        const response = await api.get(
          `/admin/fulfillment-providers`,
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.fulfillment_providers).toEqual(
          expect.arrayContaining([
            { id: "manual_test-provider", is_enabled: true },
            {
              id: "manual-calculated_test-provider-calculated",
              is_enabled: true,
            },
          ])
        )
      })
    })
  },
})

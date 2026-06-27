import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../helpers/create-admin-user"

jest.setTimeout(50000)

const env = {}

medusaIntegrationTestRunner({
  env,
  testSuite: ({ dbConnection, getContainer, api, dbUtils }) => {
    describe("Payment Providers", () => {
      let appContainer

      beforeAll(async () => {
        appContainer = getContainer()
        await createAdminUser(dbConnection, adminHeaders, appContainer)

        await dbUtils.snapshot()
      })

      it("should list payment providers", async () => {
        let response = await api.get(
          `/admin/payments/payment-providers`,
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.payment_providers).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: "pp_system_default_2",
              is_enabled: true,
            }),
            expect.objectContaining({
              id: "pp_system_default",
              is_enabled: true,
            }),
          ])
        )

        expect(response.data.count).toEqual(2)
      })
    })
  },
})

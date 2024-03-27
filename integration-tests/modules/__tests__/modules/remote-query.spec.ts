import { ContainerRegistrationKeys } from "@medusajs/utils"
import { medusaIntegrationTestRunner } from "medusa-test-utils"
import { createAdminUser } from "../../..//helpers/create-admin-user"
import { adminHeaders } from "../../../helpers/create-admin-user"

jest.setTimeout(50000)

const env = { MEDUSA_FF_MEDUSA_V2: true }

medusaIntegrationTestRunner({
  env,
  testSuite: ({ dbConnection, getContainer, api }) => {
    describe("Remote Query", () => {
      let appContainer

      beforeAll(async () => {
        appContainer = getContainer()
      })

      beforeEach(async () => {
        await createAdminUser(dbConnection, adminHeaders, appContainer)
      })

      it("should fail to retrieve a single non-existing id", async () => {
        const created = await api.post(
          `/admin/regions`,
          {
            name: "Test Region",
            currency_code: "usd",
            countries: ["us"],
          },
          adminHeaders
        )

        const remoteQuery = appContainer.resolve(
          ContainerRegistrationKeys.REMOTE_QUERY
        )

        const getRegion = await remoteQuery({
          region: {
            fields: ["id", "currency_code"],
            __args: {
              id: created.data.region.id,
            },
          },
        })

        expect(getRegion).toEqual([
          {
            id: created.data.region.id,
            currency_code: "usd",
          },
        ])

        const getNonExistingRegion = remoteQuery({
          region: {
            fields: ["id", "currency_code"],
            __args: {
              id: "region_123",
            },
          },
        })

        expect(getNonExistingRegion).rejects.toThrow(
          "Region with id: region_123 was not found"
        )
      })
    })
  },
})

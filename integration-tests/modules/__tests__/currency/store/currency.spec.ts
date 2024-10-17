import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import {
  generatePublishableKey,
  generateStoreHeaders,
} from "../../../../helpers/create-admin-user"

jest.setTimeout(50000)

const env = { MEDUSA_FF_MEDUSA_V2: true }

medusaIntegrationTestRunner({
  env,
  testSuite: ({ api, getContainer }) => {
    describe("Currency - Store", () => {
      it("should correctly retrieve and list currencies", async () => {
        const publishableKey = await generatePublishableKey(getContainer())
        const storeHeaders = generateStoreHeaders({ publishableKey })

        const listResp = await api.get("/store/currencies", storeHeaders)

        expect(listResp.data.currencies).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              code: "aud",
            }),
            expect.objectContaining({
              code: "cad",
            }),
          ])
        )

        const retrieveResp = await api.get(
          `/store/currencies/aud`,
          storeHeaders
        )
        expect(retrieveResp.data.currency).toEqual(
          listResp.data.currencies.find((c) => c.code === "aud")
        )
      })
    })
  },
})

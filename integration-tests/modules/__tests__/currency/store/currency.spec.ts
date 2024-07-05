import { medusaIntegrationTestRunner } from "medusa-test-utils"

jest.setTimeout(50000)

const env = { MEDUSA_FF_MEDUSA_V2: true }
const storeHeaders = {
  headers: {},
}

medusaIntegrationTestRunner({
  env,
  testSuite: ({ api }) => {
    describe("Currency - Store", () => {
      it("should correctly retrieve and list currencies", async () => {
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

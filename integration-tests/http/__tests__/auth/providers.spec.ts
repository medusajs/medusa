import { medusaIntegrationTestRunner } from "@medusajs/test-utils"

jest.setTimeout(100000)

medusaIntegrationTestRunner({
  testSuite: ({ api }) => {
    describe("Auth provider discovery", () => {
      // The HTTP test env registers a single "emailpass" auth provider and does
      // not configure `authMethodsPerActor`, so every actor type is allowed to
      // use every registered provider.
      const emailpassProvider = {
        id: "emailpass",
        identifier: "emailpass",
        display_name: "Email/Password Authentication",
      }

      it("lists the auth providers for the user actor type without authentication", async () => {
        const response = await api.get("/auth/user/providers")

        expect(response.status).toEqual(200)
        expect(response.data.providers).toEqual([emailpassProvider])
      })

      it("lists the auth providers for the customer actor type", async () => {
        const response = await api.get("/auth/customer/providers")

        expect(response.status).toEqual(200)
        expect(response.data.providers).toEqual([emailpassProvider])
      })

      it("never exposes provider options or secrets", async () => {
        const response = await api.get("/auth/user/providers")

        for (const provider of response.data.providers) {
          expect(Object.keys(provider).sort()).toEqual([
            "display_name",
            "id",
            "identifier",
          ])
        }
      })
    })
  },
})

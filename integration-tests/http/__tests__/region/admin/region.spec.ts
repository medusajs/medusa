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
  testSuite: ({ dbConnection, getContainer, api }) => {
    let region1
    let region2
    let container
    let storeHeaders

    beforeEach(async () => {
      container = getContainer()
      await createAdminUser(dbConnection, adminHeaders, container)
      const publishableKey = await generatePublishableKey(container)
      storeHeaders = generateStoreHeaders({ publishableKey })

      region1 = (
        await api.post(
          "/admin/regions",
          {
            name: "United Kingdom",
            currency_code: "gbp",
          },
          adminHeaders
        )
      ).data.region

      region2 = (
        await api.post(
          "/admin/regions",
          {
            name: "United States",
            currency_code: "usd",
          },
          adminHeaders
        )
      ).data.region
    })

    // BREAKING: There is no more `tax_rate` field on the region.
    // BREAKING: There are no more fulfillment providers list on a region.
    describe("GET /admin/regions", () => {
      it("should list regions", async () => {
        const response = await api.get("/admin/regions", adminHeaders)

        expect(response.status).toEqual(200)
        expect(response.data.regions).toEqual([
          expect.objectContaining({
            name: "United Kingdom",
            id: region1.id,
            currency_code: "gbp",
            automatic_taxes: region1.automatic_taxes,
            countries: [],
          }),
          expect.objectContaining({
            name: "United States",
            id: region2.id,
            currency_code: "usd",
            automatic_taxes: region2.automatic_taxes,
            countries: [],
          }),
        ])
      })

      it("should list the regions with q and order params", async () => {
        const response = await api.get(
          "/admin/regions?q=united&order=-currency_code",
          adminHeaders
        )

        expect(response.status).toEqual(200)

        expect(response.data.regions).toEqual([
          expect.objectContaining({
            name: "United States",
            currency_code: "usd",
          }),
          expect.objectContaining({
            name: "United Kingdom",
            currency_code: "gbp",
          }),
        ])
      })
    })

    describe("GET /admin/regions/:id", () => {
      it("should retrieve the region from ID", async () => {
        const response = await api.get(
          `/admin/regions/${region1.id}`,
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.region).toEqual(
          expect.objectContaining({
            id: region1.id,
          })
        )
      })

      it("should throw an error when region ID is invalid", async () => {
        await api
          .get(`/admin/regions/invalid-region-id`, adminHeaders)
          .catch((e) => {
            expect(e.response.status).toEqual(404)
            expect(e.response.data.type).toEqual("not_found")
            expect(e.response.data.message).toEqual(
              `Region with id: invalid-region-id not found`
            )
          })
      })

      it("should list payment providers", async () => {
        const remoteLink = container.resolve(
          ContainerRegistrationKeys.REMOTE_LINK
        )

        let response = await api.get(
          `/store/regions/${region1.id}?fields=*payment_providers`,
          storeHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.region.payment_providers).toEqual([])

        await remoteLink.create([
          {
            [Modules.REGION]: { region_id: region1.id },
            [Modules.PAYMENT]: { payment_provider_id: "pp_system_default" },
          },
        ])

        response = await api.get(
          `/store/regions/${region1.id}?fields=*payment_providers`,
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

    describe("POST /admin/regions", () => {
      it("should create a region", async () => {
        const region = (
          await api.post(
            "/admin/regions",
            {
              name: "Test",
              currency_code: "usd",
            },
            adminHeaders
          )
        ).data.region

        expect(region).toEqual(
          expect.objectContaining({
            name: "Test",
            currency_code: "usd",
          })
        )
      })

      it("should create a region with tax inclusivity setting", async () => {
        const region = (
          await api.post(
            "/admin/regions",
            {
              name: "Test",
              currency_code: "usd",
              // BREAKING: The property used to be called `includes_tax`
              is_tax_inclusive: true,
            },
            adminHeaders
          )
        ).data.region

        const response = await api.get(`/admin/price-preferences`, adminHeaders)

        expect(response.data.price_preferences).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              attribute: "region_id",
              value: region.id,
              is_tax_inclusive: true,
            }),
          ])
        )
      })

      it("should fails to create when countries exists in different region", async () => {
        try {
          await api.post(
            `/admin/regions`,
            {
              name: "World",
              currency_code: "usd",
              countries: ["us"],
            },
            adminHeaders
          )
        } catch (error) {
          expect(error.response.status).toEqual(400)
          expect(error.response.data.message).toEqual(
            `Countries with codes: \"us\" are already assigned to a region`
          )
        }
      })
    })

    describe("POST /admin/regions/:id", () => {
      it("should update a region", async () => {
        const region = (
          await api.post(
            `/admin/regions/${region1.id}`,
            {
              name: "New test",
              currency_code: "eur",
            },
            adminHeaders
          )
        ).data.region

        expect(region).toEqual(
          expect.objectContaining({
            name: "New test",
            currency_code: "eur",
          })
        )
      })

      it("should update a region with tax inclusivity setting", async () => {
        const beforeResponse = await api.get(
          `/admin/price-preferences`,
          adminHeaders
        )
        expect(beforeResponse.data.price_preferences).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              attribute: "region_id",
              value: region1.id,
              is_tax_inclusive: false,
            }),
          ])
        )

        await api.post(
          `/admin/regions/${region1.id}`,
          {
            is_tax_inclusive: true,
          },
          adminHeaders
        )

        const afterResponse = await api.get(
          `/admin/price-preferences`,
          adminHeaders
        )
        expect(afterResponse.data.price_preferences).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              attribute: "region_id",
              value: region1.id,
              is_tax_inclusive: true,
            }),
          ])
        )
      })
    })
  },
})

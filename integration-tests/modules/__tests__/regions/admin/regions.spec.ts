import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IRegionModuleService } from "@medusajs/types"
import { createAdminUser } from "../../../../helpers/create-admin-user"
import { medusaIntegrationTestRunner } from "medusa-test-utils"

jest.setTimeout(50000)

const env = { MEDUSA_FF_MEDUSA_V2: true }
const adminHeaders = {
  headers: { "x-medusa-access-token": "test_token" },
}

medusaIntegrationTestRunner({
  env,
  testSuite: ({ dbConnection, getContainer, api }) => {
    describe("Regions - Admin", () => {
      let appContainer
      let service: IRegionModuleService

      beforeAll(async () => {
        appContainer = getContainer()
        service = appContainer.resolve(ModuleRegistrationName.REGION)
      })

      beforeEach(async () => {
        await createAdminUser(dbConnection, adminHeaders, appContainer)
      })

      it("should create, update, and delete a region", async () => {
        const created = await api.post(
          `/admin/regions`,
          {
            name: "Test Region",
            currency_code: "usd",
            countries: ["us", "ca"],
            metadata: { foo: "bar" },
          },
          adminHeaders
        )

        expect(created.status).toEqual(200)
        expect(created.data.region).toEqual(
          expect.objectContaining({
            id: created.data.region.id,
            name: "Test Region",
            currency_code: "usd",
            metadata: { foo: "bar" },
          })
        )
        expect(
          created.data.region.countries.map((c) => c.iso_2).sort()
        ).toEqual(["ca", "us"])

        const updated = await api.post(
          `/admin/regions/${created.data.region.id}`,
          {
            name: "United States",
            currency_code: "usd",
            countries: ["us"],
            metadata: { foo: "baz" },
          },
          adminHeaders
        )

        expect(updated.status).toEqual(200)
        expect(updated.data.region).toEqual(
          expect.objectContaining({
            id: updated.data.region.id,
            name: "United States",
            currency_code: "usd",
            metadata: { foo: "baz" },
          })
        )
        expect(updated.data.region.countries.map((c) => c.iso_2)).toEqual([
          "us",
        ])

        const deleted = await api.delete(
          `/admin/regions/${updated.data.region.id}`,
          adminHeaders
        )

        expect(deleted.status).toEqual(200)
        expect(deleted.data).toEqual({
          id: updated.data.region.id,
          object: "region",
          deleted: true,
        })

        const deletedRegion = await service.retrieveRegion(
          updated.data.region.id,
          {
            withDeleted: true,
          }
        )

        // @ts-ignore
        expect(deletedRegion.deleted_at).toBeTruthy()
      })

      it("should create the region with the available payment providers if the providers exists", async () => {
        const paymentProviderId = "pp_system_default"

        const created = await api.post(
          `/admin/regions?fields=*payment_providers`,
          {
            name: "Test Region",
            currency_code: "usd",
            countries: ["us", "ca"],
            metadata: { foo: "bar" },
            payment_providers: [paymentProviderId],
          },
          adminHeaders
        )

        expect(created.status).toEqual(200)
        expect(created.data.region).toEqual(
          expect.objectContaining({
            id: created.data.region.id,
            name: "Test Region",
            currency_code: "usd",
            metadata: { foo: "bar" },
            payment_providers: [
              expect.objectContaining({
                id: paymentProviderId,
              }),
            ],
          })
        )
      })

      it("should update the region available payment providers", async () => {
        const paymentProviderId = "pp_system_default"
        const paymentProvider2Id = "pp_system_default_2"

        const created = await api.post(
          `/admin/regions`,
          {
            name: "Test Region",
            currency_code: "usd",
            countries: ["us", "ca"],
            metadata: { foo: "bar" },
          },
          adminHeaders
        )

        /**
         * Assign a new payment provider
         */

        await api.post(
          `/admin/regions/${created.data.region.id}`,
          {
            payment_providers: [paymentProviderId],
          },
          adminHeaders
        )

        let regionResponse = await api.get(
          `/admin/regions/${created.data.region.id}?fields=*payment_providers`,
          adminHeaders
        )

        expect(regionResponse.status).toEqual(200)
        expect(regionResponse.data.region.payment_providers).toHaveLength(1)
        expect(regionResponse.data.region).toEqual(
          expect.objectContaining({
            id: regionResponse.data.region.id,
            payment_providers: [
              expect.objectContaining({
                id: paymentProviderId,
              }),
            ],
          })
        )

        /**
         * Replace the region payment providers by a new one set of providers
         */

        await api.post(
          `/admin/regions/${created.data.region.id}`,
          {
            payment_providers: [paymentProvider2Id],
          },
          adminHeaders
        )

        regionResponse = await api.get(
          `/admin/regions/${created.data.region.id}?fields=*payment_providers`,
          adminHeaders
        )

        expect(regionResponse.status).toEqual(200)
        expect(regionResponse.data.region.payment_providers).toHaveLength(1)
        expect(regionResponse.data.region).toEqual(
          expect.objectContaining({
            id: regionResponse.data.region.id,
            payment_providers: [
              expect.objectContaining({
                id: paymentProvider2Id,
              }),
            ],
          })
        )

        /**
         * Replace the region payment providers with both providers
         */

        await api.post(
          `/admin/regions/${created.data.region.id}`,
          {
            payment_providers: [paymentProviderId, paymentProvider2Id],
          },
          adminHeaders
        )

        regionResponse = await api.get(
          `/admin/regions/${created.data.region.id}?fields=*payment_providers`,
          adminHeaders
        )

        expect(regionResponse.status).toEqual(200)
        expect(regionResponse.data.region.payment_providers).toHaveLength(2)
        expect(regionResponse.data.region).toEqual(
          expect.objectContaining({
            id: regionResponse.data.region.id,
            payment_providers: [
              expect.objectContaining({
                id: paymentProvider2Id,
              }),
              expect.objectContaining({
                id: paymentProviderId,
              }),
            ],
          })
        )
      })

      it("should throw on update if the given payment providers does not exists", async () => {
        const created = await api.post(
          `/admin/regions`,
          {
            name: "Test Region",
            currency_code: "usd",
            countries: ["us", "ca"],
            metadata: { foo: "bar" },
          },
          adminHeaders
        )

        const updateErr = await api
          .post(
            `/admin/regions/${created.data.region.id}`,
            {
              payment_providers: ["test"],
            },
            adminHeaders
          )
          .catch((e) => e)

        expect(updateErr.response.status).toEqual(404)
        expect(updateErr.response.data.message).toEqual(
          "Payment providers with ids test not found or not enabled"
        )
      })

      it("should throw on missing required properties in create", async () => {
        const err = await api
          .post(`/admin/regions`, {}, adminHeaders)
          .catch((e) => e)

        expect(err.response.status).toEqual(400)
        // expect(err.response.data.message).toEqual(
        //   "name must be a string, currency_code must be a string"
        // )
      })

      it("should throw on unknown properties in create", async () => {
        const error = await api
          .post(
            `/admin/regions`,
            {
              foo: "bar",
              currency_code: "usd",
              name: "Test Region",
            },
            adminHeaders
          )
          .catch((e) => e)

        expect(error.response.status).toEqual(400)
        // expect(error.response.data.message).toEqual(
        //   "property foo should not exist"
        // )
      })

      it("should throw on unknown properties in update", async () => {
        const created = await service.createRegions({
          name: "Test Region",
          currency_code: "usd",
        })

        const error = await api
          .post(
            `/admin/regions/${created.id}`,
            {
              foo: "bar",
              currency_code: "usd",
              name: "Test Region",
            },
            adminHeaders
          )
          .catch((e) => e)

        expect(error.response.status).toEqual(400)
        // expect(error.response.data.message).toEqual(
        //   "property foo should not exist"
        // )
      })

      it("should get all regions and count", async () => {
        await service.createRegions([
          {
            name: "Test",
            currency_code: "usd",
            countries: ["jp"],
            metadata: { foo: "bar" },
          },
        ])

        const response = await api.get(`/admin/regions`, adminHeaders)

        expect(response.status).toEqual(200)
        expect(response.data.regions).toEqual([
          expect.objectContaining({
            id: expect.any(String),
            name: "Test",
            currency_code: "usd",
            metadata: { foo: "bar" },
          }),
        ])
        expect(response.data.regions[0].countries.map((c) => c.iso_2)).toEqual([
          "jp",
        ])
      })

      it("should support searching of regions", async () => {
        await service.createRegions([
          {
            name: "APAC",
            currency_code: "usd",
            countries: ["jp"],
          },
          {
            name: "Europe",
            currency_code: "eur",
            countries: ["de"],
          },
        ])

        const response = await api.get(`/admin/regions?q=eu`, adminHeaders)

        expect(response.status).toEqual(200)
        expect(response.data.regions).toEqual([
          expect.objectContaining({
            name: "Europe",
            currency_code: "eur",
          }),
        ])
      })

      it("should get a region", async () => {
        const [region] = await service.createRegions([
          {
            name: "Test",
            currency_code: "usd",
            countries: ["jp"],
            metadata: { foo: "bar" },
          },
        ])

        const response = await api.get(
          `/admin/regions/${region.id}`,
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.region).toEqual(
          expect.objectContaining({
            id: region.id,
            name: "Test",
            currency_code: "usd",
            metadata: { foo: "bar" },
          })
        )
        expect(response.data.region.countries.map((c) => c.iso_2)).toEqual([
          "jp",
        ])
      })
    })
  },
})

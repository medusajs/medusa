import { medusaIntegrationTestRunner } from "medusa-test-utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"

jest.setTimeout(30000)

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api }) => {
    beforeAll(() => {})

    beforeEach(async () => {
      const container = getContainer()
      await createAdminUser(dbConnection, adminHeaders, container)
    })

    describe("GET /admin/regions", () => {
      let region1
      let region2

      beforeEach(async () => {
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

      it("should list regions", async () => {
        const response = await api.get("/admin/regions", adminHeaders)

        expect(response.status).toEqual(200)
        expect(response.data.regions).toEqual([
          expect.objectContaining({
            name: "United Kingdom",
          }),
          expect.objectContaining({
            name: "United States",
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
      let region1
      beforeEach(async () => {
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
      })

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
    })

    describe("POST /admin/regions", () => {
      beforeEach(async () => {
        await api.post(
          "/admin/regions",
          {
            name: "United States",
            currency_code: "usd",
            countries: ["us"],
          },
          adminHeaders
        )
      })

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

    // TODO: Migrate when tax_inclusive_pricing is implemented
    // describe("[MEDUSA_FF_TAX_INCLUSIVE_PRICING] /admin/regions", () => {
    //   let medusaProcess
    //   let dbConnection

    //   beforeAll(async () => {
    //     const cwd = path.resolve(path.join(__dirname, "..", ".."))
    //     const [process, connection] = await startServerWithEnvironment({
    //       cwd,
    //       env: { MEDUSA_FF_TAX_INCLUSIVE_PRICING: true },
    //     })
    //     dbConnection = connection
    //     medusaProcess = process
    //   })

    //   afterAll(async () => {
    //     const db = useDb()
    //     await db.shutdown()

    //     medusaProcess.kill()
    //   })

    //   describe("POST /admin/regions/:id", () => {
    //     const region1TaxInclusiveId = "region-1-tax-inclusive"

    //     beforeEach(async () => {
    //       try {
    //         await adminSeeder(dbConnection)
    //         await simpleRegionFactory(dbConnection, {
    //           id: region1TaxInclusiveId,
    //           countries: ["fr"],
    //         })
    //       } catch (err) {
    //         console.log(err)
    //         throw err
    //       }
    //     })

    //     afterEach(async () => {
    //       const db = useDb()
    //       await db.teardown()
    //     })

    //     it("should allow to create a region that includes tax", async function () {
    //       const api = useApi()

    //       const payload = {
    //         name: "region-including-taxes",
    //         currency_code: "usd",
    //         tax_rate: 0,
    //         payment_providers: ["test-pay"],
    //         fulfillment_providers: ["test-ful"],
    //         countries: ["us"],
    //         includes_tax: true,
    //       }

    //       const response = await api
    //         .post(`/admin/regions`, payload, adminReqConfig)
    //         .catch((err) => {
    //           console.log(err)
    //         })

    //       expect(response.data.region).toEqual(
    //         expect.objectContaining({
    //           id: expect.any(String),
    //           includes_tax: true,
    //           name: "region-including-taxes",
    //         })
    //       )
    //     })

    //     it("should allow to update a region that includes tax", async function () {
    //       const api = useApi()
    //       let response = await api
    //         .get(`/admin/regions/${region1TaxInclusiveId}`, adminReqConfig)
    //         .catch((err) => {
    //           console.log(err)
    //         })

    //       expect(response.data.region.includes_tax).toBe(false)

    //       response = await api
    //         .post(
    //           `/admin/regions/${region1TaxInclusiveId}`,
    //           {
    //             includes_tax: true,
    //           },
    //           adminReqConfig
    //         )
    //         .catch((err) => {
    //           console.log(err)
    //         })

    //       expect(response.data.region.includes_tax).toBe(true)
    //     })
    //   })
    // })
  },
})

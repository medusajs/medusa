const path = require("path")
const { ShippingProfile } = require("@medusajs/medusa")

const setupServer = require("../../../environment-helpers/setup-server")
const startServerWithEnvironment =
  require("../../../environment-helpers/start-server-with-environment").default
const { useApi } = require("../../../environment-helpers/use-api")
const { initDb, useDb } = require("../../../environment-helpers/use-db")
const adminSeeder = require("../../../helpers/admin-seeder")
const shippingOptionSeeder = require("../../../helpers/shipping-option-seeder")
const {
  simpleShippingOptionFactory,
  simpleRegionFactory,
} = require("../../../factories")

const adminReqConfig = {
  headers: {
    "x-medusa-access-token": "test_token",
  },
}

jest.setTimeout(30000)

describe("/admin/shipping-options", () => {
  let medusaProcess
  let dbConnection

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", ".."))
    dbConnection = await initDb({ cwd })
    medusaProcess = await setupServer({ cwd })
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()
    medusaProcess.kill()
  })

  describe("POST /admin/shipping-options/:id", () => {
    beforeEach(async () => {
      await adminSeeder(dbConnection)
      await shippingOptionSeeder(dbConnection)
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("should update a shipping option with no existing requirements", async () => {
      const api = useApi()

      const payload = {
        name: "Test option",
        amount: 100,
        requirements: [
          {
            type: "min_subtotal",
            amount: 1,
          },
          {
            type: "max_subtotal",
            amount: 2,
          },
        ],
      }

      const res = await api.post(
        `/admin/shipping-options/test-out`,
        payload,
        adminReqConfig
      )

      const requirements = res.data.shipping_option.requirements

      expect(res.status).toEqual(200)
      expect(requirements.length).toEqual(2)
      expect(requirements[0]).toEqual(
        expect.objectContaining({
          type: "min_subtotal",
          shipping_option_id: "test-out",
          amount: 1,
        })
      )
      expect(requirements[1]).toEqual(
        expect.objectContaining({
          type: "max_subtotal",
          shipping_option_id: "test-out",
          amount: 2,
        })
      )
    })

    it("should update a shipping option with price_type", async () => {
      const api = useApi()

      const payload = {
        price_type: "calculated",
        requirements: [],
      }

      const res = await api
        .post(`/admin/shipping-options/test-out`, payload, adminReqConfig)
        .catch(console.log)

      expect(res.status).toEqual(200)
      expect(res.data.shipping_option).toEqual(
        expect.objectContaining({
          price_type: "calculated",
        })
      )
    })

    it("should fail to add a a requirement with an id if it does not exists", async () => {
      const api = useApi()

      const payload = {
        name: "Test option",
        amount: 100,
        requirements: [
          {
            id: "not_allowed",
            type: "min_subtotal",
            amount: 1,
          },
          {
            id: "really_not_allowed",
            type: "max_subtotal",
            amount: 2,
          },
        ],
      }

      const res = await api
        .post(`/admin/shipping-options/test-out`, payload, adminReqConfig)
        .catch((err) => {
          return err.response
        })

      expect(res.status).toEqual(400)
      expect(res.data.message).toEqual(
        "Shipping option requirement with id not_allowed does not exist"
      )
    })

    it("should successfully updates a set of existing requirements", async () => {
      const api = useApi()

      const payload = {
        requirements: [
          {
            id: "option-req",
            type: "min_subtotal",
            amount: 15,
          },
          {
            id: "option-req-2",
            type: "max_subtotal",
            amount: 20,
          },
        ],
        amount: 200,
      }

      const res = await api
        .post(
          `/admin/shipping-options/test-option-req`,
          payload,
          adminReqConfig
        )
        .catch((err) => {
          console.log(err.response.data.message)
        })

      expect(res.status).toEqual(200)
    })

    it("should successfully updates a set of existing requirements by updating one and deleting the other", async () => {
      const api = useApi()

      const payload = {
        requirements: [
          {
            id: "option-req",
            type: "min_subtotal",
            amount: 15,
          },
        ],
      }

      const res = await api
        .post(
          `/admin/shipping-options/test-option-req`,
          payload,
          adminReqConfig
        )
        .catch((err) => {
          console.log(err.response.data.message)
        })

      expect(res.status).toEqual(200)
    })

    it("should successfully updates a set of requirements because max. subtotal >= min. subtotal", async () => {
      const api = useApi()

      const payload = {
        requirements: [
          {
            id: "option-req",
            type: "min_subtotal",
            amount: 150,
          },
          {
            id: "option-req-2",
            type: "max_subtotal",
            amount: 200,
          },
        ],
      }

      const res = await api
        .post(
          `/admin/shipping-options/test-option-req`,
          payload,
          adminReqConfig
        )
        .catch((err) => {
          console.log(err.response.data.message)
        })

      expect(res.status).toEqual(200)
      expect(res.data.shipping_option.requirements[0].amount).toEqual(150)
      expect(res.data.shipping_option.requirements[1].amount).toEqual(200)
    })

    it("should fail to updates a set of requirements because max. subtotal <= min. subtotal", async () => {
      const api = useApi()

      const payload = {
        requirements: [
          {
            id: "option-req",
            type: "min_subtotal",
            amount: 1500,
          },
          {
            id: "option-req-2",
            type: "max_subtotal",
            amount: 200,
          },
        ],
      }

      const res = await api
        .post(
          `/admin/shipping-options/test-option-req`,
          payload,
          adminReqConfig
        )
        .catch((err) => {
          return err.response
        })

      expect(res.status).toEqual(400)
      expect(res.data.message).toEqual(
        "Max. subtotal must be greater than Min. subtotal"
      )
    })
  })

  describe("POST /admin/shipping-options", () => {
    let payload

    beforeEach(async () => {
      await adminSeeder(dbConnection)
      await shippingOptionSeeder(dbConnection)

      const api = useApi()
      await api.post(
        `/admin/regions/region`,
        {
          fulfillment_providers: ["test-ful"],
        },
        adminReqConfig
      )

      const manager = dbConnection.manager
      const defaultProfile = await manager.findOne(ShippingProfile, {
        where: {
          type: ShippingProfile.default,
        },
      })

      payload = {
        name: "Test option",
        amount: 100,
        price_type: "flat_rate",
        region_id: "region",
        provider_id: "test-ful",
        data: {},
        profile_id: defaultProfile.id,
      }
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("should create a shipping option with requirements", async () => {
      const api = useApi()
      payload.requirements = [
        {
          type: "max_subtotal",
          amount: 2,
        },
        {
          type: "min_subtotal",
          amount: 1,
        },
      ]

      const res = await api.post(
        `/admin/shipping-options`,
        payload,
        adminReqConfig
      )

      expect(res.status).toEqual(200)
      expect(res.data.shipping_option.requirements.length).toEqual(2)
    })

    it("should create a shipping option with no requirements", async () => {
      const api = useApi()
      const res = await api.post(
        `/admin/shipping-options`,
        payload,
        adminReqConfig
      )

      expect(res.status).toEqual(200)
      expect(res.data.shipping_option.requirements.length).toEqual(0)
    })

    it("should fail on same requirement types", async () => {
      const api = useApi()
      payload.requirements = [
        {
          type: "max_subtotal",
          amount: 2,
        },
        {
          type: "max_subtotal",
          amount: 1,
        },
      ]

      try {
        await api.post(`/admin/shipping-options`, payload, adminReqConfig)
      } catch (error) {
        expect(error.response.data.message).toEqual(
          "Only one requirement of each type is allowed"
        )
      }
    })

    it("should fail when min_subtotal > max_subtotal", async () => {
      const api = useApi()
      payload.requirements = [
        {
          type: "max_subtotal",
          amount: 2,
        },
        {
          type: "min_subtotal",
          amount: 4,
        },
      ]

      try {
        await api.post(`/admin/shipping-options`, payload, adminReqConfig)
      } catch (error) {
        expect(error.response.data.message).toEqual(
          "Max. subtotal must be greater than Min. subtotal"
        )
      }
    })
  })
  describe("GET /admin/shipping-options", () => {
    beforeEach(async () => {
      await adminSeeder(dbConnection)
      await shippingOptionSeeder(dbConnection)
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("should list shipping options", async () => {
      const api = useApi()
      const res = await api.get(`/admin/shipping-options`, adminReqConfig)

      expect(res.status).toEqual(200)
    })

    it("should list admin only shipping options", async () => {
      const api = useApi()
      const res = await api.get(
        `/admin/shipping-options?admin_only=true`,
        adminReqConfig
      )

      expect(res.status).toEqual(200)
      expect(res.data.shipping_options).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: "test-option-req-admin-only",
            admin_only: true,
          }),
        ])
      )
    })

    it("should list return shipping options", async () => {
      const api = useApi()
      const res = await api.get(
        `/admin/shipping-options?is_return=true`,
        adminReqConfig
      )

      expect(res.status).toEqual(200)
      expect(res.data.shipping_options).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: "test-option-req-return",
            is_return: true,
          }),
        ])
      )
    })

    it("should list shipping options without return and admin options", async () => {
      const api = useApi()
      const res = await api.get(
        `/admin/shipping-options?is_return=false&admin_only=true`,
        adminReqConfig
      )

      expect(res.status).toEqual(200)
      expect(res.data.shipping_options).not.toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: "test-option-req-return",
            is_return: true,
          }),
          expect.objectContaining({
            id: "test-option-req-admin-only",
            admin_only: true,
          }),
        ])
      )
    })
  })
})

describe("[MEDUSA_FF_TAX_INCLUSIVE_PRICING] /admin/shipping-options", () => {
  let medusaProcess
  let dbConnection

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", ".."))
    const [process, connection] = await startServerWithEnvironment({
      cwd,
      env: { MEDUSA_FF_TAX_INCLUSIVE_PRICING: true },
    })
    dbConnection = connection
    medusaProcess = process
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()

    medusaProcess.kill()
  })

  describe("POST /admin/shipping-options", () => {
    const shippingOptionIncludesTaxId = "shipping-option-1-includes-tax"
    let region

    beforeEach(async () => {
      try {
        await adminSeeder(dbConnection)
        region = await simpleRegionFactory(dbConnection, {
          id: "region",
          countries: ["fr"],
        })
        await simpleShippingOptionFactory(dbConnection, {
          id: shippingOptionIncludesTaxId,
          region_id: region.id,
        })
      } catch (err) {
        console.log(err)
        throw err
      }
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("should creates a shipping option that includes tax", async () => {
      const api = useApi()

      const defaultProfile = await dbConnection.manager.findOne(
        ShippingProfile,
        {
          where: {
            type: ShippingProfile.default,
          },
        }
      )

      const payload = {
        name: "Test option",
        amount: 100,
        price_type: "flat_rate",
        region_id: region.id,
        provider_id: "test-ful",
        data: {},
        profile_id: defaultProfile.id,
        includes_tax: true,
      }

      const response = await api
        .post("/admin/shipping-options", payload, adminReqConfig)
        .catch((err) => {
          console.log(err)
        })

      expect(response.status).toEqual(200)
      expect(response.data.shipping_option).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          includes_tax: true,
        })
      )
    })

    it("should update a shipping option that include_tax", async () => {
      const api = useApi()

      let response = await api
        .get(
          `/admin/shipping-options/${shippingOptionIncludesTaxId}`,
          adminReqConfig
        )
        .catch((err) => {
          console.log(err)
        })

      expect(response.data.shipping_option.includes_tax).toBe(false)

      const payload = {
        requirements: [
          {
            type: "min_subtotal",
            amount: 1,
          },
          {
            type: "max_subtotal",
            amount: 2,
          },
        ],
        includes_tax: true,
      }

      response = await api
        .post(
          `/admin/shipping-options/${shippingOptionIncludesTaxId}`,
          payload,
          adminReqConfig
        )
        .catch((err) => {
          console.log(err)
        })

      expect(response.data.shipping_option.includes_tax).toBe(true)
    })
  })
})

const path = require("path")
const {
  Region,
  ShippingProfile,
  ShippingOption,
  ShippingOptionRequirement,
} = require("@medusajs/medusa")

const setupServer = require("../../../helpers/setup-server")
const { useApi } = require("../../../helpers/use-api")
const { initDb, useDb } = require("../../../helpers/use-db")
const adminSeeder = require("../../helpers/admin-seeder")
const shippingOptionSeeder = require("../../helpers/shipping-option-seeder")

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

    it("updates a shipping option with no existing requirements", async () => {
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

      const res = await api.post(`/admin/shipping-options/test-out`, payload, {
        headers: {
          Authorization: "Bearer test_token",
        },
      })

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

    it("fails as it is not allowed to set id from client side", async () => {
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
        .post(`/admin/shipping-options/test-out`, payload, {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          return err.response
        })

      expect(res.status).toEqual(400)
      expect(res.data.message).toEqual("ID does not exist")
    })

    it("it successfully updates a set of existing requirements", async () => {
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
        .post(`/admin/shipping-options/test-option-req`, payload, {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err.response.data.message)
        })

      expect(res.status).toEqual(200)
    })

    it("it successfully updates a set of existing requirements by updating one and deleting the other", async () => {
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
        .post(`/admin/shipping-options/test-option-req`, payload, {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err.response.data.message)
        })

      expect(res.status).toEqual(200)
    })

    it("successfully updates a set of requirements because max. subtotal >= min. subtotal", async () => {
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
        .post(`/admin/shipping-options/test-option-req`, payload, {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err.response.data.message)
        })

      expect(res.status).toEqual(200)
      expect(res.data.shipping_option.requirements[0].amount).toEqual(150)
      expect(res.data.shipping_option.requirements[1].amount).toEqual(200)
    })

    it("fails to updates a set of requirements because max. subtotal <= min. subtotal", async () => {
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
        .post(`/admin/shipping-options/test-option-req`, payload, {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
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
        {
          headers: {
            Authorization: "Bearer test_token",
          },
        }
      )

      const manager = dbConnection.manager
      const defaultProfile = await manager.findOne(ShippingProfile, {
        type: "default",
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

    it("creates a shipping option with requirements", async () => {
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

      const res = await api.post(`/admin/shipping-options`, payload, {
        headers: {
          Authorization: "Bearer test_token",
        },
      })

      expect(res.status).toEqual(200)
      expect(res.data.shipping_option.requirements.length).toEqual(2)
    })

    it("creates a shipping option with no requirements", async () => {
      const api = useApi()
      const res = await api.post(`/admin/shipping-options`, payload, {
        headers: {
          Authorization: "Bearer test_token",
        },
      })

      expect(res.status).toEqual(200)
      expect(res.data.shipping_option.requirements.length).toEqual(0)
    })

    it("fails on same requirement types", async () => {
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
        await api.post(`/admin/shipping-options`, payload, {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
      } catch (error) {
        expect(error.response.data.message).toEqual(
          "Only one requirement of each type is allowed"
        )
      }
    })

    it("fails when min_subtotal > max_subtotal", async () => {
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
        await api.post(`/admin/shipping-options`, payload, {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
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

    it("lists shipping options", async () => {
      const api = useApi()
      const res = await api.get(`/admin/shipping-options`, {
        headers: {
          Authorization: "Bearer test_token",
        },
      })

      expect(res.status).toEqual(200)
    })

    it("lists admin only shipping options", async () => {
      const api = useApi()
      const res = await api.get(`/admin/shipping-options?admin_only=true`, {
        headers: {
          Authorization: "Bearer test_token",
        },
      })

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

    it("lists return shipping options", async () => {
      const api = useApi()
      const res = await api.get(`/admin/shipping-options?is_return=true`, {
        headers: {
          Authorization: "Bearer test_token",
        },
      })

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

    it("lists shipping options without return and admin options", async () => {
      const api = useApi()
      const res = await api.get(
        `/admin/shipping-options?is_return=false&admin_only=true`,
        {
          headers: {
            Authorization: "Bearer test_token",
          },
        }
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

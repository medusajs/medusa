const path = require("path")

const setupServer = require("../../../helpers/setup-server")
const { useApi } = require("../../../helpers/use-api")
const { initDb, useDb } = require("../../../helpers/use-db")
const {
  simpleProductFactory,
  simpleShippingOptionFactory,
  simpleShippingProfileFactory,
} = require("../../factories")
const adminSeeder = require("../../helpers/admin-seeder")

const adminReqConfig = {
  headers: {
    Authorization: "Bearer test_token",
  },
}

jest.setTimeout(30000)

describe("/admin/shipping-profiles", () => {
  let medusaProcess
  let dbConnection

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", ".."))
    dbConnection = await initDb({ cwd })
    medusaProcess = await setupServer({ cwd, verbose: false })
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()

    medusaProcess.kill()
  })

  describe("GET /admin/shipping-profiles", () => {
    beforeEach(async () => {
      await adminSeeder(dbConnection)
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("lists shipping profiles", async () => {
      const api = useApi()

      const {
        data: { shipping_profiles },
        status,
      } = await api.get("/admin/shipping-profiles", adminReqConfig)

      expect(status).toEqual(200)

      // Should contain default and gift_card profiles
      expect(shipping_profiles.length).toEqual(2)
    })

    it("gets a shipping profile by id", async () => {
      const api = useApi()

      const profile = await simpleShippingProfileFactory(dbConnection)

      const {
        data: { shipping_profile },
        status,
      } = await api.get(
        `/admin/shipping-profiles/${profile.id}`,
        adminReqConfig
      )

      expect(status).toEqual(200)
      expect(shipping_profile).toEqual(
        expect.objectContaining({
          ...profile,
          updated_at: expect.any(String),
          created_at: expect.any(String),
        })
      )
    })
  })

  describe("POST /admin/shipping-profiles", () => {
    beforeEach(async () => {
      await adminSeeder(dbConnection)
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("creates a custom shipping profile", async () => {
      const api = useApi()

      const payload = {
        name: "test-profile-2023",
        type: "custom",
      }

      const {
        data: { shipping_profile },
        status,
      } = await api.post("/admin/shipping-profiles", payload, adminReqConfig)

      expect(status).toEqual(200)
      expect(shipping_profile).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          created_at: expect.any(String),
          updated_at: expect.any(String),
          deleted_at: null,
          ...payload,
        })
      )
    })

    it("creates a default shipping profile", async () => {
      const api = useApi()

      const payload = {
        name: "test-profile-2023",
        type: "default",
      }

      const {
        data: { shipping_profile },
        status,
      } = await api.post("/admin/shipping-profiles", payload, adminReqConfig)

      expect(status).toEqual(200)
      expect(shipping_profile).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          created_at: expect.any(String),
          updated_at: expect.any(String),
          deleted_at: null,
          ...payload,
        })
      )
    })

    it("creates a gift_card shipping profile", async () => {
      const api = useApi()

      const payload = {
        name: "test-profile-2023",
        type: "gift_card",
      }

      const {
        data: { shipping_profile },
        status,
      } = await api.post("/admin/shipping-profiles", payload, adminReqConfig)

      expect(status).toEqual(200)
      expect(shipping_profile).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          created_at: expect.any(String),
          updated_at: expect.any(String),
          deleted_at: null,
          ...payload,
        })
      )
    })

    it("creates a shipping profile with metadata", async () => {
      const api = useApi()

      const payload = {
        name: "test-profile-2023",
        type: "default",
        metadata: {
          custom_key: "custom_value",
        },
      }

      const {
        data: { shipping_profile },
        status,
      } = await api.post("/admin/shipping-profiles", payload, adminReqConfig)

      expect(status).toEqual(200)
      expect(shipping_profile).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          created_at: expect.any(String),
          updated_at: expect.any(String),
          deleted_at: null,
          ...payload,
        })
      )
    })

    it("fails to create a shipping profile with invalid type", async () => {
      const api = useApi()
      expect.assertions(2)

      const payload = {
        name: "test-profile-2023",
        type: "invalid",
      }

      await api
        .post("/admin/shipping-profiles", payload, adminReqConfig)
        .catch((err) => {
          expect(err.response.status).toEqual(400)
          expect(err.response.data.message).toEqual(
            "type must be one of 'default', 'custom', 'gift_card'"
          )
        })
    })

    it("updates a shipping profile", async () => {
      const api = useApi()

      const testProducts = await Promise.all(
        [...Array(5).keys()].map(async () => {
          return await simpleProductFactory(dbConnection)
        })
      )

      const testShippingOptions = await Promise.all(
        [...Array(5).keys()].map(async () => {
          return await simpleShippingOptionFactory(dbConnection)
        })
      )

      const payload = {
        name: "test-profile-2023",
        type: "custom",
        metadata: {
          my_key: "my_value",
        },
      }

      const {
        data: { shipping_profile: created },
      } = await api.post("/admin/shipping-profiles", payload, adminReqConfig)

      const updatePayload = {
        name: "test-profile-2023-updated",
        products: testProducts.map((p) => p.id),
        shipping_options: testShippingOptions.map((o) => o.id),
        metadata: {
          my_key: "",
          my_new_key: "my_new_value",
        },
      }

      const {
        data: { shipping_profile },
        status,
      } = await api.post(
        `/admin/shipping-profiles/${created.id}`,
        updatePayload,
        adminReqConfig
      )

      expect(status).toEqual(200)
      expect(shipping_profile).toEqual(
        expect.objectContaining({
          name: "test-profile-2023-updated",
          created_at: expect.any(String),
          updated_at: expect.any(String),
          metadata: {
            my_new_key: "my_new_value",
          },
          deleted_at: null,
          type: "custom",
        })
      )

      const {
        data: { products },
      } = await api.get(`/admin/products`, adminReqConfig)

      expect(products.length).toEqual(5)
      expect(products).toEqual(
        expect.arrayContaining(
          testProducts.map((p) => {
            return expect.objectContaining({
              id: p.id,
              profile_id: shipping_profile.id,
            })
          })
        )
      )

      const {
        data: { shipping_options },
      } = await api.get(`/admin/shipping-options`, adminReqConfig)

      const numberOfShippingOptionsWithProfile = shipping_options.filter(
        (so) => so.profile_id === shipping_profile.id
      ).length

      expect(numberOfShippingOptionsWithProfile).toEqual(5)
      expect(shipping_options).toEqual(
        expect.arrayContaining(
          testShippingOptions.map((o) => {
            return expect.objectContaining({
              id: o.id,
              profile_id: shipping_profile.id,
            })
          })
        )
      )
    })
  })

  describe("DELETE /admin/shipping-profiles", () => {
    beforeEach(async () => {
      await adminSeeder(dbConnection)
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("deletes a shipping profile", async () => {
      expect.assertions(2)

      const api = useApi()

      const profile = await simpleShippingProfileFactory(dbConnection)

      const { status } = await api.delete(
        `/admin/shipping-profiles/${profile.id}`,
        adminReqConfig
      )

      expect(status).toEqual(200)
      await api
        .get(`/admin/shipping-profiles/${profile.id}`, adminReqConfig)
        .catch((err) => {
          expect(err.response.status).toEqual(404)
        })
    })
  })
})

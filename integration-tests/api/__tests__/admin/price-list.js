const path = require("path")

const setupServer = require("../../../helpers/setup-server")
const { useApi } = require("../../../helpers/use-api")
const { useDb, initDb } = require("../../../helpers/use-db")

const adminSeeder = require("../../helpers/admin-seeder")
const customerSeeder = require("../../helpers/customer-seeder")
const priceListSeeder = require("../../helpers/price-list-seeder")
const productSeeder = require("../../helpers/product-seeder")

jest.setTimeout(30000)

describe("/admin/price-lists", () => {
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

  describe("POST /admin/price-list", () => {
    beforeEach(async () => {
      try {
        await adminSeeder(dbConnection)
        await customerSeeder(dbConnection)
        await productSeeder(dbConnection)
      } catch (err) {
        console.log(err)
        throw err
      }
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("creates a price list", async () => {
      const api = useApi()

      const payload = {
        name: "VIP Summer sale",
        description: "Summer sale for VIP customers. 25% off selected items.",
        type: "sale",
        status: "active",
        starts_at: "2022-07-01T00:00:00.000Z",
        ends_at: "2022-07-31T00:00:00.000Z",
        customer_groups: [
          {
            id: "customer-group-1",
          },
        ],
        prices: [
          {
            amount: 85,
            currency_code: "usd",
            variant_id: "test-variant",
          },
        ],
      }

      const response = await api
        .post("/admin/price-lists", payload, {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.warn(err.response.data)
        })

      expect(response.status).toEqual(200)
      expect(response.data.price_list).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: "VIP Summer sale",
          description: "Summer sale for VIP customers. 25% off selected items.",
          type: "sale",
          status: "active",
          starts_at: "2022-07-01T00:00:00.000Z",
          ends_at: "2022-07-31T00:00:00.000Z",
          customer_groups: [
            expect.objectContaining({
              id: "customer-group-1",
            }),
          ],
          prices: [
            expect.objectContaining({
              id: expect.any(String),
              amount: 85,
              currency_code: "usd",
              variant_id: "test-variant",
            }),
          ],
        })
      )
    })
  })

  describe("GET /admin/price-lists", () => {
    beforeEach(async () => {
      try {
        await adminSeeder(dbConnection)
        await productSeeder(dbConnection)
        await priceListSeeder(dbConnection)
      } catch (err) {
        console.log(err)
        throw err
      }
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("returns a price list by :id", async () => {
      const api = useApi()

      const response = await api
        .get("/admin/price-lists/pl_no_customer_groups", {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.warn(err.response.data)
        })

      expect(response.status).toEqual(200)
      expect(response.data.price_list).toMatchSnapshot({
        id: expect.any(String),
        name: "VIP winter sale",
        description: "Winter sale for VIP customers. 25% off selected items.",
        type: "sale",
        status: "active",
        starts_at: "2022-07-01T00:00:00.000Z",
        ends_at: "2022-07-31T00:00:00.000Z",
        prices: [
          {
            id: expect.any(String),
            amount: 100,
            currency_code: "usd",
            min_quantity: 1,
            max_quantity: 100,
            variant_id: "test-variant",
            price_list_id: "pl_no_customer_groups",
            created_at: expect.any(String),
            updated_at: expect.any(String),
          },
          {
            id: expect.any(String),
            amount: 80,
            currency_code: "usd",
            min_quantity: 101,
            max_quantity: 500,
            variant_id: "test-variant",
            price_list_id: "pl_no_customer_groups",
            created_at: expect.any(String),
            updated_at: expect.any(String),
          },
          {
            id: expect.any(String),
            amount: 50,
            currency_code: "usd",
            min_quantity: 501,
            max_quantity: 1000,
            variant_id: "test-variant",
            price_list_id: "pl_no_customer_groups",
            created_at: expect.any(String),
            updated_at: expect.any(String),
          },
        ],
        created_at: expect.any(String),
        updated_at: expect.any(String),
      })
    })

    it("returns a list of price lists", async () => {
      const api = useApi()

      const response = await api
        .get("/admin/price-lists", {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.warn(err.response.data)
        })

      expect(response.status).toEqual(200)
      expect(response.data.price_lists).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: "pl_no_customer_groups",
          }),
        ])
      )
    })
  })

  describe("POST /admin/price-lists/:id", () => {
    beforeEach(async () => {
      try {
        await adminSeeder(dbConnection)
        await customerSeeder(dbConnection)
        await productSeeder(dbConnection)
        await priceListSeeder(dbConnection)
      } catch (err) {
        console.log(err)
        throw err
      }
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("updates a price list", async () => {
      const api = useApi()

      const payload = {
        name: "Loyalty Reward - Winter Sale",
        description: "Winter sale for our most loyal customers",
        type: "sale",
        status: "draft",
        starts_at: "2022-09-01T00:00:00.000Z",
        ends_at: "2022-12-31T00:00:00.000Z",
        customer_groups: [
          {
            id: "customer-group-1",
          },
        ],
        prices: [
          {
            amount: 85,
            currency_code: "usd",
            variant_id: "test-variant_1",
          },
          {
            amount: 10,
            currency_code: "usd",
            variant_id: "test-variant",
          },
        ],
      }

      const response = await api
        .post("/admin/price-lists/pl_no_customer_groups", payload, {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.warn(err.response.data)
        })

      expect(response.status).toEqual(200)
      expect(response.data.price_list).toMatchSnapshot({
        id: "pl_no_customer_groups",
        name: "Loyalty Reward - Winter Sale",
        description: "Winter sale for our most loyal customers",
        type: "sale",
        status: "draft",
        starts_at: "2022-09-01T00:00:00.000Z",
        ends_at: "2022-12-31T00:00:00.000Z",
        prices: [
          {
            id: expect.any(String),
            amount: 100,
            currency_code: "usd",
            min_quantity: 1,
            max_quantity: 100,
            variant_id: "test-variant",
            price_list_id: "pl_no_customer_groups",
            region_id: null,
            created_at: expect.any(String),
            updated_at: expect.any(String),
          },
          {
            id: expect.any(String),
            amount: 80,
            currency_code: "usd",
            min_quantity: 101,
            max_quantity: 500,
            variant_id: "test-variant",
            price_list_id: "pl_no_customer_groups",
            region_id: null,
            created_at: expect.any(String),
            updated_at: expect.any(String),
          },
          {
            id: expect.any(String),
            amount: 50,
            currency_code: "usd",
            min_quantity: 501,
            max_quantity: 1000,
            variant_id: "test-variant",
            price_list_id: "pl_no_customer_groups",
            region_id: null,
            created_at: expect.any(String),
            updated_at: expect.any(String),
          },
          {
            id: expect.any(String),
            amount: 85,
            currency_code: "usd",
            variant_id: "test-variant_1",
            price_list_id: "pl_no_customer_groups",
            min_quantity: null,
            max_quantity: null,
            region_id: null,
            created_at: expect.any(String),
            updated_at: expect.any(String),
            deleted_at: null,
          },
          {
            id: expect.any(String),
            amount: 10,
            currency_code: "usd",
            variant_id: "test-variant",
            price_list_id: "pl_no_customer_groups",
            min_quantity: null,
            max_quantity: null,
            region_id: null,
            created_at: expect.any(String),
            updated_at: expect.any(String),
            deleted_at: null,
          },
        ],
        customer_groups: [
          {
            id: "customer-group-1",
            created_at: expect.any(String),
            updated_at: expect.any(String),
          },
        ],
        created_at: expect.any(String),
        updated_at: expect.any(String),
      })
    })

    it("updates the amount and currency of a price in the price list", async () => {
      const api = useApi()

      const payload = {
        prices: [
          {
            id: "ma_test_1",
            amount: 250,
            currency_code: "eur",
            variant_id: "test-variant",
          },
        ],
      }

      const response = await api
        .post("/admin/price-lists/pl_no_customer_groups", payload, {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.warn(err.response.data)
        })

      expect(response.status).toEqual(200)

      const updatedPrice = response.data.price_list.prices.find(
        (p) => p.id === "ma_test_1"
      )

      expect(updatedPrice).toMatchSnapshot({
        id: "ma_test_1",
        amount: 250,
        currency_code: "eur",
        min_quantity: 1,
        max_quantity: 100,
        variant_id: "test-variant",
        price_list_id: "pl_no_customer_groups",
        region_id: null,
        created_at: expect.any(String),
        updated_at: expect.any(String),
      })
    })
  })

  describe("POST /admin/price-lists/:id/prices/batch", () => {
    beforeEach(async () => {
      try {
        await adminSeeder(dbConnection)
        await productSeeder(dbConnection)
        await priceListSeeder(dbConnection)
      } catch (err) {
        console.log(err)
        throw err
      }
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("Adds a batch of new prices to a price list without overriding existing prices", async () => {
      const api = useApi()

      const payload = {
        prices: [
          {
            amount: 45,
            currency_code: "usd",
            variant_id: "test-variant",
            min_quantity: 1001,
            max_quantity: 2000,
          },
          {
            amount: 35,
            currency_code: "usd",
            variant_id: "test-variant",
            min_quantity: 2001,
            max_quantity: 3000,
          },
          {
            amount: 25,
            currency_code: "usd",
            variant_id: "test-variant",
            min_quantity: 3001,
            max_quantity: 4000,
          },
        ],
      }

      const response = await api
        .post(
          "/admin/price-lists/pl_no_customer_groups/prices/batch",
          payload,
          {
            headers: {
              Authorization: "Bearer test_token",
            },
          }
        )
        .catch((err) => {
          console.warn(err.response.data)
        })

      expect(response.status).toEqual(200)
      expect(response.data.price_list.prices.length).toEqual(6)
      expect(response.data.price_list.prices).toMatchSnapshot([
        {
          id: expect.any(String),
          price_list_id: "pl_no_customer_groups",
          amount: 100,
          currency_code: "usd",
          min_quantity: 1,
          max_quantity: 100,
          variant_id: "test-variant",
          created_at: expect.any(String),
          updated_at: expect.any(String),
        },
        {
          id: expect.any(String),
          price_list_id: "pl_no_customer_groups",
          amount: 80,
          currency_code: "usd",
          min_quantity: 101,
          max_quantity: 500,
          variant_id: "test-variant",
          created_at: expect.any(String),
          updated_at: expect.any(String),
        },
        {
          id: expect.any(String),
          price_list_id: "pl_no_customer_groups",
          amount: 50,
          currency_code: "usd",
          min_quantity: 501,
          max_quantity: 1000,
          variant_id: "test-variant",
          created_at: expect.any(String),
          updated_at: expect.any(String),
        },
        {
          id: expect.any(String),
          price_list_id: "pl_no_customer_groups",
          amount: 45,
          currency_code: "usd",
          variant_id: "test-variant",
          min_quantity: 1001,
          max_quantity: 2000,
          created_at: expect.any(String),
          updated_at: expect.any(String),
        },
        {
          id: expect.any(String),
          price_list_id: "pl_no_customer_groups",
          amount: 35,
          currency_code: "usd",
          variant_id: "test-variant",
          min_quantity: 2001,
          max_quantity: 3000,
          created_at: expect.any(String),
          updated_at: expect.any(String),
        },
        {
          id: expect.any(String),
          price_list_id: "pl_no_customer_groups",
          amount: 25,
          currency_code: "usd",
          variant_id: "test-variant",
          min_quantity: 3001,
          max_quantity: 4000,
          created_at: expect.any(String),
          updated_at: expect.any(String),
        },
      ])
    })

    it("Adds a batch of new prices to a price list overriding existing prices", async () => {
      const api = useApi()

      const payload = {
        prices: [
          {
            amount: 45,
            currency_code: "usd",
            variant_id: "test-variant",
            min_quantity: 1001,
            max_quantity: 2000,
          },
          {
            amount: 35,
            currency_code: "usd",
            variant_id: "test-variant",
            min_quantity: 2001,
            max_quantity: 3000,
          },
          {
            amount: 25,
            currency_code: "usd",
            variant_id: "test-variant",
            min_quantity: 3001,
            max_quantity: 4000,
          },
        ],
        override: true,
      }

      const response = await api
        .post(
          "/admin/price-lists/pl_no_customer_groups/prices/batch",
          payload,
          {
            headers: {
              Authorization: "Bearer test_token",
            },
          }
        )
        .catch((err) => {
          console.warn(err.response.data)
        })

      expect(response.status).toEqual(200)
      expect(response.data.price_list.prices.length).toEqual(3)
      expect(response.data.price_list.prices).toMatchSnapshot([
        {
          id: expect.any(String),
          price_list_id: "pl_no_customer_groups",
          amount: 45,
          currency_code: "usd",
          variant_id: "test-variant",
          min_quantity: 1001,
          max_quantity: 2000,
          created_at: expect.any(String),
          updated_at: expect.any(String),
        },
        {
          id: expect.any(String),
          price_list_id: "pl_no_customer_groups",
          amount: 35,
          currency_code: "usd",
          variant_id: "test-variant",
          min_quantity: 2001,
          max_quantity: 3000,
          created_at: expect.any(String),
          updated_at: expect.any(String),
        },
        {
          id: expect.any(String),
          price_list_id: "pl_no_customer_groups",
          amount: 25,
          currency_code: "usd",
          variant_id: "test-variant",
          min_quantity: 3001,
          max_quantity: 4000,
          created_at: expect.any(String),
          updated_at: expect.any(String),
        },
      ])
    })
  })

  describe("DELETE /admin/price-lists/:id", () => {
    beforeEach(async () => {
      try {
        await adminSeeder(dbConnection)
        await productSeeder(dbConnection)
        await priceListSeeder(dbConnection)
      } catch (err) {
        console.log(err)
        throw err
      }
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("Deletes a price list", async () => {
      const api = useApi()

      const response = await api
        .delete("/admin/price-lists/pl_no_customer_groups", {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.warn(err.response.data)
        })

      expect(response.status).toEqual(200)
      expect(response.data).toEqual({
        id: "pl_no_customer_groups",
        object: "price-list",
        deleted: true,
      })
    })
  })

  describe("tests cascade on delete", () => {
    beforeEach(async () => {
      try {
        await adminSeeder(dbConnection)
        await productSeeder(dbConnection)
        await priceListSeeder(dbConnection)
      } catch (err) {
        console.log(err)
        throw err
      }
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("Deletes a variant and ensures that prices associated with the variant are deleted from PriceList", async () => {
      const api = useApi()

      await api
        .delete("/admin/products/test-product/variants/test-variant", {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.warn(err.response.data)
        })

      const response = await api.get(
        "/admin/price-lists/pl_no_customer_groups",
        {
          headers: {
            Authorization: "Bearer test_token",
          },
        }
      )

      expect(response.status).toEqual(200)
      expect(response.data.price_list.prices.length).toEqual(0)
    })
  })

  describe("DELETE /admin/price-lists/:id/prices/batch", () => {
    beforeEach(async () => {
      try {
        await adminSeeder(dbConnection)
        await productSeeder(dbConnection)
        await priceListSeeder(dbConnection)
      } catch (err) {
        console.log(err)
        throw err
      }
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("Deletes several prices associated with a price list", async () => {
      const api = useApi()

      const response = await api
        .delete("/admin/price-lists/pl_no_customer_groups/prices/batch", {
          headers: {
            Authorization: "Bearer test_token",
          },
          data: {
            price_ids: ["ma_test_1", "ma_test_2"],
          },
        })
        .catch((err) => {
          console.warn(err.response.data)
        })

      const getPriceListResponse = await api
        .get("/admin/price-lists/pl_no_customer_groups", {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.warn(err.response.data)
        })

      expect(response.status).toEqual(200)
      expect(response.data).toEqual({
        ids: ["ma_test_1", "ma_test_2"],
        object: "money-amount",
        deleted: true,
      })
      expect(getPriceListResponse.data.price_list.prices.length).toEqual(1)
      expect(getPriceListResponse.data.price_list.prices[0].id).toEqual(
        "ma_test_3"
      )
    })
  })
})

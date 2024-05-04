const path = require("path")
const { Region } = require("@medusajs/medusa")

const setupServer = require("../../../environment-helpers/setup-server")
const startServerWithEnvironment =
  require("../../../environment-helpers/start-server-with-environment").default
const { useApi } = require("../../../environment-helpers/use-api")
const { useDb, initDb } = require("../../../environment-helpers/use-db")

const {
  simpleProductFactory,
  simplePriceListFactory,
  simpleRegionFactory,
} = require("../../../factories")
const adminSeeder = require("../../../helpers/admin-seeder")
const customerSeeder = require("../../../helpers/customer-seeder")
const priceListSeeder = require("../../../helpers/price-list-seeder")
const productSeeder = require("../../../helpers/product-seeder")

const adminReqConfig = {
  headers: {
    "x-medusa-access-token": "test_token",
  },
}

jest.setTimeout(50000)

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
      await adminSeeder(dbConnection)
      await customerSeeder(dbConnection)
      await productSeeder(dbConnection)
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("creates a price list", async () => {
      const api = useApi()

      const region = await simpleRegionFactory(dbConnection, {
        id: "region-pl-infer-currency",
        currency_code: "hrk",
      })

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
          {
            amount: 105,
            region_id: region.id,
            variant_id: "test-variant",
          },
        ],
      }

      const response = await api
        .post("/admin/price-lists", payload, adminReqConfig)
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
            expect.objectContaining({
              id: expect.any(String),
              amount: 105,
              currency_code: region.currency_code,
              variant_id: "test-variant",
            }),
          ],
        })
      )
    })
  })

  describe("GET /admin/price-lists", () => {
    beforeEach(async () => {
      await adminSeeder(dbConnection)
      await productSeeder(dbConnection)
      await priceListSeeder(dbConnection)
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("returns a price list by :id", async () => {
      const api = useApi()

      const response = await api
        .get("/admin/price-lists/pl_no_customer_groups", adminReqConfig)
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
            variant: expect.any(Object),
            variants: expect.any(Array),
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
            variant: expect.any(Object),
            variants: expect.any(Array),
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
            variant: expect.any(Object),
            variants: expect.any(Array),
          },
        ],
        created_at: expect.any(String),
        updated_at: expect.any(String),
      })
    })

    it("returns a list of price lists", async () => {
      const api = useApi()

      const response = await api
        .get("/admin/price-lists", adminReqConfig)
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

    it("given a search query, returns matching results by name", async () => {
      const api = useApi()

      const response = await api
        .get("/admin/price-lists?q=winter", adminReqConfig)
        .catch((err) => {
          console.warn(err.response.data)
        })

      expect(response.status).toEqual(200)
      expect(response.data.price_lists).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: "VIP winter sale",
          }),
        ])
      )
      expect(response.data.count).toEqual(1)
    })

    it("given a search query, returns matching results by description", async () => {
      const api = useApi()

      const response = await api
        .get("/admin/price-lists?q=25%", adminReqConfig)
        .catch((err) => {
          console.warn(err.response.data)
        })

      expect(response.status).toEqual(200)
      expect(response.data.price_lists).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: "VIP winter sale",
            description:
              "Winter sale for VIP customers. 25% off selected items.",
          }),
        ])
      )
      expect(response.data.count).toEqual(1)
    })

    it("given a search query, returns empty list when does not exist", async () => {
      const api = useApi()

      const response = await api
        .get("/admin/price-lists?q=blablabla", adminReqConfig)
        .catch((err) => {
          console.warn(err.response.data)
        })

      expect(response.status).toEqual(200)
      expect(response.data.price_lists).toEqual([])
      expect(response.data.count).toEqual(0)
    })

    it("given a search query and a status filter not matching any price list, returns an empty set", async () => {
      const api = useApi()

      const response = await api
        .get("/admin/price-lists?q=vip&status[]=draft", adminReqConfig)
        .catch((err) => {
          console.warn(err.response.data)
        })

      expect(response.status).toEqual(200)
      expect(response.data.price_lists).toEqual([])
      expect(response.data.count).toEqual(0)
    })

    it("given a search query and a status filter matching a price list, returns a price list", async () => {
      const api = useApi()

      const response = await api
        .get("/admin/price-lists?q=vip&status[]=active", adminReqConfig)
        .catch((err) => {
          console.warn(err.response.data)
        })

      expect(response.status).toEqual(200)
      expect(response.data.price_lists).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: "VIP winter sale",
            status: "active",
          }),
        ])
      )
      expect(response.data.count).toEqual(1)
    })

    it("lists only price lists with customer_group", async () => {
      await customerSeeder(dbConnection)

      await simplePriceListFactory(dbConnection, {
        id: "test-list-cgroup-1",
        customer_groups: ["customer-group-1"],
      })
      await simplePriceListFactory(dbConnection, {
        id: "test-list-cgroup-2",
        customer_groups: ["customer-group-2"],
      })
      await simplePriceListFactory(dbConnection, {
        id: "test-list-cgroup-3",
        customer_groups: ["customer-group-3"],
      })
      await simplePriceListFactory(dbConnection, {
        id: "test-list-no-cgroup",
      })

      const api = useApi()

      const response = await api
        .get(
          `/admin/price-lists?customer_groups[]=customer-group-1,customer-group-2`,
          adminReqConfig
        )
        .catch((err) => {
          console.warn(err.response.data)
        })

      expect(response.status).toEqual(200)
      expect(response.data.price_lists.length).toEqual(2)
      expect(response.data.price_lists).toHaveLength(2)
      expect(response.data.price_lists).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: "test-list-cgroup-1" }),
          expect.objectContaining({ id: "test-list-cgroup-2" }),
        ])
      )
    })
  })

  describe("POST /admin/price-lists/:id", () => {
    beforeEach(async () => {
      await adminSeeder(dbConnection)
      await customerSeeder(dbConnection)
      await productSeeder(dbConnection)
      await priceListSeeder(dbConnection)
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("removes configuration with update", async () => {
      const priceList = await simplePriceListFactory(dbConnection, {
        ends_at: new Date(),
        starts_at: new Date(),
        customer_groups: ["customer-group-1"],
      })

      const api = useApi()
      const getResult = await api.get(
        `/admin/price-lists/${priceList.id}`,
        adminReqConfig
      )

      expect(getResult.status).toEqual(200)
      expect(getResult.data.price_list.starts_at).toBeTruthy()
      expect(getResult.data.price_list.ends_at).toBeTruthy()
      expect(getResult.data.price_list.customer_groups.length).toEqual(1)

      const updateResult = await api.post(
        `/admin/price-lists/${priceList.id}`,
        { ends_at: null, starts_at: null, customer_groups: [] },
        adminReqConfig
      )

      expect(updateResult.status).toEqual(200)
      expect(updateResult.data.price_list.starts_at).toBeFalsy()
      expect(updateResult.data.price_list.ends_at).toBeFalsy()
      expect(updateResult.data.price_list.customer_groups.length).toEqual(0)
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
        .post(
          "/admin/price-lists/pl_no_customer_groups",
          payload,
          adminReqConfig
        )
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
        prices: expect.arrayContaining([
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
            variant: expect.any(Object),
            variants: expect.any(Array),
            deleted_at: null,
          },
          {
            id: expect.any(String),
            amount: 80,
            currency_code: "usd",
            min_quantity: 101,
            max_quantity: 500,
            variant_id: "test-variant",
            variant: expect.any(Object),
            variants: expect.any(Array),
            price_list_id: "pl_no_customer_groups",
            region_id: null,
            created_at: expect.any(String),
            updated_at: expect.any(String),
            deleted_at: null,
          },
          {
            id: expect.any(String),
            amount: 50,
            currency_code: "usd",
            min_quantity: 501,
            max_quantity: 1000,
            variant_id: "test-variant",
            variant: expect.any(Object),
            variants: expect.any(Array),
            price_list_id: "pl_no_customer_groups",
            region_id: null,
            created_at: expect.any(String),
            updated_at: expect.any(String),
            deleted_at: null,
          },
          {
            id: expect.any(String),
            amount: 85,
            currency_code: "usd",
            variant_id: "test-variant_1",
            variant: expect.any(Object),
            variants: expect.any(Array),
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
            variant: expect.any(Object),
            variants: expect.any(Array),
            price_list_id: "pl_no_customer_groups",
            min_quantity: null,
            max_quantity: null,
            region_id: null,
            created_at: expect.any(String),
            updated_at: expect.any(String),
            deleted_at: null,
          },
        ]),
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
        .post(
          "/admin/price-lists/pl_no_customer_groups",
          payload,
          adminReqConfig
        )
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
        variant: expect.any(Object),
        variants: expect.any(Array),
      })
    })

    it("updates price list prices (inser a new MA for a specific region)", async () => {
      const api = useApi()

      const payload = {
        prices: [
          // update MA
          {
            id: "ma_test_4",
            amount: 1001,
            currency_code: "usd",
            variant_id: "test-variant",
          },
          // create MA
          {
            amount: 101,
            variant_id: "test-variant",
            region_id: "region-pl",
          },
        ],
      }

      const response = await api
        .post("/admin/price-lists/pl_with_some_ma", payload, adminReqConfig)
        .catch((err) => {
          console.warn(err.response.data)
        })

      expect(response.status).toEqual(200)

      expect(response.data.price_list.prices.length).toEqual(2)
      expect(response.data.price_list.prices).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            currency_code: "eur",
            amount: 101,
            min_quantity: null,
            max_quantity: null,
            price_list_id: "pl_with_some_ma",
            variant_id: "test-variant",
            region_id: "region-pl",
            created_at: expect.any(String),
            updated_at: expect.any(String),
            deleted_at: null,
          }),
          expect.objectContaining({
            id: "ma_test_4",
            currency_code: "usd",
            amount: 1001,
            price_list_id: "pl_with_some_ma",
            variant_id: "test-variant",
            region_id: null,
            created_at: expect.any(String),
            updated_at: expect.any(String),
            deleted_at: null,
          }),
        ])
      )
    })
  })

  describe("POST /admin/price-lists/:id/prices/batch", () => {
    beforeEach(async () => {
      await adminSeeder(dbConnection)
      await productSeeder(dbConnection)
      await priceListSeeder(dbConnection)
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
          adminReqConfig
        )
        .catch((err) => {
          console.warn(err.response.data)
        })

      expect(response.status).toEqual(200)
      expect(response.data.price_list.prices.length).toEqual(6)
      expect(
        response.data.price_list.prices.sort((a, b) => b.amount - a.amount)
      ).toMatchSnapshot([
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
          variant: expect.any(Object),
          variants: expect.any(Array),
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
          variant: expect.any(Object),
          variants: expect.any(Array),
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
          variant: expect.any(Object),
          variants: expect.any(Array),
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
          variant: expect.any(Object),
          variants: expect.any(Array),
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
          variant: expect.any(Object),
          variants: expect.any(Array),
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
          variant: expect.any(Object),
          variants: expect.any(Array),
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
          adminReqConfig
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
          variant: expect.any(Object),
          variants: expect.any(Array),
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
          variant: expect.any(Object),
          variants: expect.any(Array),
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
          variant: expect.any(Object),
          variants: expect.any(Array),
        },
      ])
    })

    it("Adds a batch of new prices where a MA record have a `region_id` instead of `currency_code`", async () => {
      const api = useApi()

      const payload = {
        prices: [
          {
            amount: 100,
            variant_id: "test-variant",
            region_id: "region-pl",
          },
          {
            amount: 200,
            variant_id: "test-variant",
            currency_code: "usd",
          },
        ],
      }

      const response = await api
        .post(
          "/admin/price-lists/pl_with_some_ma/prices/batch",
          payload,
          adminReqConfig
        )
        .catch((err) => {
          console.warn(err.response.data)
        })

      expect(response.status).toEqual(200)

      expect(response.data.price_list.prices.length).toEqual(3) // initially this PL has 1 MA record
      expect(response.data.price_list.prices).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: "ma_test_4",
            currency_code: "usd",
            amount: 70,
            price_list_id: "pl_with_some_ma",
            variant_id: "test-variant",
            region_id: null,
            created_at: expect.any(String),
            updated_at: expect.any(String),
            deleted_at: null,
          }),
          expect.objectContaining({
            id: expect.any(String),
            currency_code: "usd",
            amount: 200,
            min_quantity: null,
            max_quantity: null,
            price_list_id: "pl_with_some_ma",
            variant_id: "test-variant",
            region_id: null,
            created_at: expect.any(String),
            updated_at: expect.any(String),
            deleted_at: null,
          }),
          expect.objectContaining({
            id: expect.any(String),
            currency_code: "eur",
            amount: 100,
            min_quantity: null,
            max_quantity: null,
            price_list_id: "pl_with_some_ma",
            variant_id: "test-variant",
            region_id: "region-pl",
            created_at: expect.any(String),
            updated_at: expect.any(String),
            deleted_at: null,
          }),
        ])
      )
    })
  })

  describe("DELETE /admin/price-lists/:id", () => {
    beforeEach(async () => {
      await adminSeeder(dbConnection)
      await productSeeder(dbConnection)
      await priceListSeeder(dbConnection)
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("Deletes a price list", async () => {
      const api = useApi()

      const response = await api
        .delete("/admin/price-lists/pl_no_customer_groups", adminReqConfig)
        .catch((err) => {
          console.warn(err.response.data)
        })

      expect(response.status).toEqual(200)
      expect(response.data).toEqual({
        id: "pl_no_customer_groups",
        object: "price-list",
        deleted: true,
      })

      try {
        await api.get(
          "/admin/price-lists/pl_no_customer_groups",
          adminReqConfig
        )
      } catch (error) {
        expect(error.response.status).toBe(404)
        expect(error.response.data.message).toEqual(
          "Price list with id: pl_no_customer_groups was not found"
        )
      }
    })
  })

  describe("tests cascade on delete", () => {
    beforeEach(async () => {
      await adminSeeder(dbConnection)
      await productSeeder(dbConnection)
      await priceListSeeder(dbConnection)
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("Deletes a variant and ensures that prices associated with the variant are deleted from PriceList", async () => {
      const api = useApi()

      await api
        .delete(
          "/admin/products/test-product/variants/test-variant",
          adminReqConfig
        )
        .catch((err) => {
          console.warn(err.response.data)
        })

      const response = await api.get(
        "/admin/price-lists/pl_no_customer_groups",
        adminReqConfig
      )

      expect(response.status).toEqual(200)
      expect(response.data.price_list.prices.length).toEqual(0)
    })
  })

  describe("DELETE /admin/price-lists/:id/prices/batch", () => {
    beforeEach(async () => {
      await adminSeeder(dbConnection)
      await productSeeder(dbConnection)
      await priceListSeeder(dbConnection)
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("Deletes several prices associated with a price list", async () => {
      const api = useApi()

      const response = await api
        .delete("/admin/price-lists/pl_no_customer_groups/prices/batch", {
          ...adminReqConfig,
          data: {
            price_ids: ["ma_test_1", "ma_test_2"],
          },
        })
        .catch((err) => {
          console.warn(err.response.data)
        })

      const getPriceListResponse = await api
        .get("/admin/price-lists/pl_no_customer_groups", adminReqConfig)
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

  describe("GET /admin/price-lists/:id/products", () => {
    let tag
    beforeEach(async () => {
      await adminSeeder(dbConnection)

      await simpleProductFactory(
        dbConnection,
        {
          id: "test-prod-1",
          title: "MedusaHeadphones",
          variants: [{ id: "test-variant-1" }, { id: "test-variant-2" }],
        },
        1
      )

      const prod = await simpleProductFactory(
        dbConnection,
        {
          id: "test-prod-2",
          title: "MedusaShoes",
          tags: ["test-tag"],
          variants: [{ id: "test-variant-3" }, { id: "test-variant-4" }],
        },
        2
      )

      tag = prod.tags[0].id

      await simpleProductFactory(
        dbConnection,
        {
          id: "test-prod-3",
          title: "MedusaShirt",
          variants: [{ id: "test-variant-5" }],
        },
        3
      )

      // Used to validate that products that are not associated with the price list are not returned
      await simpleProductFactory(
        dbConnection,
        {
          id: "test-prod-4",
          title: "OtherHeadphones",
          variants: [{ id: "test-variant-6" }],
        },
        4
      )

      await simplePriceListFactory(dbConnection, {
        id: "test-list",
        customer_groups: ["test-group"],
        prices: [
          { variant_id: "test-variant-1", currency_code: "usd", amount: 150 },
          { variant_id: "test-variant-4", currency_code: "usd", amount: 150 },
        ],
      })
      await simplePriceListFactory(dbConnection, {
        id: "test-list-2",
        prices: [
          { variant_id: "test-variant-1", currency_code: "usd", amount: 200 },
          { variant_id: "test-variant-4", currency_code: "usd", amount: 200 },
        ],
      })
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("lists only product 1, 2 with price list prices", async () => {
      const api = useApi()

      const response = await api
        .get(
          `/admin/price-lists/test-list/products?order=-created_at`,
          adminReqConfig
        )
        .catch((err) => {
          console.warn(err.response.data)
        })

      expect(response.status).toEqual(200)
      expect(response.data.count).toEqual(2)
      expect(response.data.products).toHaveLength(2)
      expect(response.data.products).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: "test-prod-1",
            variants: expect.arrayContaining([
              expect.objectContaining({
                id: "test-variant-1",
                prices: expect.arrayContaining([
                  expect.objectContaining({
                    currency_code: "usd",
                    amount: 100,
                  }),
                  expect.objectContaining({
                    currency_code: "usd",
                    amount: 150,
                    price_list_id: "test-list",
                  }),
                ]),
              }),
              expect.objectContaining({
                id: "test-variant-2",
                prices: expect.arrayContaining([
                  expect.objectContaining({
                    currency_code: "usd",
                    amount: 100,
                  }),
                ]),
              }),
            ]),
          }),
          expect.objectContaining({
            id: "test-prod-2",
            variants: expect.arrayContaining([
              expect.objectContaining({
                id: "test-variant-3",
                prices: expect.arrayContaining([
                  expect.objectContaining({
                    currency_code: "usd",
                    amount: 100,
                  }),
                ]),
              }),
              expect.objectContaining({
                id: "test-variant-4",
                prices: expect.arrayContaining([
                  expect.objectContaining({
                    currency_code: "usd",
                    amount: 100,
                  }),
                  expect.objectContaining({
                    currency_code: "usd",
                    amount: 150,
                    price_list_id: "test-list",
                  }),
                ]),
              }),
            ]),
          }),
        ])
      )
    })

    it("lists only product 2", async () => {
      const api = useApi()

      const response = await api
        .get(
          `/admin/price-lists/test-list/products?tags[]=${tag}`,
          adminReqConfig
        )
        .catch((err) => {
          console.warn(err.response.data)
        })

      expect(response.status).toEqual(200)
      expect(response.data.count).toEqual(1)
      expect(response.data.products).toHaveLength(1)
      expect(response.data.products).toEqual(
        expect.arrayContaining([expect.objectContaining({ id: "test-prod-2" })])
      )
    })

    it("lists products using free text search", async () => {
      const api = useApi()

      const response = await api
        .get(
          `/admin/price-lists/test-list/products?q=Headphones`,
          adminReqConfig
        )
        .catch((err) => {
          console.warn(err.response.data)
        })

      expect(response.status).toEqual(200)
      expect(response.data.count).toEqual(1)
      expect(response.data.products).toHaveLength(1)
      expect(response.data.products).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: "test-prod-1",
            title: "MedusaHeadphones",
          }),
        ])
      )
    })
  })

  describe("delete prices from price list related to the specified product or variant", () => {
    let product1
    let product2

    function getCustomPriceIdFromVariant(variantId, index) {
      return "ma_" + index + "_" + variantId
    }

    beforeEach(async () => {
      await adminSeeder(dbConnection)

      product1 = await simpleProductFactory(
        dbConnection,
        {
          id: "test-prod-1",
          title: "some product",
          variants: [
            {
              id: `simple-test-variant-${Math.random() * 1000}`,
              title: "Test",
              prices: [{ currency: "usd", amount: 100 }],
            },
            {
              id: `simple-test-variant-${Math.random() * 1000}`,
              title: "Test 2",
              prices: [{ currency: "usd", amount: 200 }],
            },
          ],
        },
        1
      )

      product2 = await simpleProductFactory(
        dbConnection,
        {
          id: "test-prod-2",
          title: "some product 2",
        },
        2
      )

      await simplePriceListFactory(dbConnection, {
        id: "test-list",
        customer_groups: ["test-group"],
        prices: [
          ...product1.variants.map((variant, i) => ({
            id: getCustomPriceIdFromVariant(variant.id, i),
            variant_id: variant.id,
            currency_code: "usd",
            amount: (i + 1) * 150,
          })),
          ...product2.variants.map((variant, i) => ({
            id: getCustomPriceIdFromVariant(variant.id, i),
            variant_id: variant.id,
            currency_code: "usd",
            amount: (i + 1) * 150,
          })),
        ],
      })
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("should delete all the prices that are part of the price list for the specified product", async () => {
      const api = useApi()

      let response = await api.get(
        "/admin/price-lists/test-list",
        adminReqConfig
      )

      expect(response.status).toBe(200)
      expect(response.data.price_list.prices.length).toBe(3)

      response = await api.delete(
        `/admin/price-lists/test-list/products/${product1.id}/prices`,
        adminReqConfig
      )

      expect(response.status).toBe(200)
      expect(response.data).toEqual({
        ids: expect.arrayContaining(
          product1.variants.map((variant, i) => {
            return getCustomPriceIdFromVariant(variant.id, i)
          })
        ),
        object: "money-amount",
        deleted: true,
      })

      response = await api.get("/admin/price-lists/test-list", adminReqConfig)

      expect(response.status).toBe(200)
      expect(response.data.price_list.prices.length).toBe(1)
    })

    it("should delete all the prices that are part of the price list for the specified variant", async () => {
      const api = useApi()

      let response = await api.get(
        "/admin/price-lists/test-list",
        adminReqConfig
      )

      expect(response.status).toBe(200)
      expect(response.data.price_list.prices.length).toBe(3)

      const variant = product2.variants[0]
      response = await api.delete(
        `/admin/price-lists/test-list/variants/${variant.id}/prices`,
        adminReqConfig
      )

      expect(response.status).toBe(200)
      expect(response.data).toEqual({
        ids: [getCustomPriceIdFromVariant(variant.id, 0)],
        object: "money-amount",
        deleted: true,
      })

      response = await api.get("/admin/price-lists/test-list", adminReqConfig)

      expect(response.status).toBe(200)
      expect(response.data.price_list.prices.length).toBe(2)
    })
  })
})

describe("[MEDUSA_FF_TAX_INCLUSIVE_PRICING] /admin/price-lists", () => {
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

  describe("POST /admin/price-list", () => {
    const priceListIncludesTaxId = "price-list-1-includes-tax"

    beforeEach(async () => {
      try {
        await adminSeeder(dbConnection)
        await customerSeeder(dbConnection)
        await productSeeder(dbConnection)
        await simplePriceListFactory(dbConnection, {
          id: priceListIncludesTaxId,
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

    it("should creates a price list that includes tax", async () => {
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
        includes_tax: true,
      }

      const response = await api
        .post("/admin/price-lists", payload, adminReqConfig)
        .catch((err) => {
          console.warn(err.response.data)
        })

      expect(response.status).toEqual(200)
      expect(response.data.price_list).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          includes_tax: true,
        })
      )
    })

    it("should update a price list that include_tax", async () => {
      const api = useApi()

      let response = await api
        .get(`/admin/price-lists/${priceListIncludesTaxId}`, adminReqConfig)
        .catch((err) => {
          console.log(err)
        })

      expect(response.data.price_list.includes_tax).toBe(false)

      response = await api
        .post(
          `/admin/price-lists/${priceListIncludesTaxId}`,
          { includes_tax: true },
          adminReqConfig
        )
        .catch((err) => {
          console.log(err)
        })

      expect(response.data.price_list.includes_tax).toBe(true)
    })
  })
})

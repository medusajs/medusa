const { PriceList, CustomerGroup } = require("@medusajs/medusa")
const path = require("path")

const setupServer = require("../../../helpers/setup-server")
const { useApi } = require("../../../helpers/use-api")
const { useDb, initDb } = require("../../../helpers/use-db")

const {
  simpleProductFactory,
  simplePriceListFactory,
} = require("../../factories")
const {
  simpleCustomerGroupFactory,
} = require("../../factories/simple-customer-group-factory")
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

    it("given a search query, returns matching results by name", async () => {
      const api = useApi()

      const response = await api
        .get("/admin/price-lists?q=winter", {
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
            name: "VIP winter sale",
          }),
        ])
      )
      expect(response.data.count).toEqual(1)
    })

    it("given a search query, returns matching results by description", async () => {
      const api = useApi()

      const response = await api
        .get("/admin/price-lists?q=25%", {
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
        .get("/admin/price-lists?q=blablabla", {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
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
        .get("/admin/price-lists?q=vip&status[]=draft", {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
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
        .get("/admin/price-lists?q=vip&status[]=active", {
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
      expect(response.data.price_lists.length).toEqual(2)
      expect(response.data.price_lists).toEqual([
        expect.objectContaining({ id: "test-list-cgroup-1" }),
        expect.objectContaining({ id: "test-list-cgroup-2" }),
      ])
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
        .post("/admin/price-lists/pl_with_some_ma", payload, {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.warn(err.response.data)
        })

      expect(response.status).toEqual(200)

      expect(response.data.price_list.prices.length).toEqual(2)
      expect(response.data.price_list.prices).toMatchSnapshot([
        {
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
        },
        {
          id: "ma_test_4",
          currency_code: "usd",
          amount: 1001,
          price_list_id: "pl_with_some_ma",
          variant_id: "test-variant",
          region_id: null,
          created_at: expect.any(String),
          updated_at: expect.any(String),
          deleted_at: null,
        },
      ])
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
        .post("/admin/price-lists/pl_with_some_ma/prices/batch", payload, {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.warn(err.response.data)
        })

      expect(response.status).toEqual(200)

      expect(response.data.price_list.prices.length).toEqual(3) // initially this PL has 1 MA record
      expect(response.data.price_list.prices).toMatchSnapshot([
        {
          id: "ma_test_4",
          currency_code: "usd",
          amount: 70,
          price_list_id: "pl_with_some_ma",
          variant_id: "test-variant",
          region_id: null,
          created_at: expect.any(String),
          updated_at: expect.any(String),
          deleted_at: null,
        },
        {
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
        },
        {
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

  describe("GET /admin/price-lists/:id/products", () => {
    let tag
    beforeEach(async () => {
      try {
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
            variants: [{ id: "test-variant-5" }],
          },
          3
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
      } catch (err) {
        console.log(err)
        throw err
      }
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("lists only product 1, 2 with price list prices", async () => {
      const api = useApi()

      const response = await api
        .get(`/admin/price-lists/test-list/products?order=-created_at`, {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.warn(err.response.data)
        })

      expect(response.status).toEqual(200)
      expect(response.data.count).toEqual(2)
      expect(response.data.products).toEqual([
        expect.objectContaining({
          id: "test-prod-1",
          variants: [
            expect.objectContaining({
              id: "test-variant-1",
              prices: [
                expect.objectContaining({ currency_code: "usd", amount: 100 }),
                expect.objectContaining({
                  currency_code: "usd",
                  amount: 150,
                  price_list_id: "test-list",
                }),
              ],
            }),
            expect.objectContaining({
              id: "test-variant-2",
              prices: [
                expect.objectContaining({ currency_code: "usd", amount: 100 }),
              ],
            }),
          ],
        }),
        expect.objectContaining({
          id: "test-prod-2",
          variants: [
            expect.objectContaining({
              id: "test-variant-3",
              prices: [
                expect.objectContaining({ currency_code: "usd", amount: 100 }),
              ],
            }),
            expect.objectContaining({
              id: "test-variant-4",
              prices: [
                expect.objectContaining({ currency_code: "usd", amount: 100 }),
                expect.objectContaining({
                  currency_code: "usd",
                  amount: 150,
                  price_list_id: "test-list",
                }),
              ],
            }),
          ],
        }),
      ])
    })

    it("lists only product 2", async () => {
      const api = useApi()

      const response = await api
        .get(`/admin/price-lists/test-list/products?tags[]=${tag}`, {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.warn(err.response.data)
        })

      expect(response.status).toEqual(200)
      expect(response.data.count).toEqual(1)
      expect(response.data.products).toEqual([
        expect.objectContaining({ id: "test-prod-2" }),
      ])
    })
  })
})

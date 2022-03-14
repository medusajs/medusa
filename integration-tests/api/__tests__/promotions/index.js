const path = require("path")

const setupServer = require("../../../helpers/setup-server")
const { useApi } = require("../../../helpers/use-api")
const { useDb, initDb } = require("../../../helpers/use-db")

// const customerSeeder = require("../../helpers/customer-seeder")
const adminSeeder = require("../../helpers/admin-seeder")
// const productSeeder = require("../../helpers/product-seeder")
const promotionsSeeder = require("../../helpers/promotions-seeder")

jest.setTimeout(30000)

describe("Promotions", () => {
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

  describe("Money amount", () => {
    beforeEach(async () => {
      try {
        await adminSeeder(dbConnection)
        await promotionsSeeder(dbConnection)
      } catch (err) {
        console.log(err)
        throw err
      }
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("calculatedPrice contains lowest price", async () => {
      const api = useApi()
      const res = await api
        .get("/store/products/test-product?cart_id=test-cart")
        .catch((error) => console.log(error))

      const variant = res.data.product.variants[0]

      const lowestPrice = variant.prices.reduce(
        (prev, curr) => (curr.amount < prev ? curr.amount : prev),
        Infinity
      )

      expect(variant.calculatedPrice).toEqual(lowestPrice)

      expect(variant).toEqual(
        expect.objectContaining({ originalPrice: 120, calculatedPrice: 110 })
      )
    })

    it("returns no money amounts belonging to customer groups without login", async () => {
      const api = useApi()
      const res = await api
        .get("/store/products/test-product?cart_id=test-cart")
        .catch((error) => console.log(error))

      const variant = res.data.product.variants[0]

      expect(variant.prices.length).toEqual(2)
      variant.prices.forEach((price) => {
        expect(price.customer_groups).toEqual([])
      })
      expect(variant.prices).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: "test-price1",
            region_id: "test-region",
            currency_code: "usd",
            type: "default",
            amount: 120,
          }),
          expect.objectContaining({
            id: "test-price3",
            region_id: "test-region",
            currency_code: "usd",
            type: "sale",
            amount: 110,
          }),
        ])
      )
    })

    it("sets default price as original price", async () => {
      const api = useApi()
      const res = await api
        .get("/store/products/test-product?cart_id=test-cart")
        .catch((error) => console.log(error))

      const variant = res.data.product.variants[0]

      expect(variant.originalPrice).toEqual(
        variant.prices.find((p) => p.type === "default").amount
      )
    })

    it("gets prices for currency if no region prices exist", async () => {
      const api = useApi()
      const res = await api
        .get("/store/products/test-product?cart_id=test-cart-2")
        .catch((error) => console.log(error))

      const variant = res.data.product.variants[0]

      expect(variant.originalPrice).toEqual(
        variant.prices.find((p) => p.type === "default").amount
      )
      expect(variant.prices.length).toEqual(2)
      variant.prices.forEach((price) => {
        expect(price.customer_groups).toEqual([])
      })
      variant.prices.forEach((price) => {
        expect(price.region_id).toEqual("test-region")
        expect(price.currency_code).toEqual("usd")
      })
      expect(variant.prices).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: "test-price1",
            region_id: "test-region",
            currency_code: "usd",
            type: "default",
            amount: 120,
          }),
          expect.objectContaining({
            id: "test-price3",
            region_id: "test-region",
            currency_code: "usd",
            type: "sale",
            amount: 110,
          }),
        ])
      )
    })

    it("gets prices for cart region for multi region product", async () => {
      const api = useApi()
      const res = await api
        .get("/store/products/test-product-multi-region?cart_id=test-cart-1")
        .catch((error) => console.log(error))

      const variant = res.data.product.variants[0]

      expect(variant).toEqual(
        expect.objectContaining({ originalPrice: 130, calculatedPrice: 110 })
      )
      expect(variant.originalPrice).toEqual(
        variant.prices.find((p) => p.type === "default").amount
      )

      expect(variant.prices.length).toEqual(2)

      expect(variant.prices).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: "test-price1-region-2",
            region_id: "test-region-2",
            currency_code: "dkk",
            type: "default",
            amount: 130,
          }),
          expect.objectContaining({
            id: "test-price3-region-2",
            region_id: "test-region-2",
            currency_code: "dkk",
            type: "sale",
            amount: 110,
          }),
        ])
      )
    })

    it("gets moneyamounts only with valid date interval", async () => {
      const api = useApi()
      const res = await api
        .get("/store/products/test-product-sale?cart_id=test-cart")
        .catch((error) => console.log(error))

      const variant = res.data.product.variants[0]

      const date = new Date()

      expect(variant.prices.length).toEqual(2)
      variant.prices.forEach((price) => {
        if (price.starts_at) {
          expect(new Date(price.starts_at).getTime()).toBeLessThan(
            date.getTime()
          )
        }
        if (price.ends_at) {
          expect(new Date(price.ends_at).getTime()).toBeGreaterThan(
            date.getTime()
          )
        }
      })
    })

    it("gets moneyamounts with valid date intervals and finds lowest price with overlapping intervals", async () => {
      const api = useApi()
      const res = await api
        .get("/store/products/test-product-sale-overlap?cart_id=test-cart")
        .catch((error) => console.log(error))

      const variant = res.data.product.variants[0]

      const date = new Date()

      expect(variant).toEqual(
        expect.objectContaining({
          originalPrice: 150,
          calculatedPrice: 120,
        })
      )
      expect(variant.prices.length).toEqual(3)
      variant.prices.forEach((price) => {
        if (price.starts_at) {
          expect(new Date(price.starts_at).getTime()).toBeLessThan(
            date.getTime()
          )
        }
        if (price.ends_at) {
          expect(new Date(price.ends_at).getTime()).toBeGreaterThan(
            date.getTime()
          )
        }
      })

      expect(variant.prices).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: "test-price-sale-overlap-1",
            region_id: "test-region",
            currency_code: "usd",
            amount: 140,
            type: "sale",
          }),
          expect.objectContaining({
            id: "test-price1-sale-overlap",
            region_id: "test-region",
            currency_code: "usd",
            amount: 120,
            type: "sale",
          }),
          expect.objectContaining({
            id: "test-price2-sale-overlap-default",
            region_id: "test-region",
            currency_code: "usd",
            amount: 150,
            type: "default",
          }),
        ])
      )
    })

    it("gets all prices with varying quantity limits with no quantity", async () => {
      const api = useApi()
      const res = await api
        .get("/store/products/test-product-quantity?cart_id=test-cart")
        .catch((error) => console.log(error))

      const variant = res.data.product.variants[0]

      expect(variant.prices.length).toEqual(5)
      expect(variant.prices).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: "test-price-quantity",
            region_id: "test-region",
            currency_code: "usd",
            amount: 100,
            type: "sale",
            min_quantity: 10,
            max_quantity: 100,
          }),
          expect.objectContaining({
            id: "test-price1-quantity",
            region_id: "test-region",
            currency_code: "usd",
            amount: 120,
            type: "sale",
            min_quantity: 101,
            max_quantity: 1000,
          }),
          expect.objectContaining({
            id: "test-price2-quantity",
            region_id: "test-region",
            currency_code: "usd",
            amount: 130,
            type: "sale",
            max_quantity: 9,
          }),
          expect.objectContaining({
            id: "test-price3-quantity-now",
            region_id: "test-region",
            currency_code: "usd",
            amount: 140,
            type: "sale",
            min_quantity: 101,
            max_quantity: 1000,
          }),
          expect.objectContaining({
            id: "test-price3-quantity-default",
            region_id: "test-region",
            currency_code: "usd",
            amount: 150,
            type: "default",
          }),
        ])
      )

      expect(variant.calculatedPrice).toEqual(130)
      expect(variant.originalPrice).toEqual(150)
      expect(variant.originalPrice).toEqual(
        variant.prices.find((p) => p.type === "default").amount
      )
    })

    it("fetches product with groups in money amounts with login", async () => {
      const api = useApi()

      // customer with customer-group 5
      const authResponse = await api.post("/store/auth", {
        email: "test5@email.com",
        password: "test",
      })

      const [authCookie] = authResponse.headers["set-cookie"][0].split(";")

      const res = await api
        .get("/store/products/test-product?cart_id=test-cart", {
          headers: {
            Cookie: authCookie,
          },
        })
        .catch((error) => console.log(error))

      const variant = res.data.product.variants[0]

      expect(variant.prices.length).toEqual(3)
      expect(variant.prices).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: "test-price1",
            region_id: "test-region",
            currency_code: "usd",
            type: "default",
            amount: 120,
          }),
          expect.objectContaining({
            id: "test-price3",
            region_id: "test-region",
            currency_code: "usd",
            type: "sale",
            amount: 110,
          }),
          expect.objectContaining({
            id: "test-price",
            region_id: "test-region",
            currency_code: "usd",
            amount: 100,
            type: "cost",
            customer_groups: [
              expect.objectContaining({
                id: "test-group-5",
                name: "test-group-5",
              }),
            ],
          }),
        ])
      )
    })

    it("fetches product with groups and quantities in money amounts with login", async () => {
      const api = useApi()

      // customer with customer-group 5
      const authResponse = await api.post("/store/auth", {
        email: "test5@email.com",
        password: "test",
      })

      const [authCookie] = authResponse.headers["set-cookie"][0].split(";")

      const res = await api
        .get(
          "/store/products/test-product-quantity-customer?cart_id=test-cart",
          {
            headers: {
              Cookie: authCookie,
            },
          }
        )
        .catch((error) => console.log(error))

      const variant = res.data.product.variants[0]

      expect(variant.prices.length).toEqual(6)
      expect(variant.prices).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: "test-price-quantity-customer",
            region_id: "test-region",
            currency_code: "usd",
            amount: 100,
            type: "sale",
            min_quantity: 10,
            max_quantity: 100,
          }),
          expect.objectContaining({
            id: "test-price1-quantity-customer",
            region_id: "test-region",
            currency_code: "usd",
            amount: 120,
            type: "sale",
            min_quantity: 101,
            max_quantity: 1000,
          }),
          expect.objectContaining({
            id: "test-price2-quantity-customer",
            region_id: "test-region",
            currency_code: "usd",
            amount: 130,
            type: "sale",
            max_quantity: 9,
          }),
          expect.objectContaining({
            id: "test-price2-quantity-customer-group",
            region_id: "test-region",
            currency_code: "usd",
            amount: 100,
            type: "sale",
            max_quantity: 9,
            customer_groups: [
              expect.objectContaining({
                id: "test-group-5",
                name: "test-group-5",
              }),
            ],
          }),
          expect.objectContaining({
            id: "test-price3-quantity-customer-now",
            region_id: "test-region",
            currency_code: "usd",
            amount: 140,
            type: "sale",
            min_quantity: 101,
            max_quantity: 1000,
          }),
          expect.objectContaining({
            id: "test-price3-quantity-customer-default",
            region_id: "test-region",
            currency_code: "usd",
            amount: 150,
            type: "default",
          }),
        ])
      )

      expect(variant.calculatedPrice).toEqual(100)
      expect(variant.originalPrice).toEqual(150)
      expect(variant.originalPrice).toEqual(
        variant.prices.find((p) => p.type === "default").amount
      )
    })

    it("gets moneyamounts only with valid date interval for customer", async () => {
      const api = useApi()

      // customer with customer-group 5
      const authResponse = await api.post("/store/auth", {
        email: "test5@email.com",
        password: "test",
      })

      const [authCookie] = authResponse.headers["set-cookie"][0].split(";")

      const res = await api
        .get("/store/products/test-product-sale-customer?cart_id=test-cart", {
          headers: {
            Cookie: authCookie,
          },
        })
        .catch((error) => console.log(error))

      const variant = res.data.product.variants[0]

      const date = new Date()

      expect(variant).toEqual(
        expect.objectContaining({
          originalPrice: 150,
          calculatedPrice: 100,
        })
      )

      expect(variant.prices.length).toEqual(2)
      variant.prices.forEach((price) => {
        if (price.starts_at) {
          expect(new Date(price.starts_at).getTime()).toBeLessThan(
            date.getTime()
          )
        }
        if (price.ends_at) {
          expect(new Date(price.ends_at).getTime()).toBeGreaterThan(
            date.getTime()
          )
        }
      })
    })

    it("gets moneyamounts only with valid date interval for customer regardless of quantity limits", async () => {
      const api = useApi()

      // customer with customer-group 5
      const authResponse = await api.post("/store/auth", {
        email: "test5@email.com",
        password: "test",
      })

      const [authCookie] = authResponse.headers["set-cookie"][0].split(";")

      const res = await api
        .get(
          "/store/products/test-product-sale-customer-quantity?cart_id=test-cart",
          {
            headers: {
              Cookie: authCookie,
            },
          }
        )
        .catch((error) => console.log(error))

      const variant = res.data.product.variants[0]

      const date = new Date()

      expect(variant).toEqual(
        expect.objectContaining({
          originalPrice: 150,
          calculatedPrice: 100,
        })
      )

      expect(variant.prices.length).toEqual(3)
      variant.prices.forEach((price) => {
        if (price.starts_at) {
          expect(new Date(price.starts_at).getTime()).toBeLessThan(
            date.getTime()
          )
        }
        if (price.ends_at) {
          expect(new Date(price.ends_at).getTime()).toBeGreaterThan(
            date.getTime()
          )
        }
      })

      expect(variant.prices).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: "test-price1-sale-customer-quantity-groups",
            region_id: "test-region",
            currency_code: "usd",
            amount: 100,
            type: "sale",
            max_quantity: 99,
            customer_groups: [
              expect.objectContaining({
                id: "test-group-5",
                name: "test-group-5",
              }),
            ],
          }),
          expect.objectContaining({
            id: "test-price2-sale-customer-quantity-default",
            region_id: "test-region",
            currency_code: "usd",
            amount: 150,
            type: "default",
          }),
          expect.objectContaining({
            id: "test-price1-sale-customer-quantity",
            region_id: "test-region",
            currency_code: "usd",
            amount: 100,
            type: "sale",
            max_quantity: 99,
          }),
        ])
      )
    })
  })
})

/*
integration tests check list
default
  - fetches only non-customer group prices
  
  - resulting price is correct
  
  - lowest price is set as calculated
  
  - default price is set as original

  - fetches only prices for specific region if they exist 
    
  - date interval delimitations work correctly
    
  - price quantities are applied correctly (in cart tests)
  
  - all prices with varying quantities are returned

  - discount price with no min_quantity is applied when lower than default 

  - fetches prices for currency if region price is not found 

  - quantities and date limits

  - multiple overlapping date limits

with login
  - fetches only prices for valid customer groups
  
  - fetches both customer group and non-customer group prices

  - customer groups with quantities

  - customer groups with date limits

  - customer groups with quantities and date limits

*/

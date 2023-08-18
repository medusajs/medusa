import { MoneyAmount, PriceList, Region } from "@medusajs/medusa"
import path from "path"

import { bootstrapApp } from "../../../../environment-helpers/bootstrap-app"
import setupServer from "../../../../environment-helpers/setup-server"
import { setPort, useApi } from "../../../../environment-helpers/use-api"
import { initDb, useDb } from "../../../../environment-helpers/use-db"
import { simpleProductFactory } from "../../../../factories"
import { AxiosInstance } from "axios"
import { Customer } from "@medusajs/medusa"

jest.setTimeout(30000)

const getApi = () => { 
  return useApi() as unknown as AxiosInstance
}

describe("/store/carts", () => {
  let medusaProcess
  let dbConnection

  const doAfterEach = async () => {
    const db = useDb()
    return await db.teardown()
  }

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", "..", ".."))
    dbConnection = await initDb({ cwd })
    medusaProcess = await setupServer({ cwd, verbose: true })
    const { app, port } = await bootstrapApp({ cwd })
    setPort(port)
    app.listen(port, () => {
      process.send?.(port)
    })
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()
    medusaProcess.kill()
  })

  describe("POST /store/carts", () => {
    let prod1
    let prodSale

    beforeEach(async () => {
      const manager = dbConnection.manager
      await manager.insert(Region, {
        id: "region",
        name: "Test Region",
        currency_code: "usd",
        tax_rate: 0,
      })
      await manager.insert(Region, {
        id: "region-1",
        name: "Test Region",
        currency_code: "dkk",
        tax_rate: 0,
      })

      await manager.query(
        `UPDATE "country"
         SET region_id='region'
         WHERE iso_2 = 'us'`
      )

      await manager.query(
        `UPDATE "country"
         SET region_id='region-1'
         WHERE iso_2 = 'dk'`
      )
      await manager.query(
        `UPDATE "country"
         SET region_id='region-1'
         WHERE iso_2 = 'uk'`
      )

      await dbConnection.manager.insert(Customer, {
        id: "test_customer",
        first_name: "john",
        last_name: "doe",
        email: "john@doe.com",
        password_hash:
          "c2NyeXB0AAEAAAABAAAAAVMdaddoGjwU1TafDLLlBKnOTQga7P2dbrfgf3fB+rCD/cJOMuGzAvRdKutbYkVpuJWTU39P7OpuWNkUVoEETOVLMJafbI8qs8Qx/7jMQXkN", // password matching "test"
        has_account: true,
      })

      prod1 = await simpleProductFactory(dbConnection, {
        id: "test-product",
        variants: [{ id: "test-variant_1" }],
      })

      prodSale = await simpleProductFactory(dbConnection, {
        id: "test-product-sale",
        variants: [
          {
            id: "test-variant-sale",
            prices: [{ amount: 1000, currency: "usd" }],
          },
        ],
      })
    })

    afterEach(async () => {
      await doAfterEach()
    })

    it("should create a cart", async () => {
      const api = getApi()
      const response = await api.post("/store/carts")

      expect(response.status).toEqual(200)

      const getRes = await api.post(`/store/carts/${response.data.cart.id}`)
      expect(getRes.status).toEqual(200)
    })

    it("should fail to create a cart when no region exist", async () => {
      const api = getApi()

      await dbConnection.manager.query(
        `UPDATE "country"
         SET region_id=null`
      )

      await dbConnection.manager.query(`DELETE from region`)

      try {
        await api.post("/store/carts")
      } catch (error) {
        expect(error.response.status).toEqual(400)
        expect(error.response.data.message).toEqual(
          "A region is required to create a cart"
        )
      }
    })

    it("should create a cart with items", async () => {
      const yesterday = ((today) =>
        new Date(today.setDate(today.getDate() - 1)))(new Date())
      const tomorrow = ((today) =>
        new Date(today.setDate(today.getDate() + 1)))(new Date())

      const priceList1 = await dbConnection.manager.create(PriceList, {
        id: "pl_current",
        name: "Past winter sale",
        description: "Winter sale for key accounts.",
        type: "sale",
        status: "active",
        starts_at: yesterday,
        ends_at: tomorrow,
      })

      await dbConnection.manager.save(priceList1)

      const ma_sale_1 = dbConnection.manager.create(MoneyAmount, {
        variant_id: prodSale.variants[0].id,
        currency_code: "usd",
        amount: 800,
        price_list_id: "pl_current",
      })

      await dbConnection.manager.save(ma_sale_1)

      const api = getApi()

      const response = await api
        .post("/store/carts", {
          items: [
            {
              variant_id: prod1.variants[0].id,
              quantity: 1,
            },
            {
              variant_id: prodSale.variants[0].id,
              quantity: 2,
            },
          ],
        })

      response.data.cart.items.sort((a, b) => a.quantity - b.quantity)

      expect(response.status).toEqual(200)
      expect(response.data.cart.items).toHaveLength(2)
      expect(response.data.cart.items).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            variant_id: prod1.variants[0].id,
            quantity: 1,
          }),
          expect.objectContaining({
            variant_id: prodSale.variants[0].id,
            quantity: 2,
            unit_price: 800,
          }),
        ])
      )

      const getRes = await api.post(`/store/carts/${response.data.cart.id}`)
      expect(getRes.status).toEqual(200)
    })

    it("should create a cart with a customer", async () => { 
      const api = getApi()

      const authResponse = await api.post("/store/auth", {
        email: "john@doe.com",
        password: "test",
      })

      const [authCookie] = authResponse.headers["set-cookie"][0].split(";")

      const response = await api.post("/store/carts", {}, {
        headers: {
          Cookie: authCookie,
        },
      })
      
      expect(response.status).toEqual(200)
      expect(response.data.cart.customer_id).toEqual(authResponse.data.customer.id)        
      expect(response.data.cart.email).toEqual("john@doe.com")        
    })

    it("should create a cart with country given by country_code", async () => {
      const api = getApi()
      const response = await api.post("/store/carts", {
        country_code: "dk",
        region_id: 'region-1'
      })

      expect(response.status).toEqual(200)
      expect(response.data.cart.shipping_address.country_code).toEqual("dk")

      const getRes = await api.post(`/store/carts/${response.data.cart.id}`)
      expect(getRes.status).toEqual(200)
    })


    it("should create a cart with context", async () => {
      const api = getApi()

      const response = await api.post("/store/carts", {
        context: {
          test_id: "test",
        },
      })

      expect(response.status).toEqual(200)

      const getRes = await api.post(`/store/carts/${response.data.cart.id}`)
      expect(getRes.status).toEqual(200)

      const cart = getRes.data.cart
      expect(cart.context).toEqual({
        ip: expect.any(String),
        user_agent: expect.stringContaining("axios/0.21."),
        test_id: "test",
      })
    })
  })
})

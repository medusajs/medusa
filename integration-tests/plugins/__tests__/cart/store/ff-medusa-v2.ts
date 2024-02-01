import { Region } from "@medusajs/medusa"
import path from "path"
import { startBootstrapApp } from "../../../../environment-helpers/bootstrap-app"
import { useApi } from "../../../../environment-helpers/use-api"
import { initDb, useDb } from "../../../../environment-helpers/use-db"
import {
  simpleProductFactory,
  simpleSalesChannelFactory,
} from "../../../../factories"

jest.setTimeout(30000)

const env = {
  MEDUSA_FF_MEDUSA_V2: true,
}

describe.skip("/store/carts", () => {
  let dbConnection
  let shutdownServer

  const doAfterEach = async () => {
    const db = useDb()
    return await db.teardown()
  }

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", "..", ".."))
    dbConnection = await initDb({ cwd, env } as any)
    shutdownServer = await startBootstrapApp({ cwd, env })
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()
    await shutdownServer()
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

      await manager.query(
        `UPDATE "country"
         SET region_id='region'
         WHERE iso_2 = 'us'`
      )

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

      await simpleSalesChannelFactory(dbConnection, {
        id: "amazon-sc",
        name: "Amazon store",
      })
    })

    afterEach(async () => {
      await doAfterEach()
    })

    it("should create a cart in a sales channel", async () => {
      const api = useApi()

      const response = await api.post("/store/carts", {
        sales_channel_id: "amazon-sc",
      })

      expect(response.status).toEqual(200)

      const getRes = await api.get(`/store/carts/${response.data.cart.id}`)
      expect(getRes.status).toEqual(200)
      expect(getRes.data.cart.sales_channel.id).toEqual("amazon-sc")
    })
  })
})

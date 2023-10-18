import setupServer from "../../../../environment-helpers/setup-server"
import { useApi } from "../../../../environment-helpers/use-api"
import { getContainer } from "../../../../environment-helpers/use-container"
import { initDb, useDb } from "../../../../environment-helpers/use-db"
import { simpleProductFactory } from "../../../../factories"

import { MoneyAmount, Region } from "@medusajs/medusa"
import path from "path"
import adminSeeder from "../../../../helpers/admin-seeder"
import { createDefaultRuleTypes } from "../../../helpers/create-default-rule-types"

jest.setTimeout(5000)

const adminHeaders = {
  headers: {
    "x-medusa-access-token": "test_token",
  },
}

const env = {
  MEDUSA_FF_PRICING_INTEGRATION: true,
  MEDUSA_FF_ISOLATE_PRODUCT_DOMAIN: true,
}

describe("[Product & Pricing Module] POST /admin/products/:id/variants/:id", () => {
  let dbConnection
  let appContainer
  let medusaProcess
  let product
  let variant

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", "..", ".."))
    dbConnection = await initDb({ cwd, env } as any)
    medusaProcess = await setupServer({ cwd, env, verbose: true } as any)
    appContainer = getContainer()
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()
    medusaProcess.kill()
  })

  beforeEach(async () => {
    const manager = dbConnection.manager
    await adminSeeder(dbConnection)
    await createDefaultRuleTypes(appContainer)

    await manager.insert(Region, {
      id: "test-region",
      name: "Test Region",
      currency_code: "usd",
      tax_rate: 0,
    })

    await manager.insert(MoneyAmount, {
      id: "money-amount-test",
      currency_code: "usd",
      amount: 50000,
    })

    product = await simpleProductFactory(dbConnection, {
      id: "test-product-with-variant",
      variants: [
        {
          options: [{ option_id: "test-product-option-1", value: "test" }],
        },
      ],
      options: [
        {
          id: "test-product-option-1",
          title: "Test option 1",
        },
      ],
    })

    variant = product.variants[0]
  })

  afterEach(async () => {
    const db = useDb()
    await db.teardown()
  })

  it("should create prices with region_id and currency_code context", async () => {
    const api = useApi()
    const data = {
      title: "test variant update",
      prices: [
        {
          amount: 66600,
          region_id: "test-region",
          id: "boooyeah",
        },
        {
          amount: 55500,
          currency_code: "usd",
          region_id: null,
        },
      ],
    }
    console.log("variant.id - ", variant.id)
    let response = await api.post(
      `/admin/products/${product.id}/variants/${variant.id}`,
      data,
      adminHeaders
    )

    expect(response.status).toEqual(200)
    expect(response.data.product).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        variants: expect.arrayContaining([
          expect.objectContaining({
            id: variant.id,
            title: "test variant update",
            prices: expect.arrayContaining([
              expect.objectContaining({
                amount: 66600,
                currency_code: "usd",
              }),
              expect.objectContaining({
                amount: 55500,
                currency_code: "usd",
              }),
            ]),
          }),
        ]),
      })
    )
  })
})

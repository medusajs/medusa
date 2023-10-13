import path from "path"

import { Region } from "@medusajs/medusa"

import { bootstrapApp } from "../../../../environment-helpers/bootstrap-app"
import { setPort, useApi } from "../../../../environment-helpers/use-api"
import { initDb, useDb } from "../../../../environment-helpers/use-db"
import { createDefaultRuleTypes } from "../../../helpers/create-default-ruletypes"

import adminSeeder from "../../../../helpers/admin-seeder"

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

describe("[Product & Pricing Module] POST /admin/products", () => {
  let express
  let dbConnection
  let appContainer

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", "..", ".."))
    dbConnection = await initDb({ cwd, env } as any)

    const { container, app, port } = await bootstrapApp({ cwd, env })
    appContainer = container
    setPort(port)
    express = app.listen(port)
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()
    express.close()
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
  })

  afterEach(async () => {
    const db = useDb()
    await db.teardown()
  })

  it("should create prices with region_id and currency_code context", async () => {
    const api = useApi()
    const data = {
      title: "test product",
      options: [{ title: "test-option" }],
      variants: [
        {
          title: "test variant",
          prices: [
            {
              amount: 66600,
              region_id: "test-region",
            },
            {
              amount: 55500,
              currency_code: "usd",
            },
          ],
          options: [{ value: "test-option" }],
        },
      ],
    }

    let response = await api.post(
      "/admin/products?relations=variants.prices",
      data,
      adminHeaders
    )

    expect(response.status).toEqual(200)
    expect(response.data).toEqual({
      product: expect.objectContaining({
        id: expect.any(String),
        title: "test product",
        variants: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            title: "test variant",
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
      }),
    })

    response = await api.get(
      `/store/products/${response.data.product.id}?currency_code=usd&region_id=test-region`,
      data
    )

    expect(response.data.product).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        variants: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            title: "test variant",
            original_price: 66600,
            calculated_price: 66600,
          }),
        ]),
      })
    )

    response = await api.get(
      `/store/products/${response.data.product.id}?currency_code=usd`,
      data
    )

    expect(response.data.product).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        variants: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            title: "test variant",
            original_price: 55500,
            calculated_price: 55500,
          }),
        ]),
      })
    )
  })
})

import path from "path"

import {
  MoneyAmount,
  Product,
  ProductVariant,
  ProductVariantMoneyAmount,
  Region,
} from "@medusajs/medusa"

import setupServer from "../../../../environment-helpers/setup-server"
import { useApi } from "../../../../environment-helpers/use-api"
import { initDb, useDb } from "../../../../environment-helpers/use-db"

import adminSeeder from "../../../../helpers/admin-seeder"

import { simpleSalesChannelFactory } from "../../../../factories"

jest.setTimeout(3000)

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
  let medusaProcess
  let dbConnection

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", "..", ".."))
    dbConnection = await initDb({ cwd, env } as any)
    medusaProcess = await setupServer({
      cwd,
      env,
      verbose: false,
    } as any)
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()

    medusaProcess.kill()
  })

  beforeEach(async () => {
    const manager = dbConnection.manager
    await adminSeeder(dbConnection)
    await simpleSalesChannelFactory(dbConnection, {
      name: "Default channel",
      id: "default-channel",
      is_default: true,
    })

    await manager.insert(Product, {
      id: "test-product-x",
      handle: "test-product-x",
      title: "Test product",
      description: "test-product-x-description1",
    })

    await manager.insert(Region, {
      id: "test-region",
      name: "Test Region",
      currency_code: "usd",
      tax_rate: 0,
    })

    await manager.insert(ProductVariant, {
      id: "test-variant-x",
      inventory_quantity: 10,
      title: "Test variant",
      variant_rank: 0,
      sku: "test-sku",
      ean: "test-ean",
      upc: "test-upc",
      barcode: "test-barcode",
      product_id: "test-product-x",
      options: [
        {
          id: "test-variant-x-option",
          value: "Default variant",
          option_id: "test-option",
        },
      ],
    })

    await await manager.insert(MoneyAmount, {
      id: "test-price",
      currency_code: "usd",
      amount: 100,
    })

    await await manager.insert(ProductVariantMoneyAmount, {
      id: "pvma0",
      money_amount_id: "test-price",
      variant_id: "test-variant-x",
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

    const response = await api.post("/admin/products", data, adminHeaders)

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
  })
})

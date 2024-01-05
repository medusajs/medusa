import path from "path"

import { useApi } from "../../../../environment-helpers/use-api"
import { initDb, useDb } from "../../../../environment-helpers/use-db"

import { startBootstrapApp } from "../../../../environment-helpers/bootstrap-app"
import adminSeeder from "../../../../helpers/admin-seeder"
import { ISalesChannelModuleService } from "@medusajs/types"
import { getContainer } from "../../../../environment-helpers/use-container"
import { simpleProductFactory } from "../../../../factories"

jest.setTimeout(50000)

const adminHeaders = {
  headers: {
    "x-medusa-access-token": "test_token",
  },
}

const env = {
  MEDUSA_FF_MEDUSA_V2: true,
}

describe("POST /admin/sales-channels/:id/products/batch", () => {
  let dbConnection
  let appContainer
  let shutdownServer
  let product1
  let salesChannel
  let salesChannelModuleService: ISalesChannelModuleService

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", "..", ".."))
    dbConnection = await initDb({ cwd, env } as any)
    shutdownServer = await startBootstrapApp({ cwd, env })
    appContainer = getContainer()
    salesChannelModuleService = appContainer.resolve(
      "salesChannelModuleService"
    )
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()
    await shutdownServer()
  })

  beforeEach(async () => {
    await adminSeeder(dbConnection)

    product1 = await simpleProductFactory(dbConnection, {
      id: "test-product-1",
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
    ;[salesChannel] = await salesChannelModuleService.create([
      { name: "Test sales channel", description: "Desc", is_disabled: false },
    ])
  })

  afterEach(async () => {
    const db = useDb()
    await db.teardown()
  })

  it("should assign products to a sales channel", async () => {
    const api = useApi() as any

    const result = await api.post(
      `/admin/sales-channels/${salesChannel.id}/products/batch`,
      { product_ids: [{ id: product1.id }] },
      adminHeaders
    )

    expect(result.status).toEqual(200)

    const res = await api.get(`/admin/products/${product1.id}`, adminHeaders)

    expect(res.data.product.sales_channels).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: salesChannel.id,
        }),
      ])
    )
  })
})

describe("DELETE /admin/sales-channels/:id/products/batch", () => {
  let dbConnection
  let appContainer
  let shutdownServer
  let product1
  let salesChannel
  let salesChannelModuleService: ISalesChannelModuleService

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", "..", ".."))
    dbConnection = await initDb({ cwd, env } as any)
    shutdownServer = await startBootstrapApp({ cwd, env })
    appContainer = getContainer()
    salesChannelModuleService = appContainer.resolve(
      "salesChannelModuleService"
    )
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()
    await shutdownServer()
  })

  beforeEach(async () => {
    await adminSeeder(dbConnection)

    product1 = await simpleProductFactory(dbConnection, {
      id: "test-product-1",
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
    ;[salesChannel] = await salesChannelModuleService.create([
      { name: "Test sales channel", description: "Desc", is_disabled: false },
    ])

    await dbConnection.manager.query(
      `insert into "product_sales_channel" (id, product_id, sales_channel_id) values ('psc', '${product1.id}', '${salesChannel.id}');`
    )
  })

  afterEach(async () => {
    const db = useDb()
    await db.teardown()
  })

  it("should remove products from a sales channel", async () => {
    const api = useApi() as any

    let res = await api.get(`/admin/products/${product1.id}`, adminHeaders)

    expect(res.data.product.sales_channels).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: salesChannel.id,
        }),
      ])
    )

    const result = await api.delete(
      `/admin/sales-channels/${salesChannel.id}/products/batch`,
      { product_ids: [{ id: product1.id }] },
      adminHeaders
    )

    expect(result.status).toEqual(200)

    res = await api.get(`/admin/products/${product1.id}`, adminHeaders)

    expect(res.data.product.sales_channels).toEqual(
      expect.not.arrayContaining([
        expect.objectContaining({
          id: salesChannel.id,
        }),
      ])
    )
  })
})

import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import {
  ICartModuleService,
  IRegionModuleService,
  ISalesChannelModuleService,
} from "@medusajs/types"
import path from "path"
import { startBootstrapApp } from "../../../../environment-helpers/bootstrap-app"
import { useApi } from "../../../../environment-helpers/use-api"
import { getContainer } from "../../../../environment-helpers/use-container"
import { initDb, useDb } from "../../../../environment-helpers/use-db"
import adminSeeder from "../../../../helpers/admin-seeder"

jest.setTimeout(50000)

const env = { MEDUSA_FF_MEDUSA_V2: true }

describe("POST /store/carts", () => {
  let dbConnection
  let appContainer
  let shutdownServer
  let cartModuleService: ICartModuleService
  let regionModuleService: IRegionModuleService
  let scModuleService: ISalesChannelModuleService

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", "..", ".."))
    dbConnection = await initDb({ cwd, env } as any)
    shutdownServer = await startBootstrapApp({ cwd, env })
    appContainer = getContainer()
    cartModuleService = appContainer.resolve(ModuleRegistrationName.CART)
    regionModuleService = appContainer.resolve(ModuleRegistrationName.REGION)
    scModuleService = appContainer.resolve(ModuleRegistrationName.SALES_CHANNEL)
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()
    await shutdownServer()
  })

  beforeEach(async () => {
    await adminSeeder(dbConnection)

    // @ts-ignore
    await regionModuleService.createDefaultCountriesAndCurrencies()
  })

  afterEach(async () => {
    const db = useDb()
    await db.teardown()
  })

  it("should create and update a cart", async () => {
    const region = await regionModuleService.create({
      name: "US",
      currency_code: "usd",
    })

    const salesChannel = await scModuleService.create({
      name: "Webshop",
    })

    const api = useApi() as any

    const created = await api.post(`/store/carts`, {
      email: "tony@stark.com",
      currency_code: "usd",
      region_id: region.id,
      sales_channel_id: salesChannel.id,
    })

    expect(created.status).toEqual(200)
    expect(created.data.cart).toEqual(
      expect.objectContaining({
        id: created.data.cart.id,
        currency_code: "usd",
        email: "tony@stark.com",
        region: expect.objectContaining({
          id: region.id,
          currency_code: "usd",
        }),
        sales_channel_id: salesChannel.id,
      })
    )

    const updated = await api.post(`/store/carts/${created.data.cart.id}`, {
      email: "tony@stark-industries.com",
    })

    expect(updated.status).toEqual(200)
    expect(updated.data.cart).toEqual(
      expect.objectContaining({
        id: updated.data.cart.id,
        currency_code: "usd",
        email: "tony@stark-industries.com",
      })
    )
  })

  it("should create cart with any region", async () => {
    await regionModuleService.create({
      name: "US",
      currency_code: "usd",
    })

    const api = useApi() as any
    const response = await api.post(`/store/carts`, {
      email: "tony@stark.com",
      currency_code: "usd",
    })

    expect(response.status).toEqual(200)
    expect(response.data.cart).toEqual(
      expect.objectContaining({
        id: response.data.cart.id,
        currency_code: "usd",
        email: "tony@stark.com",
        region: expect.objectContaining({
          id: expect.any(String),
        }),
      })
    )
  })

  it("should create cart with region currency code", async () => {
    await regionModuleService.create({
      name: "US",
      currency_code: "usd",
    })

    const api = useApi() as any
    const response = await api.post(`/store/carts`, {
      email: "tony@stark.com",
    })

    expect(response.status).toEqual(200)
    expect(response.data.cart).toEqual(
      expect.objectContaining({
        id: response.data.cart.id,
        currency_code: "usd",
        email: "tony@stark.com",
        region: expect.objectContaining({
          id: expect.any(String),
        }),
      })
    )
  })

  it("should throw when no regions exist", async () => {
    const api = useApi() as any

    await expect(
      api.post(`/store/carts`, {
        email: "tony@stark.com",
        currency_code: "usd",
      })
    ).rejects.toThrow()
  })

  it("should get cart", async () => {
    const region = await regionModuleService.create({
      name: "US",
      currency_code: "usd",
    })

    const salesChannel = await scModuleService.create({
      name: "Webshop",
    })

    const cart = await cartModuleService.create({
      currency_code: "usd",
      items: [
        {
          unit_price: 1000,
          quantity: 1,
          title: "Test item",
        },
      ],
      region_id: region.id,
      sales_channel_id: salesChannel.id,
    })

    const api = useApi() as any
    const response = await api.get(`/store/carts/${cart.id}`)

    expect(response.status).toEqual(200)
    expect(response.data.cart).toEqual(
      expect.objectContaining({
        id: cart.id,
        currency_code: "usd",
        items: expect.arrayContaining([
          expect.objectContaining({
            unit_price: 1000,
            quantity: 1,
            title: "Test item",
          }),
        ]),
        region: expect.objectContaining({
          id: region.id,
          currency_code: "usd",
        }),
        sales_channel_id: salesChannel.id,
      })
    )
  })
})

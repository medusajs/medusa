import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { ICartModuleService, ISalesChannelModuleService } from "@medusajs/types"
import path from "path"
import { startBootstrapApp } from "../../../environment-helpers/bootstrap-app"
import { getContainer } from "../../../environment-helpers/use-container"
import { initDb, useDb } from "../../../environment-helpers/use-db"
import adminSeeder from "../../../helpers/admin-seeder"

jest.setTimeout(50000)

const env = { MEDUSA_FF_MEDUSA_V2: true }

describe("Link: Cart Sales Channel", () => {
  let dbConnection
  let appContainer
  let shutdownServer
  let cartModuleService: ICartModuleService
  let scModuleService: ISalesChannelModuleService
  let remoteQuery

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", ".."))
    dbConnection = await initDb({ cwd, env } as any)
    shutdownServer = await startBootstrapApp({ cwd, env })
    appContainer = getContainer()
    cartModuleService = appContainer.resolve(ModuleRegistrationName.CART)
    scModuleService = appContainer.resolve(ModuleRegistrationName.SALES_CHANNEL)
    remoteQuery = appContainer.resolve("remoteQuery")
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()
    await shutdownServer()
  })

  beforeEach(async () => {
    await adminSeeder(dbConnection)
  })

  afterEach(async () => {
    const db = useDb()
    await db.teardown()
  })

  it("should query carts and sales channels with remote query", async () => {
    const salesChannel = await scModuleService.create({
      name: "Webshop",
    })

    const cart = await cartModuleService.create({
      email: "tony@stark.com",
      currency_code: "usd",
      sales_channel_id: salesChannel.id,
    })

    const carts = await remoteQuery({
      cart: {
        fields: ["id"],
        sales_channel: {
          fields: ["id"],
        },
      },
    })

    const salesChannels = await remoteQuery({
      sales_channel: {
        fields: ["id"],
        carts: {
          fields: ["id"],
        },
      },
    })

    expect(carts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: cart.id,
          sales_channel: expect.objectContaining({ id: salesChannel.id }),
        }),
      ])
    )

    expect(salesChannels).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: salesChannel.id,
          carts: expect.arrayContaining([
            expect.objectContaining({ id: cart.id }),
          ]),
        }),
      ])
    )
  })
})

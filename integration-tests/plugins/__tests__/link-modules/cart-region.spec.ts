import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { ICartModuleService, IRegionModuleService } from "@medusajs/types"
import path from "path"
import { startBootstrapApp } from "../../../environment-helpers/bootstrap-app"
import { getContainer } from "../../../environment-helpers/use-container"
import { initDb, useDb } from "../../../environment-helpers/use-db"

jest.setTimeout(50000)

const env = { MEDUSA_FF_MEDUSA_V2: true }

describe("Link: Cart Region", () => {
  let dbConnection
  let appContainer
  let shutdownServer
  let cartModuleService: ICartModuleService
  let regionModule: IRegionModuleService
  let remoteQuery

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", ".."))
    dbConnection = await initDb({ cwd, env } as any)
    shutdownServer = await startBootstrapApp({ cwd, env })
    appContainer = getContainer()
    cartModuleService = appContainer.resolve(ModuleRegistrationName.CART)
    regionModule = appContainer.resolve(ModuleRegistrationName.REGION)
    remoteQuery = appContainer.resolve("remoteQuery")
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()
    await shutdownServer()
  })

  beforeEach(async () => {
    // @ts-ignore
    await regionModule.createDefaultCountriesAndCurrencies()
  })

  afterEach(async () => {
    const db = useDb()
    await db.teardown()
  })

  it("should query carts and regions with remote query", async () => {
    const region = await regionModule.create({
      name: "Region",
      currency_code: "usd",
    })

    const cart = await cartModuleService.create({
      email: "tony@stark.com",
      currency_code: "usd",
      region_id: region.id,
    })

    const carts = await remoteQuery({
      cart: {
        fields: ["id"],
        region: {
          fields: ["id"],
        },
      },
    })

    const regions = await remoteQuery({
      region: {
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
          region: expect.objectContaining({ id: region.id }),
        }),
      ])
    )

    expect(regions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: region.id,
          carts: expect.arrayContaining([
            expect.objectContaining({ id: cart.id }),
          ]),
        }),
      ])
    )
  })
})

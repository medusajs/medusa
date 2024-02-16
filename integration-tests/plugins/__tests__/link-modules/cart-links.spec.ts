import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import {
  ICartModuleService,
  ICustomerModuleService,
  IRegionModuleService,
} from "@medusajs/types"
import path from "path"
import { startBootstrapApp } from "../../../environment-helpers/bootstrap-app"
import { getContainer } from "../../../environment-helpers/use-container"
import { initDb, useDb } from "../../../environment-helpers/use-db"

jest.setTimeout(50000)

const env = { MEDUSA_FF_MEDUSA_V2: true }

describe("Cart Links", () => {
  let dbConnection
  let appContainer
  let shutdownServer
  let cartModuleService: ICartModuleService
  let regionModule: IRegionModuleService
  let customerModule: ICustomerModuleService
  let remoteQuery

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", ".."))
    dbConnection = await initDb({ cwd, env } as any)
    shutdownServer = await startBootstrapApp({ cwd, env })
    appContainer = getContainer()
    cartModuleService = appContainer.resolve(ModuleRegistrationName.CART)
    regionModule = appContainer.resolve(ModuleRegistrationName.REGION)
    customerModule = appContainer.resolve(ModuleRegistrationName.CUSTOMER)
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

    const customer = await customerModule.create({
      email: "tony@stark.com",
    })

    const cart = await cartModuleService.create({
      currency_code: "usd",
      region_id: region.id,
      customer_id: customer.id,
    })

    const carts = await remoteQuery({
      cart: {
        fields: ["id"],
        region: {
          fields: ["id"],
        },
        customer: {
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

    const customers = await remoteQuery({
      customer: {
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
          customer: expect.objectContaining({ id: customer.id }),
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

    expect(customers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: customer.id,
          carts: expect.arrayContaining([
            expect.objectContaining({ id: cart.id }),
          ]),
        }),
      ])
    )
  })
})

import { ModuleRegistrationName, Modules } from "@medusajs/modules-sdk"
import { IPaymentModuleService, IRegionModuleService } from "@medusajs/types"
import path from "path"
import { startBootstrapApp } from "../../../environment-helpers/bootstrap-app"
import { getContainer } from "../../../environment-helpers/use-container"
import { initDb, useDb } from "../../../environment-helpers/use-db"

jest.setTimeout(50000)

const env = { MEDUSA_FF_MEDUSA_V2: true }

describe("Region and Payment Providers", () => {
  let dbConnection
  let appContainer
  let shutdownServer
  let regionModule: IRegionModuleService
  let paymentModule: IPaymentModuleService
  let remoteQuery
  let remoteLink

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", ".."))
    dbConnection = await initDb({ cwd, env } as any)
    shutdownServer = await startBootstrapApp({ cwd, env })
    appContainer = getContainer()
    regionModule = appContainer.resolve(ModuleRegistrationName.REGION)
    paymentModule = appContainer.resolve(ModuleRegistrationName.PAYMENT)
    remoteQuery = appContainer.resolve("remoteQuery")
    remoteLink = appContainer.resolve("remoteLink")
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()
    await shutdownServer()
  })

  afterEach(async () => {
    const db = useDb()
    await db.teardown()
  })

  it("should query region and payment provider link with remote query", async () => {
    const region = await regionModule.create({
      name: "North America",
      currency_code: "usd",
    })

    await remoteLink.create([
      {
        [Modules.REGION]: {
          region_id: region.id,
        },
        [Modules.PAYMENT]: {
          payment_provider_id: "pp_system_default",
        },
      },
    ])

    const links = await remoteQuery({
      region: {
        fields: ["id"],
        payment_providers: {
          fields: ["id"],
        },
      },
    })

    const otherLink = await remoteQuery({
      payment_providers: {
        fields: ["id"],
        regions: {
          fields: ["id"],
        },
      },
    })

    expect(links).toHaveLength(1)
    expect(links).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: region.id,
          payment_providers: expect.arrayContaining([
            expect.objectContaining({
              id: "pp_system_default",
            }),
          ]),
        }),
      ])
    )

    expect(otherLink).toHaveLength(1)
    expect(otherLink).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "pp_system_default",
          regions: expect.arrayContaining([
            expect.objectContaining({
              id: region.id,
            }),
          ]),
        }),
      ])
    )
  })
})

import { ModuleRegistrationName, Modules } from "@medusajs/modules-sdk"
import { IRegionModuleService } from "@medusajs/types"
import path from "path"
import { startBootstrapApp } from "../../../environment-helpers/bootstrap-app"
import { useApi } from "../../../environment-helpers/use-api"
import { getContainer } from "../../../environment-helpers/use-container"
import { initDb, useDb } from "../../../environment-helpers/use-db"

jest.setTimeout(50000)

const env = { MEDUSA_FF_MEDUSA_V2: true }

describe("Payments", () => {
  let dbConnection
  let appContainer
  let shutdownServer
  let regionService: IRegionModuleService
  let remoteLink

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", ".."))
    dbConnection = await initDb({ cwd, env } as any)
    shutdownServer = await startBootstrapApp({ cwd, env })
    appContainer = getContainer()
    regionService = appContainer.resolve(ModuleRegistrationName.REGION)
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

  it("should list payment providers", async () => {
    const region = await regionService.create({
      name: "Test Region",
      currency_code: "usd",
    })

    const api = useApi() as any
    let response = await api.get(
      `/store/regions/${region.id}/payment-providers`
    )

    expect(response.status).toEqual(200)
    expect(response.data.payment_providers).toEqual([])

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

    response = await api.get(`/store/regions/${region.id}/payment-providers`)

    expect(response.status).toEqual(200)
    expect(response.data.payment_providers).toEqual([
      expect.objectContaining({
        id: "pp_system_default",
      }),
    ])
  })
})

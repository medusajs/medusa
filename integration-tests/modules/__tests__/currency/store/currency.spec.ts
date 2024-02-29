import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { ICurrencyModuleService } from "@medusajs/types"
import path from "path"
import { startBootstrapApp } from "../../../../environment-helpers/bootstrap-app"
import { useApi } from "../../../../environment-helpers/use-api"
import { getContainer } from "../../../../environment-helpers/use-container"
import { initDb, useDb } from "../../../../environment-helpers/use-db"
import { DataSource } from "typeorm"

jest.setTimeout(50000)

const env = { MEDUSA_FF_MEDUSA_V2: true }
const storeHeaders = {
  headers: {},
}

describe("Currency - Store", () => {
  let dbConnection: DataSource
  let appContainer
  let shutdownServer
  let service: ICurrencyModuleService

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", "..", ".."))
    dbConnection = await initDb({ cwd, env } as any)
    shutdownServer = await startBootstrapApp({ cwd, env })
    appContainer = getContainer()
    service = appContainer.resolve(ModuleRegistrationName.CURRENCY)
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

  it("should correctly retrieve and list currencies", async () => {
    const api = useApi() as any
    const listResp = await api.get("/store/currencies", storeHeaders)

    expect(listResp.data.currencies).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: "aud",
        }),
        expect.objectContaining({
          code: "cad",
        }),
      ])
    )

    const retrieveResp = await api.get(`/store/currencies/aud`, storeHeaders)
    expect(retrieveResp.data.currency).toEqual(
      listResp.data.currencies.find((c) => c.code === "aud")
    )
  })
})

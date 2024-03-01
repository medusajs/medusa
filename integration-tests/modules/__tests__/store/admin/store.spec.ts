import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IStoreModuleService } from "@medusajs/types"
import path from "path"
import { startBootstrapApp } from "../../../../environment-helpers/bootstrap-app"
import { useApi } from "../../../../environment-helpers/use-api"
import { getContainer } from "../../../../environment-helpers/use-container"
import { initDb, useDb } from "../../../../environment-helpers/use-db"
import { DataSource } from "typeorm"
import { createAdminUser } from "../../../helpers/create-admin-user"

jest.setTimeout(50000)

const env = { MEDUSA_FF_MEDUSA_V2: true }
const adminHeaders = {
  headers: { "x-medusa-access-token": "test_token" },
}

describe("Store - Admin", () => {
  let dbConnection: DataSource
  let appContainer
  let shutdownServer
  let service: IStoreModuleService

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", "..", ".."))
    dbConnection = await initDb({ cwd, env } as any)
    shutdownServer = await startBootstrapApp({ cwd, env })
    appContainer = getContainer()
    service = appContainer.resolve(ModuleRegistrationName.STORE)
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()
    await shutdownServer()
  })

  beforeEach(async () => {
    await createAdminUser(dbConnection, adminHeaders)
  })

  afterEach(async () => {
    const db = useDb()
    await db.teardown()
  })

  it("should correctly implement the entire lifecycle of a store", async () => {
    const api = useApi() as any
    const createdStore = await service.create({ name: "Test store" })

    expect(createdStore).toEqual(
      expect.objectContaining({
        id: createdStore.id,
        name: "Test store",
      })
    )

    const updated = await api.post(
      `/admin/stores/${createdStore.id}`,
      {
        name: "Updated store",
      },
      adminHeaders
    )

    expect(updated.status).toEqual(200)
    expect(updated.data.store).toEqual(
      expect.objectContaining({
        id: createdStore.id,
        name: "Updated store",
      })
    )

    await service.delete(createdStore.id)
    const listedStores = await api.get(`/admin/stores`, adminHeaders)
    expect(listedStores.data.stores).toHaveLength(0)
  })
})

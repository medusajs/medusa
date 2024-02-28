import path from "path"
import { ITaxModuleService } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"

import { createAdminUser } from "../../../helpers/create-admin-user"
import { initDb, useDb } from "../../../../environment-helpers/use-db"
import { getContainer } from "../../../../environment-helpers/use-container"
import { startBootstrapApp } from "../../../../environment-helpers/bootstrap-app"
import { useApi } from "../../../../environment-helpers/use-api"

jest.setTimeout(50000)

const env = { MEDUSA_FF_MEDUSA_V2: true }
const adminHeaders = {
  headers: { "x-medusa-access-token": "test_token" },
}

describe("Taxes - Admin", () => {
  let dbConnection
  let appContainer
  let shutdownServer
  let service: ITaxModuleService

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", "..", ".."))
    dbConnection = await initDb({ cwd, env } as any)
    shutdownServer = await startBootstrapApp({ cwd, env })
    appContainer = getContainer()
    service = appContainer.resolve(ModuleRegistrationName.TAX)
  })

  beforeEach(async () => {
    await createAdminUser(dbConnection, adminHeaders)
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

  it("can retrieve a tax rate", async () => {
    const region = await service.createTaxRegions({
      country_code: "us",
    })
    const rate = await service.create({
      tax_region_id: region.id,
      code: "test",
      rate: 2.5,
      name: "Test Rate",
    })

    const api = useApi() as any
    const response = await api.get(`/admin/tax-rates/${rate.id}`, adminHeaders)

    expect(response.status).toEqual(200)
    expect(response.data).toEqual({
      tax_rate: {
        id: rate.id,
        code: "test",
        rate: 2.5,
        name: "Test Rate",
        metadata: null,
        tax_region_id: region.id,
        is_default: false,
        is_combinable: false,
        created_at: expect.any(String),
        updated_at: expect.any(String),
        deleted_at: null,
        created_by: null,
      },
    })
  })

  it("can create a tax region with rates and rules", async () => {
    const api = useApi() as any
    const regionRes = await api.post(
      `/admin/tax-regions`,
      {
        country_code: "us",
        default_tax_rate: {
          code: "default",
          rate: 2,
          name: "default rate",
        },
      },
      adminHeaders
    )

    const usRegionId = regionRes.data.tax_region.id

    expect(regionRes.status).toEqual(200)
    expect(regionRes.data).toEqual({
      tax_region: {
        id: expect.any(String),
        country_code: "us",
        parent_id: null,
        province_code: null,
        created_at: expect.any(String),
        updated_at: expect.any(String),
        deleted_at: null,
        created_by: "admin_user",
        provider_id: null,
        metadata: null,
      },
    })

    const rateRes = await api.post(
      `/admin/tax-rates`,
      {
        tax_region_id: usRegionId,
        code: "RATE2",
        name: "another rate",
        rate: 10,
        rules: [{ reference: "product", reference_id: "prod_1234" }],
      },
      adminHeaders
    )

    expect(rateRes.status).toEqual(200)
    expect(rateRes.data).toEqual({
      tax_rate: {
        id: expect.any(String),
        code: "RATE2",
        rate: 10,
        name: "another rate",
        is_default: false,
        metadata: null,
        tax_region_id: usRegionId,
        created_at: expect.any(String),
        updated_at: expect.any(String),
        deleted_at: null,
        created_by: "admin_user",
        is_combinable: false,
      },
    })

    const provRegRes = await api.post(
      `/admin/tax-regions`,
      {
        country_code: "US",
        parent_id: usRegionId,
        province_code: "cA",
      },
      adminHeaders
    )

    expect(provRegRes.status).toEqual(200)
    expect(provRegRes.data).toEqual({
      tax_region: {
        id: expect.any(String),
        country_code: "us",
        parent_id: usRegionId,
        province_code: "ca",
        created_at: expect.any(String),
        updated_at: expect.any(String),
        deleted_at: null,
        created_by: "admin_user",
        metadata: null,
        provider_id: null,
      },
    })

    const defRes = await api.post(
      `/admin/tax-rates`,
      {
        tax_region_id: provRegRes.data.tax_region.id,
        code: "DEFAULT",
        name: "DEFAULT",
        rate: 10,
        is_default: true,
      },
      adminHeaders
    )

    const listRes = await api.get(`/admin/tax-rates`, adminHeaders)

    expect(listRes.status).toEqual(200)
    expect(listRes.data.tax_rates).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: rateRes.data.tax_rate.id,
          code: "RATE2",
          rate: 10,
          name: "another rate",
          is_default: false,
          metadata: null,
          tax_region_id: usRegionId,
          created_at: expect.any(String),
          updated_at: expect.any(String),
          deleted_at: null,
          created_by: "admin_user",
        }),
        expect.objectContaining({ id: defRes.data.tax_rate.id }),
        expect.objectContaining({
          tax_region_id: usRegionId,
          is_default: true,
          rate: 2,
        }),
      ])
    )
  })
})

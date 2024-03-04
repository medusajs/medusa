import path from "path"
import { ITaxModuleService } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"

import { createAdminUser } from "../../../helpers/create-admin-user"
import { initDb, useDb } from "../../../../environment-helpers/use-db"
import { getContainer } from "../../../../environment-helpers/use-container"
import { startBootstrapApp } from "../../../../environment-helpers/bootstrap-app"
import { useApi } from "../../../../environment-helpers/use-api"
import {
  createTaxRateRulesStepId,
  maybeSetTaxRateRulesStepId,
  updateTaxRatesStepId,
  updateTaxRatesWorkflow,
} from "@medusajs/core-flows"

jest.setTimeout(50000)

const env = { MEDUSA_FF_MEDUSA_V2: true }
const adminHeaders = {
  headers: { "x-medusa-access-token": "test_token" },
}

describe("Taxes - Workflow", () => {
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

  it("compensates rules correctly", async () => {
    const taxRegion = await service.createTaxRegions({
      country_code: "us",
    })

    const [rateOne, rateTwo] = await service.create([
      {
        tax_region_id: taxRegion.id,
        rate: 10,
        code: "standard",
        name: "Standard",
        rules: [
          { reference: "shipping", reference_id: "shipping_12354" },
          { reference: "shipping", reference_id: "shipping_11111" },
          { reference: "shipping", reference_id: "shipping_22222" },
        ],
      },
      {
        tax_region_id: taxRegion.id,
        rate: 2,
        code: "reduced",
        name: "Reduced",
        rules: [
          { reference: "product", reference_id: "product_12354" },
          { reference: "product", reference_id: "product_11111" },
          { reference: "product", reference_id: "product_22222" },
        ],
      },
    ])

    const workflow = updateTaxRatesWorkflow(appContainer)

    workflow.appendAction("throw", createTaxRateRulesStepId, {
      invoke: async function failStep() {
        throw new Error(`Failed to update`)
      },
    })

    await workflow.run({
      input: {
        selector: { tax_region_id: taxRegion.id },
        update: {
          rate: 2,
          rules: [
            { reference: "product", reference_id: "product_12354" },
            { reference: "shipping", reference_id: "shipping_12354" },
          ],
        },
      },
      throwOnError: false,
    })

    const taxRateRules = await service.listTaxRateRules({
      tax_rate: { tax_region_id: taxRegion.id },
    })

    expect(taxRateRules.length).toEqual(6)
    expect(taxRateRules).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          tax_rate_id: rateOne.id,
          reference_id: "shipping_12354",
        }),
        expect.objectContaining({
          tax_rate_id: rateOne.id,
          reference_id: "shipping_11111",
        }),
        expect.objectContaining({
          tax_rate_id: rateOne.id,
          reference_id: "shipping_22222",
        }),
        expect.objectContaining({
          tax_rate_id: rateTwo.id,
          reference_id: "product_12354",
        }),
        expect.objectContaining({
          tax_rate_id: rateTwo.id,
          reference_id: "product_11111",
        }),
        expect.objectContaining({
          tax_rate_id: rateTwo.id,
          reference_id: "product_22222",
        }),
      ])
    )
  })

  it("creates rules correctly", async () => {
    const taxRegion = await service.createTaxRegions({
      country_code: "us",
    })

    const [rateOne, rateTwo] = await service.create([
      {
        tax_region_id: taxRegion.id,
        rate: 10,
        code: "standard",
        name: "Standard",
        rules: [
          { reference: "shipping", reference_id: "shipping_12354" },
          { reference: "shipping", reference_id: "shipping_11111" },
          { reference: "shipping", reference_id: "shipping_22222" },
        ],
      },
      {
        tax_region_id: taxRegion.id,
        rate: 2,
        code: "reduced",
        name: "Reduced",
        rules: [
          { reference: "product", reference_id: "product_12354" },
          { reference: "product", reference_id: "product_11111" },
          { reference: "product", reference_id: "product_22222" },
        ],
      },
    ])

    await updateTaxRatesWorkflow(appContainer).run({
      input: {
        selector: { tax_region_id: taxRegion.id },
        update: {
          rate: 2,
          rules: [
            { reference: "product", reference_id: "product_12354" },
            { reference: "shipping", reference_id: "shipping_12354" },
          ],
        },
      },
    })

    const taxRateRules = await service.listTaxRateRules({
      tax_rate: { tax_region_id: taxRegion.id },
    })

    expect(taxRateRules.length).toEqual(4)
    expect(taxRateRules).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          tax_rate_id: rateOne.id,
          reference_id: "shipping_12354",
        }),
        expect.objectContaining({
          tax_rate_id: rateTwo.id,
          reference_id: "shipping_12354",
        }),
        expect.objectContaining({
          tax_rate_id: rateOne.id,
          reference_id: "product_12354",
        }),
        expect.objectContaining({
          tax_rate_id: rateTwo.id,
          reference_id: "product_12354",
        }),
      ])
    )
  })
})

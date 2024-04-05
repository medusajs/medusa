import {
  CreateInventoryItemActions,
  createInventoryItems,
} from "@medusajs/core-flows"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IInventoryService, WorkflowTypes } from "@medusajs/types"

import { pipe } from "@medusajs/workflows-sdk"
import path from "path"
import { startBootstrapApp } from "../../../../environment-helpers/bootstrap-app"
import { getContainer } from "../../../../environment-helpers/use-container"
import { initDb, useDb } from "../../../../environment-helpers/use-db"

jest.setTimeout(30000)

describe("CreateInventoryItem workflow", function () {
  let medusaContainer
  let shutdownServer

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", "..", ".."))
    await initDb({ cwd })
    shutdownServer = await startBootstrapApp({ cwd, skipExpressListen: true })
    medusaContainer = getContainer()
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()
    await shutdownServer()
  })

  it("should compensate all the invoke if something fails", async () => {
    const workflow = createInventoryItems(medusaContainer)

    workflow.appendAction(
      "fail_step",
      CreateInventoryItemActions.createInventoryItems,
      {
        invoke: pipe({}, async function failStep() {
          throw new Error(`Failed`)
        }),
      },
      {
        noCompensation: true,
      }
    )

    const input: WorkflowTypes.InventoryWorkflow.CreateInventoryItemsWorkflowInputDTO =
      {
        inventoryItems: [
          {
            sku: "TABLE_LEG",
            description: "Table Leg",
          },
        ],
      }

    const { result, errors, transaction } = await workflow.run({
      input,
      context: {},
      throwOnError: false,
    })

    expect(errors).toEqual([
      {
        action: "fail_step",
        handlerType: "invoke",
        error: expect.objectContaining({ message: `Failed` }),
      },
    ])

    expect(transaction.getState()).toEqual("reverted")

    expect(result).toHaveLength(1)
    expect(result[0].inventoryItem).toEqual(
      expect.objectContaining({ id: expect.any(String) })
    )

    const inventoryService: IInventoryService = medusaContainer.resolve(
      ModuleRegistrationName.INVENTORY
    )

    const [inventoryItems] = await inventoryService.listInventoryItems(
      { id: result[0].inventoryItem.id },
      { withDeleted: true }
    )

    expect(inventoryItems[0]).toEqual(
      expect.objectContaining({
        id: result[0].inventoryItem.id,
        deleted_at: expect.any(Date),
      })
    )
  })
})

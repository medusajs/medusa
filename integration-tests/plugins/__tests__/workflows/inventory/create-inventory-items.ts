import path from "path"
import { initDb, useDb } from "../../../../environment-helpers/use-db"
import { bootstrapApp } from "../../../../environment-helpers/bootstrap-app"
import {
  createInventoryItems,
  CreateInventoryItemActions,
  pipe,
} from "@medusajs/workflows"
import { IInventoryService, WorkflowTypes } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"

describe("CreateInventoryItem workflow", function () {
  let medusaProcess
  let medusaContainer

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", "..", ".."))
    await initDb({ cwd } as any)
    const { container } = await bootstrapApp({ cwd })
    medusaContainer = container
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()

    medusaProcess.kill()
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
        error: new Error(`Failed`),
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

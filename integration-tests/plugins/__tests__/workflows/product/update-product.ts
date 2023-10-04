import {
  Handlers,
  pipe,
  updateProducts,
  UpdateProductsActions,
} from "@medusajs/workflows"
import { WorkflowTypes } from "@medusajs/types"
import path from "path"

import { initDb, useDb } from "../../../../environment-helpers/use-db"
import { bootstrapApp } from "../../../../environment-helpers/bootstrap-app"
import { simpleProductFactory } from "../../../../factories"

describe("UpdateProduct workflow", function () {
  let medusaProcess
  let dbConnection
  let medusaContainer

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", "..", ".."))
    dbConnection = await initDb({ cwd } as any)
    const { container } = await bootstrapApp({ cwd })
    medusaContainer = container
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()

    medusaProcess.kill()
  })

  beforeEach(async () => {
    await simpleProductFactory(dbConnection, {
      title: "Original title",
      id: "to-update",
      variants: [{ id: "original-variant" }],
    })
  })

  it("should compensate all the invoke if something fails", async () => {
    const workflow = updateProducts(medusaContainer)

    workflow.appendAction(
      "fail_step",
      UpdateProductsActions.removeInventoryItems,
      {
        invoke: pipe({}, async function failStep() {
          throw new Error(`Failed to update products`)
        }),
      },
      {
        noCompensation: true,
      }
    )

    const input: WorkflowTypes.ProductWorkflow.UpdateProductsWorkflowInputDTO =
      {
        products: [
          {
            id: "to-update",
            title: "Updated title",
            variants: [
              {
                title: "Should be deleted with revert variant",
              },
            ],
          },
        ],
      }

    const manager = medusaContainer.resolve("manager")
    const context = {
      manager,
    }

    const { errors, transaction } = await workflow.run({
      input,
      context,
      throwOnError: false,
    })

    expect(errors).toEqual([
      {
        action: "fail_step",
        handlerType: "invoke",
        error: new Error(`Failed to update products`),
      },
    ])

    expect(transaction.getState()).toEqual("reverted")

    let [product] = await Handlers.ProductHandlers.listProducts({
      container: medusaContainer,
      context,
      data: {
        ids: ["to-update"],
        config: { listConfig: { relations: ["variants"] } },
      },
    } as any)

    expect(product).toEqual(
      expect.objectContaining({
        title: "Original title",
        id: "to-update",
        variants: [expect.objectContaining({ id: "original-variant" })],
      })
    )
  })
})

import {
  Handlers,
  updateProducts,
  UpdateProductsActions,
} from "@medusajs/core-flows"
import { WorkflowTypes } from "@medusajs/types"
import { pipe } from "@medusajs/workflows-sdk"
import path from "path"

import { startBootstrapApp } from "../../../../environment-helpers/bootstrap-app"
import { getContainer } from "../../../../environment-helpers/use-container"
import { initDb, useDb } from "../../../../environment-helpers/use-db"
import { simpleProductFactory } from "../../../../factories"

jest.setTimeout(100000)

describe.skip("UpdateProduct workflow", function () {
  let dbConnection
  let medusaContainer
  let shutdownServer

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", "..", ".."))
    dbConnection = await initDb({ cwd })
    shutdownServer = await startBootstrapApp({ cwd, skipExpressListen: true })
    medusaContainer = getContainer()
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()
    await shutdownServer()
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
        error: expect.objectContaining({
          message: `Failed to update products`,
        }),
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

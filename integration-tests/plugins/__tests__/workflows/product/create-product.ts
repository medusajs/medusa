import path from "path"
import { initDb, useDb } from "../../../../environment-helpers/use-db"
import { bootstrapApp } from "../../../../environment-helpers/bootstrap-app"
import { Actions, createProducts, InputAlias, pipe } from "@medusajs/workflows"
import { WorkflowTypes } from "@medusajs/types"
import {
  defaultAdminProductFields,
  defaultAdminProductRelations,
} from "@medusajs/medusa/dist"
import { listProducts } from "@medusajs/workflows/dist/handlers/product"

describe("CreateProduct workflow", function () {
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
    const workflow = createProducts(medusaContainer)

    workflow.appendAction(
      "fail_step",
      Actions.result,
      {
        invoke: pipe(
          {
            inputAlias: InputAlias.ProductsInputData,
            invoke: {
              from: InputAlias.ProductsInputData,
            },
          },
          async function failStep() {
            throw new Error(`Failed to create products`)
          }
        ),
      },
      {
        noCompensation: true,
      }
    )

    const input: WorkflowTypes.ProductWorkflow.CreateProductsWorkflowInputDTO =
      {
        products: [
          {
            title: "Test product",
            type: { value: "physical" },
            tags: [{ value: "test" }],
            subtitle: "Test subtitle",
            variants: [
              {
                title: "Test variant",
                prices: [
                  {
                    amount: 100,
                    currency_code: "usd",
                  },
                ],
              },
            ],
            options: [
              {
                title: "Test option",
              },
            ],
          },
        ],
        config: {
          listConfig: {
            select: defaultAdminProductFields,
            relations: defaultAdminProductRelations,
          },
        },
      }

    const manager = medusaContainer.resolve("manager")
    const context = {
      manager,
    }
    const { result, errors, transaction } = await workflow.run({
      input,
      context,
      throwOnError: false,
    })

    expect(errors).toEqual([
      {
        action: "fail_step",
        handlerType: "invoke",
        error: new Error(`Failed to create products`),
      },
    ])

    expect(transaction.getState()).toEqual("reverted")

    const steps = transaction.getFlow().steps
    for (const stepKey of Object.keys(steps)) {
      const step = transaction.getFlow().steps[stepKey]
      if (step.id === "_root") {
        continue
      }

      if (step.definition.action === "fail_step") {
        expect(step.invoke.state).toEqual("failed")
        expect(step.compensate.state).toEqual("reverted")
        continue
      }

      expect(step.invoke.state).toEqual("done")
      expect(step.compensate.state).toEqual("reverted")
    }

    const productId = result[0].id
    const [product] = await listProducts({
      container: medusaContainer,
      context,
      data: {
        ids: [productId],
      },
    } as any)

    expect(product).toBeUndefined()
  })
})

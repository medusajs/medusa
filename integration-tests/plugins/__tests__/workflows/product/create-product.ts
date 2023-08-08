import path from "path"
import { initDb, useDb } from "../../../../environment-helpers/use-db"
import { bootstrapApp } from "../../../../environment-helpers/bootstrap-app"
import { Actions, createProducts, InputAlias, pipe } from "@medusajs/workflows"
import { WorkflowTypes } from "@medusajs/types"
import {
  defaultAdminProductFields,
  defaultAdminProductRelations,
} from "@medusajs/medusa/dist"

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
          async function failStep({ data }) {
            throw new Error(
              `Failed to create products with title: ${data.products
                .map((p) => p.title)
                .join(",")}`
            )
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
    const { result, errors, transaction } = await workflow.run({
      input,
      context: {
        manager,
      },
      throwOnError: false,
    })

    expect(errors).toEqual([
      {
        action: "fail_step",
        handlerType: "invoke",
        error: new Error(
          `Failed to create products with title: ${input.products[0].title}`
        ),
      },
    ])

    expect(transaction.getState()).toEqual("reverted")

    for (const step of transaction.getFlow().steps) {
      if (step.definition.action === "fail_step") {
        expect(step.invoke.state).toEqual("failed")
        expect(step.compensate.state).toEqual("reverted")
        continue
      }

      expect(step.invoke.state).toEqual("done")
      expect(step.compensate.state).toEqual("reverted")
    }
  })
})

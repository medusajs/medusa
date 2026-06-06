import { MedusaContainer } from "@zjedene-medusa/framework"
import { asFunction, createContainer } from "@zjedene-medusa/framework/awilix"
import { ContainerRegistrationKeys } from "@zjedene-medusa/framework/utils"
import { createWorkflow, WorkflowResponse } from "@zjedene-medusa/workflows-sdk"
import { expectTypeOf } from "expect-type"
import { FixtureEntryPoints } from "../__fixtures__/remote-query"
import { useQueryGraphStep } from "../use-query-graph"

describe("useQueryGraphStep", () => {
  let container!: MedusaContainer

  beforeAll(() => {
    container = createContainer() as unknown as MedusaContainer
    container.register(
      ContainerRegistrationKeys.QUERY,
      asFunction(() => {
        return {
          graph: () => Promise.resolve({ data: [] }),
        } as any
      })
    )
  })

  it("should return a single data item when is_list is false", async () => {
    const workflow = createWorkflow("useQueryGraphStepTest1", (_: any) => {
      const result = useQueryGraphStep({
        entity: "simple_product",
        fields: ["*"],
        filters: {
          id: "123",
          variants: {
            id: "123",
          },
        },
        options: {
          isList: false,
        },
      })

      return new WorkflowResponse(result)
    })

    const result = await workflow(container).run()

    type Result = (typeof result)["result"]

    expectTypeOf<Result["data"]>().toEqualTypeOf<
      FixtureEntryPoints["simple_product"]
    >()
  })

  it("should return a list of data items when is_list is true", async () => {
    const workflow = createWorkflow("useQueryGraphStepTest1", (_: any) => {
      const result = useQueryGraphStep({
        entity: "simple_product",
        fields: ["*"],
        filters: {
          id: "123",
        },
        options: {
          isList: true,
        },
      })

      return new WorkflowResponse(result)
    })

    const result = await workflow(container).run()

    type Result = (typeof result)["result"]

    expectTypeOf<Result["data"]>().toEqualTypeOf<
      FixtureEntryPoints["simple_product"][]
    >()
  })

  it("should return a list of data items when is_list is not specified", async () => {
    const workflow = createWorkflow("useQueryGraphStepTest1", (_: any) => {
      const result = useQueryGraphStep({
        entity: "simple_product",
        fields: ["*"],
        filters: {
          id: "123",
        },
      })

      return new WorkflowResponse(result)
    })

    const result = await workflow(container).run()

    type Result = (typeof result)["result"]

    expectTypeOf<Result["data"]>().toEqualTypeOf<
      FixtureEntryPoints["simple_product"][]
    >()
  })
})

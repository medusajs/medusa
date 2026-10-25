import { MedusaContainer } from "@medusajs/framework"
import { asFunction, createContainer } from "@medusajs/framework/awilix"
import { Modules } from "@medusajs/framework/utils"
import {
  createStep,
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/workflows-sdk"
import { updateOrderTagsStep } from "../update-order-tags"

const buildContainer = (): {
  container: MedusaContainer
  calls: {
    listOrderTags: any[][]
    updateOrderTags: any[][]
    compensationErrors: Error[]
  }
} => {
  const calls: {
    listOrderTags: any[][]
    updateOrderTags: any[][]
    compensationErrors: Error[]
  } = {
    listOrderTags: [],
    updateOrderTags: [],
    compensationErrors: [],
  }

  const container = createContainer() as unknown as MedusaContainer
  container.register(
    Modules.ORDER,
    asFunction(() => ({
      listOrderTags: async (selector: any, config: any) => {
        calls.listOrderTags.push([selector, config])

        // Mirrors the real `select` behavior: it only ever contains the
        // fields present in the original `update` payload
        // (`getSelectsAndRelationsFromObjectArray`), so a metadata-only
        // update never fetches `value`. The returned tag has no `value`
        // key at all.
        return [{ id: "otag_1", metadata: { foo: "bar" } }]
      },
      updateOrderTags: async (selector: any, data: any) => {
        calls.updateOrderTags.push([selector, data])

        // Mirrors MikroORM's `EntityAssigner.assignProperty`, which throws
        // when a non-nullable column (`OrderTag.value`) is explicitly
        // assigned `undefined`. This only happens on the per-tag
        // compensation call, where `selector` is the tag's own string id
        // (the main step's call passes a filter object as the selector).
        if (
          typeof selector === "string" &&
          Object.prototype.hasOwnProperty.call(data, "value") &&
          data.value === undefined
        ) {
          const error = new Error(
            "OrderTag.value: value cannot be undefined for a non-nullable property"
          )
          calls.compensationErrors.push(error)
          throw error
        }

        return [
          {
            id: typeof selector === "string" ? selector : "otag_1",
            ...data,
          },
        ]
      },
    }))
  )

  return { container, calls }
}

describe("updateOrderTagsStep compensation", () => {
  it("restores a metadata-only tag update without crashing on the non-nullable `value` column", async () => {
    const { container, calls } = buildContainer()

    // A step that always fails, forcing the workflow to roll back the
    // already-completed `updateOrderTagsStep`.
    const forceFailureStep = createStep(
      `force-failure-${Math.random().toString(36).slice(2)}`,
      async (_input: unknown[]) => {
        throw new Error("force compensation")
      }
    )

    const workflow = createWorkflow(
      `update-order-tags-compensation-test-${Math.random()
        .toString(36)
        .slice(2)}`,
      (input: any) => {
        const tags = updateOrderTagsStep(input)
        forceFailureStep(tags)
        return new WorkflowResponse(tags)
      }
    )

    await workflow(container).run({
      input: {
        selector: { id: "otag_1" },
        // A metadata-only update: `value` is never part of the request, so
        // the step's `select` never fetches it.
        update: { metadata: { foo: "bar" } },
      },
      throwOnError: false,
    })

    // Compensation for `updateOrderTagsStep` must restore the tag without
    // crashing. Before the fix, the compensation function hand-picked
    // `{ value: tag.value, metadata: tag.metadata }` from the fetched
    // `prevData`, which explicitly sent `value: undefined` to the
    // non-nullable `value` column and crashed instead of restoring state.
    expect(calls.compensationErrors).toHaveLength(0)

    const compensationCall = calls.updateOrderTags.find(
      ([selector]) => typeof selector === "string"
    )
    expect(compensationCall).toBeDefined()

    const [, compensationData] = compensationCall!
    expect(
      Object.prototype.hasOwnProperty.call(compensationData, "value")
    ).toBe(false)
    expect(compensationData.metadata).toEqual({ foo: "bar" })
  })
})

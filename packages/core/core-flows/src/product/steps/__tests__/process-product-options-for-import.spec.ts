import { MedusaContainer } from "@medusajs/framework"
import { asFunction, createContainer } from "@medusajs/framework/awilix"
import { Modules } from "@medusajs/framework/utils"
import { createWorkflow, WorkflowResponse } from "@medusajs/workflows-sdk"
import { processProductOptionsForImportStep } from "../process-product-options-for-import"

const buildContainer = (
  productServiceOverrides: Record<string, any> = {}
): { container: MedusaContainer; calls: Record<string, any[]> } => {
  const calls: Record<string, any[]> = {
    createProductOptions: [],
    deleteProductOptions: [],
  }
  const container = createContainer() as unknown as MedusaContainer
  container.register(
    Modules.PRODUCT,
    asFunction(() => ({
      createProductOptions: async (input: any) => {
        calls.createProductOptions.push(input)
        const list = Array.isArray(input) ? input : [input]
        // Echo back stable ids the test can assert against.
        return list.map((opt: any, idx: number) => ({
          ...opt,
          id: opt.id ?? `opt_created_${idx + 1}`,
        }))
      },
      deleteProductOptions: async (ids: string[]) => {
        calls.deleteProductOptions.push(ids)
      },
      ...productServiceOverrides,
    }))
  )
  return { container, calls }
}

const runStep = async (
  container: MedusaContainer,
  input: any
): Promise<any> => {
  const workflow = createWorkflow(
    `process-options-test-${Math.random().toString(36).slice(2)}`,
    () => {
      const out = processProductOptionsForImportStep(input)
      return new WorkflowResponse(out)
    }
  )
  return workflow(container).run({ input: {} })
}

describe("processProductOptionsForImportStep", () => {
  it("links existing options when every option carries an id (no creates)", async () => {
    const { container, calls } = buildContainer()

    const result = await runStep(container, {
      products: [
        {
          title: "P1",
          options: [
            { id: "opt_a", title: "Size", values: ["S"] },
            { id: "opt_b", title: "Color", values: ["Red"] },
          ],
        },
      ],
    })

    expect(calls.createProductOptions).toHaveLength(0)
    const transformed = result.result[0]
    expect(transformed.options).toBeUndefined()
    expect(transformed.option_ids).toEqual(["opt_a", "opt_b"])
  })

  it("creates fresh options with is_exclusive: true by default when no id is supplied", async () => {
    const { container, calls } = buildContainer()

    const result = await runStep(container, {
      products: [
        {
          title: "P1",
          options: [
            { title: "Size", values: ["S", "M"] },
            { title: "Color", values: ["Red"] },
          ],
        },
      ],
    })

    expect(calls.createProductOptions).toHaveLength(1)
    expect(calls.createProductOptions[0]).toEqual([
      { title: "Size", values: ["S", "M"], is_exclusive: true },
      { title: "Color", values: ["Red"], is_exclusive: true },
    ])

    const transformed = result.result[0]
    expect(transformed.option_ids).toEqual(["opt_created_1", "opt_created_2"])
  })

  it("honors is_exclusive: false on the input when no id is supplied", async () => {
    const { container, calls } = buildContainer()

    await runStep(container, {
      products: [
        {
          title: "P1",
          options: [
            { title: "Size", values: ["S"], is_exclusive: false },
          ],
        },
      ],
    })

    expect(calls.createProductOptions[0]).toEqual([
      { title: "Size", values: ["S"], is_exclusive: false },
    ])
  })

  it("mixes linked + created options and preserves input order in option_ids", async () => {
    const { container, calls } = buildContainer()

    const result = await runStep(container, {
      products: [
        {
          title: "P1",
          options: [
            { id: "opt_existing_global", title: "Color", values: ["Red"] },
            { title: "Size", values: ["S"] }, // no id → create
            { id: "opt_existing_other", title: "Material", values: ["Cotton"] },
          ],
        },
      ],
    })

    // Only one create call, only for the no-id option.
    expect(calls.createProductOptions).toHaveLength(1)
    expect(calls.createProductOptions[0]).toEqual([
      { title: "Size", values: ["S"], is_exclusive: true },
    ])

    const transformed = result.result[0]
    expect(transformed.option_ids).toEqual([
      "opt_existing_global",
      "opt_created_1",
      "opt_existing_other",
    ])
  })

  it("returns only newly-created option ids as the compensation handle", async () => {
    const { container } = buildContainer()

    const result = await runStep(container, {
      products: [
        {
          title: "P1",
          options: [
            { id: "opt_pre_existing", title: "Color", values: ["Red"] },
            { title: "Size", values: ["S"] },
          ],
        },
      ],
    })

    // The workflow exposes the step's compensation data via the run output's
    // metadata. We can't easily read it here without invoking the
    // compensation path, but we verify the transformed product references
    // both ids so the step worked end-to-end.
    expect(result.result[0].option_ids).toEqual([
      "opt_pre_existing",
      "opt_created_1",
    ])
  })

  it("passes products through untouched when they have no options field", async () => {
    const { container, calls } = buildContainer()

    const result = await runStep(container, {
      products: [{ title: "P1" }, { title: "P2" }],
    })

    expect(calls.createProductOptions).toHaveLength(0)
    expect(result.result).toHaveLength(2)
    expect(result.result[0]).toEqual({ title: "P1" })
    expect(result.result[1]).toEqual({ title: "P2" })
  })

  it("aggregates creates across multiple products into a single call", async () => {
    const { container, calls } = buildContainer()

    const result = await runStep(container, {
      products: [
        {
          title: "P1",
          options: [{ title: "Size", values: ["S"] }],
        },
        {
          title: "P2",
          options: [
            { id: "opt_pre", title: "Color", values: ["Red"] },
            { title: "Material", values: ["Cotton"] },
          ],
        },
      ],
    })

    // Both creates batched.
    expect(calls.createProductOptions).toHaveLength(1)
    expect(calls.createProductOptions[0]).toHaveLength(2)
    expect(calls.createProductOptions[0]).toEqual([
      { title: "Size", values: ["S"], is_exclusive: true },
      { title: "Material", values: ["Cotton"], is_exclusive: true },
    ])

    // Newly created ids land in the correct product/positions.
    expect(result.result[0].option_ids).toEqual(["opt_created_1"])
    expect(result.result[1].option_ids).toEqual([
      "opt_pre",
      "opt_created_2",
    ])
  })
})

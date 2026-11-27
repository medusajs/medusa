import { MedusaContainer } from "@medusajs/framework"
import { asFunction, createContainer } from "@medusajs/framework/awilix"
import { Modules } from "@medusajs/framework/utils"
import {
  createStep,
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { removeProductOptionsFromProductStep } from "../remove-product-options-from-product"

const failingStep = createStep(
  "remove-product-options-from-product-spec-failing-step",
  async () => {
    throw new Error("fail to trigger compensation")
  }
)

type Recorded = {
  removedPairs: any[]
  restoredOptionIds: string[][]
  addedLinks: any[]
  upsertedVariants: any[]
}

const makeContainer = (products: any[], deletedOptionIds: string[]) => {
  const recorded: Recorded = {
    removedPairs: [],
    restoredOptionIds: [],
    addedLinks: [],
    upsertedVariants: [],
  }

  const container = createContainer() as unknown as MedusaContainer

  container.register(
    Modules.PRODUCT,
    asFunction(
      () =>
        ({
          listProducts: () => Promise.resolve(products),
          removeProductOptionFromProduct: (pairs: any) => {
            recorded.removedPairs.push(pairs)
            return Promise.resolve(deletedOptionIds)
          },
          restoreProductOptions: (ids: string[]) => {
            recorded.restoredOptionIds.push(ids)
            return Promise.resolve()
          },
          addProductOptionToProduct: (links: any) => {
            recorded.addedLinks.push(links)
            return Promise.resolve()
          },
          upsertProductVariants: (variants: any) => {
            recorded.upsertedVariants.push(variants)
            return Promise.resolve(variants)
          },
        } as any)
    )
  )

  return { container, recorded }
}

describe("removeProductOptionsFromProductStep", () => {
  it("restores options, links, and variant option values on compensation", async () => {
    const products = [
      {
        id: "prod_1",
        options: [
          {
            id: "opt_color",
            title: "Color",
            values: [{ id: "val_red", value: "Red", option_id: "opt_color" }],
          },
          {
            id: "opt_size",
            title: "Size",
            values: [
              { id: "val_s", value: "S", option_id: "opt_size" },
              { id: "val_m", value: "M", option_id: "opt_size" },
            ],
          },
        ],
        variants: [
          {
            id: "var_1",
            options: [
              { id: "val_red", value: "Red", option_id: "opt_color" },
              { id: "val_s", value: "S", option_id: "opt_size" },
            ],
          },
          {
            id: "var_2",
            options: [
              { id: "val_red", value: "Red", option_id: "opt_color" },
              { id: "val_m", value: "M", option_id: "opt_size" },
            ],
          },
        ],
      },
    ]

    const { container, recorded } = makeContainer(products, ["opt_color"])

    const workflow = createWorkflow(
      "remove-product-options-compensate-variants",
      (input: { product_id: string; product_option_id: string }[]) => {
        removeProductOptionsFromProductStep(input)
        failingStep()
        return new WorkflowResponse(void 0)
      }
    )

    const { errors } = await workflow(container).run({
      input: [{ product_id: "prod_1", product_option_id: "opt_color" }],
      throwOnError: false,
    })

    expect(errors).toHaveLength(1)
    expect(recorded.removedPairs).toEqual([
      [{ product_id: "prod_1", product_option_id: "opt_color" }],
    ])
    expect(recorded.restoredOptionIds).toEqual([["opt_color"]])
    expect(recorded.addedLinks).toEqual([
      [
        {
          product_id: "prod_1",
          product_option_id: "opt_color",
          product_option_value_ids: ["val_red"],
        },
      ],
    ])
    expect(recorded.upsertedVariants).toEqual([
      [
        {
          id: "var_1",
          options: { Color: "Red", Size: "S" },
        },
        {
          id: "var_2",
          options: { Color: "Red", Size: "M" },
        },
      ],
    ])
  })

  it("skips variant restoration when no variants reference removed option values", async () => {
    const products = [
      {
        id: "prod_1",
        options: [
          {
            id: "opt_color",
            title: "Color",
            values: [{ id: "val_red", value: "Red", option_id: "opt_color" }],
          },
        ],
        variants: [],
      },
    ]

    const { container, recorded } = makeContainer(products, ["opt_color"])

    const workflow = createWorkflow(
      "remove-product-options-compensate-no-variants",
      (input: { product_id: string; product_option_id: string }[]) => {
        removeProductOptionsFromProductStep(input)
        failingStep()
        return new WorkflowResponse(void 0)
      }
    )

    await workflow(container).run({
      input: [{ product_id: "prod_1", product_option_id: "opt_color" }],
      throwOnError: false,
    })

    expect(recorded.restoredOptionIds).toEqual([["opt_color"]])
    expect(recorded.addedLinks).toHaveLength(1)
    expect(recorded.upsertedVariants).toEqual([])
  })

  it("handles empty input without calling service methods", async () => {
    const { container, recorded } = makeContainer([], [])

    const workflow = createWorkflow(
      "remove-product-options-compensate-empty",
      (input: { product_id: string; product_option_id: string }[]) => {
        removeProductOptionsFromProductStep(input)
        failingStep()
        return new WorkflowResponse(void 0)
      }
    )

    await workflow(container).run({
      input: [],
      throwOnError: false,
    })

    expect(recorded.removedPairs).toEqual([])
    expect(recorded.restoredOptionIds).toEqual([])
    expect(recorded.addedLinks).toEqual([])
    expect(recorded.upsertedVariants).toEqual([])
  })
})

import type { ProductTypes } from "@medusajs/framework/types"
import {
  createWorkflow,
  transform,
  when,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { isString, ProductWorkflowEvents } from "@medusajs/framework/utils"

import { emitEventStep } from "../../common"
import { createProductOptionsStep } from "../steps"
import { setProductProductOptionsWorkflow } from "./set-product-product-options"

/**
 * The data to manage product options of a product.
 */
export type LinkProductOptionsToProductWorkflowInput = {
  /**
   * The ID of the product to manage its options.
   */
  product_id: string
  /**
   * The product options to add to the product. You can pass one of the
   * following:
   *
   * 1. The ID of an existing product option as a string.
   * 2. An object with `id` and `value_ids` to add an existing product option with specific values. This
   * is useful when you want to associate only specific option values of an option to the product.
   * 3. An object to create a new product option.
   */
  add?: (
    | string
    | {
        /**
         * The ID of the product option to add.
         */
        id: string
        /**
         * The IDs of the product option values to associate with the product option.
         */
        value_ids: string[]
      }
    | ProductTypes.CreateProductOptionDTO
  )[]
  /**
   * The product options to remove from the product.
   */
  remove?: string[]
  /**
   * The product option values to update for existing product options.
   */
  update?: Array<{
    /**
     * The ID of the product option to update values for.
     */
    product_option_id: string
    /**
     * The IDs of the product option values to add, or new values to create.
     */
    add?: Array<
      | string
      | {
          /**
           * The value to create on the product option.
           */
          value: string
        }
    >
    /**
     * The IDs of the product option values to remove.
     */
    remove?: string[]
  }>
}

export const createAndLinkProductOptionsToProductWorkflowId =
  "create-and-link-product-options-to-product"
/**
 * This workflow manages one or more product options of a product. It's used by the
 * [Batch Product Product Options](https://docs.medusajs.com/api/admin#products_postproductsidoptionsbatch).
 * This workflow also creates non-existing product options before adding them to the product.
 *
 * You can also use this workflow within your customizations or your own custom workflows, allowing you
 * to wrap custom logic around product-option and product association.
 *
 * @since 2.16.0
 *
 * @example
 * const { result } = await createAndLinkProductOptionsToProductWorkflow(container)
 * .run({
 *   input: {
 *     product_id: "prod_123"
 *     add: [
 *       // Add existing option by ID
 *       "opt_456",
 *       // Create new option
 *       {
 *         title: "Size",
 *         values: ["S", "M", "L", "XL"]
 *       },
 *       // Add existing option with specific values
 *       {
 *         id: "opt_123"
 *         value_ids: ["optval_1", "optval_2"]
 *       }
 *     ],
 *     remove: ["opt_321"],
 *     update: [
 *       {
 *         product_option_id: "opt_123",
 *         add: [
 *           // add existing value
 *           "optval_3",
 *           // add new value
 *           { value: "optval_4" }
 *         ],
 *         remove: ["optval_1"]
 *       }
 *     ]
 *   }
 * })
 *
 * @summary
 *
 * Manage options of a product.
 */
export const createAndLinkProductOptionsToProductWorkflow = createWorkflow(
  createAndLinkProductOptionsToProductWorkflowId,
  (input: WorkflowData<LinkProductOptionsToProductWorkflowInput>) => {
    const { toCreate, toAdd, toAddWithValues } = transform(
      { input },
      ({ input }) => {
        const toCreate: ProductTypes.CreateProductOptionDTO[] = []
        const toAdd: string[] = []
        const toAddWithValues: Array<{
          option_id: string
          value_ids?: string[]
        }> = []

        for (const option of input.add ?? []) {
          if (isString(option)) {
            toAdd.push(option)
          } else if ("id" in option && "value_ids" in option) {
            toAddWithValues.push({
              option_id: option.id,
              value_ids: option.value_ids,
            })
          } else {
            toCreate.push(option as ProductTypes.CreateProductOptionDTO)
          }
        }

        return { toCreate, toAdd, toAddWithValues }
      }
    )

    const createdIds = when(
      "creating-product-options",
      { toCreate },
      ({ toCreate }) => toCreate.length > 0
    ).then(() => {
      const createdOptions = createProductOptionsStep(toCreate)
      return transform({ createdOptions }, ({ createdOptions }) =>
        createdOptions.map((option) => option.id)
      )
    })

    const toAddOptions = transform(
      { toAdd, toAddWithValues, createdIds },
      ({ toAdd, toAddWithValues, createdIds }) => {
        const options: (
          | string
          | { product_option_id: string; product_option_value_ids?: string[] }
        )[] = []

        // Add simple option IDs (no value filtering)
        for (const optionId of toAdd) {
          options.push(optionId)
        }

        // Add options with specific values
        for (const { option_id, value_ids } of toAddWithValues) {
          options.push({
            product_option_id: option_id,
            product_option_value_ids: value_ids,
          })
        }

        // Add created options (no value filtering)
        for (const optionId of createdIds ?? []) {
          options.push(optionId)
        }

        return options
      }
    )

    const toRemoveOptions = transform(
      { input },
      ({ input }) => input.remove ?? []
    )
    const toUpdateOptions = transform(
      { input },
      ({ input }) => input.update ?? []
    )

    const productOptions = setProductProductOptionsWorkflow.runAsStep({
      input: {
        product_id: input.product_id,
        add: toAddOptions,
        remove: toRemoveOptions,
        update: toUpdateOptions,
      },
    })

    const eventData = transform(input, ({ product_id }) => ({ id: product_id }))

    emitEventStep({
      eventName: ProductWorkflowEvents.UPDATED,
      data: eventData,
    })

    return new WorkflowResponse(productOptions)
  }
)

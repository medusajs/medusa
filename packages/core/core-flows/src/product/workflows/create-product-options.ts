import type { AdditionalData, ProductTypes } from "@medusajs/framework/types"
import { ProductOptionWorkflowEvents } from "@medusajs/framework/utils"
import {
  createHook,
  createWorkflow,
  transform,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { emitEventStep } from "../../common/steps/emit-event"
import { createProductOptionsStep } from "../steps"

/**
 * The data to create one or more product options, along with custom data that's passed to the workflow's hooks.
 */
export type CreateProductOptionsWorkflowInput = {
  /**
   * The product options to create.
   */
  product_options: ProductTypes.CreateProductOptionDTO[]
} & AdditionalData

export const createProductOptionsWorkflowId = "create-product-options"
/**
 * This workflow creates one or more product options. It's used by the [Create Product Option Admin API Route](https://docs.medusajs.com/api/admin#product-options_postproductoptions).
 *
 * This workflow has a hook that allows you to perform custom actions on the created product options. For example, you can pass under `additional_data` custom data that
 * allows you to create custom data models linked to the product options.
 *
 * You can also use this workflow within your customizations or your own custom workflows, allowing you to wrap custom logic around product-option creation.
 *
 * @example
 * const { result } = await createProductOptionsWorkflow(container)
 * .run({
 *   input: {
 *     product_options: [
 *       {
 *         title: "Size",
 *         values: ["S", "M", "L", "XL"]
 *       },
 *       {
 *         title: "Color",
 *         values: ["Red", "Blue", "Green"]
 *         is_exclusive: true,
 *         ranks: {
 *           "Red": 2,
 *           "Blue": 1,
 *           "Green": 3
 *         }
 *       }
 *     ],
 *     additional_data: {
 *       erp_id: "123"
 *     }
 *   }
 * })
 *
 * @summary
 *
 * Create one or more product options.
 *
 * @property hooks.productOptionsCreated - This hook is executed after the product options are created. You can consume this hook to perform custom actions on the created product options.
 */
export const createProductOptionsWorkflow = createWorkflow(
  createProductOptionsWorkflowId,
  (input: WorkflowData<CreateProductOptionsWorkflowInput>) => {
    const productOptions = createProductOptionsStep(input.product_options)
    const productOptionsCreated = createHook("productOptionsCreated", {
      product_options: productOptions,
      additional_data: input.additional_data,
    })

    const optionIdEvents = transform(
      { productOptions },
      ({ productOptions }) => {
        return productOptions.map((v) => {
          return { id: v.id }
        })
      }
    )

    emitEventStep({
      eventName: ProductOptionWorkflowEvents.CREATED,
      data: optionIdEvents,
    })

    return new WorkflowResponse(productOptions, {
      hooks: [productOptionsCreated],
    })
  }
)

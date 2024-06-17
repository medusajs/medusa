import { Modules } from "@medusajs/modules-sdk"
import {
  WorkflowData,
  createWorkflow,
  parallelize,
  transform,
} from "@medusajs/workflows-sdk"
import { removeRemoteLinkStep } from "../../common"
import { deleteProductsStep } from "../steps/delete-products"
import { getProductsStep } from "../steps/get-products"

type WorkflowInput = { ids: string[] }

export const deleteProductsWorkflowId = "delete-products"
export const deleteProductsWorkflow = createWorkflow(
  deleteProductsWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<void> => {
    const productsToDelete = getProductsStep({ ids: input.ids })
    const variantsToBeDeleted = transform({ productsToDelete }, (data) => {
      return data.productsToDelete
        .flatMap((product) => product.variants)
        .map((variant) => variant.id)
    })

    const [, deletedProduct] = parallelize(
      removeRemoteLinkStep({
        [Modules.PRODUCT]: {
          variant_id: variantsToBeDeleted,
          product_id: input.ids,
        },
      }).config({ name: "remove-product-variant-link-step" }),
      deleteProductsStep(input.ids)
    )

    return deletedProduct
  }
)

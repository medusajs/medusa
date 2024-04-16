import {
  WorkflowData,
  createWorkflow,
  transform,
} from "@medusajs/workflows-sdk"
import { Modules } from "@medusajs/modules-sdk"
import { deleteProductsStep } from "../steps/delete-products"
import { getProductsStep } from "../steps/get-products"
import { removeRemoteLinkStep } from "../../common"

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

    removeRemoteLinkStep({
      [Modules.PRODUCT]: { variant_id: variantsToBeDeleted },
    }).config({ name: "remove-variant-link-step" })

    removeRemoteLinkStep({
      [Modules.PRODUCT]: { product_id: input.ids },
    }).config({ name: "remove-product-link-step" })

    return deleteProductsStep(input.ids)
  }
)

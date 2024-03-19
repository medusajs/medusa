import {
  WorkflowData,
  createWorkflow,
  transform,
} from "@medusajs/workflows-sdk"
import {
  deleteProductsStep,
  getProductsStep,
  removeVariantPricingLinkStep,
} from "../steps"

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

    // Question: Should we also remove the price set manually, or would that be cascaded?
    // Question: Since we soft-delete the product, how do we restore the product with the prices and the links?
    removeVariantPricingLinkStep({ variant_ids: variantsToBeDeleted })

    return deleteProductsStep(input.ids)
  }
)

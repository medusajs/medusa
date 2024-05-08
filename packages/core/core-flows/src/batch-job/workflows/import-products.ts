import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { completeProductImportStep } from "../steps/complete-product-import"
import { preprocessProductsStep } from "../steps/preprocess-product-import"
import { processProductsStep } from "../steps/process-product-import"
import { waitForConfirmationStep } from "../steps/wait-for-confirmation"

export const importProductsWorkflowId = "import-products"
export const importProductsWorkflow = createWorkflow(
  importProductsWorkflowId,
  (input: WorkflowData) => {
    preprocessProductsStep()
    waitForConfirmationStep()
    const products = processProductsStep()
    completeProductImportStep()
  }
)

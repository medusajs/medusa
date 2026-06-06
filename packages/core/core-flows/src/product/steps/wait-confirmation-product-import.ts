import { createStep } from "@zjedene-medusa/framework/workflows-sdk"

export const waitConfirmationProductImportStepId =
  "wait-confirmation-product-import"
/**
 * This step waits until a product import is confirmed. It's useful before executing the
 * {@link batchProductsWorkflow}.
 * 
 * This step is asynchronous and will make the workflow using it a [Long-Running Workflow](https://docs.medusajs.com/learn/fundamentals/workflows/long-running-workflow).
 */
export const waitConfirmationProductImportStep = createStep(
  {
    name: waitConfirmationProductImportStepId,
    async: true,
    // After an hour we want to timeout and cancel the import so we don't have orphaned workflows
    timeout: 60 * 60 * 1,
  },
  async () => {}
)

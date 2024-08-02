import { createStep } from "@medusajs/workflows-sdk"

export const waitConfirmationProductImportStepId =
  "wait-confirmation-product-import"
export const waitConfirmationProductImportStep = createStep(
  {
    name: waitConfirmationProductImportStepId,
    async: true,
    // After an hour we want to timeout and cancel the import so we don't have orphaned workflows
    timeout: 60 * 60 * 1,
  },
  async () => {}
)

import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { batchProductVariantsStep } from "../steps/batch-product-variants"
import { PricingTypes, ProductTypes } from "@medusajs/types"

type BatchProductVariantsInput = {
  create: (ProductTypes.CreateProductVariantDTO & {
    prices?: PricingTypes.CreateMoneyAmountDTO[]
  })[]
  update: (ProductTypes.UpsertProductVariantDTO & {
    prices?: PricingTypes.CreateMoneyAmountDTO[]
  })[]
  delete: string[]
}

type BatchProductVariantsOutput = {
  created: ProductTypes.ProductVariantDTO[]
  updated: ProductTypes.ProductVariantDTO[]
  deleted: {
    ids: string[]
    object: string
    deleted: boolean
  }
}

export const batchProductVariantsWorkflowId = "batch-product-variants"
export const batchProductVariantsWorkflow = createWorkflow(
  batchProductVariantsWorkflowId,
  (
    input: WorkflowData<BatchProductVariantsInput>
  ): WorkflowData<BatchProductVariantsOutput> => {
    return batchProductVariantsStep(input)
  }
)

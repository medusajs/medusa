import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { batchProductsStep } from "../steps/batch-products"
import { PricingTypes, ProductTypes } from "@medusajs/types"

type WorkflowInput = {
  create: (Omit<ProductTypes.CreateProductDTO, "variants"> & {
    sales_channels?: { id: string }[]
    variants?: (ProductTypes.CreateProductVariantDTO & {
      prices?: PricingTypes.CreateMoneyAmountDTO[]
    })[]
  })[]
  update: (ProductTypes.UpsertProductDTO & {
    sales_channels?: { id: string }[]
  })[]
  delete: string[]
}

type BatchProductsOutput = {
  created: ProductTypes.ProductDTO[]
  updated: ProductTypes.ProductDTO[]
  deleted: {
    ids: string[]
    object: string
    deleted: boolean
  }
}

export const batchProductsWorkflowId = "batch-products"
export const batchProductsWorkflow = createWorkflow(
  batchProductsWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<BatchProductsOutput> => {
    return batchProductsStep(input)
  }
)

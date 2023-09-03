import { ProductTypes, WorkflowTypes } from "@medusajs/types"

import { WorkflowArguments } from "../../helper"

export type UpdateProductsVariantsPrepareData = {
  products: ProductTypes.UpdateProductDTO[]
  // TODO
}

export async function updateProductsVariantsPrepareData({
  container,
  context,
  data,
}: WorkflowArguments<WorkflowTypes.ProductWorkflow.CreateProductsWorkflowInputDTO>): Promise<UpdateProductsVariantsPrepareData> {
  const { manager } = context
  let products = data.products

  return {
    products: products as ProductTypes.UpdateProductDTO[],
  }
}

updateProductsVariantsPrepareData.aliases = {
  payload: "payload",
}

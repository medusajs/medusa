import { ProductTypes, WorkflowTypes } from "@medusajs/types"
import { WorkflowArguments } from "../../helper"

export type UpdateProductsVariantsData = {
  products: ProductTypes.UpdateProductDTO[]
  // TODO
}

export async function updateProductsVariants({
  container,
  context,
  data,
}: WorkflowArguments<WorkflowTypes.ProductWorkflow.CreateProductsWorkflowInputDTO>): Promise<UpdateProductsVariantsData> {
  const { manager } = context
  let products = data.products

  return {
    products: products as ProductTypes.UpdateProductDTO[],
  }
}

updateProductsVariants.aliases = {
  payload: "payload",
}

import { InputAlias } from "../definitions"
import { ProductTypes } from "@medusajs/types"
import { WorkflowArguments } from "../helper"

export async function removeProducts({
  container,
  data,
}: WorkflowArguments & {
  data: {
    [InputAlias.Products]: ProductTypes.ProductDTO[]
  }
}) {
  const productModuleService = container.resolve("productModuleService")
  const value = await productModuleService.softDelete(
    data[InputAlias.Products].map((p) => p.id)
  )

  return {
    alias: InputAlias.RemovedProducts,
    value,
  }
}

import { InputAlias } from "../definitions"
import { ProductTypes } from "@medusajs/types"
import { WorkflowArguments } from "../helper"

export async function createProducts({
  container,
  context,
  data,
}: WorkflowArguments & {
  data: { [InputAlias.Products]: ProductTypes.CreateProductDTO[] }
}) {
  const productModuleService = container.resolve("productModuleService")

  const value = await productModuleService.create(
    data[InputAlias.Products],
    context
  )

  return {
    alias: InputAlias.Products,
    value,
  }
}

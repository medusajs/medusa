import { ProductDTO, ProductTypes } from "@medusajs/types"
import { Modules, ModulesDefinition } from "@medusajs/modules-sdk"

import { WorkflowArguments } from "../../helper"

type HandlerInput = { products: ProductTypes.UpdateProductDTO[] }

type UpdateProductsPreparedData = ProductDTO[]

export async function updateProductsPrepareData({
  container,
  data,
}: WorkflowArguments<HandlerInput>): Promise<UpdateProductsPreparedData> {
  const ids = data.products.map((product) => product.id)

  const productModuleService: ProductTypes.IProductModuleService =
    container.resolve(ModulesDefinition[Modules.PRODUCT].registrationName)

  return await productModuleService.list({ id: ids })
}

updateProductsPrepareData.aliases = {
  products: "products",
}

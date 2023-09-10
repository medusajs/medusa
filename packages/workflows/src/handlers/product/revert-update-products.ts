import { Modules, ModulesDefinition } from "@medusajs/modules-sdk"
import { ProductDTO, ProductTypes, UpdateProductDTO } from "@medusajs/types"

import { WorkflowArguments } from "../../helper"
import { UpdateProductsPreparedData } from "./update-products-prepare-data"

type HandlerInput = {
  preparedData: UpdateProductsPreparedData
}

export async function revertUpdateProducts({
  container,
  data,
}: WorkflowArguments<HandlerInput>): Promise<ProductDTO[]> {
  const productModuleService: ProductTypes.IProductModuleService =
    container.resolve(ModulesDefinition[Modules.PRODUCT].registrationName)

  return await productModuleService.update(
    data.preparedData.products as UpdateProductDTO[]
  )
}

revertUpdateProducts.aliases = {
  preparedData: "preparedData",
}

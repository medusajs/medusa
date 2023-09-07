import { ProductTypes } from "@medusajs/types"

import { WorkflowArguments } from "../../helper"

type HandlerInput = { products: ProductTypes.UpdateProductDTO[] }

type UpdateProductsPreparedData = void

export async function updateProductsPrepareData({
  container,
  data,
}: WorkflowArguments<HandlerInput>): Promise<UpdateProductsPreparedData> {}

updateProductsPrepareData.aliases = {
  products: "products",
}

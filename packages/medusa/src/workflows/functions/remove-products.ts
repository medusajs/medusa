import { MedusaContainer, ProductTypes } from "@medusajs/types"

export async function createProducts({
  container,
  data,
}: {
  container: MedusaContainer
  data: ProductTypes.CreateProductDTO[]
}) {
  const productModuleService = container.resolve("productModuleService")
  return await productModuleService.create(data)
}

import { MedusaContainer, ProductTypes } from "@medusajs/types"

export async function removeProducts({
  container,
  data,
}: {
  container: MedusaContainer
  data: ProductTypes.ProductDTO[]
}): Promise<ProductTypes.ProductDTO[]> {
  const productModuleService = container.resolve("productModuleService")
  return await productModuleService.softDelete(data.map((p) => p.id))
}

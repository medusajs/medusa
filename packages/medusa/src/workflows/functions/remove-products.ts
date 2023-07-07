import { MedusaContainer, ProductTypes } from "@medusajs/types"

export async function removeProducts({
  container,
  data,
}: {
  container: MedusaContainer
  data: (ProductTypes.CreateProductDTO & { id: string })[]
}) {
  const productModuleService: ProductTypes.IProductModuleService =
    container.resolve("productModuleService")
  return await productModuleService.softDelete(data.map((p) => p.id))
}

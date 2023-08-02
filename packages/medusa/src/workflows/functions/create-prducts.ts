import { MedusaContainer, ProductTypes } from "@medusajs/types"

export type CreateProductsData = ProductTypes.CreateProductDTO[]

export async function createProducts({
  container,
  data,
}: {
  container: MedusaContainer
  data: CreateProductsData
}): Promise<ProductTypes.ProductDTO[]> {
  const productModuleService: ProductTypes.IProductModuleService =
    container.resolve("productModuleService")

  return await productModuleService.create(data)
}

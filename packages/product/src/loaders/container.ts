import { LoaderOptions } from "@medusajs/modules-sdk"

import { asClass } from "awilix"
import { ProductService, ProductVariantService } from "@services"
import { ProductRepository } from "@repositories"

export default async ({ container }: LoaderOptions): Promise<void> => {
  container.register({
    productService: asClass(ProductService).singleton(),
    productVariantService: asClass(ProductVariantService).singleton(),
    productRepository: asClass(ProductRepository).singleton(),
  })
}

import { LoaderOptions } from "@medusajs/modules-sdk"

import { asClass } from "awilix"
import {
  ProductService,
  ProductTagService,
  ProductVariantService,
} from "@services"
import {
  ProductCollectionRepository,
  ProductRepository,
  ProductTagRepository,
  ProductVariantRepository,
} from "@repositories"
import { ProductServiceInitializeOptions } from "../types"

export default async ({
  container,
  options,
}: LoaderOptions<ProductServiceInitializeOptions>): Promise<void> => {
  container.register({
    productService: asClass(ProductService).singleton(),
    productVariantService: asClass(ProductVariantService).singleton(),
    productTagService: asClass(ProductTagService).singleton(),
  })

  if (options?.customDataLayer) {
    container.register({
      productRepository: asClass(
        options.customDataLayer.repositories?.productRepository ??
          ProductRepository
      ).singleton(),
      productVariantRepository: asClass(
        options.customDataLayer.repositories?.productVariantRepository ??
          ProductVariantRepository
      ).singleton(),
      productTagRepository: asClass(
        options.customDataLayer.repositories?.productTagRepository ??
          ProductTagRepository
      ).singleton(),
      productCollectionRepository: asClass(
        options.customDataLayer.repositories?.productCollectionRepository ??
          ProductCollectionRepository
      ).singleton(),
    })
  }
}

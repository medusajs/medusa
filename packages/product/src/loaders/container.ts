import { LoaderOptions } from "@medusajs/modules-sdk"

import { asClass } from "awilix"
import {
  ProductService,
  ProductTagService,
  ProductVariantService,
} from "@services"
import {
  ProductRepository,
  ProductTagRepository,
  ProductVariantRepository,
} from "@repositories"

export default async ({ container }: LoaderOptions): Promise<void> => {
  container.register({
    productService: asClass(ProductService).singleton(),
    productVariantService: asClass(ProductVariantService).singleton(),
    productTagService: asClass(ProductTagService).singleton(),

    productRepository: asClass(ProductRepository).singleton(),
    productVariantRepository: asClass(ProductVariantRepository).singleton(),
    productTagRepository: asClass(ProductTagRepository).singleton(),
  })
}

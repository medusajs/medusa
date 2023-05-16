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
import {
  ProductServiceInitializeCustomDataLayerOptions,
  ProductServiceInitializeOptions,
  RepositoryService,
} from "../types"
import { Constructor } from "@medusajs/types"

export default async ({
  container,
  options,
}: LoaderOptions<
  | ProductServiceInitializeOptions
  | ProductServiceInitializeCustomDataLayerOptions
>): Promise<void> => {
  const customDataLayer = (
    options as ProductServiceInitializeCustomDataLayerOptions
  )?.customDataLayer

  container.register({
    productService: asClass(ProductService).singleton(),
    productVariantService: asClass(ProductVariantService).singleton(),
    productTagService: asClass(ProductTagService).singleton(),
  })

  if (customDataLayer) {
    await loadCustomRepositories({ customDataLayer, container })
  } else {
    await loadDefaultRepositories({ container })
  }
}

function loadDefaultRepositories({ container }) {
  container.register({
    productRepository: asClass(ProductRepository).singleton(),
    productVariantRepository: asClass(ProductVariantRepository).singleton(),
    productTagRepository: asClass(ProductTagRepository).singleton(),
    productCollectionRepository: asClass(
      ProductCollectionRepository
    ).singleton(),
  })
}

function loadCustomRepositories({ customDataLayer, container }) {
  Object.entries(customDataLayer.repositories).forEach(([key, Repository]) => {
    container.register({
      [key]: asClass(
        Repository as Constructor<RepositoryService<any>>
      ).singleton(),
    })
  })
}

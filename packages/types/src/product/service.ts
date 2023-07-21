import {
  CreateProductDTO,
  FilterableProductCategoryProps,
  FilterableProductCollectionProps,
  FilterableProductProps,
  FilterableProductTagProps,
  FilterableProductVariantProps,
  ProductCategoryDTO,
  ProductCollectionDTO,
  ProductDTO,
  ProductTagDTO,
  ProductVariantDTO,
} from "./common"

import { Context } from "../shared-context"
import { FindConfig } from "../common"
import { JoinerServiceConfig } from "../joiner"

export interface IProductModuleService {
  __joinerConfig(): JoinerServiceConfig

  retrieve(productId: string, sharedContext?: Context): Promise<ProductDTO>

  list(
    filters?: FilterableProductProps,
    config?: FindConfig<ProductDTO>,
    sharedContext?: Context
  ): Promise<ProductDTO[]>

  listAndCount(
    filters?: FilterableProductProps,
    config?: FindConfig<ProductDTO>,
    sharedContext?: Context
  ): Promise<[ProductDTO[], number]>

  listTags(
    filters?: FilterableProductTagProps,
    config?: FindConfig<ProductTagDTO>,
    sharedContext?: Context
  ): Promise<ProductTagDTO[]>

  retrieveVariant(
    productVariantId: string,
    config?: FindConfig<ProductVariantDTO>,
    sharedContext?: Context
  ): Promise<ProductVariantDTO>

  listVariants(
    filters?: FilterableProductVariantProps,
    config?: FindConfig<ProductVariantDTO>,
    sharedContext?: Context
  ): Promise<ProductVariantDTO[]>

  listAndCountVariants(
    filters?: FilterableProductVariantProps,
    config?: FindConfig<ProductVariantDTO>,
    sharedContext?: Context
  ): Promise<[ProductVariantDTO[], number]>

  retrieveCollection(
    productCollectionId: string,
    config?: FindConfig<ProductCollectionDTO>,
    sharedContext?: Context
  ): Promise<ProductCollectionDTO>

  listCollections(
    filters?: FilterableProductCollectionProps,
    config?: FindConfig<ProductCollectionDTO>,
    sharedContext?: Context
  ): Promise<ProductCollectionDTO[]>

  listAndCountCollections(
    filters?: FilterableProductCollectionProps,
    config?: FindConfig<ProductCollectionDTO>,
    sharedContext?: Context
  ): Promise<[ProductCollectionDTO[], number]>

  retrieveCategory(
    productCategoryId: string,
    config?: FindConfig<ProductCategoryDTO>,
    sharedContext?: Context
  ): Promise<ProductCategoryDTO>

  listCategories(
    filters?: FilterableProductCategoryProps,
    config?: FindConfig<ProductCategoryDTO>,
    sharedContext?: Context
  ): Promise<ProductCategoryDTO[]>

  listAndCountCategories(
    filters?: FilterableProductCategoryProps,
    config?: FindConfig<ProductCategoryDTO>,
    sharedContext?: Context
  ): Promise<[ProductCategoryDTO[], number]>

  create(
    data: CreateProductDTO[],
    sharedContext?: Context
  ): Promise<ProductDTO[]>

  delete(productIds: string[], sharedContext?: Context): Promise<void>

  softDelete(
    productIds: string[],
    sharedContext?: Context
  ): Promise<ProductDTO[]>

  restore(productIds: string[], sharedContext?: Context): Promise<ProductDTO[]>
}

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
import { FindConfig } from "../common"
import { Context } from "../shared-context"

export interface IProductModuleService<
  TProduct = any,
  TProductVariant = any,
  TProductTag = any,
  TProductCollection = any,
  TProductCategory = any,
  TProductImage = any
> {
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

  listVariants(
    filters?: FilterableProductVariantProps,
    config?: FindConfig<ProductVariantDTO>,
    sharedContext?: Context
  ): Promise<ProductVariantDTO[]>

  listCollections(
    filters?: FilterableProductCollectionProps,
    config?: FindConfig<ProductCollectionDTO>,
    sharedContext?: Context
  ): Promise<ProductCollectionDTO[]>

  listCategories(
    filters?: FilterableProductCategoryProps,
    config?: FindConfig<ProductCategoryDTO>,
    sharedContext?: Context
  ): Promise<ProductCategoryDTO[]>

  create(
    data: CreateProductDTO[],
    sharedContext?: Context
  ): Promise<ProductDTO[]>
}

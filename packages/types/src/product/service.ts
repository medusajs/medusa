import {
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
import { SharedContext } from "../shared-context"

export interface IProductModuleService<
  TProduct = any,
  TProductVariant = any,
  TProductTag = any,
  TProductCollection = any,
  TProductCategory = any
> {
  list(
    filters?: FilterableProductProps,
    config?: FindConfig<ProductDTO>,
    sharedContext?: SharedContext
  ): Promise<ProductDTO[]>

  listAndCount(
    filters?: FilterableProductProps,
    config?: FindConfig<ProductDTO>,
    sharedContext?: SharedContext
  ): Promise<[ProductDTO[], number]>

  listTags(
    filters?: FilterableProductTagProps,
    config?: FindConfig<ProductTagDTO>,
    sharedContext?: SharedContext
  ): Promise<ProductTagDTO[]>

  listVariants(
    filters?: FilterableProductVariantProps,
    config?: FindConfig<ProductVariantDTO>,
    sharedContext?: SharedContext
  ): Promise<ProductVariantDTO[]>

  listCollections(
    filters?: FilterableProductCollectionProps,
    config?: FindConfig<ProductCollectionDTO>,
    sharedContext?: SharedContext
  ): Promise<ProductCollectionDTO[]>

  listCategories(
    filters?: FilterableProductCategoryProps,
    config?: FindConfig<ProductCategoryDTO>,
    sharedContext?: SharedContext
  ): Promise<ProductCategoryDTO[]>
}

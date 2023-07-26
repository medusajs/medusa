import {
  CreateProductDTO,
  CreateProductTagDTO,
  CreateProductTypeDTO,
  CreateProductOptionDTO,
  CreateProductCategoryDTO,
  UpdateProductTagDTO,
  UpdateProductTypeDTO,
  UpdateProductOptionDTO,
  UpdateProductCategoryDTO,
  UpdateProductDTO,
  FilterableProductCategoryProps,
  FilterableProductCollectionProps,
  FilterableProductProps,
  FilterableProductTagProps,
  FilterableProductTypeProps,
  FilterableProductOptionProps,
  FilterableProductVariantProps,
  ProductCategoryDTO,
  ProductCollectionDTO,
  ProductDTO,
  ProductTagDTO,
  ProductTypeDTO,
  ProductOptionDTO,
  ProductVariantDTO,
  CreateProductCollectionDTO,
  UpdateProductCollectionDTO,
} from "./common"

import { Context } from "../shared-context"
import { FindConfig } from "../common"
import { JoinerServiceConfig } from "../joiner"

export interface IProductModuleService {
  __joinerConfig(): JoinerServiceConfig

  retrieve(
    productId: string,
    config?: FindConfig<ProductDTO>,
    sharedContext?: Context
  ): Promise<ProductDTO>

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

  retrieveTag(
    tagId: string,
    config?: FindConfig<ProductTagDTO>,
    sharedContext?: Context
  ): Promise<ProductTagDTO>

  listTags(
    filters?: FilterableProductTagProps,
    config?: FindConfig<ProductTagDTO>,
    sharedContext?: Context
  ): Promise<ProductTagDTO[]>

  listAndCountTags(
    filters?: FilterableProductTagProps,
    config?: FindConfig<ProductTagDTO>,
    sharedContext?: Context
  ): Promise<[ProductTagDTO[], number]>

  createTags(
    data: CreateProductTagDTO[],
    sharedContext?: Context,
  ): Promise<ProductTagDTO[]>

  updateTags(
    data: UpdateProductTagDTO[],
    sharedContext?: Context,
  ): Promise<ProductTagDTO[]>

  deleteTags(
    productTagIds: string[],
    sharedContext?: Context,
  ): Promise<void>

  retrieveType(
    typeId: string,
    config?: FindConfig<ProductTypeDTO>,
    sharedContext?: Context
  ): Promise<ProductTypeDTO>

  listTypes(
    filters?: FilterableProductTypeProps,
    config?: FindConfig<ProductTypeDTO>,
    sharedContext?: Context
  ): Promise<ProductTypeDTO[]>

  listAndCountTypes(
    filters?: FilterableProductTypeProps,
    config?: FindConfig<ProductTypeDTO>,
    sharedContext?: Context
  ): Promise<[ProductTypeDTO[], number]>

  createTypes(
    data: CreateProductTypeDTO[],
    sharedContext?: Context,
  ): Promise<ProductTypeDTO[]>

  updateTypes(
    data: UpdateProductTypeDTO[],
    sharedContext?: Context,
  ): Promise<ProductTypeDTO[]>

  deleteTypes(
    productTypeIds: string[],
    sharedContext?: Context,
  ): Promise<void>

  retrieveOption(
    optionId: string,
    config?: FindConfig<ProductOptionDTO>,
    sharedContext?: Context
  ): Promise<ProductOptionDTO>

  listOptions(
    filters?: FilterableProductOptionProps,
    config?: FindConfig<ProductOptionDTO>,
    sharedContext?: Context
  ): Promise<ProductOptionDTO[]>

  listAndCountOptions(
    filters?: FilterableProductOptionProps,
    config?: FindConfig<ProductOptionDTO>,
    sharedContext?: Context
  ): Promise<[ProductOptionDTO[], number]>

  createOptions(
    data: CreateProductOptionDTO[],
    sharedContext?: Context,
  ): Promise<ProductOptionDTO[]>

  updateOptions(
    data: UpdateProductOptionDTO[],
    sharedContext?: Context,
  ): Promise<ProductOptionDTO[]>

  deleteOptions(
    productOptionIds: string[],
    sharedContext?: Context,
  ): Promise<void>

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

  createCollections(
    data: CreateProductCollectionDTO[],
    sharedContext?: Context,
  ): Promise<ProductCollectionDTO[]>

  updateCollections(
    data: UpdateProductCollectionDTO[],
    sharedContext?: Context,
  ): Promise<ProductCollectionDTO[]>

  deleteCollections(
    productCollectionIds: string[],
    sharedContext?: Context,
  ): Promise<void>

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

  createCategory(
    data: CreateProductCategoryDTO,
    sharedContext?: Context,
  ): Promise<ProductCategoryDTO>

  updateCategory(
    categoryId: string,
    data: UpdateProductCategoryDTO,
    sharedContext?: Context,
  ): Promise<ProductCategoryDTO>

  deleteCategory(
    categoryId: string,
    sharedContext?: Context,
  ): Promise<void>

  create(
    data: CreateProductDTO[],
    sharedContext?: Context
  ): Promise<ProductDTO[]>

  update(
    data: UpdateProductDTO[],
    sharedContext?: Context
  ): Promise<ProductDTO[]>

  delete(productIds: string[], sharedContext?: Context): Promise<void>

  softDelete(
    productIds: string[],
    sharedContext?: Context
  ): Promise<ProductDTO[]>

  restore(productIds: string[], sharedContext?: Context): Promise<ProductDTO[]>
}

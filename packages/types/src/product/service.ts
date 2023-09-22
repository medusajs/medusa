import { FindConfig } from "../common"
import { RestoreReturn, SoftDeleteReturn } from "../dal"
import { ModuleJoinerConfig } from "../modules-sdk"
import { Context } from "../shared-context"
import { ProductBaseDTO, ProductVariantBaseDTO } from "./dto/base"
import {
  FilterableProductCategoryProps,
  FilterableProductCollectionProps,
  FilterableProductOptionProps,
  FilterableProductProps,
  FilterableProductTagProps,
  FilterableProductTypeProps,
  FilterableProductVariantProps,
} from "./dto/service/read"
import {
  CreateProductCategoryDTO,
  CreateProductCollectionDTO,
  CreateProductDTO,
  CreateProductOptionDTO,
  CreateProductTagDTO,
  CreateProductTypeDTO,
  UpdateProductCategoryDTO,
  UpdateProductCollectionDTO,
  UpdateProductDTO,
  UpdateProductOptionDTO,
  UpdateProductTagDTO,
  UpdateProductTypeDTO,
} from "./dto/service/mutation"
import {
  ProductCategoryDTO,
  ProductCollectionDTO,
  ProductDTO,
  ProductOptionDTO,
  ProductTagDTO,
  ProductTypeDTO,
  ProductVariantDTO,
} from "./dto/models"

/**
 * Base interface that can be respected by any custom product module.
 * The custom module can also provide a custom interface that needs to extends this one as a base.
 */

export interface IProductModuleBaseService {
  __joinerConfig(): ModuleJoinerConfig

  retrieve(
    productId: string,
    config?: FindConfig<ProductBaseDTO>,
    sharedContext?: Context
  ): Promise<ProductBaseDTO>

  list(
    filters?: FilterableProductProps,
    config?: FindConfig<ProductBaseDTO>,
    sharedContext?: Context
  ): Promise<ProductBaseDTO[]>

  listAndCount(
    filters?: FilterableProductProps,
    config?: FindConfig<ProductBaseDTO>,
    sharedContext?: Context
  ): Promise<[ProductBaseDTO[], number]>

  retrieveVariant(
    productVariantId: string,
    config?: FindConfig<ProductVariantBaseDTO>,
    sharedContext?: Context
  ): Promise<ProductVariantBaseDTO>

  listVariants(
    filters?: FilterableProductVariantProps,
    config?: FindConfig<ProductVariantBaseDTO>,
    sharedContext?: Context
  ): Promise<ProductVariantBaseDTO[]>

  listAndCountVariants(
    filters?: FilterableProductVariantProps,
    config?: FindConfig<ProductVariantBaseDTO>,
    sharedContext?: Context
  ): Promise<[ProductVariantBaseDTO[], number]>

  create(
    data: CreateProductDTO[],
    sharedContext?: Context
  ): Promise<ProductBaseDTO[]>

  update(
    data: UpdateProductDTO[],
    sharedContext?: Context
  ): Promise<ProductBaseDTO[]>

  delete(productIds: string[], sharedContext?: Context): Promise<void>

  softDelete<TReturnableLinkableKeys extends string = string>(
    productIds: string[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>

  restore<TReturnableLinkableKeys extends string = string>(
    productIds: string[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>
}

/**
 * Interface that represent the medusa Product module service.
 */
export interface IProductModuleService extends IProductModuleBaseService {
  __joinerConfig(): ModuleJoinerConfig

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
    sharedContext?: Context
  ): Promise<ProductTagDTO[]>

  updateTags(
    data: UpdateProductTagDTO[],
    sharedContext?: Context
  ): Promise<ProductTagDTO[]>

  deleteTags(productTagIds: string[], sharedContext?: Context): Promise<void>

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
    sharedContext?: Context
  ): Promise<ProductTypeDTO[]>

  updateTypes(
    data: UpdateProductTypeDTO[],
    sharedContext?: Context
  ): Promise<ProductTypeDTO[]>

  deleteTypes(productTypeIds: string[], sharedContext?: Context): Promise<void>

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
    sharedContext?: Context
  ): Promise<ProductOptionDTO[]>

  updateOptions(
    data: UpdateProductOptionDTO[],
    sharedContext?: Context
  ): Promise<ProductOptionDTO[]>

  deleteOptions(
    productOptionIds: string[],
    sharedContext?: Context
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
    sharedContext?: Context
  ): Promise<ProductCollectionDTO[]>

  updateCollections(
    data: UpdateProductCollectionDTO[],
    sharedContext?: Context
  ): Promise<ProductCollectionDTO[]>

  deleteCollections(
    productCollectionIds: string[],
    sharedContext?: Context
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
    sharedContext?: Context
  ): Promise<ProductCategoryDTO>

  updateCategory(
    categoryId: string,
    data: UpdateProductCategoryDTO,
    sharedContext?: Context
  ): Promise<ProductCategoryDTO>

  deleteCategory(categoryId: string, sharedContext?: Context): Promise<void>

  create(
    data: CreateProductDTO[],
    sharedContext?: Context
  ): Promise<ProductDTO[]>

  update(
    data: UpdateProductDTO[],
    sharedContext?: Context
  ): Promise<ProductDTO[]>

  delete(productIds: string[], sharedContext?: Context): Promise<void>

  softDelete<TReturnableLinkableKeys extends string = string>(
    productIds: string[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>

  restore<TReturnableLinkableKeys extends string = string>(
    productIds: string[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>
}

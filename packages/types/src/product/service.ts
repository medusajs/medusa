import {
  CreateProductCategoryDTO,
  CreateProductCollectionDTO,
  CreateProductDTO,
  CreateProductOptionDTO,
  CreateProductTagDTO,
  CreateProductTypeDTO,
  FilterableProductCategoryProps,
  FilterableProductCollectionProps,
  FilterableProductOptionProps,
  FilterableProductProps,
  FilterableProductTagProps,
  FilterableProductTypeProps,
  FilterableProductVariantProps,
  ProductCategoryDTO,
  ProductCollectionDTO,
  ProductDTO,
  ProductOptionDTO,
  ProductTagDTO,
  ProductTypeDTO,
  ProductVariantDTO,
  UpdateProductCategoryDTO,
  UpdateProductCollectionDTO,
  UpdateProductDTO,
  UpdateProductOptionDTO,
  UpdateProductTagDTO,
  UpdateProductTypeDTO,
} from "./common"

import { FindConfig } from "../common"
import { RestoreReturn, SoftDeleteReturn } from "../dal"
import { ModuleJoinerConfig } from "../modules-sdk"
import { Context } from "../shared-context"

export interface IProductModuleService {
  /**
   * @ignore
   */
  __joinerConfig(): ModuleJoinerConfig

  retrieve(
    productId: string,
    config?: FindConfig<ProductDTO>,
    sharedContext?: Context
  ): Promise<ProductDTO>

  /**
   * This method is used to list all available products. It also allows filtering and paginating results.
   *
   * @param filters - An object of type {@link FilterableProductProps} used to apply filters on the products' list.
   * @param config - An object of type {@link FindConfig} used to provide more configurations over the retrieval of products from the database.
   * @param sharedContext - An object of type {@link Context} used to share resources with the module.
   *
   * @returns an array of {@link ProductDTO} satisfying the supplied filters and selectors, if provided.
   *
   * @example
   * async function listProducts () {
   * 	const productService = await initializeProductModule()
   *
   *   const data = await productService.list()
   * }
   */
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

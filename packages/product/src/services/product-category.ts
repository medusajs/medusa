import { ProductCategory } from "@models"
import { ProductCategoryRepository } from "@repositories"
import { Context, DAL, FindConfig, ProductTypes } from "@medusajs/types"
import {
  ModulesSdkUtils,
  MedusaError,
  isDefined,
  InjectTransactionManager,
  InjectManager,
  MedusaContext
} from "@medusajs/utils"

import { shouldForceTransaction } from "../utils"
import { ProductCategoryServiceTypes } from "../types"

type InjectedDependencies = {
  productCategoryRepository: DAL.TreeRepositoryService
}

export default class ProductCategoryService<
  TEntity extends ProductCategory = ProductCategory
> {
  protected readonly productCategoryRepository_: DAL.TreeRepositoryService

  constructor({ productCategoryRepository }: InjectedDependencies) {
    this.productCategoryRepository_ = productCategoryRepository
  }

  @InjectManager("productCategoryRepository_")
  async retrieve(
    productCategoryId: string,
    config: FindConfig<ProductTypes.ProductCategoryDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity> {
    if (!isDefined(productCategoryId)) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `"productCategoryId" must be defined`
      )
    }

    const queryOptions = ModulesSdkUtils.buildQuery<ProductCategory>({
      id: productCategoryId,
    }, config)

    const transformOptions = {
      includeDescendantsTree: true,
    }

    const productCategories = await this.productCategoryRepository_.find(
      queryOptions,
      transformOptions,
      sharedContext
    )

    if (!productCategories?.length) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `ProductCategory with id: ${productCategoryId} was not found`
      )
    }

    return productCategories[0] as TEntity
  }

  @InjectManager("productCategoryRepository_")
  async list(
    filters: ProductTypes.FilterableProductCategoryProps = {},
    config: FindConfig<ProductTypes.ProductCategoryDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    const transformOptions = {
      includeDescendantsTree: filters?.include_descendants_tree || false,
    }
    delete filters.include_descendants_tree

    const queryOptions = ModulesSdkUtils.buildQuery<ProductCategory>(
      filters,
      config
    )
    queryOptions.where ??= {}

    return (await this.productCategoryRepository_.find(
      queryOptions,
      transformOptions,
      sharedContext
    )) as TEntity[]
  }

  @InjectManager("productCategoryRepository_")
  async listAndCount(
    filters: ProductTypes.FilterableProductCategoryProps = {},
    config: FindConfig<ProductTypes.ProductCategoryDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[TEntity[], number]> {
    const transformOptions = {
      includeDescendantsTree: filters?.include_descendants_tree || false,
    }
    delete filters.include_descendants_tree

    const queryOptions = ModulesSdkUtils.buildQuery<ProductCategory>(
      filters,
      config
    )
    queryOptions.where ??= {}

    return (await this.productCategoryRepository_.findAndCount(
      queryOptions,
      transformOptions,
      sharedContext
    )) as [TEntity[], number]
  }

  @InjectTransactionManager(shouldForceTransaction, "productCategoryRepository_")
  async create(
    data: ProductCategoryServiceTypes.CreateProductCategoryDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity> {
    return (await (this.productCategoryRepository_ as ProductCategoryRepository).create(
      data,
      sharedContext
    )) as TEntity
  }

  @InjectTransactionManager(shouldForceTransaction, "productCategoryRepository_")
  async update(
    id: string,
    data: ProductCategoryServiceTypes.UpdateProductCategoryDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity> {
    return (await (this.productCategoryRepository_ as ProductCategoryRepository).update(
      id,
      data,
      sharedContext
    )) as TEntity
  }

  @InjectTransactionManager(shouldForceTransaction, "productCategoryRepository_")
  async delete(
    id: string,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    await this.productCategoryRepository_.delete(id, sharedContext)
  }
}

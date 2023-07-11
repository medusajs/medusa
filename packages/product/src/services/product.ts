import { Product } from "@models"
import {
  Context,
  DAL,
  FindConfig,
  ProductStatus,
  ProductTypes,
  WithRequiredProperty,
} from "@medusajs/types"
import { ModulesSdkUtils, MedusaError, isDefined } from "@medusajs/utils"
import { ProductRepository } from "@repositories"

import * as ProductServiceTypes from "../types/services/product"

type InjectedDependencies = {
  productRepository: DAL.RepositoryService
}

export default class ProductService<TEntity extends Product = Product> {
  protected readonly productRepository_: DAL.RepositoryService

  constructor({ productRepository }: InjectedDependencies) {
    this.productRepository_ = productRepository
  }

  async retrieve(
    productId: string,
    config: FindConfig<ProductTypes.ProductDTO> = {},
    sharedContext?: Context
  ): Promise<TEntity> {
    if (!isDefined(productId)) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `"productId" must be defined`
      )
    }

    const queryOptions = ModulesSdkUtils.buildQuery<Product>({
      id: productId,
    }, config)

    const product = await this.productRepository_.find(
      queryOptions,
      sharedContext
    )

    if (!product?.length) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Product with id: ${productId} was not found`
      )
    }

    return product[0] as TEntity
  }

  async list(
    filters: ProductTypes.FilterableProductProps = {},
    config: FindConfig<ProductTypes.ProductDTO> = {},
    sharedContext?: Context
  ): Promise<TEntity[]> {
    if (filters.category_ids) {
      if (Array.isArray(filters.category_ids)) {
        filters.categories = {
          id: { $in: filters.category_ids },
        }
      } else {
        filters.categories = {
          id: filters.category_ids,
        }
      }
      delete filters.category_ids
    }

    const queryOptions = ModulesSdkUtils.buildQuery<Product>(filters, config)
    return (await this.productRepository_.find(
      queryOptions,
      sharedContext
    )) as TEntity[]
  }

  async listAndCount(
    filters: ProductTypes.FilterableProductProps = {},
    config: FindConfig<ProductTypes.ProductDTO> = {},
    sharedContext?: Context
  ): Promise<[TEntity[], number]> {
    if (filters.category_ids) {
      if (Array.isArray(filters.category_ids)) {
        filters.categories = {
          id: { $in: filters.category_ids },
        }
      } else {
        filters.categories = {
          id: filters.category_ids,
        }
      }
      delete filters.category_ids
    }

    const queryOptions = ModulesSdkUtils.buildQuery<Product>(filters, config)
    return (await this.productRepository_.findAndCount(
      queryOptions,
      sharedContext
    )) as [TEntity[], number]
  }

  async create(
    data: ProductTypes.CreateProductOnlyDTO[],
    sharedContext?: Context
  ): Promise<TEntity[]> {
    return await this.productRepository_.transaction(
      async (manager) => {
        data.forEach((product) => {
          product.status ??= ProductStatus.DRAFT
        })

        return await (this.productRepository_ as ProductRepository).create(
          data as WithRequiredProperty<
            ProductTypes.CreateProductOnlyDTO,
            "status"
          >[],
          {
            transactionManager: manager,
          }
        )
      },
      { transaction: sharedContext?.transactionManager }
    )
  }

  async update(
    data: ProductServiceTypes.UpdateProductDTO[],
    sharedContext?: Context
  ): Promise<TEntity[]> {
    return await this.productRepository_.transaction(
      async (manager) => {
        return await (this.productRepository_ as ProductRepository).update(
          data as WithRequiredProperty<
            ProductServiceTypes.UpdateProductDTO,
            "id"
          >[],
          {
            transactionManager: manager,
          }
        )
      },
      { transaction: sharedContext?.transactionManager }
    )
  }

  async delete(ids: string[], sharedContext?: Context): Promise<void> {
    await this.productRepository_.transaction(
      async (manager) => {
        await this.productRepository_.delete(ids, {
          transactionManager: manager,
        })
      },
      { transaction: sharedContext?.transactionManager }
    )
  }

  async softDelete(
    productIds: string[],
    sharedContext: Context = {}
  ): Promise<TEntity[]> {
    return await this.productRepository_.transaction(
      async (manager) => {
        return await this.productRepository_.softDelete(productIds, {
          transactionManager: manager,
        })
      },
      { transaction: sharedContext?.transactionManager }
    )
  }

  async restore(
    productIds: string[],
    sharedContext: Context = {}
  ): Promise<TEntity[]> {
    return await this.productRepository_.transaction(
      async (manager) => {
        return await this.productRepository_.restore(productIds, {
          transactionManager: manager,
        })
      },
      { transaction: sharedContext?.transactionManager }
    )
  }
}

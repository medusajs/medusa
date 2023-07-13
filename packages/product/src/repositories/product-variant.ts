import {
  FilterQuery as MikroFilterQuery,
  FindOptions as MikroOptions,
  LoadStrategy,
  RequiredEntityData,
} from "@mikro-orm/core"
import { Product, ProductVariant } from "@models"
import { Context, DAL, WithRequiredProperty } from "@medusajs/types"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { MedusaError, isDefined } from "@medusajs/utils"

import { ProductVariantServiceTypes } from "../types/services"
import { AbstractBaseRepository } from "./base"

export class ProductVariantRepository extends AbstractBaseRepository<ProductVariant> {
  protected readonly manager_: SqlEntityManager

  constructor({ manager }: { manager: SqlEntityManager }) {
    // @ts-ignore
    super(...arguments)
    this.manager_ = manager
  }

  async find(
    findOptions: DAL.FindOptions<ProductVariant> = { where: {} },
    context: Context = {}
  ): Promise<ProductVariant[]> {
    const manager = (context.transactionManager ??
      this.manager_) as SqlEntityManager

    const findOptions_ = { ...findOptions }
    findOptions_.options ??= {}

    Object.assign(findOptions_.options, {
      strategy: LoadStrategy.SELECT_IN,
    })

    return await manager.find(
      ProductVariant,
      findOptions_.where as MikroFilterQuery<ProductVariant>,
      findOptions_.options as MikroOptions<ProductVariant>
    )
  }

  async findAndCount(
    findOptions: DAL.FindOptions<ProductVariant> = { where: {} },
    context: Context = {}
  ): Promise<[ProductVariant[], number]> {
    const manager = (context.transactionManager ??
      this.manager_) as SqlEntityManager

    const findOptions_ = { ...findOptions }
    findOptions_.options ??= {}

    Object.assign(findOptions_.options, {
      strategy: LoadStrategy.SELECT_IN,
    })

    return await manager.findAndCount(
      ProductVariant,
      findOptions_.where as MikroFilterQuery<ProductVariant>,
      findOptions_.options as MikroOptions<ProductVariant>
    )
  }

  async delete(ids: string[], context: Context = {}): Promise<void> {
    const manager = (context.transactionManager ??
      this.manager_) as SqlEntityManager

    await manager.nativeDelete(ProductVariant, { id: { $in: ids } }, {})
  }

  async create(
    data: RequiredEntityData<ProductVariant>[],
    context: Context = {}
  ): Promise<ProductVariant[]> {
    const manager = (context.transactionManager ??
      this.manager_) as SqlEntityManager

    const variants = data.map((variant) => {
      return manager.create(ProductVariant, variant)
    })

    await manager.persist(variants)

    return variants
  }

  async update(
    data: WithRequiredProperty<ProductVariantServiceTypes.UpdateProductVariantDTO, "id">[],
    context: Context = {}
  ): Promise<ProductVariant[]> {
    const manager = (context.transactionManager ??
      this.manager_) as SqlEntityManager

    const productVariantsToUpdate = await manager.find(ProductVariant, {
      id: data.map((updateData) => updateData.id)
    })

    const productVariantsToUpdateMap = new Map<string, ProductVariant>(
      productVariantsToUpdate.map((variant) => [variant.id, variant])
    )

    const variants = data.map((variantData) => {
      const productVariant = productVariantsToUpdateMap.get(variantData.id)

      if (!productVariant) {
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          `ProductVariant with id "${variantData.id}" not found`
        )
      }

      return manager.assign(productVariant, variantData)
    })

    await manager.persist(variants)

    return variants
  }
}

import {
  FilterQuery as MikroFilterQuery,
  FindOptions as MikroOptions,
  LoadStrategy,
  RequiredEntityData,
} from "@mikro-orm/core"
import { deduplicateIfNecessary } from "../utils"
import { ProductType } from "@models"
import { Context, CreateProductTypeDTO, DAL } from "@medusajs/types"
import { BaseRepository } from "./base"

export class ProductTypeRepository extends BaseRepository<ProductType> {
  constructor() {
    // @ts-ignore
    super(...arguments)
  }

  async find(
    findOptions: DAL.FindOptions<ProductType> = { where: {} },
    context: Context = {}
  ): Promise<ProductType[]> {
    // Spread is used to copy the options in case of manipulation to prevent side effects
    const findOptions_ = { ...findOptions }

    findOptions_.options ??= {}
    findOptions_.options.limit ??= 15

    if (findOptions_.options.populate) {
      deduplicateIfNecessary(findOptions_.options.populate)
    }

    if (context.transactionManager) {
      Object.assign(findOptions_.options, { ctx: context.transactionManager })
    }

    Object.assign(findOptions_.options, {
      strategy: LoadStrategy.SELECT_IN,
    })

    return await this.manager_.find(
      ProductType,
      findOptions_.where as MikroFilterQuery<ProductType>,
      findOptions_.options as MikroOptions<ProductType>
    )
  }

  async findAndCount(
    findOptions: DAL.FindOptions<ProductType> = { where: {} },
    context: Context = {}
  ): Promise<[ProductType[], number]> {
    // Spread is used to copy the options in case of manipulation to prevent side effects
    const findOptions_ = { ...findOptions }

    findOptions_.options ??= {}
    findOptions_.options.limit ??= 15

    if (findOptions_.options.populate) {
      deduplicateIfNecessary(findOptions_.options.populate)
    }

    if (context.transactionManager) {
      Object.assign(findOptions_.options, { ctx: context.transactionManager })
    }

    Object.assign(findOptions_.options, {
      strategy: LoadStrategy.SELECT_IN,
    })

    return await this.manager_.findAndCount(
      ProductType,
      findOptions_.where as MikroFilterQuery<ProductType>,
      findOptions_.options as MikroOptions<ProductType>
    )
  }

  async upsert(
    types: CreateProductTypeDTO[],
    context: Context = {}
  ): Promise<ProductType[]> {
    const typesValues = types.map((type) => type.value)
    const existingTypes = await this.find(
      {
        where: {
          value: {
            $in: typesValues,
          },
        },
      },
      context
    )

    const existingTypesMap = new Map(
      existingTypes.map<[string, ProductType]>((type) => [type.value, type])
    )

    const upsertedTypes: ProductType[] = []
    const typesToCreate: RequiredEntityData<ProductType>[] = []

    types.forEach((type) => {
      const aType = existingTypesMap.get(type.value)
      if (aType) {
        upsertedTypes.push(aType)
      } else {
        const newType = this.manager_.create(ProductType, type)
        typesToCreate.push(newType)
      }
    })

    if (typesToCreate.length) {
      const newTypes: ProductType[] = []
      typesToCreate.forEach((type) => {
        newTypes.push(this.manager_.create(ProductType, type))
      })

      await this.manager_.persistAndFlush(newTypes)
      upsertedTypes.push(...newTypes)
    }

    return upsertedTypes
  }
}

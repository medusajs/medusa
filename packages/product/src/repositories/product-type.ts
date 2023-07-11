import {
  FilterQuery as MikroFilterQuery,
  FindOptions as MikroOptions,
  LoadStrategy,
  RequiredEntityData,
} from "@mikro-orm/core"
import { Product, ProductType } from "@models"
import { Context, CreateProductTypeDTO, DAL } from "@medusajs/types"
import { AbstractBaseRepository } from "./base"
import { SqlEntityManager } from "@mikro-orm/postgresql"

export class ProductTypeRepository extends AbstractBaseRepository<ProductType> {
  protected readonly manager_: SqlEntityManager

  constructor({ manager }: { manager: SqlEntityManager }) {
    // @ts-ignore
    super(...arguments)
    this.manager_ = manager
  }

  async find(
    findOptions: DAL.FindOptions<ProductType> = { where: {} },
    context: Context = {}
  ): Promise<ProductType[]> {
    const findOptions_ = { ...findOptions }
    findOptions_.options ??= {}

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
    const findOptions_ = { ...findOptions }
    findOptions_.options ??= {}

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

  async delete(ids: string[], context: Context = {}): Promise<void> {
    const manager = (context.transactionManager ??
      this.manager_) as SqlEntityManager

    await manager.nativeDelete(Product, { id: { $in: ids } }, {})
  }

  async create(data: unknown[], context: Context = {}): Promise<ProductType[]> {
    throw new Error("Method not implemented.")
  }
}

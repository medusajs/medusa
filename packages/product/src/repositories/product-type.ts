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
import { InjectTransactionManager, MedusaContext } from "@medusajs/utils"

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
    const manager = (context.transactionManager ??
      this.manager_) as SqlEntityManager

    const findOptions_ = { ...findOptions }
    findOptions_.options ??= {}

    Object.assign(findOptions_.options, {
      strategy: LoadStrategy.SELECT_IN,
    })

    return await manager.find(
      ProductType,
      findOptions_.where as MikroFilterQuery<ProductType>,
      findOptions_.options as MikroOptions<ProductType>
    )
  }

  async findAndCount(
    findOptions: DAL.FindOptions<ProductType> = { where: {} },
    context: Context = {}
  ): Promise<[ProductType[], number]> {
    const manager = (context.transactionManager ??
      this.manager_) as SqlEntityManager

    const findOptions_ = { ...findOptions }
    findOptions_.options ??= {}

    Object.assign(findOptions_.options, {
      strategy: LoadStrategy.SELECT_IN,
    })

    return await manager.findAndCount(
      ProductType,
      findOptions_.where as MikroFilterQuery<ProductType>,
      findOptions_.options as MikroOptions<ProductType>
    )
  }

  @InjectTransactionManager()
  async upsert(
    types: CreateProductTypeDTO[],
    @MedusaContext()
    context: Context = {}
  ): Promise<ProductType[]> {
    const { transactionManager: manager } = context

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
        const newType = (manager as SqlEntityManager).create(ProductType, type)
        typesToCreate.push(newType)
      }
    })

    if (typesToCreate.length) {
      const newTypes: ProductType[] = []
      typesToCreate.forEach((type) => {
        newTypes.push((manager as SqlEntityManager).create(ProductType, type))
      })

      await (manager as SqlEntityManager).persist(newTypes)
      upsertedTypes.push(...newTypes)
    }

    return upsertedTypes
  }

  @InjectTransactionManager()
  async delete(
    ids: string[],
    @MedusaContext()
    { transactionManager: manager }: Context = {}
  ): Promise<void> {
    await (manager as SqlEntityManager).nativeDelete(
      Product,
      { id: { $in: ids } },
      {}
    )
  }

  @InjectTransactionManager()
  async create(
    data: unknown[],
    @MedusaContext()
    { transactionManager: manager }: Context = {}
  ): Promise<ProductType[]> {
    throw new Error("Method not implemented.")
  }
}

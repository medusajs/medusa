import {
  FilterQuery as MikroFilterQuery,
  FindOptions as MikroOptions,
  LoadStrategy,
} from "@mikro-orm/core"
import { ProductType } from "@models"
import {
  Context,
  CreateProductTypeDTO,
  DAL,
  UpdateProductTypeDTO,
} from "@medusajs/types"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { DALUtils, MedusaError } from "@medusajs/utils"

export class ProductTypeRepository extends DALUtils.MikroOrmBaseRepository {
  protected readonly manager_: SqlEntityManager

  constructor({ manager }: { manager: SqlEntityManager }) {
    // @ts-ignore
    // eslint-disable-next-line prefer-rest-params
    super(...arguments)
    this.manager_ = manager
  }

  async find(
    findOptions: DAL.FindOptions<ProductType> = { where: {} },
    context: Context = {}
  ): Promise<ProductType[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

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
    const manager = this.getActiveManager<SqlEntityManager>(context)

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

  async upsert(
    types: CreateProductTypeDTO[],
    context: Context = {}
  ): Promise<ProductType[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

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
    const typesToCreate: ProductType[] = []
    const typesToUpdate: ProductType[] = []

    types.forEach((type) => {
      const aType = existingTypesMap.get(type.value)
      if (aType) {
        const updatedType = manager.assign(aType, type)
        typesToUpdate.push(updatedType)
      } else {
        const newType = manager.create(ProductType, type)
        typesToCreate.push(newType)
      }
    })

    if (typesToCreate.length) {
      manager.persist(typesToCreate)
      upsertedTypes.push(...typesToCreate)
    }

    if (typesToUpdate.length) {
      manager.persist(typesToUpdate)
      upsertedTypes.push(...typesToUpdate)
    }

    return upsertedTypes
  }

  async delete(ids: string[], context: Context = {}): Promise<void> {
    const manager = this.getActiveManager<SqlEntityManager>(context)
    await manager.nativeDelete(ProductType, { id: { $in: ids } }, {})
  }

  async create(
    data: CreateProductTypeDTO[],
    context: Context = {}
  ): Promise<ProductType[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const productTypes = data.map((typeData) => {
      return manager.create(ProductType, typeData)
    })

    manager.persist(productTypes)

    return productTypes
  }

  async update(
    data: UpdateProductTypeDTO[],
    context: Context = {}
  ): Promise<ProductType[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)
    const typeIds = data.map((typeData) => typeData.id)
    const existingTypes = await this.find(
      {
        where: {
          id: {
            $in: typeIds,
          },
        },
      },
      context
    )

    const existingTypesMap = new Map(
      existingTypes.map<[string, ProductType]>((type) => [type.id, type])
    )

    const productTypes = data.map((typeData) => {
      const existingType = existingTypesMap.get(typeData.id)

      if (!existingType) {
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          `ProductType with id "${typeData.id}" not found`
        )
      }

      return manager.assign(existingType, typeData)
    })

    manager.persist(productTypes)

    return productTypes
  }
}

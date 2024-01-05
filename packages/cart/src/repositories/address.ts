import { Context, DAL } from "@medusajs/types"
import { DALUtils, MedusaError } from "@medusajs/utils"
import {
  LoadStrategy,
  FilterQuery as MikroFilterQuery,
  FindOptions as MikroOptions,
} from "@mikro-orm/core"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { Address } from "@models"
import { CreateAddressDTO, UpdateAddressDTO } from "../types"

export class AddressRepository extends DALUtils.MikroOrmBaseRepository {
  protected readonly manager_: SqlEntityManager

  constructor({ manager }: { manager: SqlEntityManager }) {
    // @ts-ignore
    // eslint-disable-next-line prefer-rest-params
    super(...arguments)
    this.manager_ = manager
  }

  async find(
    findOptions: DAL.FindOptions<Address> = { where: {} },
    context: Context = {}
  ): Promise<Address[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const findOptions_ = { ...findOptions }
    findOptions_.options ??= {}

    Object.assign(findOptions_.options, {
      strategy: LoadStrategy.SELECT_IN,
    })

    return await manager.find(
      Address,
      findOptions_.where as MikroFilterQuery<Address>,
      findOptions_.options as MikroOptions<Address>
    )
  }

  async findAndCount(
    findOptions: DAL.FindOptions<Address> = { where: {} },
    context: Context = {}
  ): Promise<[Address[], number]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const findOptions_ = { ...findOptions }
    findOptions_.options ??= {}

    Object.assign(findOptions_.options, {
      strategy: LoadStrategy.SELECT_IN,
    })

    return await manager.findAndCount(
      Address,
      findOptions_.where as MikroFilterQuery<Address>,
      findOptions_.options as MikroOptions<Address>
    )
  }

  async delete(ids: string[], context: Context = {}): Promise<void> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    await manager.nativeDelete(Address, { id: { $in: ids } }, {})
  }

  async create(
    data: CreateAddressDTO[],
    context: Context = {}
  ): Promise<Address[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const promotions = data.map((promotionData) => {
      return manager.create(Address, promotionData)
    })

    manager.persist(promotions)

    return promotions
  }

  async update(
    data: UpdateAddressDTO[],
    context: Context = {}
  ): Promise<Address[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)
    const ids = data.map((d) => d.id)
    const existingEntites = await this.find(
      {
        where: {
          id: {
            $in: ids,
          },
        },
      },
      context
    )

    const existingEntitesMap = new Map(
      existingEntites.map<[string, Address]>((entity) => [entity.id, entity])
    )

    const entities = data.map((entityData) => {
      const existingEntity = existingEntitesMap.get(entityData.id)

      if (!existingEntity) {
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          `Address with id "${entityData.id}" not found`
        )
      }

      return manager.assign(existingEntity, entityData)
    })

    manager.persist(entities)

    return entities
  }
}

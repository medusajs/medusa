import { Context, DAL } from "@medusajs/types"
import { DALUtils, MedusaError } from "@medusajs/utils"
import {
  LoadStrategy,
  FilterQuery as MikroFilterQuery,
  FindOptions as MikroOptions,
} from "@mikro-orm/core"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { Cart } from "@models"
import { CreateCartDTO, UpdateCartDTO } from "../types"

export class CartRepository extends DALUtils.MikroOrmBaseRepository {
  protected readonly manager_: SqlEntityManager

  constructor({ manager }: { manager: SqlEntityManager }) {
    // @ts-ignore
    // eslint-disable-next-line prefer-rest-params
    super(...arguments)
    this.manager_ = manager
  }

  async find(
    findOptions: DAL.FindOptions<Cart> = { where: {} },
    context: Context = {}
  ): Promise<Cart[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const findOptions_ = { ...findOptions }
    findOptions_.options ??= {}

    Object.assign(findOptions_.options, {
      strategy: LoadStrategy.SELECT_IN,
    })

    return await manager.find(
      Cart,
      findOptions_.where as MikroFilterQuery<Cart>,
      findOptions_.options as MikroOptions<Cart>
    )
  }

  async findAndCount(
    findOptions: DAL.FindOptions<Cart> = { where: {} },
    context: Context = {}
  ): Promise<[Cart[], number]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const findOptions_ = { ...findOptions }
    findOptions_.options ??= {}

    Object.assign(findOptions_.options, {
      strategy: LoadStrategy.SELECT_IN,
    })

    return await manager.findAndCount(
      Cart,
      findOptions_.where as MikroFilterQuery<Cart>,
      findOptions_.options as MikroOptions<Cart>
    )
  }

  async delete(ids: string[], context: Context = {}): Promise<void> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    await manager.nativeDelete(Cart, { id: { $in: ids } }, {})
  }

  async create(data: CreateCartDTO[], context: Context = {}): Promise<Cart[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const promotions = data.map((promotionData) => {
      return manager.create(Cart, promotionData)
    })

    manager.persist(promotions)

    return promotions
  }

  async update(data: UpdateCartDTO[], context: Context = {}): Promise<Cart[]> {
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
      existingEntites.map<[string, Cart]>((entity) => [
        entity.id,
        entity,
      ])
    )

    const entities = data.map((entityData) => {
      const existingEntity = existingEntitesMap.get(entityData.id)

      if (!existingEntity) {
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          `Cart with id "${entityData.id}" not found`
        )
      }

      return manager.assign(existingEntity, entityData)
    })

    manager.persist(entities)

    return entities
  }
}

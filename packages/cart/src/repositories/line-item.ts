import { Context, DAL } from "@medusajs/types"
import { DALUtils, MedusaError } from "@medusajs/utils"
import {
  LoadStrategy,
  FilterQuery as MikroFilterQuery,
  FindOptions as MikroOptions,
} from "@mikro-orm/core"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { LineItem } from "@models"
import { CreateLineItemDTO, UpdateLineItemDTO } from "../types/cart"

export class LineItemRepository extends DALUtils.MikroOrmBaseRepository {
  protected readonly manager_: SqlEntityManager

  constructor({ manager }: { manager: SqlEntityManager }) {
    // @ts-ignore
    // eslint-disable-next-line prefer-rest-params
    super(...arguments)
    this.manager_ = manager
  }

  async find(
    findOptions: DAL.FindOptions<LineItem> = { where: {} },
    context: Context = {}
  ): Promise<LineItem[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const findOptions_ = { ...findOptions }
    findOptions_.options ??= {}

    Object.assign(findOptions_.options, {
      strategy: LoadStrategy.SELECT_IN,
    })

    return await manager.find(
      LineItem,
      findOptions_.where as MikroFilterQuery<LineItem>,
      findOptions_.options as MikroOptions<LineItem>
    )
  }

  async findAndCount(
    findOptions: DAL.FindOptions<LineItem> = { where: {} },
    context: Context = {}
  ): Promise<[LineItem[], number]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const findOptions_ = { ...findOptions }
    findOptions_.options ??= {}

    Object.assign(findOptions_.options, {
      strategy: LoadStrategy.SELECT_IN,
    })

    return await manager.findAndCount(
      LineItem,
      findOptions_.where as MikroFilterQuery<LineItem>,
      findOptions_.options as MikroOptions<LineItem>
    )
  }

  async delete(ids: string[], context: Context = {}): Promise<void> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    await manager.nativeDelete(LineItem, { id: { $in: ids } }, {})
  }

  async create(
    data: CreateLineItemDTO[],
    context: Context = {}
  ): Promise<LineItem[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const created = data.map((toCreate) => {
      return manager.create(LineItem, toCreate)
    })

    manager.persist(created)

    return created
  }

  async update(
    data: UpdateLineItemDTO[],
    context: Context = {}
  ): Promise<LineItem[]> {
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
      existingEntites.map<[string, LineItem]>((entity) => [entity.id, entity])
    )

    const entities = data.map((entityData) => {
      const existingEntity = existingEntitesMap.get(entityData.id)

      if (!existingEntity) {
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          `LineItem with id "${entityData.id}" not found`
        )
      }

      return manager.assign(existingEntity, entityData)
    })

    manager.persist(entities)

    return entities
  }
}

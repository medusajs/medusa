import { Context, DAL } from "@medusajs/types"
import { DALUtils, MedusaError } from "@medusajs/utils"
import {
  LoadStrategy,
  FilterQuery as MikroFilterQuery,
  FindOptions as MikroOptions,
} from "@mikro-orm/core"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { Promotion } from "@models"
import { CreatePromotionDTO, UpdatePromotionDTO } from "../types"

export class PromotionRepository extends DALUtils.MikroOrmBaseRepository {
  protected readonly manager_: SqlEntityManager

  constructor({ manager }: { manager: SqlEntityManager }) {
    // @ts-ignore
    // eslint-disable-next-line prefer-rest-params
    super(...arguments)
    this.manager_ = manager
  }

  async find(
    findOptions: DAL.FindOptions<Promotion> = { where: {} },
    context: Context = {}
  ): Promise<Promotion[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const findOptions_ = { ...findOptions }
    findOptions_.options ??= {}

    Object.assign(findOptions_.options, {
      strategy: LoadStrategy.SELECT_IN,
    })

    return await manager.find(
      Promotion,
      findOptions_.where as MikroFilterQuery<Promotion>,
      findOptions_.options as MikroOptions<Promotion>
    )
  }

  async findAndCount(
    findOptions: DAL.FindOptions<Promotion> = { where: {} },
    context: Context = {}
  ): Promise<[Promotion[], number]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const findOptions_ = { ...findOptions }
    findOptions_.options ??= {}

    Object.assign(findOptions_.options, {
      strategy: LoadStrategy.SELECT_IN,
    })

    return await manager.findAndCount(
      Promotion,
      findOptions_.where as MikroFilterQuery<Promotion>,
      findOptions_.options as MikroOptions<Promotion>
    )
  }

  async delete(ids: string[], context: Context = {}): Promise<void> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    await manager.nativeDelete(Promotion, { id: { $in: ids } }, {})
  }

  async create(
    data: CreatePromotionDTO[],
    context: Context = {}
  ): Promise<Promotion[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const promotions = data.map((promotionData) => {
      return manager.create(Promotion, promotionData)
    })

    manager.persist(promotions)

    return promotions
  }

  async update(
    data: UpdatePromotionDTO[],
    context: Context = {}
  ): Promise<Promotion[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)
    const promotionIds = data.map((promotionData) => promotionData.id)
    const existingPromotions = await this.find(
      {
        where: {
          id: {
            $in: promotionIds,
          },
        },
      },
      context
    )

    const existingPromotionMap = new Map(
      existingPromotions.map<[string, Promotion]>((promotion) => [
        promotion.id,
        promotion,
      ])
    )

    const promotions = data.map((promotionData) => {
      const existingPromotion = existingPromotionMap.get(promotionData.id)

      if (!existingPromotion) {
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          `Promotion with id "${promotionData.id}" not found`
        )
      }

      return manager.assign(existingPromotion, promotionData)
    })

    manager.persist(promotions)

    return promotions
  }
}

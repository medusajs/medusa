import {
  Context,
  CreatePriceSetMoneyAmountDTO,
  DAL,
  UpdatePriceSetMoneyAmountDTO,
} from "@medusajs/types"
import { DALUtils, MedusaError } from "@medusajs/utils"
import {
  LoadStrategy,
  FilterQuery as MikroFilterQuery,
  FindOptions as MikroOptions,
} from "@mikro-orm/core"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { PriceSetMoneyAmount } from "@models"

export class PriceSetMoneyAmountRepository extends DALUtils.MikroOrmBaseRepository {
  protected readonly manager_: SqlEntityManager

  constructor({ manager }: { manager: SqlEntityManager }) {
    // @ts-ignore
    // eslint-disable-next-line prefer-rest-params
    super(...arguments)
    this.manager_ = manager
  }

  async find(
    findOptions: DAL.FindOptions<PriceSetMoneyAmount> = { where: {} },
    context: Context = {}
  ): Promise<PriceSetMoneyAmount[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const findOptions_ = { ...findOptions }
    findOptions_.options ??= {}

    Object.assign(findOptions_.options, {
      strategy: LoadStrategy.SELECT_IN,
    })

    return await manager.find(
      PriceSetMoneyAmount,
      findOptions_.where as MikroFilterQuery<PriceSetMoneyAmount>,
      findOptions_.options as MikroOptions<PriceSetMoneyAmount>
    )
  }

  async findAndCount(
    findOptions: DAL.FindOptions<PriceSetMoneyAmount> = { where: {} },
    context: Context = {}
  ): Promise<[PriceSetMoneyAmount[], number]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const findOptions_ = { ...findOptions }
    findOptions_.options ??= {}

    Object.assign(findOptions_.options, {
      strategy: LoadStrategy.SELECT_IN,
    })

    return await manager.findAndCount(
      PriceSetMoneyAmount,
      findOptions_.where as MikroFilterQuery<PriceSetMoneyAmount>,
      findOptions_.options as MikroOptions<PriceSetMoneyAmount>
    )
  }

  async delete(ids: string[], context: Context = {}): Promise<void> {
    const manager = this.getActiveManager<SqlEntityManager>(context)
    await manager.nativeDelete(PriceSetMoneyAmount, { id: { $in: ids } }, {})
  }

  async create(
    data: CreatePriceSetMoneyAmountDTO[],
    context: Context = {}
  ): Promise<PriceSetMoneyAmount[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const psma = data.map((psmaData) => {
      return manager.create(
        PriceSetMoneyAmount,
        psmaData as unknown as PriceSetMoneyAmount
      )
    })

    manager.persist(psma)

    return psma
  }

  async update(
    data: UpdatePriceSetMoneyAmountDTO[],
    context: Context = {}
  ): Promise<PriceSetMoneyAmount[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)
    const ids = data.map((psmaData) => psmaData.id)
    const existingPriceSetMoneyAmounts = await this.find(
      {
        where: {
          id: {
            $in: ids,
          },
        },
      },
      context
    )

    const existingPSMAMap = new Map(
      existingPriceSetMoneyAmounts.map<[string, PriceSetMoneyAmount]>(
        (psma) => [psma.id, psma]
      )
    )

    const priceSetMoneyAmounts = data.map((psmaData) => {
      const existingPSMA = existingPSMAMap.get(psmaData.id)

      if (!existingPSMA) {
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          `PriceSetMoneyAmount with id "${psmaData.id}" not found`
        )
      }

      return manager.assign(existingPSMA, psmaData)
    })

    manager.persist(priceSetMoneyAmounts)

    return priceSetMoneyAmounts
  }
}

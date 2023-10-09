import {
  Context,
  CreateMoneyAmountDTO,
  DAL,
  UpdateMoneyAmountDTO,
} from "@medusajs/types"
import { DALUtils, MedusaError } from "@medusajs/utils"
import {
  LoadStrategy,
  FilterQuery as MikroFilterQuery,
  FindOptions as MikroOptions,
} from "@mikro-orm/core"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { MoneyAmount } from "@models"

export class MoneyAmountRepository extends DALUtils.MikroOrmBaseRepository {
  protected readonly manager_: SqlEntityManager

  constructor({ manager }: { manager: SqlEntityManager }) {
    // @ts-ignore
    // eslint-disable-next-line prefer-rest-params
    super(...arguments)
    this.manager_ = manager
  }

  async find(
    findOptions: DAL.FindOptions<MoneyAmount> = { where: {} },
    context: Context = {}
  ): Promise<MoneyAmount[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const findOptions_ = { ...findOptions }
    findOptions_.options ??= {}

    Object.assign(findOptions_.options, {
      strategy: LoadStrategy.SELECT_IN,
    })

    return await manager.find(
      MoneyAmount,
      findOptions_.where as MikroFilterQuery<MoneyAmount>,
      findOptions_.options as MikroOptions<MoneyAmount>
    )
  }

  async findAndCount(
    findOptions: DAL.FindOptions<MoneyAmount> = { where: {} },
    context: Context = {}
  ): Promise<[MoneyAmount[], number]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const findOptions_ = { ...findOptions }
    findOptions_.options ??= {}

    Object.assign(findOptions_.options, {
      strategy: LoadStrategy.SELECT_IN,
    })

    return await manager.findAndCount(
      MoneyAmount,
      findOptions_.where as MikroFilterQuery<MoneyAmount>,
      findOptions_.options as MikroOptions<MoneyAmount>
    )
  }

  async delete(ids: string[], context: Context = {}): Promise<void> {
    const manager = this.getActiveManager<SqlEntityManager>(context)
    await manager.nativeDelete(MoneyAmount, { id: { $in: ids } }, {})
  }

  async create(
    data: CreateMoneyAmountDTO[],
    context: Context = {}
  ): Promise<MoneyAmount[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const moneyAmounts = data.map((moneyAmountData) => {
      return manager.create(MoneyAmount, moneyAmountData)
    })

    manager.persist(moneyAmounts)

    return moneyAmounts
  }

  async update(
    data: UpdateMoneyAmountDTO[],
    context: Context = {}
  ): Promise<MoneyAmount[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)
    const moneyAmountIds = data.map((moneyAmountData) => moneyAmountData.id)
    const existingMoneyAmounts = await this.find(
      {
        where: {
          id: {
            $in: moneyAmountIds,
          },
        },
      },
      context
    )

    const existingMoneyAmountMap = new Map(
      existingMoneyAmounts.map<[string, MoneyAmount]>((moneyAmount) => [
        moneyAmount.id,
        moneyAmount,
      ])
    )

    const moneyAmounts = data.map((moneyAmountData) => {
      const existingMoneyAmount = existingMoneyAmountMap.get(moneyAmountData.id)

      if (!existingMoneyAmount) {
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          `MoneyAmount with id "${moneyAmountData.id}" not found`
        )
      }

      return manager.assign(existingMoneyAmount, moneyAmountData)
    })

    manager.persist(moneyAmounts)

    return moneyAmounts
  }
}

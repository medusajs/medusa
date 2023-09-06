import {
  Context,
  CreateRuleTypeDTO,
  DAL,
  UpdateRuleTypeDTO,
} from "@medusajs/types"
import { DALUtils, MedusaError } from "@medusajs/utils"
import {
  LoadStrategy,
  FilterQuery as MikroFilterQuery,
  FindOptions as MikroOptions,
} from "@mikro-orm/core"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { RuleType } from "@models"

export class RuletypeRepository extends DALUtils.MikroOrmBaseRepository {
  protected readonly manager_: SqlEntityManager

  constructor({ manager }: { manager: SqlEntityManager }) {
    // @ts-ignore
    // eslint-disable-next-line prefer-rest-params
    super(...arguments)
    this.manager_ = manager
  }

  async find(
    findOptions: DAL.FindOptions<RuleType> = { where: {} },
    context: Context = {}
  ): Promise<RuleType[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const findOptions_ = { ...findOptions }
    findOptions_.options ??= {}

    Object.assign(findOptions_.options, {
      strategy: LoadStrategy.SELECT_IN,
    })

    return await manager.find(
      RuleType,
      findOptions_.where as MikroFilterQuery<RuleType>,
      findOptions_.options as MikroOptions<RuleType>
    )
  }

  async findAndCount(
    findOptions: DAL.FindOptions<RuleType> = { where: {} },
    context: Context = {}
  ): Promise<[RuleType[], number]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const findOptions_ = { ...findOptions }
    findOptions_.options ??= {}

    Object.assign(findOptions_.options, {
      strategy: LoadStrategy.SELECT_IN,
    })

    return await manager.findAndCount(
      RuleType,
      findOptions_.where as MikroFilterQuery<RuleType>,
      findOptions_.options as MikroOptions<RuleType>
    )
  }

  async delete(ids: string[], context: Context = {}): Promise<void> {
    const manager = this.getActiveManager<SqlEntityManager>(context)
    await manager.nativeDelete(RuleType, { id: { $in: ids } }, {})
  }

  async create(
    data: CreateRuleTypeDTO[],
    context: Context = {}
  ): Promise<RuleType[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const moneyAmounts = data.map((ruleTypeData) => {
      return manager.create(RuleType, ruleTypeData)
    })

    manager.persist(moneyAmounts)

    return moneyAmounts
  }

  async update(
    data: UpdateRuleTypeDTO[],
    context: Context = {}
  ): Promise<RuleType[]> {
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
      existingMoneyAmounts.map<[string, RuleType]>((moneyAmount) => [
        moneyAmount.id,
        moneyAmount,
      ])
    )

    const moneyAmounts = data.map((moneyAmountData) => {
      const existingMoneyAmount = existingMoneyAmountMap.get(moneyAmountData.id)

      if (!existingMoneyAmount) {
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          `RuleType with id "${moneyAmountData.id}" not found`
        )
      }

      return manager.assign(existingMoneyAmount, moneyAmountData)
    })

    manager.persist(moneyAmounts)

    return moneyAmounts
  }
}

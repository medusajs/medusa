import {
  Context,
  CreatePriceSetMoneyAmountRulesDTO,
  DAL,
  UpdatePriceSetMoneyAmountRulesDTO,
} from "@medusajs/types"
import { DALUtils, MedusaError } from "@medusajs/utils"
import {
  LoadStrategy,
  FilterQuery as MikroFilterQuery,
  FindOptions as MikroOptions,
} from "@mikro-orm/core"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { PriceSetMoneyAmountRules } from "@models"

export class PriceSetMoneyAmountRulesRepository extends DALUtils.MikroOrmBaseRepository {
  protected readonly manager_: SqlEntityManager

  constructor({ manager }: { manager: SqlEntityManager }) {
    // @ts-ignore
    // eslint-disable-next-line prefer-rest-params
    super(...arguments)
    this.manager_ = manager
  }

  async find(
    findOptions: DAL.FindOptions<PriceSetMoneyAmountRules> = { where: {} },
    context: Context = {}
  ): Promise<PriceSetMoneyAmountRules[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const findOptions_ = { ...findOptions }
    findOptions_.options ??= {}

    Object.assign(findOptions_.options, {
      strategy: LoadStrategy.SELECT_IN,
    })

    return await manager.find(
      PriceSetMoneyAmountRules,
      findOptions_.where as MikroFilterQuery<PriceSetMoneyAmountRules>,
      findOptions_.options as MikroOptions<PriceSetMoneyAmountRules>
    )
  }

  async findAndCount(
    findOptions: DAL.FindOptions<PriceSetMoneyAmountRules> = { where: {} },
    context: Context = {}
  ): Promise<[PriceSetMoneyAmountRules[], number]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const findOptions_ = { ...findOptions }
    findOptions_.options ??= {}

    Object.assign(findOptions_.options, {
      strategy: LoadStrategy.SELECT_IN,
    })

    return await manager.findAndCount(
      PriceSetMoneyAmountRules,
      findOptions_.where as MikroFilterQuery<PriceSetMoneyAmountRules>,
      findOptions_.options as MikroOptions<PriceSetMoneyAmountRules>
    )
  }

  async delete(ids: string[], context: Context = {}): Promise<void> {
    const manager = this.getActiveManager<SqlEntityManager>(context)
    await manager.nativeDelete(PriceSetMoneyAmountRules, { id: { $in: ids } })
  }

  async create(
    data: CreatePriceSetMoneyAmountRulesDTO[],
    context: Context = {}
  ): Promise<PriceSetMoneyAmountRules[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const psmar = data.map((psmarData) => {
      return manager.create(PriceSetMoneyAmountRules, psmarData)
    })

    manager.persist(psmar)

    return psmar
  }

  async update(
    data: UpdatePriceSetMoneyAmountRulesDTO[],
    context: Context = {}
  ): Promise<PriceSetMoneyAmountRules[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)
    const psmarIds = data.map((psmar) => psmar.id)
    const existingRecords = await this.find(
      {
        where: {
          id: {
            $in: psmarIds,
          },
        },
      },
      context
    )

    const psmarMap = new Map(
      existingRecords.map<[string, PriceSetMoneyAmountRules]>((psmar) => [
        psmar.id,
        psmar,
      ])
    )

    const psmar = data.map((psmarData) => {
      const existingRecord = psmarMap.get(psmarData.id)

      if (!existingRecord) {
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          `PriceSetMoneyAmountRules with id "${psmarData.id}" not found`
        )
      }

      return manager.assign(existingRecord, psmarData)
    })

    manager.persist(psmar)

    return psmar
  }
}

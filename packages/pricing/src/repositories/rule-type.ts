import {
  Context,
  CreateRuleTypeDTO,
  DAL,
  UpdateRuleTypeDTO,
} from "@medusajs/types"
import { DALUtils, MedusaError, validateRuleAttributes } from "@medusajs/utils"
import {
  LoadStrategy,
  FilterQuery as MikroFilterQuery,
  FindOptions as MikroOptions,
} from "@mikro-orm/core"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { RuleType } from "@models"

export class RuleTypeRepository extends DALUtils.MikroOrmBaseRepository {
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
    validateRuleAttributes(data.map((d) => d.rule_attribute))

    const manager = this.getActiveManager<SqlEntityManager>(context)

    const ruleTypes = data.map((ruleTypeData) => {
      return manager.create(RuleType, ruleTypeData)
    })

    manager.persist(ruleTypes)

    return ruleTypes
  }

  async update(
    data: UpdateRuleTypeDTO[],
    context: Context = {}
  ): Promise<RuleType[]> {
    validateRuleAttributes(data.map((d) => d.rule_attribute))

    const manager = this.getActiveManager<SqlEntityManager>(context)
    const ruleTypeIds = data.map((ruleType) => ruleType.id)
    const existingRuleTypes = await this.find(
      {
        where: {
          id: {
            $in: ruleTypeIds,
          },
        },
      },
      context
    )

    const existingRuleTypesMap = new Map(
      existingRuleTypes.map<[string, RuleType]>((ruleType) => [
        ruleType.id,
        ruleType,
      ])
    )

    const ruleTypes = data.map((ruleTypeData) => {
      const existingRuleType = existingRuleTypesMap.get(ruleTypeData.id)

      if (!existingRuleType) {
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          `RuleType with id "${ruleTypeData.id}" not found`
        )
      }

      return manager.assign(existingRuleType, ruleTypeData)
    })

    manager.persist(ruleTypes)

    return ruleTypes
  }
}

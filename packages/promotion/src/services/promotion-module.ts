import {
  Context,
  DAL,
  FindConfig,
  InternalModuleDeclaration,
  ModuleJoinerConfig,
  PromotionTypes,
} from "@medusajs/types"
import {
  InjectManager,
  InjectTransactionManager,
  MedusaContext,
  MedusaError,
} from "@medusajs/utils"
import { ApplicationMethod, Promotion } from "@models"
import {
  ApplicationMethodService,
  PromotionRuleService,
  PromotionRuleValueService,
  PromotionService,
} from "@services"
import { joinerConfig } from "../joiner-config"
import {
  CreateApplicationMethodDTO,
  CreatePromotionDTO,
  UpdateApplicationMethodDTO,
  UpdatePromotionDTO,
} from "../types"
import {
  allowedAllocationForQuantity,
  validateApplicationMethodAttributes,
  validatePromotionRuleAttributes,
} from "../utils"

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  promotionService: PromotionService
  applicationMethodService: ApplicationMethodService
  promotionRuleService: PromotionRuleService
  promotionRuleValueService: PromotionRuleValueService
}

export default class PromotionModuleService<
  TPromotion extends Promotion = Promotion
> implements PromotionTypes.IPromotionModuleService
{
  protected baseRepository_: DAL.RepositoryService
  protected promotionService_: PromotionService
  protected applicationMethodService_: ApplicationMethodService
  protected promotionRuleService_: PromotionRuleService
  protected promotionRuleValueService_: PromotionRuleValueService

  constructor(
    {
      baseRepository,
      promotionService,
      applicationMethodService,
      promotionRuleService,
      promotionRuleValueService,
    }: InjectedDependencies,
    protected readonly moduleDeclaration: InternalModuleDeclaration
  ) {
    this.baseRepository_ = baseRepository
    this.promotionService_ = promotionService
    this.applicationMethodService_ = applicationMethodService
    this.promotionRuleService_ = promotionRuleService
    this.promotionRuleValueService_ = promotionRuleValueService
  }

  __joinerConfig(): ModuleJoinerConfig {
    return joinerConfig
  }

  @InjectManager("baseRepository_")
  async retrieve(
    id: string,
    config: FindConfig<PromotionTypes.PromotionDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<PromotionTypes.PromotionDTO> {
    const promotion = await this.promotionService_.retrieve(
      id,
      config,
      sharedContext
    )

    return await this.baseRepository_.serialize<PromotionTypes.PromotionDTO>(
      promotion,
      {
        populate: true,
      }
    )
  }

  @InjectManager("baseRepository_")
  async list(
    filters: PromotionTypes.FilterablePromotionProps = {},
    config: FindConfig<PromotionTypes.PromotionDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<PromotionTypes.PromotionDTO[]> {
    const promotions = await this.promotionService_.list(
      filters,
      config,
      sharedContext
    )

    return await this.baseRepository_.serialize<PromotionTypes.PromotionDTO[]>(
      promotions,
      {
        populate: true,
      }
    )
  }

  @InjectManager("baseRepository_")
  async create(
    data: PromotionTypes.CreatePromotionDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<PromotionTypes.PromotionDTO[]> {
    const promotions = await this.create_(data, sharedContext)

    return await this.list(
      { id: promotions.map((p) => p!.id) },
      {
        relations: [
          "application_method",
          "application_method.target_rules",
          "application_method.target_rules.values",
          "rules",
          "rules.values",
        ],
      },
      sharedContext
    )
  }

  @InjectTransactionManager("baseRepository_")
  protected async create_(
    data: PromotionTypes.CreatePromotionDTO[],
    @MedusaContext() sharedContext: Context = {}
  ) {
    const promotionsData: CreatePromotionDTO[] = []
    const applicationMethodsData: CreateApplicationMethodDTO[] = []

    const promotionCodeApplicationMethodDataMap = new Map<
      string,
      PromotionTypes.CreateApplicationMethodDTO
    >()

    const promotionCodeRulesDataMap = new Map<
      string,
      PromotionTypes.CreatePromotionRuleDTO[]
    >()
    const applicationMethodRuleMap = new Map<
      string,
      PromotionTypes.CreatePromotionRuleDTO[]
    >()

    for (const {
      application_method: applicationMethodData,
      rules: rulesData,
      ...promotionData
    } of data) {
      if (applicationMethodData) {
        promotionCodeApplicationMethodDataMap.set(
          promotionData.code,
          applicationMethodData
        )
      }

      if (rulesData) {
        promotionCodeRulesDataMap.set(promotionData.code, rulesData)
      }

      promotionsData.push(promotionData)
    }

    const createdPromotions = await this.promotionService_.create(
      promotionsData,
      sharedContext
    )

    for (const promotion of createdPromotions) {
      const applMethodData = promotionCodeApplicationMethodDataMap.get(
        promotion.code
      )

      if (applMethodData) {
        const {
          target_rules: targetRulesData = [],
          ...applicationMethodWithoutRules
        } = applMethodData
        const applicationMethodData = {
          ...applicationMethodWithoutRules,
          promotion,
        }

        validateApplicationMethodAttributes(applicationMethodData)
        applicationMethodsData.push(applicationMethodData)

        if (targetRulesData.length) {
          applicationMethodRuleMap.set(promotion.id, targetRulesData)
        }
      }

      await this.createPromotionRulesAndValues(
        promotionCodeRulesDataMap.get(promotion.code) || [],
        "promotions",
        promotion,
        sharedContext
      )
    }

    const createdApplicationMethods =
      await this.applicationMethodService_.create(
        applicationMethodsData,
        sharedContext
      )

    for (const applicationMethod of createdApplicationMethods) {
      await this.createPromotionRulesAndValues(
        applicationMethodRuleMap.get(applicationMethod.promotion.id) || [],
        "application_methods",
        applicationMethod,
        sharedContext
      )
    }

    return createdPromotions
  }

  @InjectManager("baseRepository_")
  async update(
    data: PromotionTypes.UpdatePromotionDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<PromotionTypes.PromotionDTO[]> {
    const promotions = await this.update_(data, sharedContext)

    return await this.list(
      { id: promotions.map((p) => p!.id) },
      {
        relations: [
          "application_method",
          "application_method.target_rules",
          "rules",
          "rules.values",
        ],
      },
      sharedContext
    )
  }

  @InjectTransactionManager("baseRepository_")
  protected async update_(
    data: PromotionTypes.UpdatePromotionDTO[],
    @MedusaContext() sharedContext: Context = {}
  ) {
    const promotionIds = data.map((d) => d.id)
    const existingPromotions = await this.promotionService_.list(
      {
        id: promotionIds,
      },
      {
        relations: ["application_method"],
      }
    )
    const existingPromotionsMap = new Map<string, Promotion>(
      existingPromotions.map((promotion) => [promotion.id, promotion])
    )

    const promotionsData: UpdatePromotionDTO[] = []
    const applicationMethodsData: UpdateApplicationMethodDTO[] = []

    for (const {
      application_method: applicationMethodData,
      ...promotionData
    } of data) {
      promotionsData.push(promotionData)

      if (!applicationMethodData) {
        continue
      }

      const existingPromotion = existingPromotionsMap.get(promotionData.id)
      const existingApplicationMethod = existingPromotion?.application_method

      if (!existingApplicationMethod) {
        continue
      }

      if (
        applicationMethodData.allocation &&
        !allowedAllocationForQuantity.includes(applicationMethodData.allocation)
      ) {
        applicationMethodData.max_quantity = null
      }

      validateApplicationMethodAttributes({
        type: applicationMethodData.type || existingApplicationMethod.type,
        target_type:
          applicationMethodData.target_type ||
          existingApplicationMethod.target_type,
        allocation:
          applicationMethodData.allocation ||
          existingApplicationMethod.allocation,
        max_quantity:
          applicationMethodData.max_quantity ||
          existingApplicationMethod.max_quantity,
      })

      applicationMethodsData.push(applicationMethodData)
    }

    const updatedPromotions = this.promotionService_.update(
      promotionsData,
      sharedContext
    )

    if (applicationMethodsData.length) {
      await this.applicationMethodService_.update(
        applicationMethodsData,
        sharedContext
      )
    }

    return updatedPromotions
  }

  @InjectManager("baseRepository_")
  @InjectTransactionManager("baseRepository_")
  async addPromotionRules(
    promotionId: string,
    rulesData: PromotionTypes.CreatePromotionRuleDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<PromotionTypes.PromotionDTO> {
    const promotion = await this.promotionService_.retrieve(promotionId)

    await this.createPromotionRulesAndValues(
      rulesData,
      "promotions",
      promotion,
      sharedContext
    )

    return this.retrieve(promotionId, {
      relations: ["rules", "rules.values"],
    })
  }

  @InjectManager("baseRepository_")
  @InjectTransactionManager("baseRepository_")
  async addPromotionTargetRules(
    promotionId: string,
    rulesData: PromotionTypes.CreatePromotionRuleDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<PromotionTypes.PromotionDTO> {
    const promotion = await this.promotionService_.retrieve(promotionId, {
      relations: ["application_method"],
    })

    const applicationMethod = promotion.application_method

    if (!applicationMethod) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `application_method for promotion not found`
      )
    }

    await this.createPromotionRulesAndValues(
      rulesData,
      "application_methods",
      applicationMethod,
      sharedContext
    )

    return this.retrieve(promotionId, {
      relations: [
        "rules",
        "rules.values",
        "application_method",
        "application_method.target_rules",
        "application_method.target_rules.values",
      ],
    })
  }

  protected async createPromotionRulesAndValues(
    rulesData: PromotionTypes.CreatePromotionRuleDTO[],
    relationName: "promotions" | "application_methods",
    relation: Promotion | ApplicationMethod,
    sharedContext: Context
  ) {
    validatePromotionRuleAttributes(rulesData)

    for (const ruleData of rulesData) {
      const { values, ...rest } = ruleData
      const promotionRuleData = {
        ...rest,
        [relationName]: [relation],
      }

      const [createdPromotionRule] = await this.promotionRuleService_.create(
        [promotionRuleData],
        sharedContext
      )

      const ruleValues = Array.isArray(values) ? values : [values]
      const promotionRuleValuesData = ruleValues.map((ruleValue) => ({
        value: ruleValue,
        promotion_rule: createdPromotionRule,
      }))

      await this.promotionRuleValueService_.create(promotionRuleValuesData)
    }
  }

  @InjectTransactionManager("baseRepository_")
  async delete(
    ids: string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    await this.promotionService_.delete(ids, sharedContext)
  }

  @InjectManager("baseRepository_")
  async removePromotionRules(
    promotionId: string,
    rulesData: PromotionTypes.RemovePromotionRuleDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<PromotionTypes.PromotionDTO> {
    await this.removePromotionRules_(promotionId, rulesData, sharedContext)

    return this.retrieve(
      promotionId,
      { relations: ["rules", "rules.values"] },
      sharedContext
    )
  }

  @InjectTransactionManager("baseRepository_")
  protected async removePromotionRules_(
    promotionId: string,
    rulesData: PromotionTypes.RemovePromotionRuleDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    const promotionRuleIdsToRemove = rulesData.map((ruleData) => ruleData.id)
    const promotion = await this.promotionService_.retrieve(
      promotionId,
      { relations: ["rules"] },
      sharedContext
    )

    const existingPromotionRuleIds = promotion.rules
      .toArray()
      .map((rule) => rule.id)

    const idsToRemove = promotionRuleIdsToRemove.filter((ruleId) =>
      existingPromotionRuleIds.includes(ruleId)
    )

    await this.promotionRuleService_.delete(idsToRemove, sharedContext)
  }

  @InjectManager("baseRepository_")
  async removePromotionTargetRules(
    promotionId: string,
    rulesData: PromotionTypes.RemovePromotionRuleDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<PromotionTypes.PromotionDTO> {
    await this.removePromotionTargetRules_(
      promotionId,
      rulesData,
      sharedContext
    )

    return this.retrieve(
      promotionId,
      {
        relations: [
          "rules",
          "rules.values",
          "application_method",
          "application_method.target_rules",
          "application_method.target_rules.values",
        ],
      },
      sharedContext
    )
  }

  @InjectTransactionManager("baseRepository_")
  protected async removePromotionTargetRules_(
    promotionId: string,
    rulesData: PromotionTypes.RemovePromotionRuleDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    const promotionRuleIds = rulesData.map((ruleData) => ruleData.id)
    const promotion = await this.promotionService_.retrieve(
      promotionId,
      { relations: ["application_method.target_rules"] },
      sharedContext
    )

    const applicationMethod = promotion.application_method

    if (!applicationMethod) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `application_method for promotion not found`
      )
    }

    const targetRuleIdsToRemove = applicationMethod.target_rules
      .toArray()
      .filter((rule) => promotionRuleIds.includes(rule.id))
      .map((rule) => rule.id)

    await this.promotionRuleService_.delete(
      targetRuleIdsToRemove,
      sharedContext
    )
  }
}

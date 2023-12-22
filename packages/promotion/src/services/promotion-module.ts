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
} from "@medusajs/utils"
import { Promotion } from "@models"
import {
  ApplicationMethodService,
  PromotionRuleService,
  PromotionRuleValueService,
  PromotionService,
} from "@services"
import { joinerConfig } from "../joiner-config"
import { CreateApplicationMethodDTO, CreatePromotionDTO } from "../types"
import { validateApplicationMethodAttributes } from "../utils"

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

    return this.baseRepository_.serialize<PromotionTypes.PromotionDTO[]>(
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
        relations: ["application_method", "rules", "rules.values"],
      },
      sharedContext
    )
  }

  @InjectTransactionManager("baseRepository_")
  protected async create_(
    data: PromotionTypes.CreatePromotionDTO[],
    @MedusaContext() sharedContext: Context = {}
  ) {
    const promotionCodeApplicationMethodDataMap = new Map<
      string,
      PromotionTypes.CreateApplicationMethodDTO
    >()
    const promotionCodeRulesDataMap = new Map<
      string,
      PromotionTypes.CreatePromotionRuleDTO[]
    >()
    const promotionsData: CreatePromotionDTO[] = []
    const applicationMethodsData: CreateApplicationMethodDTO[] = []

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
        const applicationMethodData = {
          ...applMethodData,
          promotion,
        }

        validateApplicationMethodAttributes(applicationMethodData)
        applicationMethodsData.push(applicationMethodData)
      }

      const rulesData = promotionCodeRulesDataMap.get(promotion.code) || []

      for (const ruleData of rulesData) {
        const { values, ...rest } = ruleData
        const promotionRuleData = {
          ...rest,
          promotions: [promotion],
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

    await this.applicationMethodService_.create(
      applicationMethodsData,
      sharedContext
    )

    return createdPromotions
  }
}

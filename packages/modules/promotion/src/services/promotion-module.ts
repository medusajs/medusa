import {
  CampaignBudgetTypeValues,
  Context,
  DAL,
  InternalModuleDeclaration,
  ModuleJoinerConfig,
  ModulesSdkTypes,
  PromotionTypes,
} from "@medusajs/types"
import {
  ApplicationMethodAllocation,
  ApplicationMethodTargetType,
  CampaignBudgetType,
  ComputedActions,
  InjectManager,
  InjectTransactionManager,
  MedusaContext,
  MedusaError,
  ModulesSdkUtils,
  PromotionType,
  arrayDifference,
  deduplicate,
  isDefined,
  isPresent,
  isString,
} from "@medusajs/utils"
import {
  ApplicationMethod,
  Campaign,
  CampaignBudget,
  Promotion,
  PromotionRule,
  PromotionRuleValue,
} from "@models"
import {
  ApplicationMethodRuleTypes,
  CreateApplicationMethodDTO,
  CreateCampaignBudgetDTO,
  CreateCampaignDTO,
  CreatePromotionDTO,
  CreatePromotionRuleDTO,
  UpdateApplicationMethodDTO,
  UpdateCampaignBudgetDTO,
  UpdateCampaignDTO,
  UpdatePromotionDTO,
} from "@types"
import {
  ComputeActionUtils,
  allowedAllocationForQuantity,
  areRulesValidForContext,
  validateApplicationMethodAttributes,
  validatePromotionRuleAttributes,
} from "@utils"
import { entityNameToLinkableKeysMap, joinerConfig } from "../joiner-config"
import { CreatePromotionRuleValueDTO } from "../types/promotion-rule-value"

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  promotionService: ModulesSdkTypes.InternalModuleService<any>
  applicationMethodService: ModulesSdkTypes.InternalModuleService<any>
  promotionRuleService: ModulesSdkTypes.InternalModuleService<any>
  promotionRuleValueService: ModulesSdkTypes.InternalModuleService<any>
  campaignService: ModulesSdkTypes.InternalModuleService<any>
  campaignBudgetService: ModulesSdkTypes.InternalModuleService<any>
}

const generateMethodForModels = [
  ApplicationMethod,
  Campaign,
  CampaignBudget,
  PromotionRule,
  PromotionRuleValue,
]

export default class PromotionModuleService<
    TApplicationMethod extends ApplicationMethod = ApplicationMethod,
    TPromotion extends Promotion = Promotion,
    TPromotionRule extends PromotionRule = PromotionRule,
    TPromotionRuleValue extends PromotionRuleValue = PromotionRuleValue,
    TCampaign extends Campaign = Campaign,
    TCampaignBudget extends CampaignBudget = CampaignBudget
  >
  extends ModulesSdkUtils.abstractModuleServiceFactory<
    InjectedDependencies,
    PromotionTypes.PromotionDTO,
    {
      ApplicationMethod: { dto: PromotionTypes.ApplicationMethodDTO }
      Campaign: { dto: PromotionTypes.CampaignDTO }
      CampaignBudget: { dto: PromotionTypes.CampaignBudgetDTO }
      PromotionRule: { dto: PromotionTypes.PromotionRuleDTO }
      PromotionRuleValue: { dto: PromotionTypes.PromotionRuleValueDTO }
    }
  >(Promotion, generateMethodForModels, entityNameToLinkableKeysMap)
  implements PromotionTypes.IPromotionModuleService
{
  protected baseRepository_: DAL.RepositoryService
  protected promotionService_: ModulesSdkTypes.InternalModuleService<TPromotion>
  protected applicationMethodService_: ModulesSdkTypes.InternalModuleService<TApplicationMethod>
  protected promotionRuleService_: ModulesSdkTypes.InternalModuleService<TPromotionRule>
  protected promotionRuleValueService_: ModulesSdkTypes.InternalModuleService<TPromotionRuleValue>
  protected campaignService_: ModulesSdkTypes.InternalModuleService<TCampaign>
  protected campaignBudgetService_: ModulesSdkTypes.InternalModuleService<TCampaignBudget>

  constructor(
    {
      baseRepository,
      promotionService,
      applicationMethodService,
      promotionRuleService,
      promotionRuleValueService,
      campaignService,
      campaignBudgetService,
    }: InjectedDependencies,
    protected readonly moduleDeclaration: InternalModuleDeclaration
  ) {
    // @ts-ignore
    super(...arguments)

    this.baseRepository_ = baseRepository
    this.promotionService_ = promotionService
    this.applicationMethodService_ = applicationMethodService
    this.promotionRuleService_ = promotionRuleService
    this.promotionRuleValueService_ = promotionRuleValueService
    this.campaignService_ = campaignService
    this.campaignBudgetService_ = campaignBudgetService
  }

  __joinerConfig(): ModuleJoinerConfig {
    return joinerConfig
  }

  @InjectManager("baseRepository_")
  async registerUsage(
    computedActions: PromotionTypes.UsageComputedActions[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    const promotionCodes = computedActions
      .map((computedAction) => computedAction.code)
      .filter(Boolean)

    const promotionCodeCampaignBudgetMap = new Map<
      string,
      UpdateCampaignBudgetDTO
    >()
    const promotionCodeUsageMap = new Map<string, boolean>()

    const existingPromotions = await this.list(
      { code: promotionCodes },
      { relations: ["application_method", "campaign", "campaign.budget"] },
      sharedContext
    )

    const existingPromotionsMap = new Map<string, PromotionTypes.PromotionDTO>(
      existingPromotions.map((promotion) => [promotion.code!, promotion])
    )

    for (let computedAction of computedActions) {
      if (!ComputeActionUtils.canRegisterUsage(computedAction)) {
        continue
      }

      const promotion = existingPromotionsMap.get(computedAction.code)

      if (!promotion) {
        continue
      }

      const campaignBudget = promotion.campaign?.budget

      if (!campaignBudget) {
        continue
      }

      if (campaignBudget.type === CampaignBudgetType.SPEND) {
        const campaignBudgetData = promotionCodeCampaignBudgetMap.get(
          campaignBudget.id
        ) || { id: campaignBudget.id, used: campaignBudget.used ?? 0 }

        campaignBudgetData.used =
          (campaignBudgetData.used ?? 0) + computedAction.amount

        if (
          campaignBudget.limit &&
          campaignBudgetData.used > campaignBudget.limit
        ) {
          continue
        }

        promotionCodeCampaignBudgetMap.set(
          campaignBudget.id,
          campaignBudgetData
        )
      }

      if (campaignBudget.type === CampaignBudgetType.USAGE) {
        const promotionAlreadyUsed =
          promotionCodeUsageMap.get(promotion.code!) || false

        if (promotionAlreadyUsed) {
          continue
        }

        const campaignBudgetData = {
          id: campaignBudget.id,
          used: (campaignBudget.used ?? 0) + 1,
        }

        if (
          campaignBudget.limit &&
          campaignBudgetData.used > campaignBudget.limit
        ) {
          continue
        }

        promotionCodeCampaignBudgetMap.set(
          campaignBudget.id,
          campaignBudgetData
        )

        promotionCodeUsageMap.set(promotion.code!, true)
      }

      const campaignBudgetsData: UpdateCampaignBudgetDTO[] = []

      for (const [_, campaignBudgetData] of promotionCodeCampaignBudgetMap) {
        campaignBudgetsData.push(campaignBudgetData)
      }

      await this.campaignBudgetService_.update(
        campaignBudgetsData,
        sharedContext
      )
    }
  }

  @InjectManager("baseRepository_")
  async computeActions(
    promotionCodes: string[],
    applicationContext: PromotionTypes.ComputeActionContext,
    options: PromotionTypes.ComputeActionOptions = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<PromotionTypes.ComputeActions[]> {
    const { prevent_auto_promotions: preventAutoPromotions } = options
    const computedActions: PromotionTypes.ComputeActions[] = []
    const { items = [], shipping_methods: shippingMethods = [] } =
      applicationContext
    const appliedItemCodes: string[] = []
    const appliedShippingCodes: string[] = []
    const codeAdjustmentMap = new Map<
      string,
      PromotionTypes.ComputeActionAdjustmentLine[]
    >()
    const methodIdPromoValueMap = new Map<string, number>()
    const automaticPromotions = preventAutoPromotions
      ? []
      : await this.list(
          { is_automatic: true },
          { select: ["code"], take: null },
          sharedContext
        )

    // Promotions we need to apply includes all the codes that are passed as an argument
    // to this method, along with any automatic promotions that can be applied to the context
    const automaticPromotionCodes = automaticPromotions.map((p) => p.code!)
    const promotionCodesToApply = [
      ...promotionCodes,
      ...automaticPromotionCodes,
    ]

    items.forEach((item) => {
      item.adjustments?.forEach((adjustment) => {
        if (isString(adjustment.code)) {
          const adjustments = codeAdjustmentMap.get(adjustment.code) || []

          adjustments.push(adjustment)

          codeAdjustmentMap.set(adjustment.code, adjustments)
          appliedItemCodes.push(adjustment.code)
        }
      })
    })

    shippingMethods.forEach((shippingMethod) => {
      shippingMethod.adjustments?.forEach((adjustment) => {
        if (isString(adjustment.code)) {
          const adjustments = codeAdjustmentMap.get(adjustment.code) || []

          adjustments.push(adjustment)

          codeAdjustmentMap.set(adjustment.code, adjustments)
          appliedShippingCodes.push(adjustment.code)
        }
      })
    })

    const promotions = await this.list(
      {
        code: [
          ...promotionCodesToApply,
          ...appliedItemCodes,
          ...appliedShippingCodes,
        ],
      },
      {
        relations: [
          "application_method",
          "application_method.target_rules",
          "application_method.target_rules.values",
          "application_method.buy_rules",
          "application_method.buy_rules.values",
          "rules",
          "rules.values",
          "campaign",
          "campaign.budget",
        ],
        take: null,
      }
    )

    const existingPromotionsMap = new Map<string, PromotionTypes.PromotionDTO>(
      promotions.map((promotion) => [promotion.code!, promotion])
    )

    // We look at any existing promo codes applied in the context and recommend
    // them to be removed to start calculations from the beginning and refresh
    // the adjustments if they are requested to be applied again
    const appliedCodes = [...appliedShippingCodes, ...appliedItemCodes]

    for (const appliedCode of appliedCodes) {
      const promotion = existingPromotionsMap.get(appliedCode)
      const adjustments = codeAdjustmentMap.get(appliedCode) || []
      const action = appliedShippingCodes.includes(appliedCode)
        ? ComputedActions.REMOVE_SHIPPING_METHOD_ADJUSTMENT
        : ComputedActions.REMOVE_ITEM_ADJUSTMENT

      if (!promotion) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Applied Promotion for code (${appliedCode}) not found`
        )
      }

      adjustments.forEach((adjustment) =>
        computedActions.push({
          action,
          adjustment_id: adjustment.id,
          code: appliedCode,
        })
      )
    }

    // We sort the promo codes to apply with buy get type first as they
    // are likely to be most valuable.
    const sortedPermissionsToApply = promotions
      .filter((p) => promotionCodesToApply.includes(p.code!))
      .sort(ComputeActionUtils.sortByBuyGetType)

    for (const promotionToApply of sortedPermissionsToApply) {
      const promotion = existingPromotionsMap.get(promotionToApply.code!)!

      const {
        application_method: applicationMethod,
        rules: promotionRules = [],
      } = promotion

      if (!applicationMethod) {
        continue
      }

      const isPromotionApplicable = areRulesValidForContext(
        promotionRules,
        applicationContext
      )

      if (!isPromotionApplicable) {
        continue
      }

      if (promotion.type === PromotionType.BUYGET) {
        const computedActionsForItems =
          ComputeActionUtils.getComputedActionsForBuyGet(
            promotion,
            applicationContext[ApplicationMethodTargetType.ITEMS],
            methodIdPromoValueMap
          )

        computedActions.push(...computedActionsForItems)
      }

      if (promotion.type === PromotionType.STANDARD) {
        const isTargetOrder =
          applicationMethod.target_type === ApplicationMethodTargetType.ORDER
        const isTargetItems =
          applicationMethod.target_type === ApplicationMethodTargetType.ITEMS
        const isTargetShipping =
          applicationMethod.target_type ===
          ApplicationMethodTargetType.SHIPPING_METHODS
        const allocationOverride = isTargetOrder
          ? ApplicationMethodAllocation.ACROSS
          : undefined

        if (isTargetOrder || isTargetItems) {
          const computedActionsForItems =
            ComputeActionUtils.getComputedActionsForItems(
              promotion,
              applicationContext[ApplicationMethodTargetType.ITEMS],
              methodIdPromoValueMap,
              allocationOverride
            )

          computedActions.push(...computedActionsForItems)
        }

        if (isTargetShipping) {
          const computedActionsForShippingMethods =
            ComputeActionUtils.getComputedActionsForShippingMethods(
              promotion,
              applicationContext[ApplicationMethodTargetType.SHIPPING_METHODS],
              methodIdPromoValueMap
            )

          computedActions.push(...computedActionsForShippingMethods)
        }
      }
    }

    return computedActions
  }

  async create(
    data: PromotionTypes.CreatePromotionDTO,
    sharedContext?: Context
  ): Promise<PromotionTypes.PromotionDTO>

  async create(
    data: PromotionTypes.CreatePromotionDTO[],
    sharedContext?: Context
  ): Promise<PromotionTypes.PromotionDTO[]>

  @InjectManager("baseRepository_")
  async create(
    data:
      | PromotionTypes.CreatePromotionDTO
      | PromotionTypes.CreatePromotionDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<PromotionTypes.PromotionDTO | PromotionTypes.PromotionDTO[]> {
    const input = Array.isArray(data) ? data : [data]
    const createdPromotions = await this.create_(input, sharedContext)

    const promotions = await this.list(
      { id: createdPromotions.map((p) => p!.id) },
      {
        relations: [
          "application_method",
          "application_method.target_rules",
          "application_method.target_rules.values",
          "application_method.buy_rules",
          "application_method.buy_rules.values",
          "rules",
          "rules.values",
          "campaign",
          "campaign.budget",
        ],
        take: null,
      },
      sharedContext
    )

    return Array.isArray(data) ? promotions : promotions[0]
  }

  @InjectTransactionManager("baseRepository_")
  protected async create_(
    data: PromotionTypes.CreatePromotionDTO[],
    @MedusaContext() sharedContext: Context = {}
  ) {
    const promotionsData: CreatePromotionDTO[] = []
    const applicationMethodsData: CreateApplicationMethodDTO[] = []
    const campaignsData: CreateCampaignDTO[] = []
    const existingCampaigns = await this.campaignService_.list(
      { id: data.map((d) => d.campaign_id).filter((id) => isString(id)) },
      { relations: ["budget"] },
      sharedContext
    )

    const promotionCodeApplicationMethodDataMap = new Map<
      string,
      PromotionTypes.CreateApplicationMethodDTO
    >()
    const promotionCodeRulesDataMap = new Map<
      string,
      PromotionTypes.CreatePromotionRuleDTO[]
    >()
    const methodTargetRulesMap = new Map<
      string,
      PromotionTypes.CreatePromotionRuleDTO[]
    >()
    const methodBuyRulesMap = new Map<
      string,
      PromotionTypes.CreatePromotionRuleDTO[]
    >()
    const promotionCodeCampaignMap = new Map<
      string,
      PromotionTypes.CreateCampaignDTO
    >()

    for (const {
      application_method: applicationMethodData,
      rules: rulesData,
      campaign: campaignData,
      campaign_id: campaignId,
      ...promotionData
    } of data) {
      promotionCodeApplicationMethodDataMap.set(
        promotionData.code,
        applicationMethodData
      )

      if (rulesData) {
        promotionCodeRulesDataMap.set(promotionData.code, rulesData)
      }

      if (campaignData && campaignId) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Provide either the 'campaign' or 'campaign_id' parameter; both cannot be used simultaneously.`
        )
      }

      if (!campaignData && !campaignId) {
        promotionsData.push({ ...promotionData })

        continue
      }

      const existingCampaign = existingCampaigns.find(
        (c) => c.id === campaignId
      )

      if (campaignId && !existingCampaign) {
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          `Could not find campaign with id - ${campaignId}`
        )
      }

      const campaignCurrency =
        campaignData?.budget?.currency_code ||
        existingCampaigns.find((c) => c.id === campaignId)?.budget
          ?.currency_code

      if (
        campaignData?.budget?.type === CampaignBudgetType.SPEND &&
        campaignCurrency !== applicationMethodData?.currency_code
      ) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Currency between promotion and campaigns should match`
        )
      }

      if (campaignData) {
        promotionCodeCampaignMap.set(promotionData.code, campaignData)
      }

      promotionsData.push({
        ...promotionData,
        campaign_id: campaignId,
      })
    }

    const createdPromotions = await this.promotionService_.create(
      promotionsData,
      sharedContext
    )

    for (const promotion of createdPromotions) {
      const applMethodData = promotionCodeApplicationMethodDataMap.get(
        promotion.code
      )

      const campaignData = promotionCodeCampaignMap.get(promotion.code)

      if (campaignData) {
        campaignsData.push({
          ...campaignData,
          promotions: [promotion],
        })
      }

      if (applMethodData) {
        const {
          target_rules: targetRulesData = [],
          buy_rules: buyRulesData = [],
          ...applicationMethodWithoutRules
        } = applMethodData
        const applicationMethodData = {
          ...applicationMethodWithoutRules,
          promotion,
        }

        if (
          applicationMethodData.target_type ===
            ApplicationMethodTargetType.ORDER &&
          targetRulesData.length
        ) {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            `Target rules for application method with target type (${ApplicationMethodTargetType.ORDER}) is not allowed`
          )
        }

        if (promotion.type === PromotionType.BUYGET && !buyRulesData.length) {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            `Buy rules are required for ${PromotionType.BUYGET} promotion type`
          )
        }

        if (
          promotion.type === PromotionType.BUYGET &&
          !targetRulesData.length
        ) {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            `Target rules are required for ${PromotionType.BUYGET} promotion type`
          )
        }

        validateApplicationMethodAttributes(applicationMethodData, promotion)

        applicationMethodsData.push(applicationMethodData)

        if (targetRulesData.length) {
          methodTargetRulesMap.set(promotion.id, targetRulesData)
        }

        if (buyRulesData.length) {
          methodBuyRulesMap.set(promotion.id, buyRulesData)
        }
      }

      await this.createPromotionRulesAndValues_(
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

    const createdCampaigns = await this.createCampaigns(
      campaignsData,
      sharedContext
    )

    for (const campaignData of campaignsData) {
      const promotions = campaignData.promotions
      const campaign = createdCampaigns.find(
        (c) => c.campaign_identifier === campaignData.campaign_identifier
      )

      if (!campaign || !promotions || !promotions.length) {
        continue
      }

      await this.addPromotionsToCampaign(
        { id: campaign.id, promotion_ids: promotions.map((p) => p.id) },
        sharedContext
      )
    }

    for (const applicationMethod of createdApplicationMethods) {
      await this.createPromotionRulesAndValues_(
        methodTargetRulesMap.get(applicationMethod.promotion.id) || [],
        "method_target_rules",
        applicationMethod,
        sharedContext
      )

      await this.createPromotionRulesAndValues_(
        methodBuyRulesMap.get(applicationMethod.promotion.id) || [],
        "method_buy_rules",
        applicationMethod,
        sharedContext
      )
    }

    return createdPromotions
  }

  async update(
    data: PromotionTypes.UpdatePromotionDTO,
    sharedContext?: Context
  ): Promise<PromotionTypes.PromotionDTO>

  async update(
    data: PromotionTypes.UpdatePromotionDTO[],
    sharedContext?: Context
  ): Promise<PromotionTypes.PromotionDTO[]>

  @InjectManager("baseRepository_")
  async update(
    data:
      | PromotionTypes.UpdatePromotionDTO
      | PromotionTypes.UpdatePromotionDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<PromotionTypes.PromotionDTO | PromotionTypes.PromotionDTO[]> {
    const input = Array.isArray(data) ? data : [data]
    const updatedPromotions = await this.update_(input, sharedContext)

    const promotions = await this.list(
      { id: updatedPromotions.map((p) => p!.id) },
      {
        relations: [
          "application_method",
          "application_method.target_rules",
          "application_method.target_rules.values",
          "rules",
          "rules.values",
          "campaign",
          "campaign.budget",
        ],
        take: null,
      },
      sharedContext
    )

    return Array.isArray(data) ? promotions : promotions[0]
  }

  @InjectTransactionManager("baseRepository_")
  protected async update_(
    data: PromotionTypes.UpdatePromotionDTO[],
    @MedusaContext() sharedContext: Context = {}
  ) {
    const promotionIds = data.map((d) => d.id)
    const existingPromotions = await this.promotionService_.list(
      { id: promotionIds },
      { relations: ["application_method"] }
    )
    const existingCampaigns = await this.campaignService_.list(
      { id: data.map((d) => d.campaign_id).filter((d) => isPresent(d)) },
      { relations: ["budget"] }
    )

    const existingPromotionsMap = new Map<string, Promotion>(
      existingPromotions.map((promotion) => [promotion.id, promotion])
    )

    const promotionsData: UpdatePromotionDTO[] = []
    const applicationMethodsData: UpdateApplicationMethodDTO[] = []

    for (const {
      application_method: applicationMethodData,
      campaign_id: campaignId,
      ...promotionData
    } of data) {
      const existingCampaign = existingCampaigns.find(
        (c) => c.id === campaignId
      )
      const existingPromotion = existingPromotionsMap.get(promotionData.id)!
      const existingApplicationMethod = existingPromotion?.application_method
      const promotionCurrencyCode =
        existingApplicationMethod?.currency_code ||
        applicationMethodData?.currency_code

      if (campaignId && !existingCampaign) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Could not find campaign with id ${campaignId}`
        )
      }

      if (
        campaignId &&
        existingCampaign?.budget?.type === CampaignBudgetType.SPEND &&
        existingCampaign.budget.currency_code !== promotionCurrencyCode
      ) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Currency code doesn't match for campaign (${campaignId}) and promotion (${existingPromotion.id})`
        )
      }

      if (campaignId) {
        promotionsData.push({ ...promotionData, campaign_id: campaignId })
      } else {
        promotionsData.push(promotionData)
      }

      if (!applicationMethodData || !existingApplicationMethod) {
        continue
      }

      if (
        applicationMethodData.allocation &&
        !allowedAllocationForQuantity.includes(applicationMethodData.allocation)
      ) {
        applicationMethodData.max_quantity = null
        existingApplicationMethod.max_quantity = null
      }

      validateApplicationMethodAttributes(
        applicationMethodData,
        existingPromotion
      )

      applicationMethodsData.push({
        ...applicationMethodData,
        id: existingApplicationMethod.id,
      })
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
  async updatePromotionRules(
    data: PromotionTypes.UpdatePromotionRuleDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<PromotionTypes.PromotionRuleDTO[]> {
    const updatedPromotionRules = await this.updatePromotionRules_(
      data,
      sharedContext
    )

    return this.listPromotionRules(
      { id: updatedPromotionRules.map((r) => r.id) },
      { relations: ["values"] },
      sharedContext
    )
  }

  @InjectTransactionManager("baseRepository_")
  protected async updatePromotionRules_(
    data: PromotionTypes.UpdatePromotionRuleDTO[],
    @MedusaContext() sharedContext: Context = {}
  ) {
    const promotionRuleIds = data.map((d) => d.id)

    const promotionRules = await this.listPromotionRules(
      { id: promotionRuleIds },
      { relations: ["values"] },
      sharedContext
    )

    const invalidRuleId = arrayDifference(
      deduplicate(promotionRuleIds),
      promotionRules.map((pr) => pr.id)
    )

    if (invalidRuleId.length) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Promotion rules with id - ${invalidRuleId.join(", ")} not found`
      )
    }

    const promotionRulesMap = new Map<string, PromotionTypes.PromotionRuleDTO>(
      promotionRules.map((pr) => [pr.id, pr])
    )

    const rulesToUpdate: PromotionTypes.UpdatePromotionRuleDTO[] = []
    const ruleValueIdsToDelete: string[] = []
    const ruleValuesToCreate: CreatePromotionRuleValueDTO[] = []

    for (const promotionRuleData of data) {
      const { values, ...rest } = promotionRuleData
      const normalizedValues = Array.isArray(values) ? values : [values]
      rulesToUpdate.push(rest)

      if (isDefined(values)) {
        const promotionRule = promotionRulesMap.get(promotionRuleData.id)!

        ruleValueIdsToDelete.push(...promotionRule.values.map((v) => v.id))
        ruleValuesToCreate.push(
          ...normalizedValues.map((value) => ({
            value,
            promotion_rule: promotionRule,
          }))
        )
      }
    }

    const [updatedRules] = await Promise.all([
      this.promotionRuleService_.update(rulesToUpdate, sharedContext),
      this.promotionRuleValueService_.delete(
        ruleValueIdsToDelete,
        sharedContext
      ),
      this.promotionRuleValueService_.create(ruleValuesToCreate, sharedContext),
    ])

    return updatedRules
  }

  @InjectManager("baseRepository_")
  async addPromotionRules(
    promotionId: string,
    rulesData: PromotionTypes.CreatePromotionRuleDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<PromotionTypes.PromotionRuleDTO[]> {
    const promotion = await this.promotionService_.retrieve(promotionId)

    const createdPromotionRules = await this.createPromotionRulesAndValues_(
      rulesData,
      "promotions",
      promotion,
      sharedContext
    )

    return this.listPromotionRules(
      { id: createdPromotionRules.map((r) => r.id) },
      { relations: ["values"] },
      sharedContext
    )
  }

  @InjectManager("baseRepository_")
  async addPromotionTargetRules(
    promotionId: string,
    rulesData: PromotionTypes.CreatePromotionRuleDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<PromotionTypes.PromotionRuleDTO[]> {
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

    const createdPromotionRules = await this.createPromotionRulesAndValues_(
      rulesData,
      "method_target_rules",
      applicationMethod,
      sharedContext
    )

    return await this.listPromotionRules(
      { id: createdPromotionRules.map((pr) => pr.id) },
      { relations: ["values"] },
      sharedContext
    )
  }

  @InjectManager("baseRepository_")
  async addPromotionBuyRules(
    promotionId: string,
    rulesData: PromotionTypes.CreatePromotionRuleDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<PromotionTypes.PromotionRuleDTO[]> {
    const promotion = await this.promotionService_.retrieve(
      promotionId,
      { relations: ["application_method"] },
      sharedContext
    )

    const applicationMethod = promotion.application_method

    if (!applicationMethod) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `application_method for promotion not found`
      )
    }

    const createdPromotionRules = await this.createPromotionRulesAndValues_(
      rulesData,
      "method_buy_rules",
      applicationMethod,
      sharedContext
    )

    return await this.listPromotionRules(
      { id: createdPromotionRules.map((pr) => pr.id) },
      { relations: ["values"] },
      sharedContext
    )
  }

  @InjectTransactionManager("baseRepository_")
  protected async createPromotionRulesAndValues_(
    rulesData: PromotionTypes.CreatePromotionRuleDTO[],
    relationName: "promotions" | "method_target_rules" | "method_buy_rules",
    relation: Promotion | ApplicationMethod,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TPromotionRule[]> {
    const createdPromotionRules: TPromotionRule[] = []
    const promotion =
      relation instanceof ApplicationMethod ? relation.promotion : relation

    if (!rulesData.length) {
      return []
    }

    if (
      relationName === "method_buy_rules" &&
      promotion.type === PromotionType.STANDARD
    ) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Can't add buy rules to a ${PromotionType.STANDARD} promotion`
      )
    }

    validatePromotionRuleAttributes(rulesData)

    for (const ruleData of rulesData) {
      const { values, ...rest } = ruleData
      const promotionRuleData: CreatePromotionRuleDTO = {
        ...rest,
        [relationName]: [relation],
      }

      const [createdPromotionRule] = await this.promotionRuleService_.create(
        [promotionRuleData],
        sharedContext
      )

      createdPromotionRules.push(createdPromotionRule)

      const ruleValues = Array.isArray(values) ? values : [values]
      const promotionRuleValuesData = ruleValues.map((ruleValue) => ({
        value: ruleValue,
        promotion_rule: createdPromotionRule,
      }))

      await this.promotionRuleValueService_.create(
        promotionRuleValuesData,
        sharedContext
      )
    }

    return createdPromotionRules
  }

  @InjectManager("baseRepository_")
  async removePromotionRules(
    promotionId: string,
    ruleIds: string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    await this.removePromotionRules_(promotionId, ruleIds, sharedContext)
  }

  @InjectTransactionManager("baseRepository_")
  protected async removePromotionRules_(
    promotionId: string,
    ruleIds: string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    const promotion = await this.promotionService_.retrieve(
      promotionId,
      { relations: ["rules"] },
      sharedContext
    )

    const existingRuleIds = promotion.rules.map((rule) => rule.id)
    const idsToRemove = ruleIds.filter((id) => existingRuleIds.includes(id))

    await this.promotionRuleService_.delete(idsToRemove, sharedContext)
  }

  @InjectManager("baseRepository_")
  async removePromotionTargetRules(
    promotionId: string,
    ruleIds: string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    await this.removeApplicationMethodRules_(
      promotionId,
      ruleIds,
      ApplicationMethodRuleTypes.TARGET_RULES,
      sharedContext
    )
  }

  @InjectManager("baseRepository_")
  async removePromotionBuyRules(
    promotionId: string,
    ruleIds: string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    await this.removeApplicationMethodRules_(
      promotionId,
      ruleIds,
      ApplicationMethodRuleTypes.BUY_RULES,
      sharedContext
    )
  }

  @InjectTransactionManager("baseRepository_")
  protected async removeApplicationMethodRules_(
    promotionId: string,
    ruleIds: string[],
    relation:
      | ApplicationMethodRuleTypes.TARGET_RULES
      | ApplicationMethodRuleTypes.BUY_RULES,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    const promotion = await this.promotionService_.retrieve(
      promotionId,
      { relations: [`application_method.${relation}`] },
      sharedContext
    )

    const applicationMethod = promotion.application_method

    if (!applicationMethod) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `application_method for promotion not found`
      )
    }

    const targetRuleIdsToRemove = applicationMethod[relation]
      .filter((rule) => ruleIds.includes(rule.id))
      .map((rule) => rule.id)

    await this.promotionRuleService_.delete(
      targetRuleIdsToRemove,
      sharedContext
    )
  }

  async createCampaigns(
    data: PromotionTypes.CreateCampaignDTO,
    sharedContext?: Context
  ): Promise<PromotionTypes.CampaignDTO>

  async createCampaigns(
    data: PromotionTypes.CreateCampaignDTO[],
    sharedContext?: Context
  ): Promise<PromotionTypes.CampaignDTO[]>

  @InjectManager("baseRepository_")
  async createCampaigns(
    data: PromotionTypes.CreateCampaignDTO | PromotionTypes.CreateCampaignDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<PromotionTypes.CampaignDTO | PromotionTypes.CampaignDTO[]> {
    const input = Array.isArray(data) ? data : [data]
    const createdCampaigns = await this.createCampaigns_(input, sharedContext)

    const campaigns = await this.listCampaigns(
      { id: createdCampaigns.map((p) => p!.id) },
      {
        relations: ["budget", "promotions"],
        take: null,
      },
      sharedContext
    )

    return Array.isArray(data) ? campaigns : campaigns[0]
  }

  @InjectTransactionManager("baseRepository_")
  protected async createCampaigns_(
    data: PromotionTypes.CreateCampaignDTO[],
    @MedusaContext() sharedContext: Context = {}
  ) {
    const campaignsData: CreateCampaignDTO[] = []
    const campaignBudgetsData: CreateCampaignBudgetDTO[] = []
    const campaignIdentifierBudgetMap = new Map<
      string,
      CreateCampaignBudgetDTO
    >()

    for (const createCampaignData of data) {
      const { budget: campaignBudgetData, ...campaignData } = createCampaignData

      if (campaignBudgetData) {
        campaignIdentifierBudgetMap.set(
          campaignData.campaign_identifier,
          campaignBudgetData
        )
      }

      campaignsData.push({
        ...campaignData,
      })
    }

    const createdCampaigns = await this.campaignService_.create(
      campaignsData,
      sharedContext
    )

    for (const createdCampaign of createdCampaigns) {
      const campaignBudgetData = campaignIdentifierBudgetMap.get(
        createdCampaign.campaign_identifier
      )

      if (campaignBudgetData) {
        this.validateCampaignBudgetData(campaignBudgetData)

        campaignBudgetsData.push({
          ...campaignBudgetData,
          campaign: createdCampaign.id,
        })
      }
    }

    if (campaignBudgetsData.length) {
      await this.campaignBudgetService_.create(
        campaignBudgetsData,
        sharedContext
      )
    }

    return createdCampaigns
  }

  protected validateCampaignBudgetData(data: {
    type?: CampaignBudgetTypeValues
    currency_code?: string
  }) {
    if (!data.type) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Campaign Budget type is a required field`
      )
    }

    if (
      data.type === CampaignBudgetType.SPEND &&
      !isPresent(data.currency_code)
    ) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Campaign Budget type is a required field`
      )
    }
  }

  async updateCampaigns(
    data: PromotionTypes.UpdateCampaignDTO,
    sharedContext?: Context
  ): Promise<PromotionTypes.CampaignDTO>

  async updateCampaigns(
    data: PromotionTypes.UpdateCampaignDTO[],
    sharedContext?: Context
  ): Promise<PromotionTypes.CampaignDTO[]>

  @InjectManager("baseRepository_")
  async updateCampaigns(
    data: PromotionTypes.UpdateCampaignDTO | PromotionTypes.UpdateCampaignDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<PromotionTypes.CampaignDTO | PromotionTypes.CampaignDTO[]> {
    const input = Array.isArray(data) ? data : [data]
    const updatedCampaigns = await this.updateCampaigns_(input, sharedContext)

    const campaigns = await this.listCampaigns(
      { id: updatedCampaigns.map((p) => p!.id) },
      {
        relations: ["budget", "promotions"],
        take: null,
      },
      sharedContext
    )

    return Array.isArray(data) ? campaigns : campaigns[0]
  }

  @InjectTransactionManager("baseRepository_")
  protected async updateCampaigns_(
    data: PromotionTypes.UpdateCampaignDTO[],
    @MedusaContext() sharedContext: Context = {}
  ) {
    const campaignIds = data.map((d) => d.id)
    const campaignsData: UpdateCampaignDTO[] = []
    const updateBudgetData: UpdateCampaignBudgetDTO[] = []
    const createBudgetData: CreateCampaignBudgetDTO[] = []

    const existingCampaigns = await this.listCampaigns(
      { id: campaignIds },
      { relations: ["budget"], take: null },
      sharedContext
    )

    const existingCampaignsMap = new Map<string, PromotionTypes.CampaignDTO>(
      existingCampaigns.map((campaign) => [campaign.id, campaign])
    )

    for (const updateCampaignData of data) {
      const { budget: budgetData, ...campaignData } = updateCampaignData
      const existingCampaign = existingCampaignsMap.get(campaignData.id)!

      campaignsData.push(campaignData)

      // Type & currency code of the budget is immutable, we don't allow for it to be updated.
      // If an existing budget is present, we remove the type and currency from being updated
      if (
        (existingCampaign?.budget && budgetData?.type) ||
        budgetData?.currency_code
      ) {
        delete budgetData?.type
        delete budgetData?.currency_code

        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Campaign budget attributes (type, currency_code) are immutable`
        )
      }

      if (budgetData) {
        if (existingCampaign?.budget) {
          updateBudgetData.push({
            id: existingCampaign.budget.id,
            ...budgetData,
          })
        } else {
          createBudgetData.push({
            ...budgetData,
            campaign: existingCampaign.id,
          })
        }
      }
    }

    const updatedCampaigns = await this.campaignService_.update(
      campaignsData,
      sharedContext
    )

    if (updateBudgetData.length) {
      await this.campaignBudgetService_.update(updateBudgetData, sharedContext)
    }

    if (createBudgetData.length) {
      await this.campaignBudgetService_.create(createBudgetData, sharedContext)
    }

    return updatedCampaigns
  }

  @InjectManager("baseRepository_")
  async addPromotionsToCampaign(
    data: PromotionTypes.AddPromotionsToCampaignDTO,
    sharedContext?: Context
  ): Promise<{ ids: string[] }> {
    const ids = await this.addPromotionsToCampaign_(data, sharedContext)

    return { ids }
  }

  // TODO:
  // - introduce currency_code to promotion
  // - allow promotions to be queried by currency code
  // - when the above is present, validate adding promotion to campaign based on currency code
  @InjectTransactionManager("baseRepository_")
  protected async addPromotionsToCampaign_(
    data: PromotionTypes.AddPromotionsToCampaignDTO,
    @MedusaContext() sharedContext: Context = {}
  ) {
    const { id, promotion_ids: promotionIds = [] } = data

    const campaign = await this.campaignService_.retrieve(id, {}, sharedContext)
    const promotionsToAdd = await this.promotionService_.list(
      { id: promotionIds, campaign_id: null },
      { take: null, relations: ["application_method"] },
      sharedContext
    )

    const diff = arrayDifference(
      promotionsToAdd.map((p) => p.id),
      promotionIds
    )

    if (diff.length > 0) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Cannot add promotions (${diff.join(
          ","
        )}) to campaign. These promotions are either already part of a campaign or not found.`
      )
    }

    const promotionsWithInvalidCurrency = promotionsToAdd.filter(
      (promotion) =>
        campaign.budget?.type === CampaignBudgetType.SPEND &&
        promotion.application_method?.currency_code !==
          campaign?.budget?.currency_code
    )

    if (promotionsWithInvalidCurrency.length > 0) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Cannot add promotions to campaign where currency_code don't match.`
      )
    }

    await this.promotionService_.update(
      promotionsToAdd.map((promotion) => ({
        id: promotion.id,
        campaign_id: campaign.id,
      })),
      sharedContext
    )

    return promotionsToAdd.map((promo) => promo.id)
  }

  @InjectManager("baseRepository_")
  async removePromotionsFromCampaign(
    data: PromotionTypes.AddPromotionsToCampaignDTO,
    sharedContext?: Context
  ): Promise<{ ids: string[] }> {
    const ids = await this.removePromotionsFromCampaign_(data, sharedContext)

    return { ids }
  }

  @InjectTransactionManager("baseRepository_")
  protected async removePromotionsFromCampaign_(
    data: PromotionTypes.AddPromotionsToCampaignDTO,
    @MedusaContext() sharedContext: Context = {}
  ) {
    const { id, promotion_ids: promotionIds = [] } = data

    await this.campaignService_.retrieve(id, {}, sharedContext)
    const promotionsToRemove = await this.promotionService_.list(
      { id: promotionIds },
      { take: null },
      sharedContext
    )

    const diff = arrayDifference(
      promotionsToRemove.map((p) => p.id),
      promotionIds
    )

    if (diff.length > 0) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Promotions with ids (${diff.join(",")}) not found.`
      )
    }

    await this.promotionService_.update(
      promotionsToRemove.map((promotion) => ({
        id: promotion.id,
        campaign_id: null,
      })),
      sharedContext
    )

    return promotionsToRemove.map((promo) => promo.id)
  }
}

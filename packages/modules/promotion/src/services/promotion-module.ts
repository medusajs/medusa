import {
  CampaignBudgetTypeValues,
  CampaignBudgetUsageDTO,
  Context,
  DAL,
  FilterablePromotionProps,
  FindConfig,
  InferEntityType,
  InternalModuleDeclaration,
  ModulesSdkTypes,
  PromotionDTO,
  PromotionTypes,
} from "@medusajs/framework/types"
import {
  ApplicationMethodAllocation,
  ApplicationMethodTargetType,
  arrayDifference,
  CampaignBudgetType,
  ComputedActions,
  deduplicate,
  EmitEvents,
  InjectManager,
  InjectTransactionManager,
  isDefined,
  isPresent,
  isString,
  MathBN,
  MedusaContext,
  MedusaError,
  MedusaService,
  PromotionStatus,
  PromotionType,
  toMikroORMEntity,
  transformPropertiesToBigNumber,
} from "@medusajs/framework/utils"
import {
  ApplicationMethod,
  Campaign,
  CampaignBudget,
  CampaignBudgetUsage,
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
  allowedAllocationForQuantity,
  areRulesValidForContext,
  ComputeActionUtils,
  validateApplicationMethodAttributes,
  validatePromotionRuleAttributes,
} from "@utils"
import { CreatePromotionRuleValueDTO } from "../types/promotion-rule-value"
import { buildPromotionRuleQueryFilterFromContext } from "../utils/compute-actions/build-promotion-rule-query-filter-from-context"

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  promotionService: ModulesSdkTypes.IMedusaInternalService<any>
  applicationMethodService: ModulesSdkTypes.IMedusaInternalService<any>
  promotionRuleService: ModulesSdkTypes.IMedusaInternalService<any>
  promotionRuleValueService: ModulesSdkTypes.IMedusaInternalService<any>
  campaignService: ModulesSdkTypes.IMedusaInternalService<any>
  campaignBudgetService: ModulesSdkTypes.IMedusaInternalService<any>
  campaignBudgetUsageService: ModulesSdkTypes.IMedusaInternalService<any>
}

export default class PromotionModuleService
  extends MedusaService<{
    Promotion: { dto: PromotionTypes.PromotionDTO }
    ApplicationMethod: { dto: PromotionTypes.ApplicationMethodDTO }
    Campaign: { dto: PromotionTypes.CampaignDTO }
    CampaignBudget: { dto: PromotionTypes.CampaignBudgetDTO }
    CampaignBudgetUsage: { dto: PromotionTypes.CampaignBudgetUsageDTO }
    PromotionRule: { dto: PromotionTypes.PromotionRuleDTO }
    PromotionRuleValue: { dto: PromotionTypes.PromotionRuleValueDTO }
  }>({
    Promotion,
    ApplicationMethod,
    Campaign,
    CampaignBudget,
    CampaignBudgetUsage,
    PromotionRule,
    PromotionRuleValue,
  })
  implements PromotionTypes.IPromotionModuleService
{
  protected baseRepository_: DAL.RepositoryService
  protected promotionService_: ModulesSdkTypes.IMedusaInternalService<
    InferEntityType<typeof Promotion>
  >
  protected applicationMethodService_: ModulesSdkTypes.IMedusaInternalService<
    InferEntityType<typeof ApplicationMethod>
  >
  protected promotionRuleService_: ModulesSdkTypes.IMedusaInternalService<
    InferEntityType<typeof PromotionRule>
  >
  protected promotionRuleValueService_: ModulesSdkTypes.IMedusaInternalService<
    InferEntityType<typeof PromotionRuleValue>
  >
  protected campaignService_: ModulesSdkTypes.IMedusaInternalService<
    InferEntityType<typeof Campaign>
  >
  protected campaignBudgetService_: ModulesSdkTypes.IMedusaInternalService<
    InferEntityType<typeof CampaignBudget>
  >

  protected campaignBudgetUsageService_: ModulesSdkTypes.IMedusaInternalService<
    InferEntityType<typeof CampaignBudgetUsage>
  >

  constructor(
    {
      baseRepository,
      promotionService,
      applicationMethodService,
      promotionRuleService,
      promotionRuleValueService,
      campaignService,
      campaignBudgetService,
      campaignBudgetUsageService,
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
    this.campaignBudgetUsageService_ = campaignBudgetUsageService
  }

  @InjectManager()
  async listActivePromotions(
    filters?: FilterablePromotionProps,
    config?: FindConfig<PromotionDTO>,
    sharedContext?: Context
  ): Promise<PromotionDTO[]> {
    const activePromotions = await this.listActivePromotions_(
      filters,
      config,
      sharedContext
    )

    return this.baseRepository_.serialize<PromotionDTO[]>(activePromotions)
  }

  @InjectManager()
  protected async listActivePromotions_(
    filters?: FilterablePromotionProps,
    config?: FindConfig<PromotionDTO>,
    @MedusaContext() sharedContext?: Context
  ): Promise<InferEntityType<typeof Promotion>[]> {
    // Ensure we share the same now date across all filters
    const now = new Date()
    const activeFilters = {
      status: PromotionStatus.ACTIVE,
      $or: [
        {
          campaign_id: null,
          ...filters,
        },
        {
          ...filters,
          campaign: {
            ...filters?.campaign,
            $and: [
              {
                $or: [{ starts_at: null }, { starts_at: { $lte: now } }],
              },
              {
                $or: [{ ends_at: null }, { ends_at: { $gt: now } }],
              },
            ],
          },
        },
      ],
    }

    return await this.promotionService_.list(
      activeFilters,
      config,
      sharedContext
    )
  }

  @InjectTransactionManager()
  protected async registerCampaignBudgetUsageByAttribute_(
    budgetId: string,
    attributeValue: string,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    const [campaignBudgetUsagePerAttributeValue] =
      await this.campaignBudgetUsageService_.list(
        {
          budget_id: budgetId,
          attribute_value: attributeValue,
        },
        { relations: ["budget"] },
        sharedContext
      )

    if (!campaignBudgetUsagePerAttributeValue) {
      await this.campaignBudgetUsageService_.create(
        {
          budget_id: budgetId,
          attribute_value: attributeValue,
          used: MathBN.convert(1),
        },
        sharedContext
      )
    } else {
      const limit = campaignBudgetUsagePerAttributeValue.budget.limit
      const newUsedValue = MathBN.add(
        campaignBudgetUsagePerAttributeValue.used ?? 0,
        1
      )

      if (limit && MathBN.gt(newUsedValue, limit)) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          "Promotion usage exceeds the budget limit."
        )
      }

      await this.campaignBudgetUsageService_.update(
        {
          id: campaignBudgetUsagePerAttributeValue.id,
          used: newUsedValue,
        },
        sharedContext
      )
    }
  }

  @InjectTransactionManager()
  protected async revertCampaignBudgetUsageByAttribute_(
    budgetId: string,
    attributeValue: string,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    const [campaignBudgetUsagePerAttributeValue] =
      await this.campaignBudgetUsageService_.list(
        {
          budget_id: budgetId,
          attribute_value: attributeValue,
        },
        {},
        sharedContext
      )

    if (!campaignBudgetUsagePerAttributeValue) {
      return
    }

    if (MathBN.lte(campaignBudgetUsagePerAttributeValue.used ?? 0, 1)) {
      await this.campaignBudgetUsageService_.delete(
        campaignBudgetUsagePerAttributeValue.id,
        sharedContext
      )
    } else {
      await this.campaignBudgetUsageService_.update(
        {
          id: campaignBudgetUsagePerAttributeValue.id,
          used: MathBN.sub(campaignBudgetUsagePerAttributeValue.used ?? 0, 1),
        },
        sharedContext
      )
    }
  }

  @InjectTransactionManager()
  @EmitEvents()
  /**
   * Register the usage of promotions in the campaign budget and
   * increment the used value if the budget is not exceeded,
   * throws an error if the budget is exceeded.
   *
   * @param computedActions - The computed actions to register usage for.
   * @param registrationContext - The context of the campaign budget usage.
   * @returns void
   * @throws {MedusaError} - If the promotion usage exceeds the budget limit.
   */
  async registerUsage(
    computedActions: PromotionTypes.UsageComputedActions[],
    registrationContext: PromotionTypes.CampaignBudgetUsageContext,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    const promotionCodes = computedActions
      .map((computedAction) => computedAction.code)
      .filter(Boolean)

    const campaignBudgetMap = new Map<string, UpdateCampaignBudgetDTO>()
    const promotionCodeUsageMap = new Map<string, boolean>()
    const promotionUsageMap = new Map<string, { id: string; used: number }>()

    const existingPromotions = await this.listActivePromotions_(
      { code: promotionCodes },
      { relations: ["campaign", "campaign.budget", "campaign.budget.usages"] },
      sharedContext
    )

    for (const promotion of existingPromotions) {
      if (promotion.campaign?.budget) {
        campaignBudgetMap.set(
          promotion.campaign?.budget.id,
          promotion.campaign?.budget
        )
      }
    }

    const existingPromotionsMap = new Map<
      string,
      InferEntityType<typeof Promotion>
    >(existingPromotions.map((promotion) => [promotion.code!, promotion]))

    for (let computedAction of computedActions) {
      const promotion = existingPromotionsMap.get(computedAction.code)

      if (!promotion) {
        continue
      }

      if (typeof promotion.limit === "number") {
        const newUsedValue = (promotion.used ?? 0) + 1

        if (newUsedValue > promotion.limit) {
          throw new MedusaError(
            MedusaError.Types.NOT_ALLOWED,
            "Promotion usage exceeds the limit."
          )
        }

        promotionUsageMap.set(promotion.id, {
          id: promotion.id,
          used: newUsedValue,
        })
      }

      const campaignBudget = promotion.campaign?.budget

      if (!campaignBudget) {
        continue
      }

      if (campaignBudget.type === CampaignBudgetType.SPEND) {
        const campaignBudgetData = campaignBudgetMap.get(campaignBudget.id)

        if (!campaignBudgetData) {
          continue
        }

        // Calculate the new budget value
        const newUsedValue = MathBN.add(
          campaignBudgetData.used ?? 0,
          computedAction.amount
        )

        if (
          campaignBudget.limit &&
          MathBN.gt(newUsedValue, campaignBudget.limit)
        ) {
          throw new MedusaError(
            MedusaError.Types.NOT_ALLOWED,
            "Promotion usage exceeds the budget limit."
          )
        }

        campaignBudgetData.used = newUsedValue

        campaignBudgetMap.set(campaignBudget.id, campaignBudgetData)
      }

      if (campaignBudget.type === CampaignBudgetType.USAGE) {
        const promotionAlreadyUsed =
          promotionCodeUsageMap.get(promotion.code!) || false

        if (promotionAlreadyUsed) {
          continue
        }

        const newUsedValue = MathBN.add(campaignBudget.used ?? 0, 1)

        if (
          campaignBudget.limit &&
          MathBN.gt(newUsedValue, campaignBudget.limit)
        ) {
          throw new MedusaError(
            MedusaError.Types.NOT_ALLOWED,
            "Promotion usage exceeds the budget limit."
          )
        }

        campaignBudgetMap.set(campaignBudget.id, {
          id: campaignBudget.id,
          used: newUsedValue,
        })

        promotionCodeUsageMap.set(promotion.code!, true)
      }

      if (campaignBudget.type === CampaignBudgetType.USE_BY_ATTRIBUTE) {
        const promotionAlreadyUsed =
          promotionCodeUsageMap.get(promotion.code!) || false

        if (promotionAlreadyUsed) {
          continue
        }

        const attribute = campaignBudget.attribute!
        const attributeValue = registrationContext[attribute]

        if (!attributeValue) {
          continue
        }

        await this.registerCampaignBudgetUsageByAttribute_(
          campaignBudget.id,
          attributeValue,
          sharedContext
        )

        const newUsedValue = MathBN.add(campaignBudget.used ?? 0, 1)

        // update the global budget usage to keep track but it is not used anywhere atm
        campaignBudgetMap.set(campaignBudget.id, {
          id: campaignBudget.id,
          used: newUsedValue,
        })

        promotionCodeUsageMap.set(promotion.code!, true)
      }
    }

    if (promotionUsageMap.size > 0) {
      await this.promotionService_.update(
        Array.from(promotionUsageMap.values()),
        sharedContext
      )
    }

    if (campaignBudgetMap.size > 0) {
      const campaignBudgetsData: UpdateCampaignBudgetDTO[] = []
      for (const [_, campaignBudgetData] of campaignBudgetMap) {
        // usages by attribute are updated separatley
        if (campaignBudgetData.usages) {
          const { usages, ...campaignBudgetDataWithoutUsages } =
            campaignBudgetData
          campaignBudgetsData.push(campaignBudgetDataWithoutUsages)
          continue
        }
        campaignBudgetsData.push(campaignBudgetData)
      }

      await this.campaignBudgetService_.update(
        campaignBudgetsData,
        sharedContext
      )
    }
  }

  @InjectTransactionManager()
  @EmitEvents()
  async revertUsage(
    computedActions: PromotionTypes.UsageComputedActions[],
    registrationContext: PromotionTypes.CampaignBudgetUsageContext,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    const promotionCodeUsageMap = new Map<string, boolean>()
    const campaignBudgetMap = new Map<string, UpdateCampaignBudgetDTO>()
    const promotionUsageMap = new Map<string, { id: string; used: number }>()

    const existingPromotions = await this.listActivePromotions_(
      {
        code: computedActions
          .map((computedAction) => computedAction.code)
          .filter(Boolean),
      },
      { relations: ["campaign", "campaign.budget"] },
      sharedContext
    )

    for (const promotion of existingPromotions) {
      if (promotion.campaign?.budget) {
        campaignBudgetMap.set(
          promotion.campaign?.budget.id,
          promotion.campaign?.budget
        )
      }
    }

    const existingPromotionsMap = new Map<
      string,
      InferEntityType<typeof Promotion>
    >(existingPromotions.map((promotion) => [promotion.code!, promotion]))

    for (let computedAction of computedActions) {
      const promotion = existingPromotionsMap.get(computedAction.code)

      if (!promotion) {
        continue
      }

      if (typeof promotion.limit === "number") {
        const newUsedValue = Math.max(0, (promotion.used ?? 0) - 1)

        promotionUsageMap.set(promotion.id, {
          id: promotion.id,
          used: newUsedValue,
        })
      }

      const campaignBudget = promotion.campaign?.budget

      if (!campaignBudget) {
        continue
      }

      if (campaignBudget.type === CampaignBudgetType.SPEND) {
        const campaignBudgetData = campaignBudgetMap.get(campaignBudget.id)

        if (!campaignBudgetData) {
          continue
        }

        // Calculate new used value and ensure it doesn't go below 0
        const newUsedValue = MathBN.sub(
          campaignBudgetData.used ?? 0,
          computedAction.amount
        )

        campaignBudgetData.used = MathBN.lt(newUsedValue, 0) ? 0 : newUsedValue
        campaignBudgetMap.set(campaignBudget.id, campaignBudgetData)
      }

      if (campaignBudget.type === CampaignBudgetType.USAGE) {
        const promotionAlreadyUsed =
          promotionCodeUsageMap.get(promotion.code!) || false

        if (promotionAlreadyUsed) {
          continue
        }

        // Calculate new used value and ensure it doesn't go below 0
        const newUsedValue = MathBN.sub(campaignBudget.used ?? 0, 1)
        const usedValue = MathBN.lt(newUsedValue, 0) ? 0 : newUsedValue

        campaignBudgetMap.set(campaignBudget.id, {
          id: campaignBudget.id,
          used: usedValue,
        })

        promotionCodeUsageMap.set(promotion.code!, true)
      }

      if (campaignBudget.type === CampaignBudgetType.USE_BY_ATTRIBUTE) {
        const promotionAlreadyUsed =
          promotionCodeUsageMap.get(promotion.code!) || false

        if (promotionAlreadyUsed) {
          continue
        }

        const attribute = campaignBudget.attribute!
        const attributeValue = registrationContext[attribute]

        if (!attributeValue) {
          continue
        }

        await this.revertCampaignBudgetUsageByAttribute_(
          campaignBudget.id,
          attributeValue,
          sharedContext
        )
        const newUsedValue = MathBN.sub(campaignBudget.used ?? 0, 1)
        const usedValue = MathBN.lt(newUsedValue, 0) ? 0 : newUsedValue

        // update the global budget usage to keep track but it is not used anywhere atm
        campaignBudgetMap.set(campaignBudget.id, {
          id: campaignBudget.id,
          used: usedValue,
        })

        promotionCodeUsageMap.set(promotion.code!, true)
      }
    }

    if (promotionUsageMap.size > 0) {
      await this.promotionService_.update(
        Array.from(promotionUsageMap.values()),
        sharedContext
      )
    }

    if (campaignBudgetMap.size > 0) {
      const campaignBudgetsData: UpdateCampaignBudgetDTO[] = []
      for (const [_, campaignBudgetData] of campaignBudgetMap) {
        if (campaignBudgetData.usages) {
          const { usages, ...campaignBudgetDataWithoutUsages } =
            campaignBudgetData
          campaignBudgetsData.push(campaignBudgetDataWithoutUsages)
          continue
        }
        campaignBudgetsData.push(campaignBudgetData)
      }

      await this.campaignBudgetService_.update(
        campaignBudgetsData,
        sharedContext
      )
    }
  }

  @InjectManager()
  async computeActions(
    promotionCodes: string[],
    applicationContext: PromotionTypes.ComputeActionContext,
    options: PromotionTypes.ComputeActionOptions = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<PromotionTypes.ComputeActions[]> {
    const {
      prevent_auto_promotions: preventAutoPromotions,
      skip_usage_limit_checks: skipUsageLimitChecks,
    } = options
    const computedActions: PromotionTypes.ComputeActions[] = []
    const { items = [], shipping_methods: shippingMethods = [] } =
      applicationContext

    const codeAdjustmentMap = new Map<
      string,
      {
        items: PromotionTypes.ComputeActionAdjustmentLine[]
        shipping: PromotionTypes.ComputeActionAdjustmentLine[]
      }
    >()

    // Pre-process items and shipping methods to build adjustment map efficiently
    for (const item of items) {
      if (!item.adjustments?.length) continue

      for (const adjustment of item.adjustments) {
        if (!isString(adjustment.code)) continue

        if (!codeAdjustmentMap.has(adjustment.code)) {
          codeAdjustmentMap.set(adjustment.code, { items: [], shipping: [] })
        }

        codeAdjustmentMap.get(adjustment.code)!.items.push(adjustment)
      }
    }

    for (const shippingMethod of shippingMethods) {
      if (!shippingMethod.adjustments?.length) continue

      for (const adjustment of shippingMethod.adjustments) {
        if (!isString(adjustment.code)) continue

        if (!codeAdjustmentMap.has(adjustment.code)) {
          codeAdjustmentMap.set(adjustment.code, { items: [], shipping: [] })
        }

        codeAdjustmentMap.get(adjustment.code)!.shipping.push(adjustment)
      }
    }

    const appliedCodes = Array.from(codeAdjustmentMap.keys())

    const methodIdPromoValueMap = new Map<string, number>()

    const promotionCodesToApply = [...promotionCodes, ...appliedCodes]

    const uniquePromotionCodes = Array.from(new Set(promotionCodesToApply))

    let queryFilter: DAL.FilterQuery<any> = { code: uniquePromotionCodes }

    if (!preventAutoPromotions) {
      const rulePrefilteringFilters =
        await buildPromotionRuleQueryFilterFromContext(
          applicationContext,
          sharedContext
        )

      let prefilteredAutomaticPromotionIds: string[] = []

      if (rulePrefilteringFilters) {
        const promotions = await this.promotionService_.list(
          {
            $and: [{ is_automatic: true }, rulePrefilteringFilters],
          },
          { select: ["id"] },
          sharedContext
        )

        prefilteredAutomaticPromotionIds = promotions.map(
          (promotion) => promotion.id!
        )
      }

      const automaticPromotionFilter = rulePrefilteringFilters
        ? {
            id: { $in: prefilteredAutomaticPromotionIds },
          }
        : { is_automatic: true }

      queryFilter = automaticPromotionFilter
        ? {
            $or: [{ code: uniquePromotionCodes }, automaticPromotionFilter],
          }
        : queryFilter
    }

    const promotions = await this.listActivePromotions_(
      queryFilter,
      {
        order: { application_method: { value: "DESC" } },
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
      },
      sharedContext
    )

    const existingPromotionsMap = new Map<
      string,
      InferEntityType<typeof Promotion>
    >(promotions.map((promotion) => [promotion.code!, promotion]))

    const automaticPromotionCodes: string[] = []

    for (const promotion of promotions) {
      if (promotion.is_automatic) {
        automaticPromotionCodes.push(promotion.code!)
      }
    }

    for (const [code, adjustments] of codeAdjustmentMap.entries()) {
      for (const adjustment of adjustments.items) {
        computedActions.push({
          action: ComputedActions.REMOVE_ITEM_ADJUSTMENT,
          adjustment_id: adjustment.id,
          code,
          item_id: adjustment.item_id as string,
        })
      }

      for (const adjustment of adjustments.shipping) {
        computedActions.push({
          action: ComputedActions.REMOVE_SHIPPING_METHOD_ADJUSTMENT,
          adjustment_id: adjustment.id,
          code,
          shipping_method_id: adjustment.shipping_method_id as string,
        })
      }
    }

    const promotionCodeSet = new Set<string>(promotionCodes) // TODO: uniquePromotionCodes
    const automaticPromotionCodeSet = new Set<string>(automaticPromotionCodes)

    const sortedPromotionsToApply = promotions
      .filter(
        (p) =>
          promotionCodeSet.has(p.code!) ||
          automaticPromotionCodeSet.has(p.code!)
      )
      .sort(ComputeActionUtils.sortByBuyGetType)

    const eligibleBuyItemMap = new Map<
      string,
      ComputeActionUtils.EligibleItem[]
    >()
    const eligibleTargetItemMap = new Map<
      string,
      ComputeActionUtils.EligibleItem[]
    >()

    for (const promotionToApply of sortedPromotionsToApply) {
      const promotion = existingPromotionsMap.get(promotionToApply.code!)!
      if (!promotion.application_method) {
        continue
      }

      const {
        application_method: applicationMethod,
        rules: promotionRules = [],
      } = promotion

      if (
        !skipUsageLimitChecks &&
        promotion.campaign?.budget?.type === CampaignBudgetType.USE_BY_ATTRIBUTE
      ) {
        const attribute = promotion.campaign?.budget?.attribute!
        const budgetUsageContext =
          ComputeActionUtils.getBudgetUsageContextFromComputeActionContext(
            applicationContext
          )
        const attributeValue = budgetUsageContext[attribute]

        if (!attributeValue) {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            `Attribute value for "${attribute}" is required by promotion campaing budget`
          )
        }

        const [campaignBudgetUsagePerAttribute] =
          (await this.campaignBudgetUsageService_.list(
            {
              budget_id: promotion.campaign?.budget?.id,
              attribute_value: attributeValue,
            },
            {},
            sharedContext
          )) as unknown as CampaignBudgetUsageDTO[]

        if (campaignBudgetUsagePerAttribute) {
          const action = ComputeActionUtils.computeActionForBudgetExceeded(
            promotion,
            1,
            campaignBudgetUsagePerAttribute
          )

          if (action) {
            computedActions.push(action)
            continue
          }
        }
      }

      // Check promotion usage limit
      if (!skipUsageLimitChecks && typeof promotion.limit === "number") {
        if ((promotion.used ?? 0) >= promotion.limit) {
          computedActions.push({
            action: ComputedActions.PROMOTION_LIMIT_EXCEEDED,
            code: promotion.code!,
          })
          continue
        }
      }

      const isCurrencyCodeValid =
        !isPresent(applicationMethod.currency_code) ||
        applicationContext.currency_code === applicationMethod.currency_code

      const isPromotionApplicable = areRulesValidForContext(
        promotionRules,
        applicationContext,
        ApplicationMethodTargetType.ORDER
      )

      if (!isPromotionApplicable || !isCurrencyCodeValid) {
        continue
      }

      if (promotion.type === PromotionType.BUYGET) {
        const computedActionsForItems =
          ComputeActionUtils.getComputedActionsForBuyGet(
            promotion,
            applicationContext[ApplicationMethodTargetType.ITEMS]!,
            methodIdPromoValueMap,
            eligibleBuyItemMap,
            eligibleTargetItemMap
          )

        computedActions.push(...computedActionsForItems)
      } else if (promotion.type === PromotionType.STANDARD) {
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

    transformPropertiesToBigNumber(computedActions, { include: ["amount"] })

    return computedActions
  }

  // @ts-expect-error
  async createPromotions(
    data: PromotionTypes.CreatePromotionDTO,
    sharedContext?: Context
  ): Promise<PromotionTypes.PromotionDTO>

  // @ts-expect-error
  async createPromotions(
    data: PromotionTypes.CreatePromotionDTO[],
    sharedContext?: Context
  ): Promise<PromotionTypes.PromotionDTO[]>

  @InjectManager()
  @EmitEvents()
  // @ts-expect-error
  async createPromotions(
    data:
      | PromotionTypes.CreatePromotionDTO
      | PromotionTypes.CreatePromotionDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<PromotionTypes.PromotionDTO | PromotionTypes.PromotionDTO[]> {
    const input = Array.isArray(data) ? data : [data]
    const createdPromotions = await this.createPromotions_(input, sharedContext)

    const promotions = await this.listPromotions(
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
      },
      sharedContext
    )

    return await this.baseRepository_.serialize<
      PromotionTypes.PromotionDTO | PromotionTypes.PromotionDTO[]
    >(Array.isArray(data) ? promotions : promotions[0])
  }

  @InjectTransactionManager()
  protected async createPromotions_(
    data: PromotionTypes.CreatePromotionDTO[],
    @MedusaContext() sharedContext: Context = {}
  ) {
    const promotionsData: CreatePromotionDTO[] = []
    const applicationMethodsData: CreateApplicationMethodDTO[] = []
    const campaignsData: CreateCampaignDTO[] = []

    const campaignIds = data
      .filter((d) => d.campaign_id)
      .map((d) => d.campaign_id)
      .filter((id): id is string => isString(id))

    const existingCampaigns =
      campaignIds.length > 0
        ? await this.campaignService_.list(
            { id: campaignIds },
            { relations: ["budget"] },
            sharedContext
          )
        : []

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

      if (promotionCodeRulesDataMap.has(promotion.code)) {
        await this.createPromotionRulesAndValues_(
          promotionCodeRulesDataMap.get(promotion.code) || [],
          "promotions",
          promotion,
          sharedContext
        )
      }
    }

    const createdApplicationMethods =
      applicationMethodsData.length > 0
        ? await this.applicationMethodService_.create(
            applicationMethodsData,
            sharedContext
          )
        : []

    const createdCampaigns =
      campaignsData.length > 0
        ? await this.createCampaigns(campaignsData, sharedContext)
        : []

    for (const campaignData of campaignsData) {
      const promotions = campaignData.promotions
      const campaign = createdCampaigns.find(
        (c) => c.campaign_identifier === campaignData.campaign_identifier
      )

      if (campaign && promotions && promotions.length) {
        await this.addPromotionsToCampaign(
          { id: campaign.id, promotion_ids: promotions.map((p) => p.id) },
          sharedContext
        )
      }
    }

    for (const applicationMethod of createdApplicationMethods) {
      const targetRules = methodTargetRulesMap.get(
        applicationMethod.promotion.id
      )
      if (targetRules && targetRules.length > 0) {
        await this.createPromotionRulesAndValues_(
          targetRules,
          "method_target_rules",
          applicationMethod,
          sharedContext
        )
      }

      const buyRules = methodBuyRulesMap.get(applicationMethod.promotion.id)
      if (buyRules && buyRules.length > 0) {
        await this.createPromotionRulesAndValues_(
          buyRules,
          "method_buy_rules",
          applicationMethod,
          sharedContext
        )
      }
    }

    return createdPromotions
  }

  // @ts-expect-error
  async updatePromotions(
    data: PromotionTypes.UpdatePromotionDTO,
    sharedContext?: Context
  ): Promise<PromotionTypes.PromotionDTO>

  // @ts-expect-error
  async updatePromotions(
    data: PromotionTypes.UpdatePromotionDTO[],
    sharedContext?: Context
  ): Promise<PromotionTypes.PromotionDTO[]>

  @InjectManager()
  @EmitEvents()
  // @ts-expect-error
  async updatePromotions(
    data:
      | PromotionTypes.UpdatePromotionDTO
      | PromotionTypes.UpdatePromotionDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<PromotionTypes.PromotionDTO | PromotionTypes.PromotionDTO[]> {
    const input = Array.isArray(data) ? data : [data]
    const updatedPromotions = await this.updatePromotions_(input, sharedContext)

    const promotions = await this.listPromotions(
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
      },
      sharedContext
    )

    return Array.isArray(data) ? promotions : promotions[0]
  }

  @InjectTransactionManager()
  protected async updatePromotions_(
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

    const existingPromotionsMap = new Map<
      string,
      InferEntityType<typeof Promotion>
    >(existingPromotions.map((promotion) => [promotion.id, promotion]))

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

      // Validate promotion limit cannot be less than current usage
      if (isDefined(promotionData.limit) && promotionData.limit !== null) {
        const currentUsed = existingPromotion.used ?? 0
        if (promotionData.limit < currentUsed) {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            `Promotion limit (${promotionData.limit}) cannot be less than current usage (${currentUsed})`
          )
        }
      }

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

      if (isDefined(campaignId)) {
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

  @InjectManager()
  @EmitEvents()
  // @ts-ignore
  async updatePromotionRules(
    data: PromotionTypes.UpdatePromotionRuleDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<PromotionTypes.PromotionRuleDTO[]> {
    const updatedPromotionRules = await this.updatePromotionRules_(
      data,
      sharedContext
    )

    return await this.listPromotionRules(
      { id: updatedPromotionRules.map((r) => r.id) },
      { relations: ["values"] },
      sharedContext
    )
  }

  @InjectTransactionManager()
  protected async updatePromotionRules_(
    data: PromotionTypes.UpdatePromotionRuleDTO[],
    @MedusaContext() sharedContext: Context = {}
  ) {
    const promotionRuleIds = data.map((d) => d.id)

    const promotionRules = await this.promotionRuleService_.list(
      { id: promotionRuleIds },
      { relations: ["values"] },
      sharedContext
    )

    const existingPromotionRuleIds: string[] = []
    const promotionRulesMap: Map<string, PromotionTypes.PromotionRuleDTO> =
      new Map()

    for (const promotionRule of promotionRules) {
      existingPromotionRuleIds.push(promotionRule.id)
      promotionRulesMap.set(promotionRule.id, promotionRule)
    }

    const invalidRuleId = arrayDifference(
      deduplicate(promotionRuleIds),
      existingPromotionRuleIds
    )

    if (invalidRuleId.length) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Promotion rules with id - ${invalidRuleId.join(", ")} not found`
      )
    }

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

  @InjectManager()
  @EmitEvents()
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

  @InjectManager()
  @EmitEvents()
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

  @InjectManager()
  @EmitEvents()
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

  @InjectTransactionManager()
  protected async createPromotionRulesAndValues_(
    rulesData: PromotionTypes.CreatePromotionRuleDTO[],
    relationName: "promotions" | "method_target_rules" | "method_buy_rules",
    relation:
      | InferEntityType<typeof Promotion>
      | InferEntityType<typeof ApplicationMethod>,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<InferEntityType<typeof PromotionRule>[]> {
    const MikroORMApplicationMethod = toMikroORMEntity(ApplicationMethod)
    const createdPromotionRules: InferEntityType<typeof PromotionRule>[] = []
    const promotion =
      relation instanceof MikroORMApplicationMethod
        ? relation.promotion
        : relation

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

    const promotionRuleValuesDataToCreate: CreatePromotionRuleValueDTO[] = []

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

      promotionRuleValuesDataToCreate.push(...promotionRuleValuesData)
    }

    await this.promotionRuleValueService_.create(
      promotionRuleValuesDataToCreate,
      sharedContext
    )

    return createdPromotionRules
  }

  @InjectManager()
  @EmitEvents()
  async removePromotionRules(
    promotionId: string,
    ruleIds: string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    await this.removePromotionRules_(promotionId, ruleIds, sharedContext)
  }

  @InjectTransactionManager()
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

  @InjectManager()
  @EmitEvents()
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

  @InjectManager()
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

  @InjectTransactionManager()
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

  // @ts-expect-error
  async createCampaigns(
    data: PromotionTypes.CreateCampaignDTO,
    sharedContext?: Context
  ): Promise<PromotionTypes.CampaignDTO>

  // @ts-expect-error
  async createCampaigns(
    data: PromotionTypes.CreateCampaignDTO[],
    sharedContext?: Context
  ): Promise<PromotionTypes.CampaignDTO[]>

  @InjectManager()
  @EmitEvents()
  // @ts-expect-error
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
      },
      sharedContext
    )

    return Array.isArray(data) ? campaigns : campaigns[0]
  }

  @InjectTransactionManager()
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
    currency_code?: string | null
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

  // @ts-expect-error
  async updateCampaigns(
    data: PromotionTypes.UpdateCampaignDTO,
    sharedContext?: Context
  ): Promise<PromotionTypes.CampaignDTO>

  // @ts-expect-error
  async updateCampaigns(
    data: PromotionTypes.UpdateCampaignDTO[],
    sharedContext?: Context
  ): Promise<PromotionTypes.CampaignDTO[]>

  @InjectManager()
  @EmitEvents()
  // @ts-expect-error
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
      },
      sharedContext
    )

    return Array.isArray(data) ? campaigns : campaigns[0]
  }

  @InjectTransactionManager()
  protected async updateCampaigns_(
    data: PromotionTypes.UpdateCampaignDTO[],
    @MedusaContext() sharedContext: Context = {}
  ) {
    const campaignIds = data.map((d) => d.id)
    const campaignsData: UpdateCampaignDTO[] = []
    const updateBudgetData: UpdateCampaignBudgetDTO[] = []
    const createBudgetData: CreateCampaignBudgetDTO[] = []

    const existingCampaigns = await this.campaignService_.list(
      { id: campaignIds },
      { relations: ["budget"] },
      sharedContext
    )

    const existingCampaignsMap = new Map<
      string,
      InferEntityType<typeof Campaign>
    >(existingCampaigns.map((campaign) => [campaign.id, campaign]))

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

  @InjectManager()
  @EmitEvents()
  async addPromotionsToCampaign(
    data: PromotionTypes.AddPromotionsToCampaignDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<{ ids: string[] }> {
    const ids = await this.addPromotionsToCampaign_(data, sharedContext)

    return { ids }
  }

  // TODO:
  // - introduce currency_code to promotion
  // - allow promotions to be queried by currency code
  // - when the above is present, validate adding promotion to campaign based on currency code
  @InjectTransactionManager()
  protected async addPromotionsToCampaign_(
    data: PromotionTypes.AddPromotionsToCampaignDTO,
    @MedusaContext() sharedContext: Context = {}
  ) {
    const { id, promotion_ids: promotionIds = [] } = data

    const campaign = await this.campaignService_.retrieve(id, {}, sharedContext)
    const promotionsToAdd = await this.promotionService_.list(
      { id: promotionIds, campaign_id: null },
      { relations: ["application_method"] },
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

  @InjectManager()
  @EmitEvents()
  async removePromotionsFromCampaign(
    data: PromotionTypes.AddPromotionsToCampaignDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<{ ids: string[] }> {
    const ids = await this.removePromotionsFromCampaign_(data, sharedContext)

    return { ids }
  }

  @InjectTransactionManager()
  protected async removePromotionsFromCampaign_(
    data: PromotionTypes.AddPromotionsToCampaignDTO,
    @MedusaContext() sharedContext: Context = {}
  ) {
    const { id, promotion_ids: promotionIds = [] } = data

    await this.campaignService_.retrieve(id, {}, sharedContext)
    const promotionsToRemove = await this.promotionService_.list(
      { id: promotionIds },
      {},
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

"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("@medusajs/types");
const utils_1 = require("@medusajs/utils");
const _models_1 = require("../models");
const _types_1 = require("../types");
const _utils_1 = require("../utils");
const joiner_config_1 = require("../joiner-config");
const generateMethodForModels = [
    _models_1.ApplicationMethod,
    _models_1.Campaign,
    _models_1.CampaignBudget,
    _models_1.PromotionRule,
    _models_1.PromotionRuleValue,
];
class PromotionModuleService extends utils_1.ModulesSdkUtils.abstractModuleServiceFactory(_models_1.Promotion, generateMethodForModels, joiner_config_1.entityNameToLinkableKeysMap) {
    constructor({ baseRepository, promotionService, applicationMethodService, promotionRuleService, promotionRuleValueService, campaignService, campaignBudgetService, }, moduleDeclaration) {
        // @ts-ignore
        super(...arguments);
        this.moduleDeclaration = moduleDeclaration;
        this.baseRepository_ = baseRepository;
        this.promotionService_ = promotionService;
        this.applicationMethodService_ = applicationMethodService;
        this.promotionRuleService_ = promotionRuleService;
        this.promotionRuleValueService_ = promotionRuleValueService;
        this.campaignService_ = campaignService;
        this.campaignBudgetService_ = campaignBudgetService;
    }
    __joinerConfig() {
        return joiner_config_1.joinerConfig;
    }
    async registerUsage(computedActions, sharedContext = {}) {
        const promotionCodes = computedActions
            .map((computedAction) => computedAction.code)
            .filter(Boolean);
        const promotionCodeCampaignBudgetMap = new Map();
        const promotionCodeUsageMap = new Map();
        const existingPromotions = await this.list({ code: promotionCodes }, { relations: ["application_method", "campaign", "campaign.budget"] }, sharedContext);
        const existingPromotionsMap = new Map(existingPromotions.map((promotion) => [promotion.code, promotion]));
        for (let computedAction of computedActions) {
            if (!_utils_1.ComputeActionUtils.canRegisterUsage(computedAction)) {
                continue;
            }
            const promotion = existingPromotionsMap.get(computedAction.code);
            if (!promotion) {
                continue;
            }
            const campaignBudget = promotion.campaign?.budget;
            if (!campaignBudget) {
                continue;
            }
            if (campaignBudget.type === utils_1.CampaignBudgetType.SPEND) {
                const campaignBudgetData = promotionCodeCampaignBudgetMap.get(campaignBudget.id) || { id: campaignBudget.id, used: campaignBudget.used ?? 0 };
                campaignBudgetData.used =
                    (campaignBudgetData.used ?? 0) + computedAction.amount;
                if (campaignBudget.limit &&
                    campaignBudgetData.used > campaignBudget.limit) {
                    continue;
                }
                promotionCodeCampaignBudgetMap.set(campaignBudget.id, campaignBudgetData);
            }
            if (campaignBudget.type === utils_1.CampaignBudgetType.USAGE) {
                const promotionAlreadyUsed = promotionCodeUsageMap.get(promotion.code) || false;
                if (promotionAlreadyUsed) {
                    continue;
                }
                const campaignBudgetData = {
                    id: campaignBudget.id,
                    used: (campaignBudget.used ?? 0) + 1,
                };
                if (campaignBudget.limit &&
                    campaignBudgetData.used > campaignBudget.limit) {
                    continue;
                }
                promotionCodeCampaignBudgetMap.set(campaignBudget.id, campaignBudgetData);
                promotionCodeUsageMap.set(promotion.code, true);
            }
            const campaignBudgetsData = [];
            for (const [_, campaignBudgetData] of promotionCodeCampaignBudgetMap) {
                campaignBudgetsData.push(campaignBudgetData);
            }
            await this.campaignBudgetService_.update(campaignBudgetsData, sharedContext);
        }
    }
    async computeActions(promotionCodes, applicationContext, options = {}, sharedContext = {}) {
        const { prevent_auto_promotions: preventAutoPromotions } = options;
        const computedActions = [];
        const { items = [], shipping_methods: shippingMethods = [] } = applicationContext;
        const appliedItemCodes = [];
        const appliedShippingCodes = [];
        const codeAdjustmentMap = new Map();
        const methodIdPromoValueMap = new Map();
        const automaticPromotions = preventAutoPromotions
            ? []
            : await this.list({ is_automatic: true }, { select: ["code"], take: null }, sharedContext);
        // Promotions we need to apply includes all the codes that are passed as an argument
        // to this method, along with any automatic promotions that can be applied to the context
        const automaticPromotionCodes = automaticPromotions.map((p) => p.code);
        const promotionCodesToApply = [
            ...promotionCodes,
            ...automaticPromotionCodes,
        ];
        items.forEach((item) => {
            item.adjustments?.forEach((adjustment) => {
                if ((0, utils_1.isString)(adjustment.code)) {
                    const adjustments = codeAdjustmentMap.get(adjustment.code) || [];
                    adjustments.push(adjustment);
                    codeAdjustmentMap.set(adjustment.code, adjustments);
                    appliedItemCodes.push(adjustment.code);
                }
            });
        });
        shippingMethods.forEach((shippingMethod) => {
            shippingMethod.adjustments?.forEach((adjustment) => {
                if ((0, utils_1.isString)(adjustment.code)) {
                    const adjustments = codeAdjustmentMap.get(adjustment.code) || [];
                    adjustments.push(adjustment);
                    codeAdjustmentMap.set(adjustment.code, adjustments);
                    appliedShippingCodes.push(adjustment.code);
                }
            });
        });
        const promotions = await this.list({
            code: [
                ...promotionCodesToApply,
                ...appliedItemCodes,
                ...appliedShippingCodes,
            ],
        }, {
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
        });
        const existingPromotionsMap = new Map(promotions.map((promotion) => [promotion.code, promotion]));
        // We look at any existing promo codes applied in the context and recommend
        // them to be removed to start calculations from the beginning and refresh
        // the adjustments if they are requested to be applied again
        const appliedCodes = [...appliedShippingCodes, ...appliedItemCodes];
        for (const appliedCode of appliedCodes) {
            const promotion = existingPromotionsMap.get(appliedCode);
            const adjustments = codeAdjustmentMap.get(appliedCode) || [];
            const action = appliedShippingCodes.includes(appliedCode)
                ? utils_1.ComputedActions.REMOVE_SHIPPING_METHOD_ADJUSTMENT
                : utils_1.ComputedActions.REMOVE_ITEM_ADJUSTMENT;
            if (!promotion) {
                throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, `Applied Promotion for code (${appliedCode}) not found`);
            }
            adjustments.forEach((adjustment) => computedActions.push({
                action,
                adjustment_id: adjustment.id,
                code: appliedCode,
            }));
        }
        // We sort the promo codes to apply with buy get type first as they
        // are likely to be most valuable.
        const sortedPermissionsToApply = promotions
            .filter((p) => promotionCodesToApply.includes(p.code))
            .sort(_utils_1.ComputeActionUtils.sortByBuyGetType);
        for (const promotionToApply of sortedPermissionsToApply) {
            const promotion = existingPromotionsMap.get(promotionToApply.code);
            const { application_method: applicationMethod, rules: promotionRules = [], } = promotion;
            if (!applicationMethod) {
                continue;
            }
            const isPromotionApplicable = (0, _utils_1.areRulesValidForContext)(promotionRules, applicationContext);
            if (!isPromotionApplicable) {
                continue;
            }
            if (promotion.type === utils_1.PromotionType.BUYGET) {
                const computedActionsForItems = _utils_1.ComputeActionUtils.getComputedActionsForBuyGet(promotion, applicationContext[utils_1.ApplicationMethodTargetType.ITEMS], methodIdPromoValueMap);
                computedActions.push(...computedActionsForItems);
            }
            if (promotion.type === utils_1.PromotionType.STANDARD) {
                const isTargetOrder = applicationMethod.target_type === utils_1.ApplicationMethodTargetType.ORDER;
                const isTargetItems = applicationMethod.target_type === utils_1.ApplicationMethodTargetType.ITEMS;
                const isTargetShipping = applicationMethod.target_type ===
                    utils_1.ApplicationMethodTargetType.SHIPPING_METHODS;
                const allocationOverride = isTargetOrder
                    ? utils_1.ApplicationMethodAllocation.ACROSS
                    : undefined;
                if (isTargetOrder || isTargetItems) {
                    const computedActionsForItems = _utils_1.ComputeActionUtils.getComputedActionsForItems(promotion, applicationContext[utils_1.ApplicationMethodTargetType.ITEMS], methodIdPromoValueMap, allocationOverride);
                    computedActions.push(...computedActionsForItems);
                }
                if (isTargetShipping) {
                    const computedActionsForShippingMethods = _utils_1.ComputeActionUtils.getComputedActionsForShippingMethods(promotion, applicationContext[utils_1.ApplicationMethodTargetType.SHIPPING_METHODS], methodIdPromoValueMap);
                    computedActions.push(...computedActionsForShippingMethods);
                }
            }
        }
        return computedActions;
    }
    async create(data, sharedContext = {}) {
        const input = Array.isArray(data) ? data : [data];
        const createdPromotions = await this.create_(input, sharedContext);
        const promotions = await this.list({ id: createdPromotions.map((p) => p.id) }, {
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
        }, sharedContext);
        return Array.isArray(data) ? promotions : promotions[0];
    }
    async create_(data, sharedContext = {}) {
        const promotionsData = [];
        const applicationMethodsData = [];
        const campaignsData = [];
        const promotionCodeApplicationMethodDataMap = new Map();
        const promotionCodeRulesDataMap = new Map();
        const methodTargetRulesMap = new Map();
        const methodBuyRulesMap = new Map();
        const promotionCodeCampaignMap = new Map();
        for (const { application_method: applicationMethodData, rules: rulesData, campaign: campaignData, campaign_id: campaignId, ...promotionData } of data) {
            if (applicationMethodData) {
                promotionCodeApplicationMethodDataMap.set(promotionData.code, applicationMethodData);
            }
            if (rulesData) {
                promotionCodeRulesDataMap.set(promotionData.code, rulesData);
            }
            if (campaignData && campaignId) {
                throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, `Provide either the 'campaign' or 'campaign_id' parameter; both cannot be used simultaneously.`);
            }
            if (campaignData) {
                promotionCodeCampaignMap.set(promotionData.code, campaignData);
            }
            promotionsData.push({
                ...promotionData,
                campaign: campaignId,
            });
        }
        const createdPromotions = await this.promotionService_.create(promotionsData, sharedContext);
        for (const promotion of createdPromotions) {
            const applMethodData = promotionCodeApplicationMethodDataMap.get(promotion.code);
            const campaignData = promotionCodeCampaignMap.get(promotion.code);
            if (campaignData) {
                campaignsData.push({
                    ...campaignData,
                    promotions: [promotion],
                });
            }
            if (applMethodData) {
                const { target_rules: targetRulesData = [], buy_rules: buyRulesData = [], ...applicationMethodWithoutRules } = applMethodData;
                const applicationMethodData = {
                    ...applicationMethodWithoutRules,
                    promotion,
                };
                if (applicationMethodData.target_type ===
                    utils_1.ApplicationMethodTargetType.ORDER &&
                    targetRulesData.length) {
                    throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, `Target rules for application method with target type (${utils_1.ApplicationMethodTargetType.ORDER}) is not allowed`);
                }
                if (promotion.type === utils_1.PromotionType.BUYGET && !buyRulesData.length) {
                    throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, `Buy rules are required for ${utils_1.PromotionType.BUYGET} promotion type`);
                }
                if (promotion.type === utils_1.PromotionType.BUYGET &&
                    !targetRulesData.length) {
                    throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, `Target rules are required for ${utils_1.PromotionType.BUYGET} promotion type`);
                }
                (0, _utils_1.validateApplicationMethodAttributes)(applicationMethodData, promotion);
                applicationMethodsData.push(applicationMethodData);
                if (targetRulesData.length) {
                    methodTargetRulesMap.set(promotion.id, targetRulesData);
                }
                if (buyRulesData.length) {
                    methodBuyRulesMap.set(promotion.id, buyRulesData);
                }
            }
            await this.createPromotionRulesAndValues_(promotionCodeRulesDataMap.get(promotion.code) || [], "promotions", promotion, sharedContext);
        }
        const createdApplicationMethods = await this.applicationMethodService_.create(applicationMethodsData, sharedContext);
        if (campaignsData.length) {
            await this.createCampaigns(campaignsData, sharedContext);
        }
        for (const applicationMethod of createdApplicationMethods) {
            await this.createPromotionRulesAndValues_(methodTargetRulesMap.get(applicationMethod.promotion.id) || [], "method_target_rules", applicationMethod, sharedContext);
            await this.createPromotionRulesAndValues_(methodBuyRulesMap.get(applicationMethod.promotion.id) || [], "method_buy_rules", applicationMethod, sharedContext);
        }
        return createdPromotions;
    }
    async update(data, sharedContext = {}) {
        const input = Array.isArray(data) ? data : [data];
        const updatedPromotions = await this.update_(input, sharedContext);
        const promotions = await this.list({ id: updatedPromotions.map((p) => p.id) }, {
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
        }, sharedContext);
        return Array.isArray(data) ? promotions : promotions[0];
    }
    async update_(data, sharedContext = {}) {
        const promotionIds = data.map((d) => d.id);
        const existingPromotions = await this.promotionService_.list({ id: promotionIds }, { relations: ["application_method"] });
        const existingPromotionsMap = new Map(existingPromotions.map((promotion) => [promotion.id, promotion]));
        const promotionsData = [];
        const applicationMethodsData = [];
        for (const { application_method: applicationMethodData, campaign_id: campaignId, ...promotionData } of data) {
            if (campaignId) {
                promotionsData.push({ ...promotionData, campaign: campaignId });
            }
            else {
                promotionsData.push(promotionData);
            }
            if (!applicationMethodData) {
                continue;
            }
            const existingPromotion = existingPromotionsMap.get(promotionData.id);
            const existingApplicationMethod = existingPromotion?.application_method;
            if (!existingApplicationMethod) {
                continue;
            }
            if (applicationMethodData.allocation &&
                !_utils_1.allowedAllocationForQuantity.includes(applicationMethodData.allocation)) {
                applicationMethodData.max_quantity = null;
                existingApplicationMethod.max_quantity = null;
            }
            (0, _utils_1.validateApplicationMethodAttributes)(applicationMethodData, existingPromotion);
            applicationMethodsData.push({
                ...applicationMethodData,
                id: existingApplicationMethod.id,
            });
        }
        const updatedPromotions = this.promotionService_.update(promotionsData, sharedContext);
        if (applicationMethodsData.length) {
            await this.applicationMethodService_.update(applicationMethodsData, sharedContext);
        }
        return updatedPromotions;
    }
    async updatePromotionRules(data, sharedContext = {}) {
        const updatedPromotionRules = await this.updatePromotionRules_(data, sharedContext);
        return this.listPromotionRules({ id: updatedPromotionRules.map((r) => r.id) }, { relations: ["values"] }, sharedContext);
    }
    async updatePromotionRules_(data, sharedContext = {}) {
        const promotionRuleIds = data.map((d) => d.id);
        const promotionRules = await this.listPromotionRules({ id: promotionRuleIds }, { relations: ["values"] }, sharedContext);
        const invalidRuleId = (0, utils_1.arrayDifference)((0, utils_1.deduplicate)(promotionRuleIds), promotionRules.map((pr) => pr.id));
        if (invalidRuleId.length) {
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, `Promotion rules with id - ${invalidRuleId.join(", ")} not found`);
        }
        const promotionRulesMap = new Map(promotionRules.map((pr) => [pr.id, pr]));
        const rulesToUpdate = [];
        const ruleValueIdsToDelete = [];
        const ruleValuesToCreate = [];
        for (const promotionRuleData of data) {
            const { values, ...rest } = promotionRuleData;
            const normalizedValues = Array.isArray(values) ? values : [values];
            rulesToUpdate.push(rest);
            if ((0, utils_1.isDefined)(values)) {
                const promotionRule = promotionRulesMap.get(promotionRuleData.id);
                ruleValueIdsToDelete.push(...promotionRule.values.map((v) => v.id));
                ruleValuesToCreate.push(...normalizedValues.map((value) => ({
                    value,
                    promotion_rule: promotionRule,
                })));
            }
        }
        const [updatedRules] = await Promise.all([
            this.promotionRuleService_.update(rulesToUpdate, sharedContext),
            this.promotionRuleValueService_.delete(ruleValueIdsToDelete, sharedContext),
            this.promotionRuleValueService_.create(ruleValuesToCreate, sharedContext),
        ]);
        return updatedRules;
    }
    async addPromotionRules(promotionId, rulesData, sharedContext = {}) {
        const promotion = await this.promotionService_.retrieve(promotionId);
        const createdPromotionRules = await this.createPromotionRulesAndValues_(rulesData, "promotions", promotion, sharedContext);
        return this.listPromotionRules({ id: createdPromotionRules.map((r) => r.id) }, { relations: ["values"] }, sharedContext);
    }
    async addPromotionTargetRules(promotionId, rulesData, sharedContext = {}) {
        const promotion = await this.promotionService_.retrieve(promotionId, {
            relations: ["application_method"],
        });
        const applicationMethod = promotion.application_method;
        if (!applicationMethod) {
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, `application_method for promotion not found`);
        }
        const createdPromotionRules = await this.createPromotionRulesAndValues_(rulesData, "method_target_rules", applicationMethod, sharedContext);
        return await this.listPromotionRules({ id: createdPromotionRules.map((pr) => pr.id) }, { relations: ["values"] }, sharedContext);
    }
    async addPromotionBuyRules(promotionId, rulesData, sharedContext = {}) {
        const promotion = await this.promotionService_.retrieve(promotionId, {
            relations: ["application_method"],
        });
        const applicationMethod = promotion.application_method;
        if (!applicationMethod) {
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, `application_method for promotion not found`);
        }
        const createdPromotionRules = await this.createPromotionRulesAndValues_(rulesData, "method_buy_rules", applicationMethod, sharedContext);
        return await this.listPromotionRules({ id: createdPromotionRules.map((pr) => pr.id) }, { relations: ["values"] }, sharedContext);
    }
    async createPromotionRulesAndValues_(rulesData, relationName, relation, sharedContext = {}) {
        const createdPromotionRules = [];
        const promotion = relation instanceof _models_1.ApplicationMethod ? relation.promotion : relation;
        if (!rulesData.length) {
            return [];
        }
        if (relationName === "method_buy_rules" &&
            promotion.type === utils_1.PromotionType.STANDARD) {
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, `Can't add buy rules to a ${utils_1.PromotionType.STANDARD} promotion`);
        }
        (0, _utils_1.validatePromotionRuleAttributes)(rulesData);
        for (const ruleData of rulesData) {
            const { values, ...rest } = ruleData;
            const promotionRuleData = {
                ...rest,
                [relationName]: [relation],
            };
            const [createdPromotionRule] = await this.promotionRuleService_.create([promotionRuleData], sharedContext);
            createdPromotionRules.push(createdPromotionRule);
            const ruleValues = Array.isArray(values) ? values : [values];
            const promotionRuleValuesData = ruleValues.map((ruleValue) => ({
                value: ruleValue,
                promotion_rule: createdPromotionRule,
            }));
            await this.promotionRuleValueService_.create(promotionRuleValuesData, sharedContext);
        }
        return createdPromotionRules;
    }
    async removePromotionRules(promotionId, ruleIds, sharedContext = {}) {
        await this.removePromotionRules_(promotionId, ruleIds, sharedContext);
    }
    async removePromotionRules_(promotionId, ruleIds, sharedContext = {}) {
        const promotion = await this.promotionService_.retrieve(promotionId, { relations: ["rules"] }, sharedContext);
        const existingRuleIds = promotion.rules.map((rule) => rule.id);
        const idsToRemove = ruleIds.filter((id) => existingRuleIds.includes(id));
        await this.promotionRuleService_.delete(idsToRemove, sharedContext);
    }
    async removePromotionTargetRules(promotionId, ruleIds, sharedContext = {}) {
        await this.removeApplicationMethodRules_(promotionId, ruleIds, _types_1.ApplicationMethodRuleTypes.TARGET_RULES, sharedContext);
    }
    async removePromotionBuyRules(promotionId, ruleIds, sharedContext = {}) {
        await this.removeApplicationMethodRules_(promotionId, ruleIds, _types_1.ApplicationMethodRuleTypes.BUY_RULES, sharedContext);
    }
    async removeApplicationMethodRules_(promotionId, ruleIds, relation, sharedContext = {}) {
        const promotion = await this.promotionService_.retrieve(promotionId, { relations: [`application_method.${relation}`] }, sharedContext);
        const applicationMethod = promotion.application_method;
        if (!applicationMethod) {
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, `application_method for promotion not found`);
        }
        const targetRuleIdsToRemove = applicationMethod[relation]
            .filter((rule) => ruleIds.includes(rule.id))
            .map((rule) => rule.id);
        await this.promotionRuleService_.delete(targetRuleIdsToRemove, sharedContext);
    }
    async createCampaigns(data, sharedContext = {}) {
        const input = Array.isArray(data) ? data : [data];
        const createdCampaigns = await this.createCampaigns_(input, sharedContext);
        const campaigns = await this.listCampaigns({ id: createdCampaigns.map((p) => p.id) }, {
            relations: ["budget", "promotions"],
            take: null,
        }, sharedContext);
        return Array.isArray(data) ? campaigns : campaigns[0];
    }
    async createCampaigns_(data, sharedContext = {}) {
        const campaignsData = [];
        const campaignBudgetsData = [];
        const campaignIdentifierBudgetMap = new Map();
        for (const createCampaignData of data) {
            const { budget: campaignBudgetData, promotions, ...campaignData } = createCampaignData;
            const promotionsToAdd = promotions
                ? await this.list({ id: promotions.map((p) => p.id) }, { take: null }, sharedContext)
                : [];
            if (campaignBudgetData) {
                campaignIdentifierBudgetMap.set(campaignData.campaign_identifier, campaignBudgetData);
            }
            campaignsData.push({
                ...campaignData,
                promotions: promotionsToAdd,
            });
        }
        const createdCampaigns = await this.campaignService_.create(campaignsData, sharedContext);
        for (const createdCampaign of createdCampaigns) {
            const campaignBudgetData = campaignIdentifierBudgetMap.get(createdCampaign.campaign_identifier);
            if (campaignBudgetData) {
                campaignBudgetsData.push({
                    ...campaignBudgetData,
                    campaign: createdCampaign.id,
                });
            }
        }
        if (campaignBudgetsData.length) {
            await this.campaignBudgetService_.create(campaignBudgetsData, sharedContext);
        }
        return createdCampaigns;
    }
    async updateCampaigns(data, sharedContext = {}) {
        const input = Array.isArray(data) ? data : [data];
        const updatedCampaigns = await this.updateCampaigns_(input, sharedContext);
        const campaigns = await this.listCampaigns({ id: updatedCampaigns.map((p) => p.id) }, {
            relations: ["budget", "promotions"],
            take: null,
        }, sharedContext);
        return Array.isArray(data) ? campaigns : campaigns[0];
    }
    async updateCampaigns_(data, sharedContext = {}) {
        const campaignIds = data.map((d) => d.id);
        const campaignsData = [];
        const campaignBudgetsData = [];
        const existingCampaigns = await this.listCampaigns({ id: campaignIds }, { relations: ["budget"], take: null }, sharedContext);
        const existingCampaignsMap = new Map(existingCampaigns.map((campaign) => [campaign.id, campaign]));
        for (const updateCampaignData of data) {
            const { budget: campaignBudgetData, ...campaignData } = updateCampaignData;
            const existingCampaign = existingCampaignsMap.get(campaignData.id);
            const existingCampaignBudget = existingCampaign?.budget;
            campaignsData.push(campaignData);
            if (existingCampaignBudget && campaignBudgetData) {
                campaignBudgetsData.push({
                    id: existingCampaignBudget.id,
                    ...campaignBudgetData,
                });
            }
        }
        const updatedCampaigns = await this.campaignService_.update(campaignsData, sharedContext);
        if (campaignBudgetsData.length) {
            await this.campaignBudgetService_.update(campaignBudgetsData, sharedContext);
        }
        return updatedCampaigns;
    }
}
exports.default = PromotionModuleService;
__decorate([
    (0, utils_1.InjectManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], PromotionModuleService.prototype, "registerUsage", null);
__decorate([
    (0, utils_1.InjectManager)("baseRepository_"),
    __param(3, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], PromotionModuleService.prototype, "computeActions", null);
__decorate([
    (0, utils_1.InjectManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PromotionModuleService.prototype, "create", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], PromotionModuleService.prototype, "create_", null);
__decorate([
    (0, utils_1.InjectManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PromotionModuleService.prototype, "update", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], PromotionModuleService.prototype, "update_", null);
__decorate([
    (0, utils_1.InjectManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], PromotionModuleService.prototype, "updatePromotionRules", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], PromotionModuleService.prototype, "updatePromotionRules_", null);
__decorate([
    (0, utils_1.InjectManager)("baseRepository_"),
    __param(2, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array, Object]),
    __metadata("design:returntype", Promise)
], PromotionModuleService.prototype, "addPromotionRules", null);
__decorate([
    (0, utils_1.InjectManager)("baseRepository_"),
    __param(2, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array, Object]),
    __metadata("design:returntype", Promise)
], PromotionModuleService.prototype, "addPromotionTargetRules", null);
__decorate([
    (0, utils_1.InjectManager)("baseRepository_"),
    __param(2, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array, Object]),
    __metadata("design:returntype", Promise)
], PromotionModuleService.prototype, "addPromotionBuyRules", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __param(3, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, String, Object, Object]),
    __metadata("design:returntype", Promise)
], PromotionModuleService.prototype, "createPromotionRulesAndValues_", null);
__decorate([
    (0, utils_1.InjectManager)("baseRepository_"),
    __param(2, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array, Object]),
    __metadata("design:returntype", Promise)
], PromotionModuleService.prototype, "removePromotionRules", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __param(2, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array, Object]),
    __metadata("design:returntype", Promise)
], PromotionModuleService.prototype, "removePromotionRules_", null);
__decorate([
    (0, utils_1.InjectManager)("baseRepository_"),
    __param(2, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array, Object]),
    __metadata("design:returntype", Promise)
], PromotionModuleService.prototype, "removePromotionTargetRules", null);
__decorate([
    (0, utils_1.InjectManager)("baseRepository_"),
    __param(2, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array, Object]),
    __metadata("design:returntype", Promise)
], PromotionModuleService.prototype, "removePromotionBuyRules", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __param(3, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array, String, Object]),
    __metadata("design:returntype", Promise)
], PromotionModuleService.prototype, "removeApplicationMethodRules_", null);
__decorate([
    (0, utils_1.InjectManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PromotionModuleService.prototype, "createCampaigns", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], PromotionModuleService.prototype, "createCampaigns_", null);
__decorate([
    (0, utils_1.InjectManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PromotionModuleService.prototype, "updateCampaigns", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], PromotionModuleService.prototype, "updateCampaigns_", null);

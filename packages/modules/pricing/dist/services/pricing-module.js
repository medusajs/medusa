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
const _utils_1 = require("../utils");
const joiner_config_1 = require("../joiner-config");
const price_list_1 = require("../models/price-list");
const price_set_1 = require("../models/price-set");
const generateMethodForModels = [
    _models_1.PriceList,
    _models_1.PriceListRule,
    _models_1.PriceListRuleValue,
    _models_1.PriceRule,
    _models_1.Price,
    _models_1.PriceSetRuleType,
    _models_1.RuleType,
];
class PricingModuleService extends utils_1.ModulesSdkUtils.abstractModuleServiceFactory(_models_1.PriceSet, generateMethodForModels, joiner_config_1.entityNameToLinkableKeysMap) {
    constructor({ baseRepository, pricingRepository, ruleTypeService, priceSetService, priceRuleService, priceSetRuleTypeService, priceService, priceListService, priceListRuleService, priceListRuleValueService, }, moduleDeclaration) {
        // @ts-ignore
        super(...arguments);
        this.moduleDeclaration = moduleDeclaration;
        this.baseRepository_ = baseRepository;
        this.pricingRepository_ = pricingRepository;
        this.ruleTypeService_ = ruleTypeService;
        this.priceSetService_ = priceSetService;
        this.ruleTypeService_ = ruleTypeService;
        this.priceRuleService_ = priceRuleService;
        this.priceSetRuleTypeService_ = priceSetRuleTypeService;
        this.priceService_ = priceService;
        this.priceListService_ = priceListService;
        this.priceListRuleService_ = priceListRuleService;
        this.priceListRuleValueService_ = priceListRuleValueService;
    }
    __joinerConfig() {
        return joiner_config_1.joinerConfig;
    }
    setupCalculatedPriceConfig_(filters, config) {
        const fieldIdx = config.relations?.indexOf("calculated_price");
        const shouldCalculatePrice = fieldIdx > -1;
        const pricingContext = filters.context ?? {};
        delete filters.context;
        if (!shouldCalculatePrice) {
            return;
        }
        // cleanup virtual field "calculated_price"
        config.relations?.splice(fieldIdx, 1);
        return pricingContext;
    }
    async list(filters = {}, config = {}, sharedContext = {}) {
        const pricingContext = this.setupCalculatedPriceConfig_(filters, config);
        const priceSets = await super.list(filters, config, sharedContext);
        if (pricingContext && priceSets.length) {
            const priceSetIds = [];
            const priceSetMap = new Map();
            for (const priceSet of priceSets) {
                priceSetIds.push(priceSet.id);
                priceSetMap.set(priceSet.id, priceSet);
            }
            const calculatedPrices = await this.calculatePrices({ id: priceSets.map((p) => p.id) }, { context: pricingContext }, sharedContext);
            for (const calculatedPrice of calculatedPrices) {
                const priceSet = priceSetMap.get(calculatedPrice.id);
                priceSet.calculated_price = calculatedPrice;
            }
        }
        return priceSets;
    }
    async listAndCount(filters = {}, config = {}, sharedContext = {}) {
        const pricingContext = this.setupCalculatedPriceConfig_(filters, config);
        const [priceSets, count] = await super.listAndCount(filters, config, sharedContext);
        if (pricingContext && priceSets.length) {
            const priceSetIds = [];
            const priceSetMap = new Map();
            for (const priceSet of priceSets) {
                priceSetIds.push(priceSet.id);
                priceSetMap.set(priceSet.id, priceSet);
            }
            const calculatedPrices = await this.calculatePrices({ id: priceSets.map((p) => p.id) }, { context: pricingContext }, sharedContext);
            for (const calculatedPrice of calculatedPrices) {
                const priceSet = priceSetMap.get(calculatedPrice.id);
                priceSet.calculated_price = calculatedPrice;
            }
        }
        return [priceSets, count];
    }
    async calculatePrices(pricingFilters, pricingContext = { context: {} }, sharedContext = {}) {
        const results = await this.pricingRepository_.calculatePrices(pricingFilters, pricingContext, sharedContext);
        const pricesSetPricesMap = (0, utils_1.groupBy)(results, "price_set_id");
        const calculatedPrices = pricingFilters.id.map((priceSetId) => {
            // This is where we select prices, for now we just do a first match based on the database results
            // which is prioritized by rules_count first for exact match and then deafult_priority of the rule_type
            // TODO: inject custom price selection here
            const prices = pricesSetPricesMap.get(priceSetId) || [];
            const priceListPrice = prices.find((p) => p.price_list_id);
            const defaultPrice = prices?.find((p) => !p.price_list_id);
            let calculatedPrice = defaultPrice;
            let originalPrice = defaultPrice;
            if (priceListPrice) {
                calculatedPrice = priceListPrice;
                if (priceListPrice.price_list_type === utils_1.PriceListType.OVERRIDE) {
                    originalPrice = priceListPrice;
                }
            }
            return {
                id: priceSetId,
                is_calculated_price_price_list: !!calculatedPrice?.price_list_id,
                calculated_amount: parseInt(calculatedPrice?.amount || "") || null,
                is_original_price_price_list: !!originalPrice?.price_list_id,
                original_amount: parseInt(originalPrice?.amount || "") || null,
                currency_code: calculatedPrice?.currency_code || null,
                calculated_price: {
                    id: calculatedPrice?.id || null,
                    price_list_id: calculatedPrice?.price_list_id || null,
                    price_list_type: calculatedPrice?.price_list_type || null,
                    min_quantity: parseInt(calculatedPrice?.min_quantity || "") || null,
                    max_quantity: parseInt(calculatedPrice?.max_quantity || "") || null,
                },
                original_price: {
                    id: originalPrice?.id || null,
                    price_list_id: originalPrice?.price_list_id || null,
                    price_list_type: originalPrice?.price_list_type || null,
                    min_quantity: parseInt(originalPrice?.min_quantity || "") || null,
                    max_quantity: parseInt(originalPrice?.max_quantity || "") || null,
                },
            };
        });
        return JSON.parse(JSON.stringify(calculatedPrices));
    }
    async create(data, sharedContext = {}) {
        const input = Array.isArray(data) ? data : [data];
        const priceSets = await this.create_(input, sharedContext);
        // TODO: Remove the need to refetch the data here
        const dbPriceSets = await this.list({ id: priceSets.map((p) => p.id) }, { relations: ["rule_types", "prices", "price_rules"] }, sharedContext);
        // Ensure the output to be in the same order as the input
        const results = priceSets.map((priceSet) => {
            return dbPriceSets.find((p) => p.id === priceSet.id);
        });
        return await this.baseRepository_.serialize(Array.isArray(data) ? results : results[0]);
    }
    async upsert(data, sharedContext = {}) {
        const input = Array.isArray(data) ? data : [data];
        const forUpdate = input.filter((priceSet) => !!priceSet.id);
        const forCreate = input.filter((priceSet) => !priceSet.id);
        const operations = [];
        if (forCreate.length) {
            operations.push(this.create_(forCreate, sharedContext));
        }
        if (forUpdate.length) {
            operations.push(this.update_(forUpdate, sharedContext));
        }
        const result = (await (0, utils_1.promiseAll)(operations)).flat();
        return await this.baseRepository_.serialize(Array.isArray(data) ? result : result[0]);
    }
    async update(idOrSelector, data, sharedContext = {}) {
        let normalizedInput = [];
        if ((0, utils_1.isString)(idOrSelector)) {
            // Check if the ID exists, it will throw if not.
            await this.priceSetService_.retrieve(idOrSelector, {}, sharedContext);
            normalizedInput = [{ id: idOrSelector, ...data }];
        }
        else {
            const priceSets = await this.priceSetService_.list(idOrSelector, {}, sharedContext);
            normalizedInput = priceSets.map((priceSet) => ({
                id: priceSet.id,
                ...data,
            }));
        }
        const updateResult = await this.update_(normalizedInput, sharedContext);
        const priceSets = await this.baseRepository_.serialize(updateResult);
        return (0, utils_1.isString)(idOrSelector) ? priceSets[0] : priceSets;
    }
    async normalizeUpdateData(data, sharedContext) {
        const ruleAttributes = data
            .map((d) => d.prices?.map((p) => Object.keys(p.rules ?? [])) ?? [])
            .flat(Infinity)
            .filter(Boolean);
        const ruleTypes = await this.ruleTypeService_.list({ rule_attribute: ruleAttributes }, { take: null }, sharedContext);
        const ruleTypeMap = ruleTypes.reduce((acc, curr) => {
            acc.set(curr.rule_attribute, curr);
            return acc;
        }, new Map());
        return data.map((priceSet) => {
            const prices = priceSet.prices?.map((price) => {
                const rules = Object.entries(price.rules ?? {}).map(([attribute, value]) => {
                    return {
                        price_set_id: priceSet.id,
                        rule_type_id: ruleTypeMap.get(attribute).id,
                        value,
                    };
                });
                const hasRulesInput = (0, utils_1.isPresent)(price.rules);
                delete price.rules;
                return {
                    ...price,
                    price_set_id: priceSet.id,
                    price_rules: hasRulesInput ? rules : undefined,
                    rules_count: hasRulesInput ? rules.length : undefined,
                };
            });
            return {
                ...priceSet,
                prices,
            };
        });
    }
    async update_(data, sharedContext = {}) {
        // TODO: We are not handling rule types, rules, etc. here, add support after data models are finalized
        // TODO: Since money IDs are rarely passed, this will delete all previous data and insert new entries.
        // We can make the `insert` inside upsertWithReplace do an `upsert` instead to avoid this
        const normalizedData = await this.normalizeUpdateData(data, sharedContext);
        const prices = normalizedData.flatMap((priceSet) => priceSet.prices || []);
        const upsertedPrices = await this.priceService_.upsertWithReplace(prices, {
            relations: ["price_rules"],
        }, sharedContext);
        const priceSetsToUpsert = normalizedData.map((priceSet) => {
            const { prices, ...rest } = priceSet;
            return {
                ...rest,
                prices: upsertedPrices
                    .filter((p) => p.price_set_id === priceSet.id)
                    .map((price) => {
                    // @ts-ignore
                    delete price.price_rules;
                    return price;
                }),
            };
        });
        return await this.priceSetService_.upsertWithReplace(priceSetsToUpsert, { relations: ["prices"] }, sharedContext);
    }
    async addRules(data, sharedContext = {}) {
        const inputs = Array.isArray(data) ? data : [data];
        const priceSets = await this.addRules_(inputs, sharedContext);
        const dbPriceSets = await this.list({ id: priceSets.map(({ id }) => id) }, { relations: ["rule_types"] });
        const orderedPriceSets = priceSets.map((priceSet) => {
            return dbPriceSets.find((p) => p.id === priceSet.id);
        });
        return Array.isArray(data) ? orderedPriceSets : orderedPriceSets[0];
    }
    async addPrices(data, sharedContext = {}) {
        const input = Array.isArray(data) ? data : [data];
        await this.addPrices_(input, sharedContext);
        const dbPrices = await this.list({ id: input.map((d) => d.priceSetId) }, { relations: ["prices"] }, sharedContext);
        const orderedPriceSets = input.map((inputItem) => {
            return dbPrices.find((p) => p.id === inputItem.priceSetId);
        });
        return Array.isArray(data) ? orderedPriceSets : orderedPriceSets[0];
    }
    async removeRules(data, sharedContext = {}) {
        const priceSets = await this.priceSetService_.list({ id: data.map((d) => d.id) }, {}, sharedContext);
        const priceSetIds = priceSets.map((ps) => ps.id);
        const ruleTypes = await this.ruleTypeService_.list({
            rule_attribute: data.map((d) => d.rules || []).flat(),
        }, { take: null }, sharedContext);
        const ruleTypeIds = ruleTypes.map((rt) => rt.id);
        const priceSetRuleTypes = await this.priceSetRuleTypeService_.list({ price_set_id: priceSetIds, rule_type_id: ruleTypeIds }, { take: null }, sharedContext);
        const priceRules = await this.priceRuleService_.list({ price_set_id: priceSetIds, rule_type_id: ruleTypeIds }, { select: ["price"], take: null }, sharedContext);
        await this.priceSetRuleTypeService_.delete(priceSetRuleTypes.map((psrt) => psrt.id), sharedContext);
        await this.priceService_.delete(priceRules.map((pr) => pr.price.id), sharedContext);
    }
    async createPriceLists(data, sharedContext = {}) {
        const priceLists = await this.createPriceLists_(data, sharedContext);
        return await this.baseRepository_.serialize(priceLists);
    }
    async updatePriceLists(data, sharedContext = {}) {
        const priceLists = await this.updatePriceLists_(data, sharedContext);
        return await this.baseRepository_.serialize(priceLists);
    }
    async createPriceListRules(data, sharedContext = {}) {
        const priceLists = await this.createPriceListRules_(data, sharedContext);
        return await this.baseRepository_.serialize(priceLists, {
            populate: true,
        });
    }
    async createPriceListRules_(data, sharedContext = {}) {
        return await this.priceListRuleService_.create(data, sharedContext);
    }
    async updatePriceListRules(data, sharedContext = {}) {
        const priceLists = await this.priceListRuleService_.update(data, sharedContext);
        return await this.baseRepository_.serialize(priceLists, {
            populate: true,
        });
    }
    async updatePriceListPrices(data, sharedContext = {}) {
        const prices = await this.updatePriceListPrices_(data, sharedContext);
        return await this.baseRepository_.serialize(prices);
    }
    async removePrices(ids, sharedContext = {}) {
        await this.removePrices_(ids, sharedContext);
    }
    async addPriceListPrices(data, sharedContext = {}) {
        const prices = await this.addPriceListPrices_(data, sharedContext);
        return await this.baseRepository_.serialize(prices);
    }
    async setPriceListRules(data, sharedContext = {}) {
        const [priceList] = await this.setPriceListRules_([data], sharedContext);
        return await this.baseRepository_.serialize(priceList);
    }
    async removePriceListRules(data, sharedContext = {}) {
        const [priceList] = await this.removePriceListRules_([data], sharedContext);
        return await this.baseRepository_.serialize(priceList);
    }
    async create_(data, sharedContext = {}) {
        const input = Array.isArray(data) ? data : [data];
        const ruleAttributes = (0, utils_1.deduplicate)(data.map((d) => d.rules?.map((r) => r.rule_attribute) ?? []).flat());
        const ruleTypes = await this.ruleTypeService_.list({ rule_attribute: ruleAttributes }, { take: null }, sharedContext);
        const ruleTypeMap = ruleTypes.reduce((acc, curr) => {
            acc.set(curr.rule_attribute, curr);
            return acc;
        }, new Map());
        const invalidRuleAttributes = ruleAttributes.filter((r) => !ruleTypeMap.has(r));
        if (invalidRuleAttributes.length > 0) {
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.NOT_FOUND, `Rule types don't exist for: ${invalidRuleAttributes.join(", ")}`);
        }
        const invalidMoneyAmountRule = data
            .map((d) => d.prices?.map((ma) => Object.keys(ma?.rules ?? {})).flat() ?? [])
            .flat()
            .filter((r) => !ruleTypeMap.has(r));
        if (invalidMoneyAmountRule.length > 0) {
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, `Rule types don't exist for money amounts with rule attribute: ${invalidMoneyAmountRule.join(", ")}`);
        }
        const ruleSetRuleTypeToCreateMap = new Map();
        const toCreate = input.map((inputData) => {
            const id = (0, utils_1.generateEntityId)(inputData.id, price_set_1.PriceSetIdPrefix);
            const { prices, rules = [], ...rest } = inputData;
            let pricesData = [];
            rules.forEach((rule) => {
                const priceSetRuleType = {
                    rule_type_id: ruleTypeMap.get(rule.rule_attribute).id,
                    price_set_id: id,
                };
                ruleSetRuleTypeToCreateMap.set(JSON.stringify(priceSetRuleType), priceSetRuleType);
            });
            if (inputData.prices) {
                pricesData = inputData.prices.map((price) => {
                    let { rules: priceRules = {}, ...rest } = price;
                    const cleanRules = priceRules ? (0, utils_1.removeNullish)(priceRules) : {};
                    const numberOfRules = Object.keys(cleanRules).length;
                    const rulesDataMap = new Map();
                    Object.entries(priceRules).map(([attribute, value]) => {
                        const rule = {
                            price_set_id: id,
                            rule_type_id: ruleTypeMap.get(attribute).id,
                            value,
                        };
                        rulesDataMap.set(JSON.stringify(rule), rule);
                        const priceSetRuleType = {
                            rule_type_id: ruleTypeMap.get(attribute).id,
                            price_set_id: id,
                        };
                        ruleSetRuleTypeToCreateMap.set(JSON.stringify(priceSetRuleType), priceSetRuleType);
                    });
                    return {
                        ...rest,
                        title: "",
                        rules_count: numberOfRules,
                        price_rules: Array.from(rulesDataMap.values()),
                    };
                });
            }
            return {
                ...rest,
                id,
                prices: pricesData,
            };
        });
        // Bulk create price sets
        const createdPriceSets = await this.priceSetService_.create(toCreate, sharedContext);
        if (ruleSetRuleTypeToCreateMap.size) {
            await this.priceSetRuleTypeService_.create(Array.from(ruleSetRuleTypeToCreateMap.values()), sharedContext);
        }
        return createdPriceSets;
    }
    async addRules_(inputs, sharedContext = {}) {
        const priceSets = await this.priceSetService_.list({ id: inputs.map((d) => d.priceSetId) }, { relations: ["rule_types"] }, sharedContext);
        const priceSetRuleTypeMap = new Map(priceSets.map((priceSet) => [
            priceSet.id,
            new Map([...priceSet.rule_types].map((rt) => [rt.rule_attribute, rt])),
        ]));
        const priceSetMap = new Map(priceSets.map((p) => [p.id, p]));
        const invalidPriceSetInputs = inputs.filter((d) => !priceSetMap.has(d.priceSetId));
        if (invalidPriceSetInputs.length) {
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, `PriceSets with ids: ${invalidPriceSetInputs
                .map((d) => d.priceSetId)
                .join(", ")} was not found`);
        }
        const ruleTypes = await this.ruleTypeService_.list({
            rule_attribute: inputs
                .map((data) => data.rules.map((r) => r.attribute))
                .flat(),
        }, { take: null }, sharedContext);
        const ruleTypeMap = new Map(ruleTypes.map((rt) => [rt.rule_attribute, rt]));
        const invalidRuleAttributeInputs = inputs
            .map((d) => d.rules.map((r) => r.attribute))
            .flat()
            .filter((r) => !ruleTypeMap.has(r));
        if (invalidRuleAttributeInputs.length) {
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, `Rule types don't exist for attributes: ${[
                ...new Set(invalidRuleAttributeInputs),
            ].join(", ")}`);
        }
        const priceSetRuleTypesCreate = [];
        inputs.forEach((data) => {
            for (const rule of data.rules) {
                if (priceSetRuleTypeMap.get(data.priceSetId).has(rule.attribute)) {
                    continue;
                }
                priceSetRuleTypesCreate.push({
                    rule_type_id: ruleTypeMap.get(rule.attribute).id,
                    price_set_id: priceSetMap.get(data.priceSetId).id,
                });
            }
        });
        await this.priceSetRuleTypeService_.create(priceSetRuleTypesCreate, sharedContext);
        return priceSets;
    }
    async addPrices_(input, sharedContext = {}) {
        const priceSets = await this.list({ id: input.map((d) => d.priceSetId) }, { relations: ["rule_types"] }, sharedContext);
        const priceSetMap = new Map(priceSets.map((p) => [p.id, p]));
        const ruleTypeMap = new Map(priceSets.map((priceSet) => [
            priceSet.id,
            new Map(priceSet.rule_types?.map((rt) => [rt.rule_attribute, rt]) ?? []),
        ]));
        input.forEach(({ priceSetId, prices }) => {
            const priceSet = priceSetMap.get(priceSetId);
            if (!priceSet) {
                throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, `Price set with id: ${priceSetId} not found`);
            }
            const ruleAttributes = prices
                .map((d) => (d.rules ? Object.keys(d.rules) : []))
                .flat();
            const invalidRuleAttributes = ruleAttributes.filter((r) => !ruleTypeMap.get(priceSetId).has(r));
            if (invalidRuleAttributes.length > 0) {
                throw new utils_1.MedusaError(utils_1.MedusaError.Types.NOT_FOUND, `Rule types don't exist for: ${invalidRuleAttributes.join(", ")}`);
            }
        });
        const pricesToCreate = input.flatMap(({ priceSetId, prices }) => prices.map((price) => {
            const numberOfRules = Object.entries(price?.rules ?? {}).length;
            const priceRules = Object.entries(price.rules ?? {}).map(([attribute, value]) => ({
                rule_type_id: ruleTypeMap.get(priceSetId).get(attribute).id,
                price_set_id: priceSetId,
                value,
            }));
            return {
                ...price,
                price_set_id: priceSetId,
                title: "test",
                rules_count: numberOfRules,
                priceRules,
            };
        }));
        await this.priceService_.create(pricesToCreate, sharedContext);
    }
    async createPriceLists_(data, sharedContext = {}) {
        const ruleTypeAttributes = [];
        for (const priceListData of data) {
            const { prices = [], rules: priceListRules = {} } = priceListData;
            ruleTypeAttributes.push(...Object.keys(priceListRules));
            for (const price of prices) {
                const { rules: priceListPriceRules = {} } = price;
                ruleTypeAttributes.push(...Object.keys(priceListPriceRules));
            }
        }
        const ruleTypes = await this.listRuleTypes({ rule_attribute: ruleTypeAttributes }, { take: null }, sharedContext);
        const invalidRuleTypes = (0, utils_1.arrayDifference)((0, utils_1.deduplicate)(ruleTypeAttributes), ruleTypes.map((ruleType) => ruleType.rule_attribute));
        if (invalidRuleTypes.length) {
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, `Cannot find RuleTypes with rule_attribute - ${invalidRuleTypes.join(", ")}`);
        }
        const ruleTypeMap = new Map(ruleTypes.map((rt) => [rt.rule_attribute, rt]));
        const priceListsToCreate = data.map((priceListData) => {
            const id = (0, utils_1.generateEntityId)(priceListData.id, price_list_1.PriceListIdPrefix);
            const { prices = [], rules = {}, ...rest } = priceListData;
            (0, _utils_1.validatePriceListDates)(priceListData);
            const priceListRules = Object.entries(rules).map(([attribute, value]) => {
                const ruleType = ruleTypeMap.get(attribute);
                return {
                    price_list_id: id,
                    rule_type_id: ruleType.id,
                    price_list_rule_values: value.map((v) => ({ value: v })),
                };
            });
            const pricesData = prices.map((price) => {
                const priceRules = Object.entries(price.rules ?? {}).map(([ruleAttribute, ruleValue]) => {
                    return {
                        price_set_id: price.price_set_id,
                        rule_type_id: ruleTypeMap.get(ruleAttribute)?.id,
                        value: ruleValue,
                    };
                });
                return {
                    price_list_id: id,
                    title: "test",
                    rules_count: Object.keys(price.rules ?? {}).length,
                    price_rules: priceRules,
                    ...price,
                };
            });
            return {
                id,
                ...rest,
                rules_count: Object.keys(rules).length,
                price_list_rules: priceListRules,
                prices: pricesData,
            };
        });
        return await this.priceListService_.create(priceListsToCreate, sharedContext);
    }
    async updatePriceLists_(data, sharedContext = {}) {
        const updatedPriceLists = [];
        const ruleAttributes = [];
        const priceListIds = [];
        for (const priceListData of data) {
            if (typeof priceListData.rules === "object") {
                ruleAttributes.push(...Object.keys(priceListData.rules));
                priceListIds.push(priceListData.id);
            }
        }
        const existingPriceLists = await this.listPriceLists({ id: priceListIds }, { relations: ["price_list_rules"] }, sharedContext);
        const priceListRuleIds = existingPriceLists
            .map((pl) => (pl.price_list_rules || []).map((plr) => plr.id))
            .flat();
        const existingPriceListRules = await this.listPriceListRules({ id: priceListRuleIds }, {}, sharedContext);
        if (existingPriceListRules.length) {
            await this.deletePriceListRules(existingPriceListRules.map((plr) => plr.id), sharedContext);
        }
        const ruleTypes = await this.listRuleTypes({ rule_attribute: ruleAttributes }, { take: null }, sharedContext);
        const ruleTypeMap = new Map(ruleTypes.map((rt) => [rt.rule_attribute, rt]));
        for (const priceListData of data) {
            const { rules, ...priceListOnlyData } = priceListData;
            const updatePriceListData = {
                ...priceListOnlyData,
            };
            (0, _utils_1.validatePriceListDates)(updatePriceListData);
            if (typeof rules === "object") {
                updatePriceListData.rules_count = Object.keys(rules).length;
            }
            const [updatedPriceList] = (await this.priceListService_.update([updatePriceListData], sharedContext));
            updatedPriceLists.push(updatedPriceList);
            for (const [ruleAttribute, ruleValues = []] of Object.entries(rules || {})) {
                let ruleType = ruleTypeMap.get(ruleAttribute);
                if (!ruleType) {
                    ;
                    [ruleType] = await this.createRuleTypes([{ name: ruleAttribute, rule_attribute: ruleAttribute }], sharedContext);
                    ruleTypeMap.set(ruleAttribute, ruleType);
                }
                const [priceListRule] = await this.priceListRuleService_.create([
                    {
                        price_list_id: updatedPriceList.id,
                        rule_type_id: ruleType?.id,
                    },
                ], sharedContext);
                for (const ruleValue of ruleValues) {
                    await this.priceListRuleValueService_.create([{ price_list_rule_id: priceListRule.id, value: ruleValue }], sharedContext);
                }
            }
        }
        return updatedPriceLists;
    }
    async updatePriceListPrices_(data, sharedContext = {}) {
        const ruleTypeAttributes = [];
        const priceListIds = [];
        const priceIds = [];
        const priceSetIds = data
            .map((d) => d.prices.map((price) => price.price_set_id))
            .flat();
        for (const priceListData of data) {
            priceListIds.push(priceListData.price_list_id);
            for (const price of priceListData.prices) {
                priceIds.push(price.id);
                ruleTypeAttributes.push(...Object.keys(price.rules || {}));
            }
        }
        const prices = await this.listPrices({ id: priceIds }, { take: null, relations: ["price_rules"] }, sharedContext);
        const priceMap = new Map(prices.map((price) => [price.id, price]));
        const ruleTypes = await this.listRuleTypes({ rule_attribute: ruleTypeAttributes }, { take: null }, sharedContext);
        const ruleTypeMap = new Map(ruleTypes.map((rt) => [rt.rule_attribute, rt]));
        const priceSets = await this.list({ id: priceSetIds }, { relations: ["rule_types"] }, sharedContext);
        const priceSetRuleTypeMap = priceSets.reduce((acc, curr) => {
            const priceSetRuleAttributeSet = acc.get(curr.id) || new Set();
            for (const rt of curr.rule_types ?? []) {
                priceSetRuleAttributeSet.add(rt.rule_attribute);
            }
            acc.set(curr.id, priceSetRuleAttributeSet);
            return acc;
        }, new Map());
        const ruleTypeErrors = [];
        for (const priceListData of data) {
            for (const price of priceListData.prices) {
                for (const ruleAttribute of Object.keys(price.rules ?? {})) {
                    if (!priceSetRuleTypeMap.get(price.price_set_id)?.has(ruleAttribute)) {
                        ruleTypeErrors.push(`rule_attribute "${ruleAttribute}" in price set ${price.price_set_id}`);
                    }
                }
            }
        }
        if (ruleTypeErrors.length) {
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, `Invalid rule type configuration: Price set rules doesn't exist for ${ruleTypeErrors.join(", ")}`);
        }
        const priceLists = await this.listPriceLists({ id: priceListIds }, { take: null }, sharedContext);
        const priceListMap = new Map(priceLists.map((p) => [p.id, p]));
        const pricesToUpdate = [];
        const priceRuleIdsToDelete = [];
        const priceRulesToCreate = [];
        for (const { price_list_id: priceListId, prices } of data) {
            const priceList = priceListMap.get(priceListId);
            if (!priceList) {
                throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, `Price list with id: ${priceListId} not found`);
            }
            for (const priceData of prices) {
                const { rules = {}, price_set_id, ...rest } = priceData;
                const price = priceMap.get(rest.id);
                const priceRules = price.price_rules;
                priceRulesToCreate.push(...Object.entries(rules).map(([ruleAttribute, ruleValue]) => ({
                    price_set_id,
                    rule_type_id: ruleTypeMap.get(ruleAttribute).id,
                    value: ruleValue,
                    price_id: price.id,
                })));
                pricesToUpdate.push({
                    ...rest,
                    rules_count: Object.keys(rules).length,
                });
                priceRuleIdsToDelete.push(...priceRules.map((pr) => pr.id));
            }
        }
        const [_deletedPriceRule, _createdPriceRule, updatedPrices] = await (0, utils_1.promiseAll)([
            this.priceRuleService_.delete(priceRuleIdsToDelete),
            this.priceRuleService_.create(priceRulesToCreate),
            this.priceService_.update(pricesToUpdate),
        ]);
        return updatedPrices;
    }
    async removePrices_(ids, sharedContext = {}) {
        await this.priceService_.delete(ids, sharedContext);
    }
    async addPriceListPrices_(data, sharedContext = {}) {
        const ruleTypeAttributes = [];
        const priceListIds = [];
        const priceSetIds = [];
        for (const priceListData of data) {
            priceListIds.push(priceListData.price_list_id);
            for (const price of priceListData.prices) {
                ruleTypeAttributes.push(...Object.keys(price.rules || {}));
                priceSetIds.push(price.price_set_id);
            }
        }
        const ruleTypes = await this.listRuleTypes({ rule_attribute: ruleTypeAttributes }, { take: null }, sharedContext);
        const priceSets = await this.list({ id: priceSetIds }, { relations: ["rule_types"] }, sharedContext);
        const priceSetRuleTypeMap = priceSets.reduce((acc, curr) => {
            const priceSetRuleAttributeSet = acc.get(curr.id) || new Set();
            for (const rt of curr.rule_types ?? []) {
                priceSetRuleAttributeSet.add(rt.rule_attribute);
            }
            acc.set(curr.id, priceSetRuleAttributeSet);
            return acc;
        }, new Map());
        const ruleTypeErrors = [];
        for (const priceListData of data) {
            for (const price of priceListData.prices) {
                for (const rule_attribute of Object.keys(price.rules ?? {})) {
                    if (!priceSetRuleTypeMap.get(price.price_set_id)?.has(rule_attribute)) {
                        ruleTypeErrors.push(`rule_attribute "${rule_attribute}" in price set ${price.price_set_id}`);
                    }
                }
            }
        }
        if (ruleTypeErrors.length) {
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, `Invalid rule type configuration: Price set rules doesn't exist for ${ruleTypeErrors.join(", ")}`);
        }
        const ruleTypeMap = new Map(ruleTypes.map((rt) => [rt.rule_attribute, rt]));
        const priceLists = await this.listPriceLists({ id: priceListIds }, {}, sharedContext);
        const priceListMap = new Map(priceLists.map((p) => [p.id, p]));
        const pricesToCreate = [];
        for (const { price_list_id: priceListId, prices } of data) {
            const priceList = priceListMap.get(priceListId);
            if (!priceList) {
                throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, `Price list with id: ${priceListId} not found`);
            }
            const priceListPricesToCreate = prices.map((priceData) => {
                const priceRules = priceData.rules || {};
                const noOfRules = Object.keys(priceRules).length;
                const priceRulesToCreate = Object.entries(priceRules).map(([ruleAttribute, ruleValue]) => {
                    return {
                        price_set_id: priceData.price_set_id,
                        rule_type_id: ruleTypeMap.get(ruleAttribute)?.id,
                        value: ruleValue,
                    };
                });
                return {
                    ...priceData,
                    price_set_id: priceData.price_set_id,
                    title: "test",
                    price_list_id: priceList.id,
                    rules_count: noOfRules,
                    price_rules: priceRulesToCreate,
                };
            });
            pricesToCreate.push(...priceListPricesToCreate);
        }
        return await this.priceService_.create(pricesToCreate, sharedContext);
    }
    async setPriceListRules_(data, sharedContext = {}) {
        // TODO: re think this method
        const priceLists = await this.priceListService_.list({ id: data.map((d) => d.price_list_id) }, { relations: ["price_list_rules", "price_list_rules.rule_type"] }, sharedContext);
        const priceListMap = new Map(priceLists.map((p) => [p.id, p]));
        const ruleTypes = await this.listRuleTypes({ rule_attribute: data.map((d) => Object.keys(d.rules)).flat() }, { take: null });
        const ruleTypeMap = new Map(ruleTypes.map((rt) => [rt.rule_attribute, rt]));
        const ruleIdsToUpdate = [];
        const rulesToCreate = [];
        const priceRuleValues = new Map();
        for (const { price_list_id: priceListId, rules } of data) {
            const priceList = priceListMap.get(priceListId);
            if (!priceList) {
                throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, `Price list with id: ${priceListId} not found`);
            }
            const priceListRulesMap = new Map(priceList.price_list_rules.map((p) => [p.rule_type.rule_attribute, p]));
            const priceListRuleValues = new Map();
            Object.entries(rules).map(async ([key, value]) => {
                const ruleType = ruleTypeMap.get(key);
                if (!ruleType) {
                    throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, `Rule type with attribute: ${key} not found`);
                }
                const rule = priceListRulesMap.get(key);
                priceListRuleValues.set(ruleType.id, Array.isArray(value) ? value : [value]);
                if (!rule) {
                    rulesToCreate.push({
                        rule_type_id: ruleType.id,
                        price_list_id: priceListId,
                    });
                }
                else {
                    ruleIdsToUpdate.push(rule.id);
                }
            });
            priceRuleValues.set(priceListId, priceListRuleValues);
        }
        const [createdRules, priceListValuesToDelete] = await (0, utils_1.promiseAll)([
            this.priceListRuleService_.create(rulesToCreate),
            this.priceListRuleValueService_.list({ price_list_rule_id: ruleIdsToUpdate }, { take: null }),
        ]);
        const priceListRuleValuesToCreate = [];
        for (const { id, price_list_id, rule_type_id } of createdRules) {
            const ruleValues = priceRuleValues.get(price_list_id);
            if (!ruleValues) {
                continue;
            }
            const values = ruleValues.get(rule_type_id);
            if (!values) {
                continue;
            }
            values.forEach((v) => {
                priceListRuleValuesToCreate.push({
                    price_list_rule_id: id,
                    value: v,
                });
            });
        }
        await (0, utils_1.promiseAll)([
            this.priceListRuleValueService_.delete(priceListValuesToDelete.map((p) => p.id), sharedContext),
            this.priceListRuleValueService_.create(priceListRuleValuesToCreate, sharedContext),
        ]);
        return priceLists;
    }
    async removePriceListRules_(data, sharedContext = {}) {
        const priceLists = await this.priceListService_.list({ id: data.map((d) => d.price_list_id) }, { relations: ["price_list_rules", "price_list_rules.rule_type"] }, sharedContext);
        const priceListMap = new Map(priceLists.map((p) => [p.id, p]));
        const idsToDelete = [];
        for (const { price_list_id: priceListId, rules } of data) {
            const priceList = priceListMap.get(priceListId);
            if (!priceList) {
                throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, `Price list with id: ${priceListId} not found`);
            }
            const priceListRulesMap = new Map(priceList.price_list_rules.map((p) => [p.rule_type.rule_attribute, p]));
            rules.map(async (rule_attribute) => {
                const rule = priceListRulesMap.get(rule_attribute);
                if (rule) {
                    idsToDelete.push(rule.id);
                }
            });
        }
        await this.priceListRuleService_.delete(idsToDelete);
        return priceLists;
    }
}
exports.default = PricingModuleService;
__decorate([
    (0, utils_1.InjectManager)("baseRepository_"),
    __param(2, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], PricingModuleService.prototype, "list", null);
__decorate([
    (0, utils_1.InjectManager)("baseRepository_"),
    __param(2, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], PricingModuleService.prototype, "listAndCount", null);
__decorate([
    (0, utils_1.InjectManager)("baseRepository_"),
    __param(2, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], PricingModuleService.prototype, "calculatePrices", null);
__decorate([
    (0, utils_1.InjectManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PricingModuleService.prototype, "create", null);
__decorate([
    (0, utils_1.InjectManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PricingModuleService.prototype, "upsert", null);
__decorate([
    (0, utils_1.InjectManager)("baseRepository_"),
    __param(2, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], PricingModuleService.prototype, "update", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], PricingModuleService.prototype, "update_", null);
__decorate([
    (0, utils_1.InjectManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PricingModuleService.prototype, "addRules", null);
__decorate([
    (0, utils_1.InjectManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PricingModuleService.prototype, "addPrices", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], PricingModuleService.prototype, "removeRules", null);
__decorate([
    (0, utils_1.InjectManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], PricingModuleService.prototype, "createPriceLists", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], PricingModuleService.prototype, "updatePriceLists", null);
__decorate([
    (0, utils_1.InjectManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], PricingModuleService.prototype, "createPriceListRules", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], PricingModuleService.prototype, "createPriceListRules_", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], PricingModuleService.prototype, "updatePriceListRules", null);
__decorate([
    (0, utils_1.InjectManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], PricingModuleService.prototype, "updatePriceListPrices", null);
__decorate([
    (0, utils_1.InjectManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], PricingModuleService.prototype, "removePrices", null);
__decorate([
    (0, utils_1.InjectManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], PricingModuleService.prototype, "addPriceListPrices", null);
__decorate([
    (0, utils_1.InjectManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PricingModuleService.prototype, "setPriceListRules", null);
__decorate([
    (0, utils_1.InjectManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PricingModuleService.prototype, "removePriceListRules", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], PricingModuleService.prototype, "create_", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], PricingModuleService.prototype, "addRules_", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], PricingModuleService.prototype, "addPrices_", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], PricingModuleService.prototype, "createPriceLists_", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], PricingModuleService.prototype, "updatePriceLists_", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], PricingModuleService.prototype, "updatePriceListPrices_", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], PricingModuleService.prototype, "removePrices_", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], PricingModuleService.prototype, "addPriceListPrices_", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], PricingModuleService.prototype, "setPriceListRules_", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], PricingModuleService.prototype, "removePriceListRules_", null);

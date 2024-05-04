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
const joiner_config_1 = require("../joiner-config");
const generateForModels = [_models_1.TaxRegion, _models_1.TaxRateRule, _models_1.TaxProvider];
class TaxModuleService extends utils_1.ModulesSdkUtils.abstractModuleServiceFactory(_models_1.TaxRate, generateForModels, joiner_config_1.entityNameToLinkableKeysMap) {
    constructor({ baseRepository, taxRateService, taxRegionService, taxRateRuleService, taxProviderService, }, moduleDeclaration) {
        // @ts-ignore
        super(...arguments);
        this.moduleDeclaration = moduleDeclaration;
        this.container_ = arguments[0];
        this.baseRepository_ = baseRepository;
        this.taxRateService_ = taxRateService;
        this.taxRegionService_ = taxRegionService;
        this.taxRateRuleService_ = taxRateRuleService;
        this.taxProviderService_ = taxProviderService;
    }
    __joinerConfig() {
        return joiner_config_1.joinerConfig;
    }
    async create(data, sharedContext = {}) {
        const input = Array.isArray(data) ? data : [data];
        const rates = await this.create_(input, sharedContext);
        return Array.isArray(data) ? rates : rates[0];
    }
    async create_(data, sharedContext = {}) {
        const [rules, rateData] = data.reduce((acc, region) => {
            const { rules, ...rest } = region;
            acc[0].push(rules);
            acc[1].push(rest);
            return acc;
        }, [[], []]);
        const rates = await this.taxRateService_.create(rateData, sharedContext);
        const rulesToCreate = rates
            .reduce((acc, rate, i) => {
            const rateRules = rules[i];
            if ((0, utils_1.isDefined)(rateRules)) {
                acc.push(rateRules.map((r) => {
                    return {
                        ...r,
                        created_by: rate.created_by,
                        tax_rate_id: rate.id,
                    };
                }));
            }
            return acc;
        }, [])
            .flat();
        if (rulesToCreate.length > 0) {
            await this.taxRateRuleService_.create(rulesToCreate, sharedContext);
        }
        return await this.baseRepository_.serialize(rates, {
            populate: true,
        });
    }
    async update(selector, data, sharedContext = {}) {
        const rates = await this.update_(selector, data, sharedContext);
        const serialized = await this.baseRepository_.serialize(rates, { populate: true });
        return (0, utils_1.isString)(selector) ? serialized[0] : serialized;
    }
    async update_(idOrSelector, data, sharedContext = {}) {
        const selector = Array.isArray(idOrSelector) || (0, utils_1.isString)(idOrSelector)
            ? { id: idOrSelector }
            : idOrSelector;
        if (data.rules) {
            await this.setTaxRateRulesForTaxRates(idOrSelector, data.rules, data.updated_by, sharedContext);
            delete data.rules;
        }
        return await this.taxRateService_.update({ selector, data }, sharedContext);
    }
    async setTaxRateRulesForTaxRates(idOrSelector, rules, createdBy, sharedContext = {}) {
        const selector = Array.isArray(idOrSelector) || (0, utils_1.isString)(idOrSelector)
            ? { id: idOrSelector }
            : idOrSelector;
        await this.taxRateRuleService_.softDelete({ tax_rate: selector }, sharedContext);
        // TODO: this is a temporary solution seems like mikro-orm doesn't persist
        // the soft delete which results in the creation below breaking the unique
        // constraint
        await this.taxRateRuleService_.list({ tax_rate: selector }, { select: ["id"] }, sharedContext);
        if (rules.length === 0) {
            return;
        }
        const rateIds = await this.getTaxRateIdsFromSelector(idOrSelector);
        const toCreate = rateIds
            .map((id) => {
            return rules.map((r) => {
                return {
                    ...r,
                    created_by: createdBy,
                    tax_rate_id: id,
                };
            });
        })
            .flat();
        return await this.createTaxRateRules(toCreate, sharedContext);
    }
    async getTaxRateIdsFromSelector(idOrSelector, sharedContext = {}) {
        if (Array.isArray(idOrSelector)) {
            return idOrSelector;
        }
        if ((0, utils_1.isString)(idOrSelector)) {
            return [idOrSelector];
        }
        const rates = await this.taxRateService_.list(idOrSelector, { select: ["id"] }, sharedContext);
        return rates.map((r) => r.id);
    }
    async upsert(data, sharedContext = {}) {
        const result = await this.taxRateService_.upsert(data, sharedContext);
        const serialized = await this.baseRepository_.serialize(result, { populate: true });
        return Array.isArray(data) ? serialized : serialized[0];
    }
    async createTaxRegions(data, sharedContext = {}) {
        const input = Array.isArray(data) ? data : [data];
        const result = await this.createTaxRegions_(input, sharedContext);
        return Array.isArray(data) ? result : result[0];
    }
    async createTaxRegions_(data, sharedContext = {}) {
        const { defaultRates, regionData } = this.prepareTaxRegionInputForCreate(data);
        await this.verifyProvinceToCountryMatch(regionData, sharedContext);
        const regions = await this.taxRegionService_.create(regionData, sharedContext);
        const rates = regions
            .map((region, i) => {
            if (!defaultRates[i]) {
                return false;
            }
            return {
                ...defaultRates[i],
                tax_region_id: region.id,
            };
        })
            .filter(Boolean);
        if (rates.length !== 0) {
            await this.create(rates, sharedContext);
        }
        return await this.baseRepository_.serialize(regions, { populate: true });
    }
    async createTaxRateRules(data, sharedContext = {}) {
        const input = Array.isArray(data) ? data : [data];
        const result = await this.createTaxRateRules_(input, sharedContext);
        return Array.isArray(data) ? result : result[0];
    }
    async createTaxRateRules_(data, sharedContext = {}) {
        const rules = await this.taxRateRuleService_.create(data, sharedContext);
        return await this.baseRepository_.serialize(rules, {
            populate: true,
        });
    }
    async getTaxLines(items, calculationContext, sharedContext = {}) {
        const normalizedContext = this.normalizeTaxCalculationContext(calculationContext);
        const regions = await this.taxRegionService_.list({
            $or: [
                {
                    country_code: normalizedContext.address.country_code,
                    province_code: null,
                },
                {
                    country_code: normalizedContext.address.country_code,
                    province_code: normalizedContext.address.province_code,
                },
            ],
        }, {}, sharedContext);
        const parentRegion = regions.find((r) => r.province_code === null);
        if (!parentRegion) {
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, "No parent region found for country");
        }
        const toReturn = await (0, utils_1.promiseAll)(items.map(async (item) => {
            const regionIds = regions.map((r) => r.id);
            const rateQuery = this.getTaxRateQueryForItem(item, regionIds);
            const candidateRates = await this.taxRateService_.list(rateQuery, {
                relations: ["tax_region", "rules"],
            }, sharedContext);
            const applicableRates = await this.getTaxRatesForItem(item, candidateRates);
            return {
                rates: applicableRates,
                item,
            };
        }));
        const taxLines = await this.getTaxLinesFromProvider(parentRegion.provider_id, toReturn, calculationContext);
        return taxLines;
    }
    async getTaxLinesFromProvider(rawProviderId, items, calculationContext) {
        const providerId = rawProviderId || "system";
        let provider;
        try {
            provider = this.container_[`tp_${providerId}`];
        }
        catch (err) {
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.NOT_FOUND, `Failed to resolve Tax Provider with id: ${providerId}. Make sure it's installed and configured in the Tax Module's options.`);
        }
        const [itemLines, shippingLines] = items.reduce((acc, line) => {
            if ("shipping_option_id" in line.item) {
                acc[1].push({
                    shipping_line: line.item,
                    rates: line.rates,
                });
            }
            else {
                acc[0].push({
                    line_item: line.item,
                    rates: line.rates,
                });
            }
            return acc;
        }, [[], []]);
        const itemTaxLines = await provider.getTaxLines(itemLines, shippingLines, calculationContext);
        return itemTaxLines;
    }
    normalizeTaxCalculationContext(context) {
        return {
            ...context,
            address: {
                ...context.address,
                country_code: this.normalizeRegionCodes(context.address.country_code),
                province_code: context.address.province_code
                    ? this.normalizeRegionCodes(context.address.province_code)
                    : null,
            },
        };
    }
    prepareTaxRegionInputForCreate(data) {
        const regionsWithDefaultRate = Array.isArray(data) ? data : [data];
        const defaultRates = [];
        const regionData = [];
        for (const region of regionsWithDefaultRate) {
            const { default_tax_rate, ...rest } = region;
            if (!default_tax_rate) {
                defaultRates.push(null);
            }
            else {
                defaultRates.push({
                    ...default_tax_rate,
                    is_default: true,
                    created_by: region.created_by,
                });
            }
            regionData.push({
                ...rest,
                province_code: rest.province_code
                    ? this.normalizeRegionCodes(rest.province_code)
                    : null,
                country_code: this.normalizeRegionCodes(rest.country_code),
            });
        }
        return { defaultRates, regionData };
    }
    async verifyProvinceToCountryMatch(regionsToVerify, sharedContext = {}) {
        const parentIds = regionsToVerify.map((i) => i.parent_id).filter(utils_1.isDefined);
        if (parentIds.length > 0) {
            const parentRegions = await this.taxRegionService_.list({ id: { $in: parentIds } }, { select: ["id", "country_code"] }, sharedContext);
            for (const region of regionsToVerify) {
                if ((0, utils_1.isDefined)(region.parent_id)) {
                    const parentRegion = parentRegions.find((r) => r.id === region.parent_id);
                    if (!(0, utils_1.isDefined)(parentRegion)) {
                        throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, `Province region must belong to a parent region. You are trying to create a province region with (country: ${region.country_code}, province: ${region.province_code}) but parent does not exist`);
                    }
                    if (parentRegion.country_code !== region.country_code) {
                        throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, `Province region must belong to a parent region with the same country code. You are trying to create a province region with (country: ${region.country_code}, province: ${region.province_code}) but parent expects (country: ${parentRegion.country_code})`);
                    }
                }
            }
        }
    }
    async getTaxRatesForItem(item, rates) {
        if (!rates.length) {
            return [];
        }
        const prioritizedRates = this.prioritizeRates(rates, item);
        const rate = prioritizedRates[0];
        const ratesToReturn = [rate];
        // If the rate can be combined we need to find the rate's
        // parent region and add that rate too. If not we can return now.
        if (!(rate.is_combinable && rate.tax_region.parent_id)) {
            return ratesToReturn;
        }
        // First parent region rate in prioritized rates
        // will be the most granular rate.
        const parentRate = prioritizedRates.find((r) => r.tax_region.id === rate.tax_region.parent_id);
        if (parentRate) {
            ratesToReturn.push(parentRate);
        }
        return ratesToReturn;
    }
    getTaxRateQueryForItem(item, regionIds) {
        const isShipping = "shipping_option_id" in item;
        let ruleQuery = isShipping
            ? [
                {
                    reference: "shipping_option",
                    reference_id: item.shipping_option_id,
                },
            ]
            : [
                {
                    reference: "product",
                    reference_id: item.product_id,
                },
                {
                    reference: "product_type",
                    reference_id: item.product_type_id,
                },
            ];
        return {
            $and: [
                { tax_region_id: regionIds },
                { $or: [{ is_default: true }, { rules: { $or: ruleQuery } }] },
            ],
        };
    }
    checkRuleMatches(rate, item) {
        if (rate.rules.length === 0) {
            return {
                isProductMatch: false,
                isProductTypeMatch: false,
                isShippingMatch: false,
            };
        }
        let isProductMatch = false;
        const isShipping = "shipping_option_id" in item;
        const matchingRules = rate.rules.filter((rule) => {
            if (isShipping) {
                return (rule.reference === "shipping" &&
                    rule.reference_id === item.shipping_option_id);
            }
            return ((rule.reference === "product" &&
                rule.reference_id === item.product_id) ||
                (rule.reference === "product_type" &&
                    rule.reference_id === item.product_type_id));
        });
        if (matchingRules.some((rule) => rule.reference === "product")) {
            isProductMatch = true;
        }
        return {
            isProductMatch,
            isProductTypeMatch: matchingRules.length > 0,
            isShippingMatch: isShipping && matchingRules.length > 0,
        };
    }
    prioritizeRates(rates, item) {
        const decoratedRates = rates.map((rate) => {
            const { isProductMatch, isProductTypeMatch, isShippingMatch } = this.checkRuleMatches(rate, item);
            const isProvince = rate.tax_region.province_code !== null;
            const isDefault = rate.is_default;
            const decoratedRate = {
                ...rate,
                priority_score: 7,
            };
            if ((isShippingMatch || isProductMatch) && isProvince) {
                decoratedRate.priority_score = 1;
            }
            else if (isProductTypeMatch && isProvince) {
                decoratedRate.priority_score = 2;
            }
            else if (isDefault && isProvince) {
                decoratedRate.priority_score = 3;
            }
            else if ((isShippingMatch || isProductMatch) && !isProvince) {
                decoratedRate.priority_score = 4;
            }
            else if (isProductTypeMatch && !isProvince) {
                decoratedRate.priority_score = 5;
            }
            else if (isDefault && !isProvince) {
                decoratedRate.priority_score = 6;
            }
            return decoratedRate;
        });
        return decoratedRates.sort((a, b) => a.priority_score - b.priority_score);
    }
    normalizeRegionCodes(code) {
        return code.toLowerCase();
    }
}
exports.default = TaxModuleService;
__decorate([
    (0, utils_1.InjectManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TaxModuleService.prototype, "create", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], TaxModuleService.prototype, "create_", null);
__decorate([
    (0, utils_1.InjectManager)("baseRepository_"),
    __param(2, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], TaxModuleService.prototype, "update", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __param(2, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], TaxModuleService.prototype, "update_", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TaxModuleService.prototype, "upsert", null);
__decorate([
    (0, utils_1.InjectManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TaxModuleService.prototype, "createTaxRegions", null);
__decorate([
    (0, utils_1.InjectManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TaxModuleService.prototype, "createTaxRateRules", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], TaxModuleService.prototype, "createTaxRateRules_", null);
__decorate([
    (0, utils_1.InjectManager)("baseRepository_"),
    __param(2, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object, Object]),
    __metadata("design:returntype", Promise)
], TaxModuleService.prototype, "getTaxLines", null);

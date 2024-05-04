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
const generateMethodForModels = [
    _models_1.ServiceZone,
    _models_1.ShippingOption,
    _models_1.GeoZone,
    _models_1.ShippingProfile,
    _models_1.ShippingOptionRule,
    _models_1.ShippingOptionType,
    _models_1.FulfillmentProvider,
    // Not adding Fulfillment to not auto generate the methods under the hood and only provide the methods we want to expose8
];
class FulfillmentModuleService extends utils_1.ModulesSdkUtils.abstractModuleServiceFactory(_models_1.FulfillmentSet, generateMethodForModels, joiner_config_1.entityNameToLinkableKeysMap) {
    constructor({ baseRepository, fulfillmentSetService, serviceZoneService, geoZoneService, shippingProfileService, shippingOptionService, shippingOptionRuleService, shippingOptionTypeService, fulfillmentProviderService, fulfillmentService, }, moduleDeclaration) {
        // @ts-ignore
        super(...arguments);
        this.moduleDeclaration = moduleDeclaration;
        this.baseRepository_ = baseRepository;
        this.fulfillmentSetService_ = fulfillmentSetService;
        this.serviceZoneService_ = serviceZoneService;
        this.geoZoneService_ = geoZoneService;
        this.shippingProfileService_ = shippingProfileService;
        this.shippingOptionService_ = shippingOptionService;
        this.shippingOptionRuleService_ = shippingOptionRuleService;
        this.shippingOptionTypeService_ = shippingOptionTypeService;
        this.fulfillmentProviderService_ = fulfillmentProviderService;
        this.fulfillmentService_ = fulfillmentService;
    }
    __joinerConfig() {
        return joiner_config_1.joinerConfig;
    }
    // @ts-ignore
    async listShippingOptions(filters = {}, config = {}, sharedContext = {}) {
        // Eventually, we could call normalizeListShippingOptionsForContextParams to translate the address and make a and condition with the other filters
        // In that case we could remote the address check below
        if (filters?.context || filters?.address) {
            return await this.listShippingOptionsForContext(filters, config, sharedContext);
        }
        return await super.listShippingOptions(filters, config, sharedContext);
    }
    async listShippingOptionsForContext(filters, config = {}, sharedContext = {}) {
        const { context, config: normalizedConfig, filters: normalizedFilters, } = FulfillmentModuleService.normalizeListShippingOptionsForContextParams(filters, config);
        let shippingOptions = await this.shippingOptionService_.list(normalizedFilters, normalizedConfig, sharedContext);
        if (context) {
            shippingOptions = shippingOptions.filter((shippingOption) => {
                if (!shippingOption.rules?.length) {
                    return true;
                }
                return (0, _utils_1.isContextValid)(context, shippingOption.rules.map((r) => r));
            });
        }
        return await this.baseRepository_.serialize(shippingOptions, {
            populate: true,
        });
    }
    async retrieveFulfillment(id, config = {}, sharedContext = {}) {
        const fulfillment = await this.fulfillmentService_.retrieve(id, config, sharedContext);
        return await this.baseRepository_.serialize(fulfillment, {
            populate: true,
        });
    }
    async listFulfillments(filters = {}, config = {}, sharedContext = {}) {
        const fulfillments = await this.fulfillmentService_.list(filters, config, sharedContext);
        return await this.baseRepository_.serialize(fulfillments, {
            populate: true,
        });
    }
    async listAndCountFulfillments(filters, config, sharedContext = {}) {
        const [fulfillments, count] = await this.fulfillmentService_.listAndCount(filters, config, sharedContext);
        return [
            await this.baseRepository_.serialize(fulfillments, {
                populate: true,
            }),
            count,
        ];
    }
    async create(data, sharedContext = {}) {
        const createdFulfillmentSets = await this.create_(data, sharedContext);
        return await this.baseRepository_.serialize(createdFulfillmentSets, {
            populate: true,
        });
    }
    async create_(data, sharedContext = {}) {
        const data_ = Array.isArray(data) ? data : [data];
        if (!data_.length) {
            return [];
        }
        for (const fulfillmentSet of data_) {
            if (fulfillmentSet.service_zones?.length) {
                for (const serviceZone of fulfillmentSet.service_zones) {
                    if (serviceZone.geo_zones?.length) {
                        FulfillmentModuleService.validateGeoZones(serviceZone.geo_zones);
                    }
                }
            }
        }
        const createdFulfillmentSets = await this.fulfillmentSetService_.create(data_, sharedContext);
        this.aggregateFulfillmentSetCreatedEvents(createdFulfillmentSets, sharedContext);
        return Array.isArray(data)
            ? createdFulfillmentSets
            : createdFulfillmentSets[0];
    }
    async createServiceZones(data, sharedContext = {}) {
        const createdServiceZones = await this.createServiceZones_(data, sharedContext);
        return await this.baseRepository_.serialize(createdServiceZones, {
            populate: true,
        });
    }
    async createServiceZones_(data, sharedContext = {}) {
        const data_ = Array.isArray(data) ? data : [data];
        if (!data_.length) {
            return [];
        }
        for (const serviceZone of data_) {
            if (serviceZone.geo_zones?.length) {
                if (serviceZone.geo_zones?.length) {
                    FulfillmentModuleService.validateGeoZones(serviceZone.geo_zones);
                }
            }
        }
        const createdServiceZones = await this.serviceZoneService_.create(data_, sharedContext);
        return Array.isArray(data) ? createdServiceZones : createdServiceZones[0];
    }
    async createShippingOptions(data, sharedContext = {}) {
        const createdShippingOptions = await this.createShippingOptions_(data, sharedContext);
        return await this.baseRepository_.serialize(createdShippingOptions, {
            populate: true,
        });
    }
    async createShippingOptions_(data, sharedContext = {}) {
        const data_ = Array.isArray(data) ? data : [data];
        if (!data_.length) {
            return [];
        }
        const rules = data_.flatMap((d) => d.rules).filter(Boolean);
        if (rules.length) {
            (0, _utils_1.validateAndNormalizeRules)(rules);
        }
        const createdShippingOptions = await this.shippingOptionService_.create(data_, sharedContext);
        return Array.isArray(data)
            ? createdShippingOptions
            : createdShippingOptions[0];
    }
    async createShippingProfiles(data, sharedContext = {}) {
        const createdShippingProfiles = await this.createShippingProfiles_(data, sharedContext);
        return await this.baseRepository_.serialize(createdShippingProfiles, {
            populate: true,
        });
    }
    async createShippingProfiles_(data, sharedContext = {}) {
        const data_ = Array.isArray(data) ? data : [data];
        if (!data_.length) {
            return [];
        }
        const createdShippingProfiles = await this.shippingProfileService_.create(data_, sharedContext);
        return Array.isArray(data)
            ? createdShippingProfiles
            : createdShippingProfiles[0];
    }
    async createGeoZones(data, sharedContext = {}) {
        const data_ = Array.isArray(data) ? data : [data];
        FulfillmentModuleService.validateGeoZones(data_);
        const createdGeoZones = await this.geoZoneService_.create(data_, sharedContext);
        return await this.baseRepository_.serialize(Array.isArray(data) ? createdGeoZones : createdGeoZones[0], {
            populate: true,
        });
    }
    async createShippingOptionRules(data, sharedContext = {}) {
        const createdShippingOptionRules = await this.createShippingOptionRules_(data, sharedContext);
        return await this.baseRepository_.serialize(createdShippingOptionRules, {
            populate: true,
        });
    }
    async createShippingOptionRules_(data, sharedContext = {}) {
        const data_ = Array.isArray(data) ? data : [data];
        if (!data_.length) {
            return [];
        }
        (0, _utils_1.validateAndNormalizeRules)(data_);
        const createdShippingOptionRules = await this.shippingOptionRuleService_.create(data_, sharedContext);
        return Array.isArray(data)
            ? createdShippingOptionRules
            : createdShippingOptionRules[0];
    }
    async createFulfillment(data, sharedContext = {}) {
        const { order, ...fulfillmentDataToCreate } = data;
        const fulfillment = await this.fulfillmentService_.create(fulfillmentDataToCreate, sharedContext);
        const { items, data: fulfillmentData, provider_id, ...fulfillmentRest } = fulfillment;
        let fulfillmentThirdPartyData;
        try {
            fulfillmentThirdPartyData =
                await this.fulfillmentProviderService_.createFulfillment(provider_id, fulfillmentData || {}, items.map((i) => i), order, fulfillmentRest);
            await this.fulfillmentService_.update({
                id: fulfillment.id,
                data: fulfillmentThirdPartyData ?? {},
            }, sharedContext);
        }
        catch (error) {
            await this.fulfillmentService_.delete(fulfillment.id, sharedContext);
            throw error;
        }
        return await this.baseRepository_.serialize(fulfillment, {
            populate: true,
        });
    }
    async update(data, sharedContext = {}) {
        const updatedFulfillmentSets = await this.update_(data, sharedContext);
        return await this.baseRepository_.serialize(updatedFulfillmentSets, {
            populate: true,
        });
    }
    async update_(data, sharedContext = {}) {
        const data_ = Array.isArray(data) ? data : [data];
        if (!data_.length) {
            return [];
        }
        const fulfillmentSetIds = data_.map((f) => f.id);
        if (!fulfillmentSetIds.length) {
            return [];
        }
        const fulfillmentSets = await this.fulfillmentSetService_.list({
            id: fulfillmentSetIds,
        }, {
            relations: ["service_zones", "service_zones.geo_zones"],
            take: fulfillmentSetIds.length,
        }, sharedContext);
        const fulfillmentSetSet = new Set(fulfillmentSets.map((f) => f.id));
        const expectedFulfillmentSetSet = new Set(data_.map((f) => f.id));
        const missingFulfillmentSetIds = (0, utils_1.getSetDifference)(expectedFulfillmentSetSet, fulfillmentSetSet);
        if (missingFulfillmentSetIds.size) {
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.NOT_FOUND, `The following fulfillment sets does not exists: ${Array.from(missingFulfillmentSetIds).join(", ")}`);
        }
        const fulfillmentSetMap = new Map(fulfillmentSets.map((f) => [f.id, f]));
        // find service zones to delete
        const serviceZoneIdsToDelete = [];
        const geoZoneIdsToDelete = [];
        data_.forEach((fulfillmentSet) => {
            if (fulfillmentSet.service_zones) {
                /**
                 * Detect and delete service zones that are not in the updated
                 */
                const existingFulfillmentSet = fulfillmentSetMap.get(fulfillmentSet.id);
                const existingServiceZones = existingFulfillmentSet.service_zones;
                const updatedServiceZones = fulfillmentSet.service_zones;
                const toDeleteServiceZoneIds = (0, utils_1.getSetDifference)(new Set(existingServiceZones.map((s) => s.id)), new Set(updatedServiceZones
                    .map((s) => "id" in s && s.id)
                    .filter((id) => !!id)));
                if (toDeleteServiceZoneIds.size) {
                    serviceZoneIdsToDelete.push(...Array.from(toDeleteServiceZoneIds));
                    geoZoneIdsToDelete.push(...existingServiceZones
                        .filter((s) => toDeleteServiceZoneIds.has(s.id))
                        .flatMap((s) => s.geo_zones.map((g) => g.id)));
                }
                /**
                 * Detect and re assign service zones to the fulfillment set that are still present
                 */
                const serviceZonesMap = new Map(existingFulfillmentSet.service_zones.map((serviceZone) => [
                    serviceZone.id,
                    serviceZone,
                ]));
                const serviceZonesSet = new Set(existingServiceZones
                    .map((s) => "id" in s && s.id)
                    .filter((id) => !!id));
                const expectedServiceZoneSet = new Set(fulfillmentSet.service_zones
                    .map((s) => "id" in s && s.id)
                    .filter((id) => !!id));
                const missingServiceZoneIds = (0, utils_1.getSetDifference)(expectedServiceZoneSet, serviceZonesSet);
                if (missingServiceZoneIds.size) {
                    throw new utils_1.MedusaError(utils_1.MedusaError.Types.NOT_FOUND, `The following service zones does not exists: ${Array.from(missingServiceZoneIds).join(", ")}`);
                }
                // re assign service zones to the fulfillment set
                if (fulfillmentSet.service_zones) {
                    fulfillmentSet.service_zones = fulfillmentSet.service_zones.map((serviceZone) => {
                        if (!("id" in serviceZone)) {
                            if (serviceZone.geo_zones?.length) {
                                FulfillmentModuleService.validateGeoZones(serviceZone.geo_zones);
                            }
                            return serviceZone;
                        }
                        return serviceZonesMap.get(serviceZone.id);
                    });
                }
            }
        });
        if (serviceZoneIdsToDelete.length) {
            await (0, utils_1.promiseAll)([
                this.geoZoneService_.delete({
                    id: geoZoneIdsToDelete,
                }, sharedContext),
                this.serviceZoneService_.delete({
                    id: serviceZoneIdsToDelete,
                }, sharedContext),
            ]);
        }
        const updatedFulfillmentSets = await this.fulfillmentSetService_.update(data_, sharedContext);
        return Array.isArray(data)
            ? updatedFulfillmentSets
            : updatedFulfillmentSets[0];
    }
    async updateServiceZones(idOrSelector, data, sharedContext = {}) {
        const normalizedInput = [];
        if ((0, utils_1.isString)(idOrSelector)) {
            normalizedInput.push({ id: idOrSelector, ...data });
        }
        else {
            const serviceZones = await this.serviceZoneService_.list({ ...idOrSelector }, {}, sharedContext);
            if (!serviceZones.length) {
                return [];
            }
            for (const serviceZone of serviceZones) {
                normalizedInput.push({ id: serviceZone.id, ...data });
            }
        }
        const updatedServiceZones = await this.updateServiceZones_(normalizedInput, sharedContext);
        const toReturn = (0, utils_1.isString)(idOrSelector)
            ? updatedServiceZones[0]
            : updatedServiceZones;
        return await this.baseRepository_.serialize(toReturn, {
            populate: true,
        });
    }
    async updateServiceZones_(data, sharedContext = {}) {
        const data_ = Array.isArray(data) ? data : [data];
        if (!data_.length) {
            return [];
        }
        const serviceZoneIds = data_.map((s) => s.id);
        if (!serviceZoneIds.length) {
            return [];
        }
        const serviceZones = await this.serviceZoneService_.list({
            id: serviceZoneIds,
        }, {
            relations: ["geo_zones"],
            take: serviceZoneIds.length,
        }, sharedContext);
        const serviceZoneSet = new Set(serviceZones.map((s) => s.id));
        const expectedServiceZoneSet = new Set(data_.map((s) => s.id));
        const missingServiceZoneIds = (0, utils_1.getSetDifference)(expectedServiceZoneSet, serviceZoneSet);
        if (missingServiceZoneIds.size) {
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.NOT_FOUND, `The following service zones does not exists: ${Array.from(missingServiceZoneIds).join(", ")}`);
        }
        const serviceZoneMap = new Map(serviceZones.map((s) => [s.id, s]));
        const geoZoneIdsToDelete = [];
        data_.forEach((serviceZone) => {
            if (serviceZone.geo_zones) {
                const existingServiceZone = serviceZoneMap.get(serviceZone.id);
                const existingGeoZones = existingServiceZone.geo_zones;
                const updatedGeoZones = serviceZone.geo_zones;
                const toDeleteGeoZoneIds = (0, utils_1.getSetDifference)(new Set(existingGeoZones.map((g) => g.id)), new Set(updatedGeoZones
                    .map((g) => "id" in g && g.id)
                    .filter((id) => !!id)));
                if (toDeleteGeoZoneIds.size) {
                    geoZoneIdsToDelete.push(...Array.from(toDeleteGeoZoneIds));
                }
                const geoZonesMap = new Map(existingServiceZone.geo_zones.map((geoZone) => [geoZone.id, geoZone]));
                const geoZonesSet = new Set(existingGeoZones
                    .map((g) => "id" in g && g.id)
                    .filter((id) => !!id));
                const expectedGeoZoneSet = new Set(serviceZone.geo_zones
                    .map((g) => "id" in g && g.id)
                    .filter((id) => !!id));
                const missingGeoZoneIds = (0, utils_1.getSetDifference)(expectedGeoZoneSet, geoZonesSet);
                if (missingGeoZoneIds.size) {
                    throw new utils_1.MedusaError(utils_1.MedusaError.Types.NOT_FOUND, `The following geo zones does not exists: ${Array.from(missingGeoZoneIds).join(", ")}`);
                }
                serviceZone.geo_zones = serviceZone.geo_zones.map((geoZone) => {
                    if (!("id" in geoZone)) {
                        FulfillmentModuleService.validateGeoZones([geoZone]);
                        return geoZone;
                    }
                    const existing = geoZonesMap.get(geoZone.id);
                    return { ...existing, ...geoZone };
                });
            }
        });
        if (geoZoneIdsToDelete.length) {
            await this.geoZoneService_.delete({
                id: geoZoneIdsToDelete,
            }, sharedContext);
        }
        const updatedServiceZones = await this.serviceZoneService_.update(data_, sharedContext);
        return Array.isArray(data) ? updatedServiceZones : updatedServiceZones[0];
    }
    async upsertServiceZones(data, sharedContext) {
        const upsertServiceZones = await this.upsertServiceZones_(data, sharedContext);
        const allServiceZones = await this.baseRepository_.serialize(upsertServiceZones);
        return Array.isArray(data) ? allServiceZones : allServiceZones[0];
    }
    async upsertServiceZones_(data, sharedContext = {}) {
        const input = Array.isArray(data) ? data : [data];
        const forUpdate = input.filter((serviceZone) => !!serviceZone.id);
        const forCreate = input.filter((serviceZone) => !serviceZone.id);
        const created = [];
        const updated = [];
        if (forCreate.length) {
            const createdServiceZones = await this.createServiceZones_(forCreate, sharedContext);
            const toPush = Array.isArray(createdServiceZones)
                ? createdServiceZones
                : [createdServiceZones];
            created.push(...toPush);
        }
        if (forUpdate.length) {
            const updatedServiceZones = await this.updateServiceZones_(forUpdate, sharedContext);
            const toPush = Array.isArray(updatedServiceZones)
                ? updatedServiceZones
                : [updatedServiceZones];
            updated.push(...toPush);
        }
        return [...created, ...updated];
    }
    async updateShippingOptions(idOrSelector, data, sharedContext = {}) {
        const normalizedInput = [];
        if ((0, utils_1.isString)(idOrSelector)) {
            normalizedInput.push({ id: idOrSelector, ...data });
        }
        else {
            const shippingOptions = await this.shippingOptionService_.list(idOrSelector, {}, sharedContext);
            shippingOptions.forEach((shippingOption) => {
                normalizedInput.push({ id: shippingOption.id, ...data });
            });
        }
        const updatedShippingOptions = await this.updateShippingOptions_(normalizedInput, sharedContext);
        const serialized = await this.baseRepository_.serialize(updatedShippingOptions, {
            populate: true,
        });
        return (0, utils_1.isString)(idOrSelector) ? serialized[0] : serialized;
    }
    async updateShippingOptions_(data, sharedContext = {}) {
        const dataArray = Array.isArray(data) ? data : [data];
        if (!dataArray.length) {
            return [];
        }
        const shippingOptionIds = dataArray.map((s) => s.id);
        if (!shippingOptionIds.length) {
            return [];
        }
        const shippingOptions = await this.shippingOptionService_.list({
            id: shippingOptionIds,
        }, {
            relations: ["rules"],
            take: shippingOptionIds.length,
        }, sharedContext);
        const existingShippingOptions = new Map(shippingOptions.map((s) => [s.id, s]));
        FulfillmentModuleService.validateMissingShippingOptions_(shippingOptions, dataArray);
        const ruleIdsToDelete = [];
        dataArray.forEach((shippingOption) => {
            if (!shippingOption.rules) {
                return;
            }
            const existingShippingOption = existingShippingOptions.get(shippingOption.id); // Garuantueed to exist since the validation above have been performed
            const existingRules = existingShippingOption.rules;
            FulfillmentModuleService.validateMissingShippingOptionRules(existingShippingOption, shippingOption);
            const existingRulesMap = new Map(existingRules.map((rule) => [rule.id, rule]));
            const updatedRules = shippingOption.rules
                .map((rule) => {
                if ("id" in rule) {
                    const existingRule = (existingRulesMap.get(rule.id) ??
                        {});
                    const ruleData = {
                        ...existingRule,
                        ...rule,
                    };
                    existingRulesMap.set(rule.id, ruleData);
                    return ruleData;
                }
                return;
            })
                .filter(Boolean);
            (0, _utils_1.validateAndNormalizeRules)(updatedRules);
            const updatedRuleIds = updatedRules.map((r) => "id" in r && r.id);
            const toDeleteRuleIds = (0, utils_1.arrayDifference)(updatedRuleIds, Array.from(existingRulesMap.keys()));
            if (toDeleteRuleIds.length) {
                ruleIdsToDelete.push(...toDeleteRuleIds);
            }
            shippingOption.rules = shippingOption.rules.map((rule) => {
                if (!("id" in rule)) {
                    (0, _utils_1.validateAndNormalizeRules)([rule]);
                    return rule;
                }
                return existingRulesMap.get(rule.id);
            });
        });
        if (ruleIdsToDelete.length) {
            await this.shippingOptionRuleService_.delete(ruleIdsToDelete, sharedContext);
        }
        const updatedShippingOptions = await this.shippingOptionService_.update(dataArray, sharedContext);
        return Array.isArray(data)
            ? updatedShippingOptions
            : updatedShippingOptions[0];
    }
    async upsertShippingOptions(data, sharedContext = {}) {
        const upsertedShippingOptions = await this.upsertShippingOptions_(data, sharedContext);
        const allShippingOptions = await this.baseRepository_.serialize(upsertedShippingOptions);
        return Array.isArray(data) ? allShippingOptions : allShippingOptions[0];
    }
    async upsertShippingOptions_(data, sharedContext = {}) {
        const input = Array.isArray(data) ? data : [data];
        const forUpdate = input.filter((shippingOption) => !!shippingOption.id);
        const forCreate = input.filter((shippingOption) => !shippingOption.id);
        let created = [];
        let updated = [];
        if (forCreate.length) {
            const createdShippingOptions = await this.createShippingOptions_(forCreate, sharedContext);
            const toPush = Array.isArray(createdShippingOptions)
                ? createdShippingOptions
                : [createdShippingOptions];
            created.push(...toPush);
        }
        if (forUpdate.length) {
            const updatedShippingOptions = await this.updateShippingOptions_(forUpdate, sharedContext);
            const toPush = Array.isArray(updatedShippingOptions)
                ? updatedShippingOptions
                : [updatedShippingOptions];
            updated.push(...toPush);
        }
        return [...created, ...updated];
    }
    async updateShippingProfiles(data, sharedContext = {}) {
        return [];
    }
    async updateGeoZones(data, sharedContext = {}) {
        const data_ = Array.isArray(data) ? data : [data];
        if (!data_.length) {
            return [];
        }
        FulfillmentModuleService.validateGeoZones(data_);
        const updatedGeoZones = await this.geoZoneService_.update(data, sharedContext);
        const serialized = await this.baseRepository_.serialize(updatedGeoZones, {
            populate: true,
        });
        return Array.isArray(data) ? serialized : serialized[0];
    }
    async updateShippingOptionRules(data, sharedContext = {}) {
        const updatedShippingOptionRules = await this.updateShippingOptionRules_(data, sharedContext);
        return await this.baseRepository_.serialize(updatedShippingOptionRules, {
            populate: true,
        });
    }
    async updateShippingOptionRules_(data, sharedContext = {}) {
        const data_ = Array.isArray(data) ? data : [data];
        if (!data_.length) {
            return [];
        }
        (0, _utils_1.validateAndNormalizeRules)(data_);
        const updatedShippingOptionRules = await this.shippingOptionRuleService_.update(data_, sharedContext);
        return Array.isArray(data)
            ? updatedShippingOptionRules
            : updatedShippingOptionRules[0];
    }
    async updateFulfillment(id, data, sharedContext = {}) {
        const fulfillment = await this.fulfillmentService_.update({ id, ...data }, sharedContext);
        const serialized = await this.baseRepository_.serialize(fulfillment, {
            populate: true,
        });
        return Array.isArray(serialized) ? serialized[0] : serialized;
    }
    async cancelFulfillment(id, sharedContext = {}) {
        const canceledAt = new Date();
        let fulfillment = await this.fulfillmentService_.retrieve(id, {}, sharedContext);
        FulfillmentModuleService.canCancelFulfillmentOrThrow(fulfillment);
        // Make this action idempotent
        if (!fulfillment.canceled_at) {
            try {
                await this.fulfillmentProviderService_.cancelFulfillment(fulfillment.provider_id, fulfillment.data ?? {});
            }
            catch (error) {
                throw error;
            }
            fulfillment = await this.fulfillmentService_.update({
                id,
                canceled_at: canceledAt,
            }, sharedContext);
        }
        const result = await this.baseRepository_.serialize(fulfillment, {
            populate: true,
        });
        return Array.isArray(result) ? result[0] : result;
    }
    async retrieveFulfillmentOptions(providerId) {
        return await this.fulfillmentProviderService_.getFulfillmentOptions(providerId);
    }
    async validateFulfillmentOption(providerId, data) {
        return await this.fulfillmentProviderService_.validateOption(providerId, data);
    }
    async validateShippingOption(shippingOptionId, context = {}, sharedContext = {}) {
        const shippingOptions = await this.listShippingOptionsForContext({ id: shippingOptionId, context }, {
            relations: ["rules"],
        }, sharedContext);
        return !!shippingOptions.length;
    }
    static canCancelFulfillmentOrThrow(fulfillment) {
        if (fulfillment.shipped_at) {
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, `Fulfillment with id ${fulfillment.id} already shipped`);
        }
        if (fulfillment.delivered_at) {
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, `Fulfillment with id ${fulfillment.id} already delivered`);
        }
        return true;
    }
    static validateMissingShippingOptions_(shippingOptions, shippingOptionsData) {
        const missingShippingOptionIds = (0, utils_1.arrayDifference)(shippingOptionsData.map((s) => s.id), shippingOptions.map((s) => s.id));
        if (missingShippingOptionIds.length) {
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.NOT_FOUND, `The following shipping options do not exist: ${Array.from(missingShippingOptionIds).join(", ")}`);
        }
    }
    static validateMissingShippingOptionRules(shippingOption, shippingOptionUpdateData) {
        if (!shippingOptionUpdateData.rules) {
            return;
        }
        const existingRules = shippingOption.rules;
        const rulesSet = new Set(existingRules.map((r) => r.id));
        // Only validate the rules that have an id to validate that they really exists in the shipping option
        const expectedRuleSet = new Set(shippingOptionUpdateData.rules
            .map((r) => "id" in r && r.id)
            .filter((id) => !!id));
        const nonAlreadyExistingRules = (0, utils_1.getSetDifference)(expectedRuleSet, rulesSet);
        if (nonAlreadyExistingRules.size) {
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.NOT_FOUND, `The following rules does not exists: ${Array.from(nonAlreadyExistingRules).join(", ")} on shipping option ${shippingOptionUpdateData.id}`);
        }
    }
    static validateGeoZones(geoZones) {
        const requirePropForType = {
            country: ["country_code"],
            province: ["country_code", "province_code"],
            city: ["country_code", "province_code", "city"],
            zip: ["country_code", "province_code", "city", "postal_expression"],
        };
        for (const geoZone of geoZones) {
            if (!requirePropForType[geoZone.type]) {
                throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, `Invalid geo zone type: ${geoZone.type}`);
            }
            for (const prop of requirePropForType[geoZone.type]) {
                if (!geoZone[prop]) {
                    throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, `Missing required property ${prop} for geo zone type ${geoZone.type}`);
                }
            }
        }
    }
    static normalizeListShippingOptionsForContextParams(filters, config = {}) {
        let { fulfillment_set_id, fulfillment_set_type, address, context, ...where } = filters;
        const normalizedConfig = { ...config };
        normalizedConfig.relations = [
            "rules",
            "type",
            "shipping_profile",
            "provider",
            ...(normalizedConfig.relations ?? []),
        ];
        normalizedConfig.take =
            normalizedConfig.take ?? (context ? null : undefined);
        let normalizedFilters = { ...where };
        if (fulfillment_set_id || fulfillment_set_type) {
            const fulfillmentSetConstraints = {};
            if (fulfillment_set_id) {
                fulfillmentSetConstraints["id"] = fulfillment_set_id;
            }
            if (fulfillment_set_type) {
                fulfillmentSetConstraints["type"] = fulfillment_set_type;
            }
            normalizedFilters = {
                ...normalizedFilters,
                service_zone: {
                    ...(normalizedFilters.service_zone ?? {}),
                    fulfillment_set: {
                        ...(normalizedFilters.service_zone?.fulfillment_set ?? {}),
                        ...fulfillmentSetConstraints,
                    },
                },
            };
            normalizedConfig.relations.push("service_zone.fulfillment_set");
        }
        if (address) {
            const geoZoneConstraints = FulfillmentModuleService.buildGeoZoneConstraintsFromAddress(address);
            if (geoZoneConstraints.length) {
                normalizedFilters = {
                    ...normalizedFilters,
                    service_zone: {
                        ...(normalizedFilters.service_zone ?? {}),
                        geo_zones: {
                            $or: geoZoneConstraints.map((geoZoneConstraint) => ({
                                // Apply eventually provided constraints on the geo zone along side the address constraints
                                ...(normalizedFilters.service_zone?.geo_zones ?? {}),
                                ...geoZoneConstraint,
                            })),
                        },
                    },
                };
                normalizedConfig.relations.push("service_zone.geo_zones");
            }
        }
        normalizedConfig.relations = Array.from(new Set(normalizedConfig.relations));
        return {
            filters: normalizedFilters,
            config: normalizedConfig,
            context,
        };
    }
    /**
     * Build the constraints for the geo zones based on the address properties
     * available and the hierarchy of required properties.
     * We build a OR constraint from the narrowest to the broadest
     * e.g. if we have a postal expression we build a constraint for the postal expression require props of type zip
     * and a constraint for the city required props of type city
     * and a constraint for the province code required props of type province
     * and a constraint for the country code required props of type country
     * example:
     * {
     *    $or: [
     *      {
     *        type: "zip",
     *        country_code: "SE",
     *        province_code: "AB",
     *        city: "Stockholm",
     *        postal_expression: "12345"
     *      },
     *      {
     *        type: "city",
     *        country_code: "SE",
     *        province_code: "AB",
     *        city: "Stockholm"
     *      },
     *      {
     *        type: "province",
     *        country_code: "SE",
     *        province_code: "AB"
     *      },
     *      {
     *        type: "country",
     *        country_code: "SE"
     *      }
     *    ]
     *  }
     */
    static buildGeoZoneConstraintsFromAddress(address) {
        /**
         * Define the hierarchy of required properties for the geo zones.
         */
        const geoZoneRequirePropertyHierarchy = {
            postal_expression: [
                "country_code",
                "province_code",
                "city",
                "postal_expression",
            ],
            city: ["country_code", "province_code", "city"],
            province_code: ["country_code", "province_code"],
            country_code: ["country_code"],
        };
        /**
         * Validate that the address has the required properties for the geo zones
         * constraints to build after. We are going from the narrowest to the broadest
         */
        Object.entries(geoZoneRequirePropertyHierarchy).forEach(([prop, requiredProps]) => {
            if (address[prop]) {
                for (const requiredProp of requiredProps) {
                    if (!address[requiredProp]) {
                        throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, `Missing required property ${requiredProp} for address when property ${prop} is set`);
                    }
                }
            }
        });
        const geoZoneConstraints = Object.entries(geoZoneRequirePropertyHierarchy)
            .map(([prop, requiredProps]) => {
            if (address[prop]) {
                return requiredProps.reduce((geoZoneConstraint, prop) => {
                    geoZoneConstraint.type =
                        prop === "postal_expression"
                            ? "zip"
                            : prop === "city"
                                ? "city"
                                : prop === "province_code"
                                    ? "province"
                                    : "country";
                    geoZoneConstraint[prop] = address[prop];
                    return geoZoneConstraint;
                }, {});
            }
            return null;
        })
            .filter((v) => !!v);
        return geoZoneConstraints;
    }
    aggregateFulfillmentSetCreatedEvents(createdFulfillmentSets, sharedContext) {
        const buildMessage = ({ eventName, id, object, }) => {
            return {
                eventName,
                metadata: {
                    object,
                    service: utils_1.Modules.FULFILLMENT,
                    action: "created",
                    eventGroupId: sharedContext.eventGroupId,
                },
                data: { id },
            };
        };
        for (const fulfillmentSet of createdFulfillmentSets) {
            sharedContext.messageAggregator.saveRawMessageData(buildMessage({
                eventName: utils_1.FulfillmentUtils.FulfillmentEvents.created,
                id: fulfillmentSet.id,
                object: "fulfillment_set",
            }));
            for (const serviceZone of fulfillmentSet.service_zones ?? []) {
                sharedContext.messageAggregator.saveRawMessageData(buildMessage({
                    eventName: utils_1.FulfillmentUtils.FulfillmentEvents.service_zone_created,
                    id: serviceZone.id,
                    object: "service_zone",
                }));
                for (const geoZone of serviceZone.geo_zones ?? []) {
                    sharedContext.messageAggregator.saveRawMessageData(buildMessage({
                        eventName: utils_1.FulfillmentUtils.FulfillmentEvents.geo_zone_created,
                        id: geoZone.id,
                        object: "geo_zone",
                    }));
                }
            }
        }
    }
}
exports.default = FulfillmentModuleService;
__decorate([
    (0, utils_1.InjectManager)("baseRepository_")
    // @ts-ignore
    ,
    __param(2, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], FulfillmentModuleService.prototype, "listShippingOptions", null);
__decorate([
    (0, utils_1.InjectManager)("baseRepository_"),
    __param(2, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], FulfillmentModuleService.prototype, "listShippingOptionsForContext", null);
__decorate([
    (0, utils_1.InjectManager)("baseRepository_"),
    __param(2, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], FulfillmentModuleService.prototype, "retrieveFulfillment", null);
__decorate([
    (0, utils_1.InjectManager)("baseRepository_"),
    __param(2, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], FulfillmentModuleService.prototype, "listFulfillments", null);
__decorate([
    (0, utils_1.InjectManager)("baseRepository_"),
    __param(2, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], FulfillmentModuleService.prototype, "listAndCountFulfillments", null);
__decorate([
    (0, utils_1.InjectManager)("baseRepository_"),
    (0, utils_1.EmitEvents)(),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FulfillmentModuleService.prototype, "create", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FulfillmentModuleService.prototype, "create_", null);
__decorate([
    (0, utils_1.InjectManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FulfillmentModuleService.prototype, "createServiceZones", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FulfillmentModuleService.prototype, "createServiceZones_", null);
__decorate([
    (0, utils_1.InjectManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FulfillmentModuleService.prototype, "createShippingOptions", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FulfillmentModuleService.prototype, "createShippingOptions_", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FulfillmentModuleService.prototype, "createShippingProfiles", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FulfillmentModuleService.prototype, "createShippingProfiles_", null);
__decorate([
    (0, utils_1.InjectManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FulfillmentModuleService.prototype, "createGeoZones", null);
__decorate([
    (0, utils_1.InjectManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FulfillmentModuleService.prototype, "createShippingOptionRules", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FulfillmentModuleService.prototype, "createShippingOptionRules_", null);
__decorate([
    (0, utils_1.InjectManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FulfillmentModuleService.prototype, "createFulfillment", null);
__decorate([
    (0, utils_1.InjectManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FulfillmentModuleService.prototype, "update", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FulfillmentModuleService.prototype, "update_", null);
__decorate([
    (0, utils_1.InjectManager)("baseRepository_"),
    __param(2, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], FulfillmentModuleService.prototype, "updateServiceZones", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FulfillmentModuleService.prototype, "updateServiceZones_", null);
__decorate([
    (0, utils_1.InjectManager)("baseRepository_"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FulfillmentModuleService.prototype, "upsertServiceZones", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FulfillmentModuleService.prototype, "upsertServiceZones_", null);
__decorate([
    (0, utils_1.InjectManager)("baseRepository_"),
    __param(2, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], FulfillmentModuleService.prototype, "updateShippingOptions", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FulfillmentModuleService.prototype, "updateShippingOptions_", null);
__decorate([
    (0, utils_1.InjectManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FulfillmentModuleService.prototype, "upsertShippingOptions", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FulfillmentModuleService.prototype, "upsertShippingOptions_", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FulfillmentModuleService.prototype, "updateShippingProfiles", null);
__decorate([
    (0, utils_1.InjectManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FulfillmentModuleService.prototype, "updateGeoZones", null);
__decorate([
    (0, utils_1.InjectManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FulfillmentModuleService.prototype, "updateShippingOptionRules", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FulfillmentModuleService.prototype, "updateShippingOptionRules_", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __param(2, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], FulfillmentModuleService.prototype, "updateFulfillment", null);
__decorate([
    (0, utils_1.InjectManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], FulfillmentModuleService.prototype, "cancelFulfillment", null);
__decorate([
    (0, utils_1.InjectManager)("baseRepository_"),
    __param(2, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], FulfillmentModuleService.prototype, "validateShippingOption", null);

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
const utils_1 = require("@medusajs/utils");
const _models_1 = require("../models");
const joiner_config_1 = require("../joiner-config");
const generateMethodForModels = [_models_1.Country];
class RegionModuleService extends utils_1.ModulesSdkUtils.abstractModuleServiceFactory(_models_1.Region, generateMethodForModels, joiner_config_1.entityNameToLinkableKeysMap) {
    constructor({ baseRepository, regionService, countryService }, moduleDeclaration) {
        // @ts-ignore
        super(...arguments);
        this.moduleDeclaration = moduleDeclaration;
        this.baseRepository_ = baseRepository;
        this.regionService_ = regionService;
        this.countryService_ = countryService;
    }
    __joinerConfig() {
        return joiner_config_1.joinerConfig;
    }
    async create(data, sharedContext = {}) {
        const input = Array.isArray(data) ? data : [data];
        const result = await this.create_(input, sharedContext);
        return await this.baseRepository_.serialize(Array.isArray(data) ? result : result[0]);
    }
    async create_(data, sharedContext = {}) {
        let normalizedInput = RegionModuleService.normalizeInput(data);
        let normalizedDbRegions = normalizedInput.map((region) => (0, utils_1.removeUndefined)({
            ...region,
            countries: undefined,
        }));
        const result = await this.regionService_.create(normalizedDbRegions, sharedContext);
        if (data.some((input) => input.countries?.length)) {
            await this.validateCountries(normalizedInput.map((r) => r.countries ?? []).flat(), sharedContext);
            await this.countryService_.update(normalizedInput.map((region, i) => ({
                selector: { iso_2: region.countries },
                data: {
                    region_id: result[i].id,
                },
            })), sharedContext);
        }
        return result;
    }
    async upsert(data, sharedContext = {}) {
        const input = Array.isArray(data) ? data : [data];
        const forUpdate = input.filter((region) => !!region.id);
        const forCreate = input.filter((region) => !region.id);
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
            normalizedInput = [{ id: idOrSelector, ...data }];
        }
        else {
            const regions = await this.regionService_.list(idOrSelector, {}, sharedContext);
            normalizedInput = regions.map((region) => ({
                id: region.id,
                ...data,
            }));
        }
        const updateResult = await this.update_(normalizedInput, sharedContext);
        const regions = await this.baseRepository_.serialize(updateResult);
        return (0, utils_1.isString)(idOrSelector) ? regions[0] : regions;
    }
    async update_(data, sharedContext = {}) {
        const normalizedInput = RegionModuleService.normalizeInput(data);
        // If countries are being updated for a region, first make previously set countries' region to null to get to a clean slate.
        // Somewhat less efficient, but region operations will be very rare, so it is better to go with a simple solution
        const regionsWithCountryUpdate = normalizedInput
            .filter((region) => !!region.countries)
            .map((region) => region.id)
            .flat();
        let normalizedDbRegions = normalizedInput.map((region) => (0, utils_1.removeUndefined)({
            ...region,
            countries: undefined, // -> delete countries if passed because we want to do update "manually"
        }));
        if (regionsWithCountryUpdate.length) {
            await this.countryService_.update({
                selector: {
                    region_id: regionsWithCountryUpdate,
                },
                data: { region_id: null },
            }, sharedContext);
            await this.validateCountries(normalizedInput.map((d) => d.countries ?? []).flat(), sharedContext);
            await this.countryService_.update(normalizedInput.map((region) => ({
                selector: { iso_2: region.countries },
                data: {
                    region_id: region.id,
                },
            })), sharedContext);
        }
        return await this.regionService_.update(normalizedDbRegions, sharedContext);
    }
    static normalizeInput(regions) {
        return regions.map((region) => (0, utils_1.removeUndefined)({
            ...region,
            currency_code: region.currency_code?.toLowerCase(),
            name: region.name?.trim(),
            countries: region.countries?.map((country) => country.toLowerCase()),
        }));
    }
    /**
     * Validate that countries can be assigned to a region.
     *
     * NOTE: this method relies on countries of the regions that we are assigning to need to be unassigned first.
     * @param countries
     * @param sharedContext
     * @private
     */
    async validateCountries(countries, sharedContext) {
        if (!countries?.length) {
            return [];
        }
        // The new regions being created have a country conflict
        const uniqueCountries = Array.from(new Set(countries));
        if (uniqueCountries.length !== countries.length) {
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, `Countries with codes: "${(0, utils_1.getDuplicates)(countries).join(", ")}" are already assigned to a region`);
        }
        const countriesInDb = await this.countryService_.list({ iso_2: uniqueCountries }, { select: ["iso_2", "region_id"], take: null }, sharedContext);
        const countryCodesInDb = countriesInDb.map((c) => c.iso_2.toLowerCase());
        // Countries missing in the database
        if (countriesInDb.length !== uniqueCountries.length) {
            const missingCountries = (0, utils_1.arrayDifference)(uniqueCountries, countryCodesInDb);
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, `Countries with codes: "${missingCountries.join(", ")}" do not exist`);
        }
        // Countries that already have a region already assigned to them
        const countriesWithRegion = countriesInDb.filter((c) => !!c.region_id);
        if (countriesWithRegion.length) {
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, `Countries with codes: "${countriesWithRegion
                .map((c) => c.iso_2)
                .join(", ")}" are already assigned to a region`);
        }
        return countriesInDb;
    }
}
exports.default = RegionModuleService;
__decorate([
    (0, utils_1.InjectManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], RegionModuleService.prototype, "create", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], RegionModuleService.prototype, "create_", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], RegionModuleService.prototype, "upsert", null);
__decorate([
    (0, utils_1.InjectManager)("baseRepository_"),
    __param(2, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], RegionModuleService.prototype, "update", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], RegionModuleService.prototype, "update_", null);

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
const joiner_config_1 = require("../joiner-config");
const models_1 = require("../models");
const utils_2 = require("@medusajs/utils");
const generateMethodForModels = [models_1.StockLocationAddress];
/**
 * Service for managing stock locations.
 */
class StockLocationModuleService extends utils_1.ModulesSdkUtils.abstractModuleServiceFactory(models_1.StockLocation, generateMethodForModels, joiner_config_1.entityNameToLinkableKeysMap) {
    constructor({ eventBusService, baseRepository, stockLocationService, stockLocationAddressService, }, moduleDeclaration) {
        // @ts-ignore
        super(...arguments);
        this.moduleDeclaration = moduleDeclaration;
        this.baseRepository_ = baseRepository;
        this.stockLocationService_ = stockLocationService;
        this.stockLocationAddressService_ = stockLocationAddressService;
        this.eventBusService_ = eventBusService;
    }
    __joinerConfig() {
        return joiner_config_1.joinerConfig;
    }
    /**
     * Creates a new stock location.
     * @param data - The input data for creating a Stock Location.
     * @param context
     * @returns The created stock location.
     */
    async create(data, context = {}) {
        const input = Array.isArray(data) ? data : [data];
        const created = await this.create_(input, context);
        const serialized = await this.baseRepository_.serialize(created, { populate: true });
        return Array.isArray(data) ? serialized : serialized[0];
    }
    async create_(data, context = {}) {
        return await this.stockLocationService_.create(data, context);
    }
    async upsert(data, context = {}) {
        const input = Array.isArray(data) ? data : [data];
        const result = await this.upsert_(input, context);
        return await this.baseRepository_.serialize(Array.isArray(data) ? result : result[0]);
    }
    async upsert_(input, context = {}) {
        const toUpdate = input.filter((location) => !!location.id);
        const toCreate = input.filter((location) => !location.id);
        const operations = [];
        if (toCreate.length) {
            operations.push(this.create_(toCreate, context));
        }
        if (toUpdate.length) {
            operations.push(this.update_(toUpdate, context));
        }
        return (await (0, utils_2.promiseAll)(operations)).flat();
    }
    /**
     * Updates an existing stock location.
     * @param stockLocationId - The ID of the stock location to update.
     * @param updateData - The update data for the stock location.
     * @param context
     * @returns The updated stock location.
     */
    async update(idOrSelector, data, context = {}) {
        let normalizedInput = [];
        if ((0, utils_1.isString)(idOrSelector)) {
            normalizedInput = [{ id: idOrSelector, ...data }];
        }
        else {
            normalizedInput = { data, selector: idOrSelector };
        }
        const updated = await this.update_(normalizedInput, context);
        const serialized = await this.baseRepository_.serialize(updated, { populate: true });
        return Array.isArray(data) ? serialized : serialized[0];
    }
    async update_(data, context = {}) {
        return await this.stockLocationService_.update(data, context);
    }
    async updateStockLocationAddress(data, context = {}) {
        const input = Array.isArray(data) ? data : [data];
        const updated = await this.updateStockLocationAddress_(input, context);
        const serialized = await this.baseRepository_.serialize(updated, { populate: true });
        return Array.isArray(data) ? serialized : serialized[0];
    }
    async updateStockLocationAddress_(input, context) {
        return await this.stockLocationAddressService_.update(input, context);
    }
}
exports.default = StockLocationModuleService;
__decorate([
    (0, utils_1.InjectManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], StockLocationModuleService.prototype, "create", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], StockLocationModuleService.prototype, "create_", null);
__decorate([
    (0, utils_1.InjectManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], StockLocationModuleService.prototype, "upsert", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], StockLocationModuleService.prototype, "upsert_", null);
__decorate([
    (0, utils_1.InjectManager)("baseRepository_"),
    __param(2, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], StockLocationModuleService.prototype, "update", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], StockLocationModuleService.prototype, "update_", null);
__decorate([
    (0, utils_1.InjectManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], StockLocationModuleService.prototype, "updateStockLocationAddress", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], StockLocationModuleService.prototype, "updateStockLocationAddress_", null);

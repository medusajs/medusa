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
const generateMethodForModels = [];
class StoreModuleService extends utils_1.ModulesSdkUtils.abstractModuleServiceFactory(_models_1.Store, generateMethodForModels, joiner_config_1.entityNameToLinkableKeysMap) {
    constructor({ baseRepository, storeService }, moduleDeclaration) {
        // @ts-ignore
        super(...arguments);
        this.moduleDeclaration = moduleDeclaration;
        this.baseRepository_ = baseRepository;
        this.storeService_ = storeService;
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
        let normalizedInput = StoreModuleService.normalizeInput(data);
        StoreModuleService.validateCreateRequest(normalizedInput);
        return await this.storeService_.create(normalizedInput, sharedContext);
    }
    async upsert(data, sharedContext = {}) {
        const input = Array.isArray(data) ? data : [data];
        const forUpdate = input.filter((store) => !!store.id);
        const forCreate = input.filter((store) => !store.id);
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
            const stores = await this.storeService_.list(idOrSelector, {}, sharedContext);
            normalizedInput = stores.map((store) => ({
                id: store.id,
                ...data,
            }));
        }
        const updateResult = await this.update_(normalizedInput, sharedContext);
        const stores = await this.baseRepository_.serialize(updateResult);
        return (0, utils_1.isString)(idOrSelector) ? stores[0] : stores;
    }
    async update_(data, sharedContext = {}) {
        const normalizedInput = StoreModuleService.normalizeInput(data);
        await this.validateUpdateRequest(normalizedInput);
        return await this.storeService_.update(normalizedInput, sharedContext);
    }
    static normalizeInput(stores) {
        return stores.map((store) => (0, utils_1.removeUndefined)({
            ...store,
            name: store.name?.trim(),
        }));
    }
    static validateCreateRequest(stores) {
        for (const store of stores) {
            // If we are setting the default currency code on creating, make sure it is supported
            if (store.default_currency_code) {
                if (!store.supported_currency_codes?.includes(store.default_currency_code ?? "")) {
                    throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, `Store does not have currency: ${store.default_currency_code}`);
                }
            }
        }
    }
    async validateUpdateRequest(stores) {
        const dbStores = await this.storeService_.list({ id: stores.map((s) => s.id) }, { take: null });
        const dbStoresMap = new Map(dbStores.map((dbStore) => [dbStore.id, dbStore]));
        for (const store of stores) {
            const dbStore = dbStoresMap.get(store.id);
            // If it is updating both the supported currency codes and the default one, look in that list
            if (store.supported_currency_codes && store.default_currency_code) {
                if (!store.supported_currency_codes.includes(store.default_currency_code ?? "")) {
                    throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, `Store does not have currency: ${store.default_currency_code}`);
                }
                return;
            }
            // If it is updating only the default currency code, look in the db store
            if (store.default_currency_code) {
                if (!dbStore?.supported_currency_codes?.includes(store.default_currency_code)) {
                    throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, `Store does not have currency: ${store.default_currency_code}`);
                }
            }
            // If it is updating only the supported currency codes, make sure one of them is not set as a default one
            if (store.supported_currency_codes) {
                if (!store.supported_currency_codes.includes(dbStore?.default_currency_code ?? "")) {
                    throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, "You are not allowed to remove default currency from store currencies without replacing it as well");
                }
            }
        }
    }
}
exports.default = StoreModuleService;
__decorate([
    (0, utils_1.InjectManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], StoreModuleService.prototype, "create", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], StoreModuleService.prototype, "create_", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], StoreModuleService.prototype, "upsert", null);
__decorate([
    (0, utils_1.InjectManager)("baseRepository_"),
    __param(2, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], StoreModuleService.prototype, "update", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], StoreModuleService.prototype, "update_", null);

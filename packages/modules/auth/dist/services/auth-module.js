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
const _models_1 = require("../models");
const joiner_config_1 = require("../joiner-config");
const utils_1 = require("@medusajs/utils");
const generateMethodForModels = [_models_1.AuthUser];
class AuthModuleService extends utils_1.ModulesSdkUtils.abstractModuleServiceFactory(_models_1.AuthUser, generateMethodForModels, joiner_config_1.entityNameToLinkableKeysMap) {
    constructor({ authUserService, baseRepository }, moduleDeclaration) {
        // @ts-ignore
        super(...arguments);
        this.moduleDeclaration = moduleDeclaration;
        this.baseRepository_ = baseRepository;
        this.authUserService_ = authUserService;
    }
    __joinerConfig() {
        return joiner_config_1.joinerConfig;
    }
    async create(data, sharedContext = {}) {
        const authUsers = await this.authUserService_.create(data, sharedContext);
        return await this.baseRepository_.serialize(authUsers, {
            populate: true,
        });
    }
    // TODO: should be pluralized, see convention about the methods naming or the abstract module service interface definition @engineering
    async update(data, sharedContext = {}) {
        const updatedUsers = await this.authUserService_.update(data, sharedContext);
        const serializedUsers = await this.baseRepository_.serialize(updatedUsers, {
            populate: true,
        });
        return Array.isArray(data) ? serializedUsers : serializedUsers[0];
    }
    getRegisteredAuthenticationProvider(provider, { authScope }) {
        let containerProvider;
        try {
            containerProvider = this.__container__[`auth_provider_${provider}`];
        }
        catch (error) {
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.NOT_FOUND, `AuthenticationProvider: ${provider} wasn't registered in the module. Have you configured your options correctly?`);
        }
        return containerProvider.withScope(authScope);
    }
    async authenticate(provider, authenticationData) {
        try {
            const registeredProvider = this.getRegisteredAuthenticationProvider(provider, authenticationData);
            return await registeredProvider.authenticate(authenticationData);
        }
        catch (error) {
            return { success: false, error: error.message };
        }
    }
    async validateCallback(provider, authenticationData) {
        try {
            const registeredProvider = this.getRegisteredAuthenticationProvider(provider, authenticationData);
            return await registeredProvider.validateCallback(authenticationData);
        }
        catch (error) {
            return { success: false, error: error.message };
        }
    }
}
exports.default = AuthModuleService;
__decorate([
    (0, utils_1.InjectManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthModuleService.prototype, "create", null);
__decorate([
    (0, utils_1.InjectManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthModuleService.prototype, "update", null);

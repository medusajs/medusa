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
class AuthUserService extends utils_1.ModulesSdkUtils.internalModuleServiceFactory(_models_1.AuthUser) {
    constructor(container) {
        // @ts-ignore
        super(...arguments);
        this.authUserRepository_ = container.authUserRepository;
        this.baseRepository_ = container.baseRepository;
    }
    async retrieveByProviderAndEntityId(entityId, provider, config = {}, sharedContext = {}) {
        const queryConfig = utils_1.ModulesSdkUtils.buildQuery({ entity_id: entityId, provider }, { ...config, take: 1 });
        const [result] = await this.authUserRepository_.find(queryConfig, sharedContext);
        if (!result) {
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.NOT_FOUND, `AuthUser with entity_id: "${entityId}" and provider: "${provider}" not found`);
        }
        return await this.baseRepository_.serialize(result);
    }
}
exports.default = AuthUserService;
__decorate([
    (0, utils_1.InjectManager)("authUserRepository_"),
    __param(3, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthUserService.prototype, "retrieveByProviderAndEntityId", null);

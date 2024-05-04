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
class RuleTypeService extends utils_1.ModulesSdkUtils.internalModuleServiceFactory(_models_1.RuleType) {
    constructor({ ruleTypeRepository }) {
        // @ts-ignore
        super(...arguments);
        this.ruleTypeRepository_ = ruleTypeRepository;
    }
    async create(data, sharedContext = {}) {
        const data_ = Array.isArray(data) ? data : [data];
        (0, utils_1.validateRuleAttributes)(data_.map((d) => d.rule_attribute));
        return await super.create(data, sharedContext);
    }
    // TODO: add support for selector? and then rm ts ignore
    // @ts-ignore
    async update(data, sharedContext = {}) {
        const data_ = Array.isArray(data) ? data : [data];
        (0, utils_1.validateRuleAttributes)(data_.map((d) => d.rule_attribute));
        return await super.update(data, sharedContext);
    }
}
exports.default = RuleTypeService;
__decorate([
    (0, utils_1.InjectTransactionManager)("ruleTypeRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], RuleTypeService.prototype, "create", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("ruleTypeRepository_")
    // TODO: add support for selector? and then rm ts ignore
    // @ts-ignore
    ,
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], RuleTypeService.prototype, "update", null);

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
class ProductService extends utils_1.ModulesSdkUtils.internalModuleServiceFactory(_models_1.Product) {
    constructor({ productRepository }) {
        // @ts-ignore
        // eslint-disable-next-line prefer-rest-params
        super(...arguments);
        this.productRepository_ = productRepository;
    }
    async list(filters = {}, config = {}, sharedContext = {}) {
        return await super.list(ProductService.normalizeFilters(filters), config, sharedContext);
    }
    async listAndCount(filters = {}, config = {}, sharedContext = {}) {
        return await super.listAndCount(ProductService.normalizeFilters(filters), config, sharedContext);
    }
    static normalizeFilters(filters = {}) {
        const normalized = filters;
        if (normalized.category_id) {
            if (Array.isArray(normalized.category_id)) {
                normalized.categories = {
                    id: { $in: normalized.category_id },
                };
            }
            else {
                normalized.categories = {
                    id: normalized.category_id,
                };
            }
            delete normalized.category_id;
        }
        return normalized;
    }
}
exports.default = ProductService;
__decorate([
    (0, utils_1.InjectManager)("productRepository_"),
    __param(2, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], ProductService.prototype, "list", null);
__decorate([
    (0, utils_1.InjectManager)("productRepository_"),
    __param(2, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], ProductService.prototype, "listAndCount", null);

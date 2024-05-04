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
class ProductCategoryService {
    constructor({ productCategoryRepository }) {
        this.productCategoryRepository_ = productCategoryRepository;
    }
    async retrieve(productCategoryId, config = {}, sharedContext = {}) {
        if (!(0, utils_1.isDefined)(productCategoryId)) {
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.NOT_FOUND, `"productCategoryId" must be defined`);
        }
        const queryOptions = utils_1.ModulesSdkUtils.buildQuery({
            id: productCategoryId,
        }, config);
        const transformOptions = {
            includeDescendantsTree: true,
        };
        const productCategories = await this.productCategoryRepository_.find(queryOptions, transformOptions, sharedContext);
        if (!productCategories?.length) {
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.NOT_FOUND, `ProductCategory with id: ${productCategoryId} was not found`);
        }
        return productCategories[0];
    }
    async list(filters = {}, config = {}, sharedContext = {}) {
        const transformOptions = {
            includeDescendantsTree: filters?.include_descendants_tree || false,
            includeAncestorsTree: filters?.include_ancestors_tree || false,
        };
        delete filters.include_descendants_tree;
        delete filters.include_ancestors_tree;
        // Apply free text search filter
        if (filters?.q) {
            config.filters ?? (config.filters = {});
            config.filters[utils_1.FreeTextSearchFilterKey] = {
                value: filters.q,
                fromEntity: _models_1.ProductCategory.name,
            };
            delete filters.q;
        }
        const queryOptions = utils_1.ModulesSdkUtils.buildQuery(filters, config);
        queryOptions.where ?? (queryOptions.where = {});
        return (await this.productCategoryRepository_.find(queryOptions, transformOptions, sharedContext));
    }
    async listAndCount(filters = {}, config = {}, sharedContext = {}) {
        const transformOptions = {
            includeDescendantsTree: filters?.include_descendants_tree || false,
            includeAncestorsTree: filters?.include_ancestors_tree || false,
        };
        delete filters.include_descendants_tree;
        delete filters.include_ancestors_tree;
        // Apply free text search filter
        if (filters?.q) {
            config.filters ?? (config.filters = {});
            config.filters[utils_1.FreeTextSearchFilterKey] = {
                value: filters.q,
                fromEntity: _models_1.ProductCategory.name,
            };
            delete filters.q;
        }
        const queryOptions = utils_1.ModulesSdkUtils.buildQuery(filters, config);
        queryOptions.where ?? (queryOptions.where = {});
        return (await this.productCategoryRepository_.findAndCount(queryOptions, transformOptions, sharedContext));
    }
    async create(data, sharedContext = {}) {
        return (await this.productCategoryRepository_.create(data, sharedContext));
    }
    async update(id, data, sharedContext = {}) {
        return (await this.productCategoryRepository_.update(id, data, sharedContext));
    }
    async delete(id, sharedContext = {}) {
        await this.productCategoryRepository_.delete(id, sharedContext);
    }
}
exports.default = ProductCategoryService;
__decorate([
    (0, utils_1.InjectManager)("productCategoryRepository_"),
    __param(2, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ProductCategoryService.prototype, "retrieve", null);
__decorate([
    (0, utils_1.InjectManager)("productCategoryRepository_"),
    __param(2, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], ProductCategoryService.prototype, "list", null);
__decorate([
    (0, utils_1.InjectManager)("productCategoryRepository_"),
    __param(2, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], ProductCategoryService.prototype, "listAndCount", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("productCategoryRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProductCategoryService.prototype, "create", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("productCategoryRepository_"),
    __param(2, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ProductCategoryService.prototype, "update", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("productCategoryRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProductCategoryService.prototype, "delete", null);

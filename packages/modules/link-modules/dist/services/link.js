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
const utils_2 = require("../utils");
class LinkService {
    constructor({ linkRepository }) {
        this.linkRepository_ = linkRepository;
    }
    async list(filters = {}, config = {}, sharedContext = {}) {
        const queryOptions = utils_1.ModulesSdkUtils.buildQuery(filters, config);
        return await this.linkRepository_.find(queryOptions, sharedContext);
    }
    async listAndCount(filters = {}, config = {}, sharedContext = {}) {
        const queryOptions = utils_1.ModulesSdkUtils.buildQuery(filters, config);
        return await this.linkRepository_.findAndCount(queryOptions, sharedContext);
    }
    async create(data, sharedContext = {}) {
        return await this.linkRepository_.create(data, {
            transactionManager: sharedContext.transactionManager,
        });
    }
    async dismiss(data, sharedContext = {}) {
        const filter = [];
        for (const pair of data) {
            filter.push({
                $and: Object.entries(pair).map(([key, value]) => ({
                    [key]: value,
                })),
            });
        }
        const [rows] = await this.linkRepository_.softDelete({ $or: filter }, {
            transactionManager: sharedContext.transactionManager,
        });
        return rows;
    }
    async delete(data, sharedContext = {}) {
        await this.linkRepository_.delete(data, {
            transactionManager: sharedContext.transactionManager,
        });
    }
    async softDelete(data, sharedContext = {}) {
        const deleteFilters = {
            $or: data.map((dataEntry) => {
                const filter = {};
                for (const key in dataEntry) {
                    filter[key] = {
                        $in: Array.isArray(dataEntry[key])
                            ? dataEntry[key]
                            : [dataEntry[key]],
                    };
                }
                return filter;
            }),
        };
        return await this.linkRepository_.softDelete(deleteFilters, {
            transactionManager: sharedContext.transactionManager,
        });
    }
    async restore(data, sharedContext = {}) {
        const restoreFilters = {
            $or: data.map((dataEntry) => {
                const filter = {};
                for (const key in dataEntry) {
                    filter[key] = {
                        $in: Array.isArray(dataEntry[key])
                            ? dataEntry[key]
                            : [dataEntry[key]],
                    };
                }
                return filter;
            }),
        };
        return await this.linkRepository_.restore(restoreFilters, {
            transactionManager: sharedContext.transactionManager,
        });
    }
}
exports.default = LinkService;
__decorate([
    (0, utils_1.InjectManager)("linkRepository_"),
    __param(2, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], LinkService.prototype, "list", null);
__decorate([
    (0, utils_1.InjectManager)("linkRepository_"),
    __param(2, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], LinkService.prototype, "listAndCount", null);
__decorate([
    (0, utils_1.InjectTransactionManager)(utils_2.doNotForceTransaction, "linkRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], LinkService.prototype, "create", null);
__decorate([
    (0, utils_1.InjectTransactionManager)(utils_2.doNotForceTransaction, "linkRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], LinkService.prototype, "dismiss", null);
__decorate([
    (0, utils_1.InjectTransactionManager)(utils_2.doNotForceTransaction, "linkRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], LinkService.prototype, "delete", null);
__decorate([
    (0, utils_1.InjectTransactionManager)(utils_2.doNotForceTransaction, "linkRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], LinkService.prototype, "softDelete", null);
__decorate([
    (0, utils_1.InjectTransactionManager)(utils_2.doNotForceTransaction, "linkRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], LinkService.prototype, "restore", null);

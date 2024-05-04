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
class OrderChangeService extends utils_1.ModulesSdkUtils.internalModuleServiceFactory(_models_1.OrderChange) {
    constructor(container) {
        // @ts-ignore
        super(...arguments);
        this.orderChangeRepository_ = container.orderChangeRepository;
    }
    async listCurrentOrderChange(orderId, config = {}, sharedContext = {}) {
        const allChanges = await super.list({ order_id: orderId }, config ?? {
            select: ["order_id", "status", "version"],
            order: {
                order_id: "ASC",
                version: "DESC",
            },
        });
        if (!allChanges.length) {
            return [];
        }
        const lastChanges = [];
        const seen = new Set();
        for (let i = 0; i < allChanges.length; i++) {
            if (seen.has(allChanges[i].order_id)) {
                continue;
            }
            seen.add(allChanges[i].order_id);
            if (this.isActive(allChanges[i])) {
                lastChanges.push(allChanges[i].id);
            }
        }
        let orderChange;
        if (allChanges?.length > 0) {
            if (this.isActive(allChanges[0])) {
                orderChange = allChanges[0];
            }
        }
        if (!orderChange) {
            return [];
        }
        const relations = (0, utils_1.deduplicate)([...(config.relations ?? []), "actions"]);
        config.relations = relations;
        const queryConfig = utils_1.ModulesSdkUtils.buildQuery({
            id: lastChanges,
            order: {
                items: {
                    version: orderChange.version,
                },
            },
        }, config);
        return await this.orderChangeRepository_.find(queryConfig, sharedContext);
    }
    isActive(orderChange) {
        return (orderChange.status === utils_1.OrderChangeStatus.PENDING ||
            orderChange.status === utils_1.OrderChangeStatus.REQUESTED);
    }
    async create(data, sharedContext = {}) {
        const dataArr = Array.isArray(data) ? data : [data];
        const activeOrderEdit = await this.listCurrentOrderChange(dataArr.map((d) => d.order_id), {}, sharedContext);
        if (activeOrderEdit.length > 0) {
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, `An active order change already exists for the order(s) ${activeOrderEdit
                .map((a) => a.order_id)
                .join(",")}`);
        }
        return await super.create(dataArr, sharedContext);
    }
}
exports.default = OrderChangeService;
__decorate([
    (0, utils_1.InjectManager)("orderChangeRepository_"),
    __param(2, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], OrderChangeService.prototype, "listCurrentOrderChange", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("orderChangeRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OrderChangeService.prototype, "create", null);
//# sourceMappingURL=order-change-service.js.map
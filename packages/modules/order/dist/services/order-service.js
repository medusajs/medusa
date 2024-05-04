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
class OrderService extends utils_1.ModulesSdkUtils.internalModuleServiceFactory(_models_1.Order) {
    constructor(container) {
        // @ts-ignore
        super(...arguments);
        this.orderRepository_ = container.orderRepository;
    }
    async retrieveOrderVersion(id, version, config = {}, sharedContext = {}) {
        const queryConfig = utils_1.ModulesSdkUtils.buildQuery({ id, items: { version } }, { ...config, take: 1 });
        const [result] = await this.orderRepository_.find(queryConfig, sharedContext);
        if (!result) {
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.NOT_FOUND, `Order with id: "${id}" and version: "${version}" not found`);
        }
        return result;
    }
}
exports.default = OrderService;
__decorate([
    (0, utils_1.InjectManager)("orderRepository_"),
    __param(3, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Object, Object]),
    __metadata("design:returntype", Promise)
], OrderService.prototype, "retrieveOrderVersion", null);
//# sourceMappingURL=order-service.js.map
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
const medusa_core_utils_1 = require("medusa-core-utils");
const os_1 = require("os");
class PaymentProviderService {
    constructor(container, moduleDeclaration) {
        this.moduleDeclaration = moduleDeclaration;
        this.container_ = container;
        this.paymentProviderRepository_ = container.paymentProviderRepository;
    }
    async create(data, sharedContext) {
        return await this.paymentProviderRepository_.create(data, sharedContext);
    }
    async list(filters, config, sharedContext) {
        const queryOptions = utils_1.ModulesSdkUtils.buildQuery(filters, config);
        return await this.paymentProviderRepository_.find(queryOptions, sharedContext);
    }
    async listAndCount(filters, config, sharedContext) {
        const queryOptions = utils_1.ModulesSdkUtils.buildQuery(filters, config);
        return await this.paymentProviderRepository_.findAndCount(queryOptions, sharedContext);
    }
    retrieveProvider(providerId) {
        try {
            return this.container_[providerId];
        }
        catch (e) {
            throw new medusa_core_utils_1.MedusaError(medusa_core_utils_1.MedusaError.Types.NOT_FOUND, `Could not find a payment provider with id: ${providerId}`);
        }
    }
    async createSession(providerId, sessionInput) {
        const provider = this.retrieveProvider(providerId);
        const paymentResponse = await provider.initiatePayment(sessionInput);
        if ((0, utils_1.isPaymentProviderError)(paymentResponse)) {
            this.throwPaymentProviderError(paymentResponse);
        }
        return paymentResponse.data;
    }
    async updateSession(providerId, sessionInput) {
        const provider = this.retrieveProvider(providerId);
        const paymentResponse = await provider.updatePayment(sessionInput);
        if ((0, utils_1.isPaymentProviderError)(paymentResponse)) {
            this.throwPaymentProviderError(paymentResponse);
        }
        return paymentResponse?.data;
    }
    async deleteSession(input) {
        const provider = this.retrieveProvider(input.provider_id);
        const error = await provider.deletePayment(input.data);
        if ((0, utils_1.isPaymentProviderError)(error)) {
            this.throwPaymentProviderError(error);
        }
    }
    async authorizePayment(input, context) {
        const provider = this.retrieveProvider(input.provider_id);
        const res = await provider.authorizePayment(input.data, context);
        if ((0, utils_1.isPaymentProviderError)(res)) {
            this.throwPaymentProviderError(res);
        }
        const { data, status } = res;
        return { data, status };
    }
    async getStatus(input) {
        const provider = this.retrieveProvider(input.provider_id);
        return await provider.getPaymentStatus(input.data);
    }
    async capturePayment(input) {
        const provider = this.retrieveProvider(input.provider_id);
        const res = await provider.capturePayment(input.data);
        if ((0, utils_1.isPaymentProviderError)(res)) {
            this.throwPaymentProviderError(res);
        }
        return res;
    }
    async cancelPayment(input) {
        const provider = this.retrieveProvider(input.provider_id);
        const error = await provider.cancelPayment(input.data);
        if ((0, utils_1.isPaymentProviderError)(error)) {
            this.throwPaymentProviderError(error);
        }
    }
    async refundPayment(input, amount) {
        const provider = this.retrieveProvider(input.provider_id);
        const res = await provider.refundPayment(input.data, amount);
        if ((0, utils_1.isPaymentProviderError)(res)) {
            this.throwPaymentProviderError(res);
        }
        return res;
    }
    async getWebhookActionAndData(providerId, data) {
        const provider = this.retrieveProvider(providerId);
        return await provider.getWebhookActionAndData(data);
    }
    throwPaymentProviderError(errObj) {
        throw new medusa_core_utils_1.MedusaError(medusa_core_utils_1.MedusaError.Types.INVALID_DATA, `${errObj.error}${errObj.detail ? `:${os_1.EOL}${errObj.detail}` : ""}`, errObj.code);
    }
}
exports.default = PaymentProviderService;
__decorate([
    (0, utils_1.InjectTransactionManager)("paymentProviderRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], PaymentProviderService.prototype, "create", null);
__decorate([
    (0, utils_1.InjectManager)("paymentProviderRepository_"),
    __param(2, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentProviderService.prototype, "list", null);
__decorate([
    (0, utils_1.InjectManager)("paymentProviderRepository_"),
    __param(2, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentProviderService.prototype, "listAndCount", null);

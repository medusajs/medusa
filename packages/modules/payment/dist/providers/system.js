"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemProviderService = void 0;
const types_1 = require("@medusajs/types");
const utils_1 = require("@medusajs/utils");
class SystemProviderService extends utils_1.AbstractPaymentProvider {
    async getStatus(_) {
        return "authorized";
    }
    async getPaymentData(_) {
        return {};
    }
    async initiatePayment(context) {
        return { data: {} };
    }
    async getPaymentStatus(paymentSessionData) {
        throw new Error("Method not implemented.");
    }
    async retrievePayment(paymentSessionData) {
        return {};
    }
    async authorizePayment(_) {
        return { data: {}, status: types_1.PaymentSessionStatus.AUTHORIZED };
    }
    async updatePayment(_) {
        return { data: {} };
    }
    async deletePayment(_) {
        return {};
    }
    async capturePayment(_) {
        return {};
    }
    async refundPayment(_) {
        return {};
    }
    async cancelPayment(_) {
        return {};
    }
    async getWebhookActionAndData(data) {
        return { action: utils_1.PaymentActions.NOT_SUPPORTED };
    }
}
exports.SystemProviderService = SystemProviderService;
SystemProviderService.identifier = "system";
SystemProviderService.PROVIDER = "system";
exports.default = SystemProviderService;

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
const joiner_config_1 = require("../joiner-config");
const generateMethodForModels = [
    _models_1.PaymentCollection,
    _models_1.Payment,
    _models_1.PaymentSession,
    _models_1.Capture,
    _models_1.Refund,
];
class PaymentModuleService extends utils_1.ModulesSdkUtils.abstractModuleServiceFactory(_models_1.PaymentCollection, generateMethodForModels, joiner_config_1.entityNameToLinkableKeysMap) {
    constructor({ baseRepository, paymentService, captureService, refundService, paymentSessionService, paymentProviderService, paymentCollectionService, }, moduleDeclaration) {
        // @ts-ignore
        super(...arguments);
        this.moduleDeclaration = moduleDeclaration;
        this.baseRepository_ = baseRepository;
        this.refundService_ = refundService;
        this.captureService_ = captureService;
        this.paymentService_ = paymentService;
        this.paymentSessionService_ = paymentSessionService;
        this.paymentProviderService_ = paymentProviderService;
        this.paymentCollectionService_ = paymentCollectionService;
    }
    __joinerConfig() {
        return joiner_config_1.joinerConfig;
    }
    async createPaymentCollections(data, sharedContext) {
        const input = Array.isArray(data) ? data : [data];
        const collections = await this.createPaymentCollections_(input, sharedContext);
        return await this.baseRepository_.serialize(Array.isArray(data) ? collections : collections[0], {
            populate: true,
        });
    }
    async createPaymentCollections_(data, sharedContext) {
        return this.paymentCollectionService_.create(data, sharedContext);
    }
    async updatePaymentCollections(idOrSelector, data, sharedContext) {
        let updateData = [];
        if ((0, utils_1.isString)(idOrSelector)) {
            updateData = [
                {
                    id: idOrSelector,
                    ...data,
                },
            ];
        }
        else {
            const collections = await this.paymentCollectionService_.list(idOrSelector, {}, sharedContext);
            updateData = collections.map((c) => ({
                id: c.id,
                ...data,
            }));
        }
        const result = await this.updatePaymentCollections_(updateData, sharedContext);
        return await this.baseRepository_.serialize(Array.isArray(data) ? result : result[0], {
            populate: true,
        });
    }
    async updatePaymentCollections_(data, sharedContext) {
        return await this.paymentCollectionService_.update(data, sharedContext);
    }
    async upsertPaymentCollections(data, sharedContext) {
        const input = Array.isArray(data) ? data : [data];
        const forUpdate = input.filter((collection) => !!collection.id);
        const forCreate = input.filter((collection) => !collection.id);
        const operations = [];
        if (forCreate.length) {
            operations.push(this.createPaymentCollections_(forCreate, sharedContext));
        }
        if (forUpdate.length) {
            operations.push(this.updatePaymentCollections_(forUpdate, sharedContext));
        }
        const result = (await (0, utils_1.promiseAll)(operations)).flat();
        return await this.baseRepository_.serialize(Array.isArray(data) ? result : result[0]);
    }
    async completePaymentCollections(paymentCollectionId, sharedContext) {
        const input = Array.isArray(paymentCollectionId)
            ? paymentCollectionId.map((id) => ({
                id,
                completed_at: new Date(),
            }))
            : [{ id: paymentCollectionId, completed_at: new Date() }];
        // TODO: what checks should be done here? e.g. captured_amount === amount?
        const updated = await this.paymentCollectionService_.update(input, sharedContext);
        return await this.baseRepository_.serialize(Array.isArray(paymentCollectionId) ? updated : updated[0], { populate: true });
    }
    async createPaymentSession(paymentCollectionId, input, sharedContext) {
        let paymentSession;
        try {
            const providerSessionSession = await this.paymentProviderService_.createSession(input.provider_id, {
                context: input.context ?? {},
                amount: input.amount,
                currency_code: input.currency_code,
            });
            input.data = {
                ...input.data,
                ...providerSessionSession,
            };
            paymentSession = await this.createPaymentSession_(paymentCollectionId, input, sharedContext);
        }
        catch (error) {
            // In case the session is created at the provider, but fails to be created in Medusa,
            // we catch the error and delete the session at the provider and rethrow.
            await this.paymentProviderService_.deleteSession({
                provider_id: input.provider_id,
                data: input.data,
            });
            throw error;
        }
        return await this.baseRepository_.serialize(paymentSession, {
            populate: true,
        });
    }
    async createPaymentSession_(paymentCollectionId, data, sharedContext) {
        const paymentSession = await this.paymentSessionService_.create({
            payment_collection_id: paymentCollectionId,
            provider_id: data.provider_id,
            amount: data.amount,
            currency_code: data.currency_code,
            context: data.context,
            data: data.data,
        }, sharedContext);
        return paymentSession;
    }
    async updatePaymentSession(data, sharedContext) {
        const session = await this.paymentSessionService_.retrieve(data.id, { select: ["id", "data", "provider_id"] }, sharedContext);
        const updated = await this.paymentSessionService_.update({
            id: session.id,
            amount: data.amount,
            currency_code: data.currency_code,
            data: data.data,
        }, sharedContext);
        return await this.baseRepository_.serialize(updated[0], { populate: true });
    }
    async deletePaymentSession(id, sharedContext) {
        const session = await this.paymentSessionService_.retrieve(id, { select: ["id", "data", "provider_id"] }, sharedContext);
        await this.paymentProviderService_.deleteSession({
            provider_id: session.provider_id,
            data: session.data,
        });
        await this.paymentSessionService_.delete(id, sharedContext);
    }
    async authorizePaymentSession(id, context, sharedContext) {
        const session = await this.paymentSessionService_.retrieve(id, {
            select: [
                "id",
                "data",
                "provider_id",
                "amount",
                "currency_code",
                "payment_collection_id",
            ],
        }, sharedContext);
        // this method needs to be idempotent
        if (session.authorized_at) {
            const payment = await this.paymentService_.retrieve({ session_id: session.id }, { relations: ["payment_collection"] }, sharedContext);
            return await this.baseRepository_.serialize(payment, { populate: true });
        }
        const { data, status } = await this.paymentProviderService_.authorizePayment({
            provider_id: session.provider_id,
            data: session.data,
        }, context);
        await this.paymentSessionService_.update({
            id: session.id,
            data,
            status,
            authorized_at: status === types_1.PaymentSessionStatus.AUTHORIZED ? new Date() : null,
        }, sharedContext);
        if (status !== types_1.PaymentSessionStatus.AUTHORIZED) {
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.NOT_ALLOWED, `Session: ${session.id} is not authorized with the provider.`);
        }
        // TODO: update status on payment collection if authorized_amount === amount - depends on the BigNumber PR
        const payment = await this.paymentService_.create({
            amount: session.amount,
            currency_code: session.currency_code,
            payment_session: session.id,
            payment_collection_id: session.payment_collection_id,
            provider_id: session.provider_id,
            // customer_id: context.customer.id,
            data,
        }, sharedContext);
        return await this.retrievePayment(payment.id, { relations: ["payment_collection"] }, sharedContext);
    }
    async updatePayment(data, sharedContext) {
        // NOTE: currently there is no update with the provider but maybe data could be updated
        const result = await this.paymentService_.update(data, sharedContext);
        return await this.baseRepository_.serialize(result[0], {
            populate: true,
        });
    }
    async capturePayment(data, sharedContext = {}) {
        const payment = await this.paymentService_.retrieve(data.payment_id, {
            select: [
                "id",
                "data",
                "provider_id",
                "amount",
                "raw_amount",
                "canceled_at",
            ],
            relations: ["captures.raw_amount"],
        }, sharedContext);
        // If no custom amount is passed, we assume the full amount needs to be captured
        if (!data.amount) {
            data.amount = payment.amount;
        }
        if (payment.canceled_at) {
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, `The payment: ${payment.id} has been canceled.`);
        }
        if (payment.captured_at) {
            return await this.retrievePayment(data.payment_id, { relations: ["captures"] }, sharedContext);
        }
        const capturedAmount = payment.captures.reduce((captureAmount, next) => {
            return utils_1.MathBN.add(captureAmount, next.raw_amount);
        }, utils_1.MathBN.convert(0));
        const authorizedAmount = new utils_1.BigNumber(payment.raw_amount);
        const newCaptureAmount = new utils_1.BigNumber(data.amount);
        const remainingToCapture = utils_1.MathBN.sub(authorizedAmount, capturedAmount);
        if (utils_1.MathBN.gt(newCaptureAmount, remainingToCapture)) {
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, `You cannot capture more than the authorized amount substracted by what is already captured.`);
        }
        const paymentData = await this.paymentProviderService_.capturePayment({
            data: payment.data,
            provider_id: payment.provider_id,
        });
        await this.captureService_.create({
            payment: data.payment_id,
            amount: data.amount,
            captured_by: data.captured_by,
        }, sharedContext);
        await this.paymentService_.update({ id: payment.id, data: paymentData }, sharedContext);
        // When the entire authorized amount has been captured, we mark it fully capture by setting the captured_at field
        const totalCaptured = utils_1.MathBN.convert(utils_1.MathBN.add(capturedAmount, newCaptureAmount));
        if (utils_1.MathBN.gte(totalCaptured, authorizedAmount)) {
            await this.paymentService_.update({ id: payment.id, captured_at: new Date() }, sharedContext);
        }
        return await this.retrievePayment(payment.id, { relations: ["captures"] }, sharedContext);
    }
    async refundPayment(data, sharedContext) {
        const payment = await this.paymentService_.retrieve(data.payment_id, {
            select: ["id", "data", "provider_id", "amount", "raw_amount"],
            relations: ["captures.raw_amount"],
        }, sharedContext);
        if (!data.amount) {
            data.amount = payment.amount;
        }
        const capturedAmount = payment.captures.reduce((captureAmount, next) => {
            const amountAsBigNumber = new utils_1.BigNumber(next.raw_amount);
            return utils_1.MathBN.add(captureAmount, amountAsBigNumber);
        }, utils_1.MathBN.convert(0));
        const refundAmount = new utils_1.BigNumber(data.amount);
        if (utils_1.MathBN.lt(capturedAmount, refundAmount)) {
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, `You cannot refund more than what is captured on the payment.`);
        }
        const paymentData = await this.paymentProviderService_.refundPayment({
            data: payment.data,
            provider_id: payment.provider_id,
        }, data.amount);
        await this.refundService_.create({
            payment: data.payment_id,
            amount: data.amount,
            created_by: data.created_by,
        }, sharedContext);
        await this.paymentService_.update({ id: payment.id, data: paymentData }, sharedContext);
        return await this.retrievePayment(payment.id, { relations: ["refunds"] }, sharedContext);
    }
    async cancelPayment(paymentId, sharedContext) {
        const payment = await this.paymentService_.retrieve(paymentId, { select: ["id", "data", "provider_id"] }, sharedContext);
        // TODO: revisit when totals are implemented
        //   if (payment.captured_amount !== 0) {
        //     throw new MedusaError(
        //       MedusaError.Types.INVALID_DATA,
        //       `Cannot cancel a payment: ${payment.id} that has been captured.`
        //     )
        //   }
        await this.paymentProviderService_.cancelPayment({
            data: payment.data,
            provider_id: payment.provider_id,
        });
        await this.paymentService_.update({ id: paymentId, canceled_at: new Date() }, sharedContext);
        return await this.retrievePayment(payment.id, {}, sharedContext);
    }
    async processEvent(eventData, sharedContext) {
        const providerId = `pp_${eventData.provider}`;
        const event = await this.paymentProviderService_.getWebhookActionAndData(providerId, eventData.payload);
        if (event.action === utils_1.PaymentActions.NOT_SUPPORTED) {
            return;
        }
        switch (event.action) {
            case utils_1.PaymentActions.SUCCESSFUL: {
                const [payment] = await this.listPayments({
                    session_id: event.data.resource_id,
                }, {}, sharedContext);
                await this.capturePayment({ payment_id: payment.id, amount: event.data.amount }, sharedContext);
                break;
            }
            case utils_1.PaymentActions.AUTHORIZED:
                await this.authorizePaymentSession(event.data.resource_id, {}, sharedContext);
        }
    }
    async listPaymentProviders(filters = {}, config = {}, sharedContext) {
        const providers = await this.paymentProviderService_.list(filters, config, sharedContext);
        return await this.baseRepository_.serialize(providers, {
            populate: true,
        });
    }
    async listAndCountPaymentProviders(filters = {}, config = {}, sharedContext) {
        const [providers, count] = await this.paymentProviderService_.listAndCount(filters, config, sharedContext);
        return [
            await this.baseRepository_.serialize(providers, {
                populate: true,
            }),
            count,
        ];
    }
}
exports.default = PaymentModuleService;
__decorate([
    (0, utils_1.InjectManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentModuleService.prototype, "createPaymentCollections", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], PaymentModuleService.prototype, "createPaymentCollections_", null);
__decorate([
    (0, utils_1.InjectManager)("baseRepository_"),
    __param(2, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentModuleService.prototype, "updatePaymentCollections", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], PaymentModuleService.prototype, "updatePaymentCollections_", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentModuleService.prototype, "upsertPaymentCollections", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentModuleService.prototype, "completePaymentCollections", null);
__decorate([
    (0, utils_1.InjectManager)("baseRepository_"),
    __param(2, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentModuleService.prototype, "createPaymentSession", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __param(2, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentModuleService.prototype, "createPaymentSession_", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentModuleService.prototype, "updatePaymentSession", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PaymentModuleService.prototype, "deletePaymentSession", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __param(2, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentModuleService.prototype, "authorizePaymentSession", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentModuleService.prototype, "updatePayment", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentModuleService.prototype, "capturePayment", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentModuleService.prototype, "refundPayment", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PaymentModuleService.prototype, "cancelPayment", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentModuleService.prototype, "processEvent", null);
__decorate([
    (0, utils_1.InjectManager)("baseRepository_"),
    __param(2, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentModuleService.prototype, "listPaymentProviders", null);
__decorate([
    (0, utils_1.InjectManager)("baseRepository_"),
    __param(2, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentModuleService.prototype, "listAndCountPaymentProviders", null);

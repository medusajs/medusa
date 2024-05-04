"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findOrCreateCustomerStep = exports.findOrCreateCustomerStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const utils_1 = require("@medusajs/utils");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.findOrCreateCustomerStepId = "find-or-create-customer";
exports.findOrCreateCustomerStep = (0, workflows_sdk_1.createStep)(exports.findOrCreateCustomerStepId, async (data, { container }) => {
    if (typeof data.customerId === undefined &&
        typeof data.email === undefined) {
        return new workflows_sdk_1.StepResponse({
            customer: undefined,
            email: undefined,
        }, { customerWasCreated: false });
    }
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.CUSTOMER);
    const customerData = {
        customer: null,
        email: null,
    };
    let customerWasCreated = false;
    if (data.customerId) {
        const customer = await service.retrieve(data.customerId);
        customerData.customer = customer;
        customerData.email = customer.email;
        return new workflows_sdk_1.StepResponse(customerData, {
            customerWasCreated,
        });
    }
    if (data.email) {
        const validatedEmail = (0, utils_1.validateEmail)(data.email);
        let [customer] = await service.list({
            email: validatedEmail,
            has_account: false,
        });
        if (!customer) {
            customer = await service.create({ email: validatedEmail });
            customerWasCreated = true;
        }
        customerData.customer = customer;
        customerData.email = customer.email;
    }
    return new workflows_sdk_1.StepResponse(customerData, {
        customer: customerData.customer,
        customerWasCreated,
    });
}, async (compData, { container }) => {
    const { customer, customerWasCreated } = compData;
    if (!customerWasCreated || !customer?.id) {
        return;
    }
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.CUSTOMER);
    await service.delete(customer.id);
});

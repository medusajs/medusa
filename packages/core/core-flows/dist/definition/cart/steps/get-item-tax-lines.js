"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getItemTaxLinesStep = exports.getItemTaxLinesStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const utils_1 = require("@medusajs/utils");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
function normalizeTaxModuleContext(cart, forceTaxCalculation) {
    const address = cart.shipping_address;
    const shouldCalculateTax = forceTaxCalculation || cart.region?.automatic_taxes;
    if (!shouldCalculateTax) {
        return null;
    }
    if (forceTaxCalculation && !address?.country_code) {
        throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, `country code is required to calculate taxes`);
    }
    if (!address?.country_code) {
        return null;
    }
    const customer = cart.customer
        ? {
            id: cart.customer.id,
            email: cart.customer.email,
            customer_groups: cart.customer.groups?.map((g) => g.id) || [],
        }
        : undefined;
    return {
        address: {
            country_code: address.country_code,
            province_code: address.province,
            address_1: address.address_1,
            address_2: address.address_2,
            city: address.city,
            postal_code: address.postal_code,
        },
        customer,
        // TODO: Should probably come in from order module, defaulting to false
        is_return: false,
    };
}
function normalizeLineItemsForTax(cart, items) {
    return items.map((item) => ({
        id: item.id,
        product_id: item.product_id,
        product_name: item.variant_title,
        product_sku: item.variant_sku,
        product_type: item.product_type,
        product_type_id: item.product_type,
        quantity: item.quantity,
        unit_price: item.unit_price,
        currency_code: cart.currency_code,
    }));
}
function normalizeLineItemsForShipping(cart, shippingMethods) {
    return shippingMethods.map((shippingMethod) => ({
        id: shippingMethod.id,
        shipping_option_id: shippingMethod.shipping_option_id,
        unit_price: shippingMethod.amount,
        currency_code: cart.currency_code,
    }));
}
exports.getItemTaxLinesStepId = "get-item-tax-lines";
exports.getItemTaxLinesStep = (0, workflows_sdk_1.createStep)(exports.getItemTaxLinesStepId, async (data, { container }) => {
    const { cart, items, shipping_methods: shippingMethods, force_tax_calculation: forceTaxCalculation = false, } = data;
    const taxService = container.resolve(modules_sdk_1.ModuleRegistrationName.TAX);
    const taxContext = normalizeTaxModuleContext(cart, forceTaxCalculation);
    if (!taxContext) {
        return new workflows_sdk_1.StepResponse({
            lineItemTaxLines: [],
            shippingMethodsTaxLines: [],
        });
    }
    const lineItemTaxLines = (await taxService.getTaxLines(normalizeLineItemsForTax(cart, items), taxContext));
    const shippingMethodsTaxLines = (await taxService.getTaxLines(normalizeLineItemsForShipping(cart, shippingMethods), taxContext));
    return new workflows_sdk_1.StepResponse({
        lineItemTaxLines,
        shippingMethodsTaxLines,
    });
});

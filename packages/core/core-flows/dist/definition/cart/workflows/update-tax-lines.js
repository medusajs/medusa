"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTaxLinesWorkflow = exports.updateTaxLinesWorkflowId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const steps_1 = require("../steps");
const cartFields = [
    "id",
    "currency_code",
    "email",
    "region.id",
    "region.automatic_taxes",
    "items.id",
    "items.variant_id",
    "items.product_id",
    "items.product_title",
    "items.product_description",
    "items.product_subtitle",
    "items.product_type",
    "items.product_collection",
    "items.product_handle",
    "items.variant_sku",
    "items.variant_barcode",
    "items.variant_title",
    "items.title",
    "items.quantity",
    "items.unit_price",
    "items.tax_lines.id",
    "items.tax_lines.description",
    "items.tax_lines.code",
    "items.tax_lines.rate",
    "items.tax_lines.provider_id",
    "shipping_methods.tax_lines.id",
    "shipping_methods.tax_lines.description",
    "shipping_methods.tax_lines.code",
    "shipping_methods.tax_lines.rate",
    "shipping_methods.tax_lines.provider_id",
    "shipping_methods.shipping_option_id",
    "shipping_methods.amount",
    "customer.id",
    "customer.email",
    "customer.groups.id",
    "shipping_address.id",
    "shipping_address.address_1",
    "shipping_address.address_2",
    "shipping_address.city",
    "shipping_address.postal_code",
    "shipping_address.country_code",
    "shipping_address.region_code",
    "shipping_address.province",
];
exports.updateTaxLinesWorkflowId = "update-tax-lines";
exports.updateTaxLinesWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.updateTaxLinesWorkflowId, (input) => {
    const cart = (0, steps_1.retrieveCartWithLinksStep)({
        cart_or_cart_id: input.cart_or_cart_id,
        fields: cartFields,
    });
    const taxLineItems = (0, steps_1.getItemTaxLinesStep)((0, workflows_sdk_1.transform)({ input, cart }, (data) => ({
        cart: data.cart,
        items: data.input.items || data.cart.items,
        shipping_methods: data.input.shipping_methods || data.cart.shipping_methods,
        force_tax_calculation: data.input.force_tax_calculation,
    })));
    (0, steps_1.setTaxLinesForItemsStep)({
        cart,
        item_tax_lines: taxLineItems.lineItemTaxLines,
        shipping_tax_lines: taxLineItems.shippingMethodsTaxLines,
    });
});

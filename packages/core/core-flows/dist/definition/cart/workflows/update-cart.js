"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCartWorkflow = exports.updateCartWorkflowId = void 0;
const utils_1 = require("@medusajs/utils");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const common_1 = require("../../../common");
const steps_1 = require("../steps");
const refresh_cart_promotions_1 = require("../steps/refresh-cart-promotions");
const update_tax_lines_1 = require("../steps/update-tax-lines");
const fields_1 = require("../utils/fields");
const refresh_payment_collection_1 = require("./refresh-payment-collection");
exports.updateCartWorkflowId = "update-cart";
exports.updateCartWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.updateCartWorkflowId, (input) => {
    const [salesChannel, region, customerData] = (0, workflows_sdk_1.parallelize)((0, steps_1.findSalesChannelStep)({
        salesChannelId: input.sales_channel_id,
    }), (0, steps_1.findOneOrAnyRegionStep)({
        regionId: input.region_id,
    }), (0, steps_1.findOrCreateCustomerStep)({
        customerId: input.customer_id,
        email: input.email,
    }));
    const cartInput = (0, workflows_sdk_1.transform)({ input, region, customerData, salesChannel }, (data) => {
        const { promo_codes, ...updateCartData } = data.input;
        const data_ = { ...updateCartData };
        if ((0, utils_1.isPresent)(updateCartData.region_id)) {
            data_.currency_code = data.region.currency_code;
            data_.region_id = data.region.id;
        }
        if (updateCartData.customer_id !== undefined ||
            updateCartData.email !== undefined) {
            data_.customer_id = data.customerData.customer?.id || null;
            data_.email =
                data.input?.email ?? (data.customerData.customer?.email || null);
        }
        if (updateCartData.sales_channel_id !== undefined) {
            data_.sales_channel_id = data.salesChannel?.id || null;
        }
        return data_;
    });
    const carts = (0, steps_1.updateCartsStep)([cartInput]);
    const cart = (0, common_1.useRemoteQueryStep)({
        entry_point: "cart",
        fields: fields_1.cartFieldsForRefreshSteps,
        variables: { id: cartInput.id },
        list: false,
    }).config({ name: "refetch–cart" });
    (0, steps_1.refreshCartShippingMethodsStep)({ cart });
    (0, update_tax_lines_1.updateTaxLinesStep)({ cart_or_cart_id: carts[0].id });
    (0, refresh_cart_promotions_1.refreshCartPromotionsStep)({
        id: input.id,
        promo_codes: input.promo_codes,
        action: utils_1.PromotionActions.REPLACE,
    });
    (0, refresh_payment_collection_1.refreshPaymentCollectionForCartStep)({
        cart_id: input.id,
    });
});

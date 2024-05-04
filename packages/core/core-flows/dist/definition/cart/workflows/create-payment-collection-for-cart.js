"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPaymentCollectionForCartWorkflow = exports.createPaymentCollectionForCartWorkflowId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const steps_1 = require("../steps");
const create_payment_collection_1 = require("../steps/create-payment-collection");
const link_cart_payment_collection_1 = require("../steps/link-cart-payment-collection");
exports.createPaymentCollectionForCartWorkflowId = "create-payment-collection-for-cart";
exports.createPaymentCollectionForCartWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.createPaymentCollectionForCartWorkflowId, (input) => {
    const created = (0, create_payment_collection_1.createPaymentCollectionsStep)([input]);
    const link = (0, workflows_sdk_1.transform)({ cartId: input.cart_id, created }, (data) => ({
        links: [
            {
                cart_id: data.cartId,
                payment_collection_id: data.created[0].id,
            },
        ],
    }));
    (0, link_cart_payment_collection_1.linkCartAndPaymentCollectionsStep)(link);
    const cart = (0, steps_1.retrieveCartStep)({ id: input.cart_id });
    return cart;
});

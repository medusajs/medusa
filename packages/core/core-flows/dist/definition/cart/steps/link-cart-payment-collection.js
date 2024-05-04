"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.linkCartAndPaymentCollectionsStep = exports.linkCartAndPaymentCollectionsStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const utils_1 = require("@medusajs/utils");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.linkCartAndPaymentCollectionsStepId = "link-cart-payment-collection";
exports.linkCartAndPaymentCollectionsStep = (0, workflows_sdk_1.createStep)(exports.linkCartAndPaymentCollectionsStepId, async (data, { container }) => {
    const remoteLink = container.resolve(utils_1.ContainerRegistrationKeys.REMOTE_LINK);
    const links = data.links.map((d) => ({
        [modules_sdk_1.Modules.CART]: { cart_id: d.cart_id },
        [modules_sdk_1.Modules.PAYMENT]: { payment_collection_id: d.payment_collection_id },
    }));
    await remoteLink.create(links);
    return new workflows_sdk_1.StepResponse(void 0, data);
}, async (data, { container }) => {
    if (!data) {
        return;
    }
    const remoteLink = container.resolve(utils_1.ContainerRegistrationKeys.REMOTE_LINK);
    const links = data.links.map((d) => ({
        [modules_sdk_1.Modules.CART]: { cart_id: d.cart_id },
        [modules_sdk_1.Modules.PAYMENT]: { payment_collection_id: d.payment_collection_id },
    }));
    await remoteLink.dismiss(links);
});

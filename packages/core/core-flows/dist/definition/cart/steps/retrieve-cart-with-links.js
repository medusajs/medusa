"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.retrieveCartWithLinksStep = exports.retrieveCartWithLinksStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const utils_1 = require("@medusajs/utils");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.retrieveCartWithLinksStepId = "retrieve-cart-with-links";
exports.retrieveCartWithLinksStep = (0, workflows_sdk_1.createStep)(exports.retrieveCartWithLinksStepId, async (data, { container }) => {
    const { cart_or_cart_id: cartOrCartId, fields } = data;
    if ((0, utils_1.isObject)(cartOrCartId)) {
        return new workflows_sdk_1.StepResponse(cartOrCartId);
    }
    const id = cartOrCartId;
    const remoteQuery = container.resolve(modules_sdk_1.LinkModuleUtils.REMOTE_QUERY);
    const query = (0, utils_1.remoteQueryObjectFromString)({
        entryPoint: modules_sdk_1.Modules.CART,
        fields,
    });
    const [cart] = await remoteQuery(query, { cart: { id } });
    return new workflows_sdk_1.StepResponse(cart);
});

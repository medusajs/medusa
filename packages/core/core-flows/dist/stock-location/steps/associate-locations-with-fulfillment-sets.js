"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.associateFulfillmentSetsWithLocationStep = exports.associateFulfillmentSetsWithLocationStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const utils_1 = require("@medusajs/utils");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.associateFulfillmentSetsWithLocationStepId = "associate-fulfillment-sets-with-location-step";
exports.associateFulfillmentSetsWithLocationStep = (0, workflows_sdk_1.createStep)(exports.associateFulfillmentSetsWithLocationStepId, async (data, { container }) => {
    if (!data.input.length) {
        return new workflows_sdk_1.StepResponse([], []);
    }
    const remoteLink = container.resolve(utils_1.ContainerRegistrationKeys.REMOTE_LINK);
    const links = data.input
        .map((link) => {
        return link.fulfillment_set_ids.map((id) => {
            return {
                [modules_sdk_1.Modules.STOCK_LOCATION]: {
                    stock_location_id: link.location_id,
                },
                [modules_sdk_1.Modules.FULFILLMENT]: {
                    fulfillment_set_id: id,
                },
            };
        });
    })
        .flat();
    const createdLinks = await remoteLink.create(links);
    return new workflows_sdk_1.StepResponse(createdLinks, links);
}, async (links, { container }) => {
    if (!links?.length) {
        return;
    }
    const remoteLink = container.resolve(utils_1.ContainerRegistrationKeys.REMOTE_LINK);
    await remoteLink.dismiss(links);
});

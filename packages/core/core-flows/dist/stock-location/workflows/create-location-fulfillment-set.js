"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLocationFulfillmentSetWorkflow = exports.createLocationFulfillmentSetWorkflowId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const fulfillment_1 = require("../../fulfillment");
const associate_locations_with_fulfillment_sets_1 = require("../steps/associate-locations-with-fulfillment-sets");
exports.createLocationFulfillmentSetWorkflowId = "create-location-fulfillment-set";
exports.createLocationFulfillmentSetWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.createLocationFulfillmentSetWorkflowId, (input) => {
    const fulfillmentSet = (0, fulfillment_1.createFulfillmentSets)([
        {
            name: input.fulfillment_set_data.name,
            type: input.fulfillment_set_data.type,
        },
    ]);
    const data = (0, workflows_sdk_1.transform)({ input, fulfillmentSet }, (data) => [
        {
            location_id: data.input.location_id,
            fulfillment_set_ids: [data.fulfillmentSet[0].id],
        },
    ]);
    (0, associate_locations_with_fulfillment_sets_1.associateFulfillmentSetsWithLocationStep)({
        input: data,
    });
});

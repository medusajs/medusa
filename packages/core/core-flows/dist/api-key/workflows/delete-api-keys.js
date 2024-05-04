"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteApiKeysWorkflow = exports.deleteApiKeysWorkflowId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const remove_remote_links_1 = require("../../common/steps/remove-remote-links");
const steps_1 = require("../steps");
exports.deleteApiKeysWorkflowId = "delete-api-keys";
exports.deleteApiKeysWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.deleteApiKeysWorkflowId, (input) => {
    (0, steps_1.deleteApiKeysStep)(input.ids);
    // Please note, the ids here should be publishable key IDs
    (0, remove_remote_links_1.removeRemoteLinkStep)({
        [modules_sdk_1.Modules.API_KEY]: { publishable_key_id: input.ids },
    });
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulkCreateDeleteLevelsWorkflow = exports.bulkCreateDeleteLevelsWorkflowId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const steps_1 = require("../steps");
const common_1 = require("../../common");
exports.bulkCreateDeleteLevelsWorkflowId = "bulk-create-delete-levels-workflow";
exports.bulkCreateDeleteLevelsWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.bulkCreateDeleteLevelsWorkflowId, (input) => {
    const deleted = (0, steps_1.deleteInventoryLevelsFromItemAndLocationsStep)(input.deletes);
    (0, common_1.removeRemoteLinkStep)(deleted);
    return (0, steps_1.createInventoryLevelsStep)(input.creates);
});

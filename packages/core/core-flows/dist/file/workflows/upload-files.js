"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFilesWorkflow = exports.uploadFilesWorkflowId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const steps_1 = require("../steps");
exports.uploadFilesWorkflowId = "upload-files";
exports.uploadFilesWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.uploadFilesWorkflowId, (input) => {
    return (0, steps_1.uploadFilesStep)(input);
});

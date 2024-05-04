"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateReservationsWorkflow = exports.updateReservationsWorkflowId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const steps_1 = require("../steps");
exports.updateReservationsWorkflowId = "update-reservations-workflow";
exports.updateReservationsWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.updateReservationsWorkflowId, (input) => {
    return (0, steps_1.updateReservationsStep)(input.updates);
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReservationsWorkflow = exports.createReservationsWorkflowId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const steps_1 = require("../steps");
exports.createReservationsWorkflowId = "create-reservations-workflow";
exports.createReservationsWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.createReservationsWorkflowId, (input) => {
    return (0, steps_1.createReservationsStep)(input.reservations);
});

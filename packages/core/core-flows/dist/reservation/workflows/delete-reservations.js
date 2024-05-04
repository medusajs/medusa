"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReservationsWorkflow = exports.deleteReservationsWorkflowId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const steps_1 = require("../steps");
exports.deleteReservationsWorkflowId = "delete-reservations";
exports.deleteReservationsWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.deleteReservationsWorkflowId, (input) => {
    return (0, steps_1.deleteReservationsStep)(input.ids);
});

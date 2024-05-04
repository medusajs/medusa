"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReservationsStep = exports.deleteReservationsStepId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const modules_sdk_1 = require("@medusajs/modules-sdk");
exports.deleteReservationsStepId = "delete-reservations";
exports.deleteReservationsStep = (0, workflows_sdk_1.createStep)(exports.deleteReservationsStepId, async (ids, { container }) => {
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.INVENTORY);
    await service.softDeleteReservationItems(ids);
    return new workflows_sdk_1.StepResponse(void 0, ids);
}, async (prevIds, { container }) => {
    if (!prevIds?.length) {
        return;
    }
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.INVENTORY);
    await service.restoreReservationItems(prevIds);
});

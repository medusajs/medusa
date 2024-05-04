"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReservationsStep = exports.createReservationsStepId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const modules_sdk_1 = require("@medusajs/modules-sdk");
exports.createReservationsStepId = "create-reservations-step";
exports.createReservationsStep = (0, workflows_sdk_1.createStep)(exports.createReservationsStepId, async (data, { container }) => {
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.INVENTORY);
    const created = await service.createReservationItems(data);
    return new workflows_sdk_1.StepResponse(created, created.map((reservation) => reservation.id));
}, async (createdIds, { container }) => {
    if (!createdIds?.length) {
        return;
    }
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.INVENTORY);
    await service.deleteReservationItems(createdIds);
});

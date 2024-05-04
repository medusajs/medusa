"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateReservationsStep = exports.updateReservationsStepId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const utils_1 = require("@medusajs/utils");
const modules_sdk_1 = require("@medusajs/modules-sdk");
exports.updateReservationsStepId = "update-reservations-step";
exports.updateReservationsStep = (0, workflows_sdk_1.createStep)(exports.updateReservationsStepId, async (data, { container }) => {
    const inventoryModuleService = container.resolve(modules_sdk_1.ModuleRegistrationName.INVENTORY);
    const { selects, relations } = (0, utils_1.getSelectsAndRelationsFromObjectArray)(data);
    const dataBeforeUpdate = await inventoryModuleService.listReservationItems({ id: data.map((d) => d.id) }, { relations, select: selects });
    const updatedReservations = await inventoryModuleService.updateReservationItems(data);
    return new workflows_sdk_1.StepResponse(updatedReservations, {
        dataBeforeUpdate,
        selects,
        relations,
    });
}, async (revertInput, { container }) => {
    if (!revertInput) {
        return;
    }
    const { dataBeforeUpdate = [], selects, relations } = revertInput;
    const inventoryModuleService = container.resolve(modules_sdk_1.ModuleRegistrationName.INVENTORY);
    await inventoryModuleService.updateReservationItems(dataBeforeUpdate.map((data) => (0, utils_1.convertItemResponseToUpdateRequest)(data, selects, relations)));
});

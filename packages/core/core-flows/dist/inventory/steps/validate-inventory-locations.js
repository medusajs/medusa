"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateInventoryLocationsStep = exports.validateInventoryLocationsStepId = void 0;
const utils_1 = require("@medusajs/utils");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.validateInventoryLocationsStepId = "validate-inventory-levels-step";
exports.validateInventoryLocationsStep = (0, workflows_sdk_1.createStep)(exports.validateInventoryLocationsStepId, async (data, { container }) => {
    const remoteQuery = container.resolve(utils_1.ContainerRegistrationKeys.REMOTE_QUERY);
    const locationQuery = (0, utils_1.remoteQueryObjectFromString)({
        entryPoint: "stock_location",
        variables: {
            id: data.map((d) => d.location_id),
        },
        fields: ["id"],
    });
    const stockLocations = await remoteQuery(locationQuery);
    const diff = (0, utils_1.arrayDifference)(data.map((d) => d.location_id), stockLocations.map((l) => l.id));
    if (diff.length > 0) {
        throw new utils_1.MedusaError(utils_1.MedusaError.Types.NOT_FOUND, `Stock locations with ids: ${diff.join(", ")} was not found`);
    }
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findRegion = void 0;
const utils_1 = require("@medusajs/utils");
const medusa_core_utils_1 = require("medusa-core-utils");
var Aliases;
(function (Aliases) {
    Aliases["Region"] = "region";
})(Aliases || (Aliases = {}));
async function findRegion({ container, data, }) {
    const regionService = container.resolve("regionService");
    let regionId;
    const regionDTO = {};
    if ((0, medusa_core_utils_1.isDefined)(data[Aliases.Region].region_id)) {
        regionDTO.region_id = data[Aliases.Region].region_id;
        regionDTO.region = await regionService.retrieve(regionDTO.region_id, {
            relations: ["countries"],
        });
    }
    else {
        const regions = await regionService.list({}, {
            relations: ["countries"],
        });
        if (!regions?.length) {
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, `A region is required to create a cart`);
        }
        regionDTO.region_id = regions[0].id;
        regionDTO.region = regions[0];
    }
    return regionDTO;
}
exports.findRegion = findRegion;
findRegion.aliases = Aliases;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRegions = void 0;
const _models_1 = require("../models");
async function createRegions(manager, data) {
    const regions = data.map((region) => {
        return manager.create(_models_1.Region, region);
    });
    await manager.persistAndFlush(regions);
    return regions;
}
exports.createRegions = createRegions;

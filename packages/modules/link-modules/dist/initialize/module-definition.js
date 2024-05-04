"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLinkModuleDefinition = void 0;
const _services_1 = require("../services");
const loaders_1 = require("../loaders");
function getLinkModuleDefinition(joinerConfig, primary, foreign) {
    return {
        service: joinerConfig.isReadOnlyLink
            ? (0, _services_1.getReadOnlyModuleService)(joinerConfig)
            : (0, _services_1.getModuleService)(joinerConfig),
        loaders: (0, loaders_1.getLoaders)({
            joinerConfig,
            primary,
            foreign,
        }),
    };
}
exports.getLinkModuleDefinition = getLinkModuleDefinition;

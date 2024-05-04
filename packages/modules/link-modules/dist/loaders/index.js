"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLoaders = void 0;
const utils_1 = require("../utils");
const connection_1 = require("./connection");
const container_1 = require("./container");
function getLoaders({ joinerConfig, primary, foreign, }) {
    if (joinerConfig.isReadOnlyLink) {
        return [];
    }
    const entity = (0, utils_1.generateEntity)(joinerConfig, primary, foreign);
    return [(0, connection_1.connectionLoader)(entity), (0, container_1.containerLoader)(entity, joinerConfig)];
}
exports.getLoaders = getLoaders;

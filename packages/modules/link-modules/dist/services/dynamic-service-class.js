"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReadOnlyModuleService = exports.getModuleService = void 0;
const _services_1 = require(".");
function getModuleService(joinerConfig) {
    const joinerConfig_ = JSON.parse(JSON.stringify(joinerConfig));
    delete joinerConfig_.databaseConfig;
    return class LinkService extends _services_1.LinkModuleService {
        __joinerConfig() {
            return joinerConfig_;
        }
    };
}
exports.getModuleService = getModuleService;
function getReadOnlyModuleService(joinerConfig) {
    return class ReadOnlyLinkService {
        __joinerConfig() {
            return joinerConfig;
        }
    };
}
exports.getReadOnlyModuleService = getReadOnlyModuleService;

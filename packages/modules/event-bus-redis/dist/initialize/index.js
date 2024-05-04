"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initialize = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const initialize = async (options) => {
    const serviceKey = modules_sdk_1.Modules.EVENT_BUS;
    const loaded = await modules_sdk_1.MedusaModule.bootstrap({
        moduleKey: serviceKey,
        defaultPath: "@medusajs/event-bus-redis",
        declaration: options,
    });
    return loaded[serviceKey];
};
exports.initialize = initialize;
//# sourceMappingURL=index.js.map
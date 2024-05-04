"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initialize = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const initialize = () => __awaiter(void 0, void 0, void 0, function* () {
    const serviceKey = modules_sdk_1.Modules.EVENT_BUS;
    const loaded = yield modules_sdk_1.MedusaModule.bootstrap({
        moduleKey: serviceKey,
        defaultPath: "@medusajs/event-bus-local",
    });
    return loaded[serviceKey];
});
exports.initialize = initialize;
//# sourceMappingURL=index.js.map
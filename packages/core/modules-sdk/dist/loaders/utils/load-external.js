"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadExternalModule = void 0;
const utils_1 = require("@medusajs/utils");
const awilix_1 = require("awilix");
const definitions_1 = require("../../definitions");
const Clients = __importStar(require("./clients"));
async function loadExternalModule(container, resolution, logger) {
    const registrationName = resolution.definition.registrationName;
    const { server } = resolution.moduleDeclaration;
    let loadedModule;
    const clientType = server?.type;
    if (!clientType) {
        throw new Error(`Client type is not defined.`);
    }
    else if (!Clients[clientType]) {
        throw new Error(`Client type "${clientType}" is not supported.`);
    }
    try {
        let moduleKey = resolution.definition.key;
        for (const key of Object.keys(definitions_1.Modules)) {
            if (definitions_1.Modules[key] === moduleKey) {
                moduleKey = key.toLowerCase();
                break;
            }
        }
        const clientConstructor = Clients[clientType].default;
        clientConstructor.__type = utils_1.MedusaModuleType;
        loadedModule = await clientConstructor(moduleKey, server?.url, {
            options: { ...(server?.options ?? {}) },
        }, logger);
    }
    catch (error) {
        return { error };
    }
    container.register({
        [registrationName]: (0, awilix_1.asValue)(loadedModule),
    });
}
exports.loadExternalModule = loadExternalModule;
//# sourceMappingURL=load-external.js.map